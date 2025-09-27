import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

const createConfig = (phase) => {
  const baseConfig = {
    images: {
      unoptimized: true,
    },
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
