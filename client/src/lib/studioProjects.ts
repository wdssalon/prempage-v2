export type StudioProject = {
  slug: string;
  name: string;
  description: string;
  devUrl: string;
  previewBaseUrl: string;
  instructions: string[];
};

const PROJECTS: StudioProject[] = [
  {
    slug: "horizon-example",
    name: "Horizon Example",
    description:
      "Baseline static site bundle used to prototype the Studio editing flow.",
    devUrl: "http://localhost:3000",
    previewBaseUrl: "http://localhost:3000/preview",
    instructions: [
      "In a separate terminal run `pnpm dev` inside public-sites/sites/horizon-example/.",
      "Keep the dev server running; the iframe below streams straight from the live Next.js instance.",
      "Return here to interact with the site once the server reports `ready - started server on 0.0.0.0:3000`.",
    ],
  },
];

export function listStudioProjects(): StudioProject[] {
  return PROJECTS;
}

export function getStudioProject(slug: string): StudioProject | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
