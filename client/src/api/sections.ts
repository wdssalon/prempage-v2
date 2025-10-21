import { getApiBaseUrl } from "./config";
import { getResponseErrorDetail } from "./error-utils";
import type { components } from "./types";

const apiBaseUrl = getApiBaseUrl();

export type HorizonSectionInsertRequest =
  components["schemas"]["HorizonSectionInsertRequest"];

export type HorizonSectionInsertResponse =
  components["schemas"]["HorizonSectionInsertResponse"];

export type SectionInsertStage =
  | "generating"
  | "validating"
  | "complete"
  | "error";

type InsertSectionInput = {
  projectSlug: string;
  sectionKey: string;
  position: HorizonSectionInsertRequest["position"];
  targetSectionId: string | null;
  customSectionPrompt?: string;
};

type StreamInsertHandlers = {
  onStage: (stage: SectionInsertStage) => void;
  onCompleted: (result: HorizonSectionInsertResponse) => void;
  onFailed: (message: string) => void;
};

const STAGE_SET = new Set<SectionInsertStage>([
  "generating",
  "validating",
  "complete",
  "error",
]);

function parseStageCandidate(value: unknown): SectionInsertStage | null {
  if (typeof value !== "string") {
    return null;
  }

  if (STAGE_SET.has(value as SectionInsertStage)) {
    return value as SectionInsertStage;
  }

  return null;
}

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

export function streamInsertSection(
  input: InsertSectionInput,
  handlers: StreamInsertHandlers,
): () => void {
  const params = new URLSearchParams({
    position: input.position,
    section_key: input.sectionKey,
  });

  if (input.targetSectionId) {
    params.set("target_section_id", input.targetSectionId);
  }

  if (input.customSectionPrompt && input.customSectionPrompt.trim().length > 0) {
    params.set("custom_section_prompt", input.customSectionPrompt.trim());
  }

  const streamUrl = `${apiBaseUrl}/projects/${input.projectSlug}/sections/insert/stream?${params.toString()}`;
  const eventSource = new EventSource(streamUrl);
  let isClosed = false;

  const closeStream = () => {
    if (isClosed) {
      return;
    }
    isClosed = true;
    eventSource.close();
  };

  const handleStage = (event: MessageEvent) => {
    try {
      const payload = JSON.parse(event.data) as { stage?: unknown };
      const stage = parseStageCandidate(payload.stage);
      if (stage) {
        handlers.onStage(stage);
      }
    } catch (error) {
      console.error("Failed to parse section stage event", error);
    }
  };

  const handleCompleted = (event: MessageEvent) => {
    closeStream();
    try {
      const payload = JSON.parse(event.data) as {
        result?: HorizonSectionInsertResponse;
      };
      if (payload.result) {
        handlers.onCompleted(payload.result);
        return;
      }
    } catch (error) {
      console.error("Failed to parse section completion event", error);
    }
    handlers.onFailed("Section generation completed without a result payload.");
  };

  const handleFailed = (event: MessageEvent) => {
    closeStream();
    try {
      const payload = JSON.parse(event.data) as { message?: string };
      handlers.onFailed(
        payload.message?.trim() || "Section generation failed unexpectedly.",
      );
    } catch (error) {
      console.error("Failed to parse section failure event", error);
      handlers.onFailed("Section generation failed unexpectedly.");
    }
  };

  eventSource.addEventListener("stage", handleStage as EventListener);
  eventSource.addEventListener("completed", handleCompleted as EventListener);
  eventSource.addEventListener("failed", handleFailed as EventListener);
  eventSource.onerror = () => {
    if (eventSource.readyState === EventSource.CLOSED) {
      return;
    }
    closeStream();
    handlers.onFailed("Lost connection to the section generator.");
  };

  return closeStream;
}
