import manifestData from "@/data/asset-manifest.json";

const manifest = manifestData as Record<string, string>;

export function getAssetUrl(key: string): string {
  const resolved = manifest[key];
  if (!resolved) {
    throw new Error(`Unknown asset '${key}'. Add it to images/ and rerun assets:sync.`);
  }
  return resolved;
}

export function listManagedAssets(): string[] {
  return Object.keys(manifest).sort((a, b) => a.localeCompare(b));
}
