#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const repoRoot = path.resolve(currentDir, '..', '..');

async function loadEnvFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) {
        continue;
      }
      const key = trimmed.slice(0, equalsIndex).trim();
      const rawValue = trimmed.slice(equalsIndex + 1).trim();
      const value = rawValue.replace(/^['"]|['"]$/g, '');
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return;
    }
    throw error;
  }
}

function readEnv(name, { required = false, fallback } = {}) {
  const value = process.env[name] ?? fallback;
  if (required && (!value || value.length === 0)) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
}

function usage(message) {
  if (message) {
    console.error(message);
  }
  console.error('Usage: upload-site-assets.mjs [slug]');
  console.error('Run from anywhere inside the repo. Slug defaults to the current working directory name');
  process.exit(1);
}

async function ensureFileExists(filePath, label) {
  try {
    await fs.access(filePath);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      throw new Error(`Could not find ${label} at ${filePath}`);
    }
    throw error;
  }
}

function normaliseBaseUrl(url) {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

async function uploadFile({ localPath, remoteUrl, accessKey }) {
  const file = await fs.readFile(localPath);
  const response = await fetch(remoteUrl, {
    method: 'PUT',
    headers: {
      AccessKey: accessKey,
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to upload ${remoteUrl} (status ${response.status}): ${body}`);
  }
}

async function purgeCacheIfConfigured(urls) {
  const apiKey = process.env.BUNNY_API_KEY;
  if (!apiKey) {
    console.warn('[upload-site-assets] Skipping cache purge - set BUNNY_API_KEY to enable.');
    return;
  }

  const chunkSize = 50;
  for (let index = 0; index < urls.length; index += chunkSize) {
    const batch = urls.slice(index, index + chunkSize);
    const response = await fetch('https://api.bunny.net/purge', {
      method: 'POST',
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: batch }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to purge batch starting with ${batch[0]} (status ${response.status}): ${body}`);
    }
  }
}

async function main() {
  const slugArg = process.argv[2];
  const cwd = process.cwd();
  const inferredSlug = path.basename(cwd);
  const slug = slugArg ?? inferredSlug;

  if (!slug || slug.trim().length === 0) {
    usage('Site slug is required');
  }

  const siteDir = path.join(repoRoot, 'public-sites', 'sites', slug);

  await loadEnvFile(path.join(repoRoot, '.env'));
  await loadEnvFile(path.join(siteDir, '.env'));

  const storageZone = readEnv('BUNNY_STORAGE_ZONE', { required: true });
  const storageHost = readEnv('BUNNY_STORAGE_HOST', { fallback: 'storage.bunnycdn.com' });
  const storageAccessKey = readEnv('BUNNY_STORAGE_PASSWORD', { required: true });
  const pullBaseUrl = normaliseBaseUrl(readEnv('BUNNY_PULL_ZONE_BASE_URL', { required: true }));

  const distDir = path.join(repoRoot, 'public-sites', 'dist', slug);
  const manifestPath = path.join(distDir, 'assets-manifest.json');

  await ensureFileExists(distDir, 'dist directory');
  await ensureFileExists(manifestPath, 'asset manifest');

  const manifestRaw = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestRaw);

  const entryKeys = Object.keys(manifest);
  if (entryKeys.length === 0) {
    console.log(`[upload-site-assets] Manifest empty for ${slug}; nothing to upload.`);
    return;
  }

  console.log(`[upload-site-assets] Uploading ${entryKeys.length} asset${entryKeys.length === 1 ? '' : 's'} for ${slug}`);

  const uploadedUrls = [];
  const cdnManifest = {};

  for (const key of entryKeys) {
    const hashedPath = manifest[key];
    if (typeof hashedPath !== 'string') {
      throw new Error(`Manifest entry for ${key} must be a string; received ${typeof hashedPath}`);
    }

    const cleanHashedPath = hashedPath.replace(/^\/+/, '');
    const pathParts = cleanHashedPath.split('/');
    if (pathParts[0] !== 'assets') {
      throw new Error(`Manifest entry ${key} resolves to '${hashedPath}'. Expected it to begin with '/assets/'.`);
    }

    const withinAssets = pathParts.slice(1).join('/');
    const localPath = path.join(distDir, cleanHashedPath);
    await ensureFileExists(localPath, `asset ${cleanHashedPath}`);

    const remoteUrl = `https://${storageHost}/${storageZone}/${slug}/assets/${withinAssets}`;
    await uploadFile({ localPath, remoteUrl, accessKey: storageAccessKey });
    console.log(`[upload-site-assets] Uploaded ${withinAssets}`);

    const publicUrl = `${pullBaseUrl}/${slug}/assets/${withinAssets}`;
    uploadedUrls.push(publicUrl);
    cdnManifest[key] = publicUrl;
  }

  const cdnManifestPath = path.join(distDir, 'assets-manifest.cdn.json');
  await fs.writeFile(cdnManifestPath, JSON.stringify(cdnManifest, null, 2) + '\n');
  console.log(`[upload-site-assets] Wrote CDN manifest to ${cdnManifestPath}`);

  try {
    await purgeCacheIfConfigured(uploadedUrls);
  } catch (error) {
    console.error('[upload-site-assets] Cache purge failed');
    throw error;
  }

  console.log('[upload-site-assets] Completed successfully');
}

main().catch((error) => {
  console.error('[upload-site-assets] Error during upload');
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
