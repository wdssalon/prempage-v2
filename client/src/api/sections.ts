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
  customSectionPrompt?: string;
};

export async function insertSection(
  input: InsertSectionInput,
): Promise<HorizonSectionInsertResponse> {
  const payload: Record<string, unknown> = {
    section_key: input.sectionKey,
    position: input.position,
    target_section_id: input.targetSectionId,
  };

  if (input.customSectionPrompt && input.customSectionPrompt.trim().length > 0) {
    payload.custom_section_prompt = input.customSectionPrompt.trim();
  }

  const response = await fetch(
    `${apiBaseUrl}/projects/${input.projectSlug}/sections/insert`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
