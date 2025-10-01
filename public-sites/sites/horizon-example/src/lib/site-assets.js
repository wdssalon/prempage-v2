import manifestData from "@/data/asset-manifest.json";

const manifest = manifestData;

const assetBaseEnv = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";
const assetBase = assetBaseEnv.endsWith("/") && assetBaseEnv !== "/" ? assetBaseEnv.slice(0, -1) : assetBaseEnv;

function buildUrl(relativePath) {
  if (/^https?:\/\//i.test(relativePath)) {
    return relativePath;
  }

  if (!assetBase || assetBase === "/") {
    return relativePath;
  }

  const trimmed = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${assetBase}${trimmed}`;
}

export function getAssetUrl(key) {
  const resolved = manifest[key];
  if (!resolved) {
    throw new Error(`Unknown asset '${key}'. Add it to images/ and rerun assets:sync.`);
  }
  return buildUrl(resolved);
}

export function listManagedAssets() {
  return Object.keys(manifest).sort((a, b) => a.localeCompare(b));
}
