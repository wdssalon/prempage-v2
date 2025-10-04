import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.CSS_TRANSFORMER && !process.env.CSS_TRANSFORMER_WASM) {
  process.env.CSS_TRANSFORMER = "wasm";
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensures Next.js resolves traces against the repository root despite per-site lockfiles.
  outputFileTracingRoot: path.join(__dirname, "..", "..", ".."),
};

export default nextConfig;
