import type { components } from "./types";

const DEFAULT_API_BASE_URL = "http://localhost:8000";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export type HorizonSectionInsertRequest =
  components["schemas"]["HorizonSectionInsertRequest"];

export type HorizonSectionInsertResponse =
  components["schemas"]["HorizonSectionInsertResponse"];

type InsertSectionInput = {
  projectSlug: string;
  sectionKey: string;
  position: HorizonSectionInsertRequest["position"];
  targetSectionId: string | null;
};

export async function insertSection(
  input: InsertSectionInput,
): Promise<HorizonSectionInsertResponse> {
  const response = await fetch(
    `${apiBaseUrl}/projects/${input.projectSlug}/sections/insert`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        section_key: input.sectionKey,
        position: input.position,
        target_section_id: input.targetSectionId,
      }),
    },
  );

  if (!response.ok) {
    const rawBody = await response.text();
    let detail: string | null = null;

    if (rawBody) {
      try {
        const payload = JSON.parse(rawBody) as { detail?: unknown };
        if (payload && typeof payload.detail === "string") {
          detail = payload.detail;
        }
      } catch {
        detail = rawBody;
      }

      if (!detail) {
        detail = rawBody;
      }
    }

    throw new Error(
      `Section insert failed with status ${response.status}${
        detail ? `: ${detail}` : ""
      }`,
    );
  }

  return (await response.json()) as HorizonSectionInsertResponse;
}
