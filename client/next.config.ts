import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Root tells Next where to trace files when multiple lockfiles exist (workspace + client).
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
