"use client";

import { type ReactElement, useEffect, useState } from "react";

import type { GenerationStage } from "./useOverlayBridge";

type GenerationStageBarProps = {
  stage: Exclude<GenerationStage, "idle">;
  onCancel?: () => void;
};

const STAGE_PHRASES: Record<Exclude<GenerationStage, "idle">, readonly string[]> = {
  generating: [
    "Sketching layouts that match the Horizon playbook…",
    "Dusting off fresh hero copy for this prompt…",
    "Linking design tokens with your request—hang tight…",
    "Auditioning section structures that fit this vibe…",
    "Mapping typography to the latest style guide…",
    "Pulling the best Tailwind primitives for the job…",
    "Riffing on layout ideas without breaking the grid…",
    "Checking the palette before we commit to markup…",
    "Syncing with the builder brain—give it a breath…",
    "Shaping a section shell that won’t fight the theme…",
    "Rehearsing spacing so the content flows naturally…",
    "Balancing text blocks with supporting visuals…",
    "Scouting the right components for this storyline…",
    "Weighing headline options that feel on brand…",
    "Staging content areas for a smooth read…",
    "Collecting structural ideas before we lock it in…",
    "Pulling fresh inspiration from the style kit…",
    "Pairing imagery hooks with supportive copy…",
    "Tuning the rhythm of headings and body text…",
    "Drafting with care so it feels authored, not automated…",
  ],
  validating: [
    "Linting markup and sanitising attributes…",
    "Verifying Tailwind classes align with the palette…",
    "Running a11y and structure checks behind the scenes…",
    "Double-checking that dynamic IDs won’t collide…",
    "Making sure semantic tags are in the right spots…",
    "Sanitising inline HTML before we ship it over…",
    "Confirming responsive breakpoints are covered…",
    "Ensuring imagery placeholders look intentional…",
    "Tightening spacing tokens so nothing drifts…",
    "Giving the layout a quick visual balance check…",
    "Final sweep to confirm no stray script sneaked in…",
    "Cross-checking content against our safe list…",
    "Reviewing aria hooks for predictable behavior…",
    "Running one more polish pass before handoff…",
    "Counting closing tags like our careers depend on it…",
    "Testing fallback content for slower networks…",
    "Checking animation timing for smooth transitions…",
    "Making sure gradients won’t clash on dark backgrounds…",
    "Sweeping for duplicate IDs in nested structures…",
    "Wrapping up QA so you don’t have to…",
  ],
  complete: [
    "Ready to drop in—see what you think!",
    "Fresh section on deck; preview updating now…",
    "All validations passed—pushing to the canvas…",
    "Handing the markup to your preview window…",
    "Okay, layout shipped—give it a try!",
    "Section rendered; feel free to iterate.",
    "The builder’s done—review when you’re ready.",
    "Live patch delivered; take it for a spin.",
    "Markup landed. Ready for your edits.",
    "Section applied—head over to the preview.",
    "All set! The new content is live in the iframe.",
    "The hard part’s handled—see how it reads.",
    "Wrapped and shipped. Tweak anything you like.",
    "Fresh drop incoming—have a look!",
    "Done! It’s queued up in the preview pane.",
    "Mission accomplished—give it a scroll.",
    "Section slotted in; let us know what to adjust.",
    "Go ahead—review the live result.",
    "Ready when you are to polish the details.",
    "We’re calling it done—your turn to review.",
  ],
  error: [
    "The builder tapped out—try a new prompt or retry.",
    "Didn’t like that HTML—let’s give it another go.",
    "We hit a snag converting that idea into markup.",
    "That prompt produced unsafe output; adjust and retry.",
    "Something felt off—tweak the instructions and re-run.",
    "We couldn’t trust that response—mind rephrasing?",
    "Markup validation failed; a quick reword might help.",
    "Ran into unexpected output—time for another attempt.",
    "That layout broke our safety checks—try again?",
    "We bailed to keep things safe—give it another shot.",
    "The HTML didn’t pass review—maybe shorten the ask?",
    "Need a cleaner prompt to keep generating.",
    "We stopped before adding risky markup.",
    "That idea was close—adjust details and retry.",
    "Our guardrails blocked the last draft.",
    "Generation stalled; a fresh prompt should do it.",
    "We errored out before inserting anything.",
    "No update was made—feel free to try another angle.",
    "Safety filters stepped in—let’s try again.",
    "HTML review flagged an issue—rerun when ready.",
  ],
};

const STAGE_CONTENT: Record<
  Exclude<GenerationStage, "idle">,
  { title: string; progress: number; tone: "default" | "success" | "error" }
> = {
  generating: {
    title: "Generating section…",
    progress: 0.35,
    tone: "default",
  },
  validating: {
    title: "Validating markup…",
    progress: 0.7,
    tone: "default",
  },
  complete: {
    title: "Section ready!",
    progress: 1,
    tone: "success",
  },
  error: {
    title: "Something went wrong",
    progress: 1,
    tone: "error",
  },
};

export function GenerationStageBar({
  stage,
  onCancel,
}: GenerationStageBarProps): ReactElement {
  const content = STAGE_CONTENT[stage];
  const phrases = STAGE_PHRASES[stage];
  const showCancel = typeof onCancel === "function" && stage !== "complete" && stage !== "error";
  const indicatorColour =
    content.tone === "success"
      ? "bg-emerald-500"
      : content.tone === "error"
        ? "bg-rose-500"
        : "bg-slate-900";
  const messageColour =
    stage === "complete" ? "text-emerald-600" : stage === "error" ? "text-rose-600" : "text-slate-500";
  const [phraseIndex, setPhraseIndex] = useState(() => pickRandomIndex(phrases.length));

  useEffect(() => {
    setPhraseIndex(pickRandomIndex(phrases.length));
  }, [stage, phrases.length]);

  useEffect(() => {
    if (phrases.length <= 1) {
      return;
    }
    const interval = window.setInterval(() => {
      setPhraseIndex((previous) => {
        return pickRandomIndex(phrases.length, previous);
      });
    }, 8000);

    return () => {
      window.clearInterval(interval);
    };
  }, [stage, phrases.length]);

  const animatedMessage = phrases[phraseIndex] ?? phrases[0];

  return (
    <div
      className="rounded-xl border border-stone-200 bg-white/90 p-3 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <StageIcon stage={stage} />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">{content.title}</p>
            <p className={`text-xs ${messageColour}`}>
              <span className="inline-flex items-center gap-2 animate-breathe">{animatedMessage}</span>
            </p>
          </div>
        </div>
        {showCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            Cancel
          </button>
        ) : null}
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-stone-200">
        <span
          className={`block h-full rounded-full transition-[width] duration-500 ${indicatorColour}`}
          style={{ width: `${Math.round(content.progress * 100)}%` }}
        />
      </div>
    </div>
  );
}

function StageIcon({ stage }: { stage: Exclude<GenerationStage, "idle"> }): ReactElement {
  if (stage === "complete") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white shadow-sm">
        ✓
      </span>
    );
  }

  if (stage === "error") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white shadow-sm">
        !
      </span>
    );
  }

  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/10">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-slate-500 border-t-transparent" />
    </span>
  );
}

function pickRandomIndex(length: number, exclude?: number): number {
  if (length <= 0) {
    return 0;
  }

  if (length === 1) {
    return 0;
  }

  let next = Math.floor(Math.random() * length);
  if (typeof exclude === "number" && length > 1) {
    while (next === exclude) {
      next = Math.floor(Math.random() * length);
    }
  }
  return next;
}
