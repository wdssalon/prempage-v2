import { getApiBaseUrl } from "./config";
import { getResponseErrorDetail } from "./error-utils";
import type { components } from "./types";

const apiBaseUrl = getApiBaseUrl();

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
    const detail = await getResponseErrorDetail(response);
    throw new Error(
      `Section insert failed with status ${response.status}${
        detail ? `: ${detail}` : ""
      }`,
    );
  }

  return (await response.json()) as HorizonSectionInsertResponse;
}
