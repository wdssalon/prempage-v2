import path from "node:path";
import { fileURLToPath } from "node:url";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputRoot = path.join(__dirname, "..", "..", "..");

const createConfig = (phase) => {
  const baseConfig = {
    images: {
      unoptimized: true,
    },
    // Keep tracing scoped to the monorepo root despite per-site lockfiles.
    outputFileTracingRoot: outputRoot,
  };

  if (phase === PHASE_PRODUCTION_BUILD) {
    return {
      ...baseConfig,
      output: "export",
    };
  }

  return baseConfig;
};

export default createConfig;
