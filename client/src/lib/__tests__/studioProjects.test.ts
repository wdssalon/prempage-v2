import { describe, expect, it } from "vitest";

import { getStudioProject, listStudioProjects } from "../studioProjects";

describe("studioProjects", () => {
  it("lists the available studio sandboxes", () => {
    const projects = listStudioProjects();

    const expectedDevUrl =
      process.env.NEXT_PUBLIC_HORIZON_DEV_URL ?? "http://localhost:3000";

    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toMatchObject({
      slug: "horizon-example",
      devUrl: expectedDevUrl,
    });
  });

  it("returns the full project details when the slug exists", () => {
    const project = getStudioProject("horizon-example");

    expect(project).toBeDefined();
    expect(project?.instructions.length).toBeGreaterThan(0);
  });

  it("returns undefined when the slug is unknown", () => {
    expect(getStudioProject("missing")).toBeUndefined();
  });
});
