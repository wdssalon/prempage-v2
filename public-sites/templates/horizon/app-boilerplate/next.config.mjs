import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Align static-site tracing with monorepo root so multiple lockfiles don't trigger warnings.
  outputFileTracingRoot: path.join(__dirname, "..", "..", ".."),
};

export default nextConfig;
