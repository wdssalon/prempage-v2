#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const resolvedPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(resolvedPath);
    }
    if (entry.isFile()) {
      return resolvedPath;
    }
    return [];
  }));
  return files.flat();
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function hashFileName(filename, hash) {
  const ext = path.extname(filename);
  const base = filename.slice(0, filename.length - ext.length);
  return `${base}.${hash}${ext}`;
}

async function main() {
  const providedPath = process.argv[2];
  const siteDir = providedPath ? path.resolve(providedPath) : process.cwd();
  const imagesDir = path.join(siteDir, 'images');
  const assetsDir = path.join(siteDir, 'public/assets');
  const manifestPath = path.join(siteDir, 'src/data/asset-manifest.json');

  let hasImagesDir = true;
  try {
    await fs.access(imagesDir);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      hasImagesDir = false;
    } else {
      throw error;
    }
  }

  if (!hasImagesDir) {
    await fs.rm(assetsDir, { recursive: true, force: true });
    await fs.mkdir(assetsDir, { recursive: true });
    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(manifestPath, JSON.stringify({}, null, 2) + '\n');
    console.warn(`[sync-site-assets] No images directory found for ${siteDir}; wrote empty manifest.`);
    return;
  }

  const imageFiles = await walk(imagesDir);

  await fs.rm(assetsDir, { recursive: true, force: true });
  await fs.mkdir(assetsDir, { recursive: true });

  const manifestEntries = {};

  for (const absFile of imageFiles) {
    const relToImages = toPosix(path.relative(imagesDir, absFile));
    const fileBuffer = await fs.readFile(absFile);
    const hash = createHash('sha256').update(fileBuffer).digest('hex').slice(0, 12);
    const hashedName = hashFileName(relToImages, hash);
    const destination = path.join(assetsDir, hashedName);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, fileBuffer);
    manifestEntries[relToImages] = `/assets/${toPosix(hashedName)}`;
  }

  const sortedKeys = Object.keys(manifestEntries).sort((a, b) => a.localeCompare(b));
  const sortedManifest = {};
  for (const key of sortedKeys) {
    sortedManifest[key] = manifestEntries[key];
  }

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(sortedManifest, null, 2) + '\n');

  console.log(`[sync-site-assets] Generated ${sortedKeys.length} asset${sortedKeys.length === 1 ? '' : 's'} for ${siteDir}`);
}

main().catch((error) => {
  console.error('[sync-site-assets] Failed to sync assets');
  console.error(error);
  process.exit(1);
});
