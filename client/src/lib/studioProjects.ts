import { getEnvVarOrDefault } from "@/config/env";

export type StudioProject = {
  slug: string;
  name: string;
  description: string;
  devUrl: string;
  previewBaseUrl: string;
  instructions: string[];
};

const DEFAULT_HORIZON_DEV_URL = "http://localhost:3000";
const DEFAULT_HORIZON_PREVIEW_BASE_URL = "http://localhost:3000/preview";

const horizonDevUrl = getEnvVarOrDefault(
  "NEXT_PUBLIC_HORIZON_DEV_URL",
  DEFAULT_HORIZON_DEV_URL,
);
const horizonPreviewBaseUrl = getEnvVarOrDefault(
  "NEXT_PUBLIC_HORIZON_PREVIEW_BASE_URL",
  DEFAULT_HORIZON_PREVIEW_BASE_URL,
);

function getDevReadyLogLocation(url: string): string {
  try {
    const parsed = new URL(url);
    const port =
      parsed.port ||
      (parsed.protocol === "https:" ? "443" : "80");
    return `0.0.0.0:${port}`;
  } catch {
    return "0.0.0.0:3000";
  }
}

const PROJECTS: StudioProject[] = [
  {
    slug: "horizon-example",
    name: "Horizon Example",
    description:
      "Baseline static site bundle used to prototype the Studio editing flow.",
    devUrl: horizonDevUrl,
    previewBaseUrl: horizonPreviewBaseUrl,
    instructions: [
      "In a separate terminal run `pnpm dev` inside public-sites/sites/horizon-example/.",
      "Keep the dev server running; the iframe below streams straight from the live Next.js instance.",
      `Return here to interact with the site once the server reports \`ready - started server on ${getDevReadyLogLocation(horizonDevUrl)}\`.`,
    ],
  },
];

export function listStudioProjects(): StudioProject[] {
  return PROJECTS;
}

export function getStudioProject(slug: string): StudioProject | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
