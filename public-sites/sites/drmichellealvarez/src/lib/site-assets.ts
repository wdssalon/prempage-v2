const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";

export function getAssetUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/assets/${path}`;
  return `${ASSET_BASE}${normalized}`;
}
