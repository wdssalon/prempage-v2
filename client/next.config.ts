import path from "path";
import type { NextConfig } from "next";

if (!process.env.CSS_TRANSFORMER && !process.env.CSS_TRANSFORMER_WASM) {
  process.env.CSS_TRANSFORMER = "wasm";
}

const nextConfig: NextConfig = {
  // Root tells Next where to trace files when multiple lockfiles exist (workspace + client).
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
