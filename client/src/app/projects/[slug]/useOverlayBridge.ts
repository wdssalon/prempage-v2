"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { logOverlayEdit } from "@/api/overlay";
import { insertSection } from "@/api/sections";
import { overlayDebug, overlayInfo } from "./overlayLogging";

type OverlayInsertFeedback =
  | { status: "idle"; message?: undefined }
  | { status: "success"; message?: string }
  | { status: "error"; message: string };

type PendingSectionRequest = {
  sectionKey: string;
  customPrompt?: string;
};

type UseOverlayBridgeOptions = {
  slug: string;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isEditMode: boolean;
  isSectionLibraryOpen: boolean;
  setSectionLibraryOpen: (open: boolean) => void;
  onSectionSelected: (key: string) => void;
};

export function useOverlayBridge({
  slug,
  iframeRef,
  isEditMode,
  isSectionLibraryOpen,
  setSectionLibraryOpen,
  onSectionSelected,
}: UseOverlayBridgeOptions) {
  const overlayMountedRef = useRef(false);
  const overlayInitIntervalRef = useRef<number | null>(null);

  const [isSelectingDropZone, setIsSelectingDropZone] = useState(false);
  const [isInsertingSection, setIsInsertingSection] = useState(false);
  const [insertFeedback, setInsertFeedback] =
    useState<OverlayInsertFeedback>({ status: "idle" });
  const [pendingSectionRequest, setPendingSectionRequest] =
    useState<PendingSectionRequest | null>(null);

  const postToIframe = useCallback(
    (message: unknown) => {
      const frame = iframeRef.current;
      if (!frame) {
        return;
      }

      frame.contentWindow?.postMessage(message, "*");
    },
    [iframeRef],
  );

  const sendOverlayInit = useCallback(() => {
    postToIframe({ source: "prempage-studio", type: "overlay-init" });
  }, [postToIframe]);

  const syncOverlayMode = useCallback(() => {
    postToIframe({
      source: "prempage-studio",
      type: "overlay-set-mode",
      editing: isEditMode,
    });
  }, [isEditMode, postToIframe]);

  const clearOverlayInitInterval = useCallback(() => {
    if (overlayInitIntervalRef.current !== null) {
      clearInterval(overlayInitIntervalRef.current);
      overlayInitIntervalRef.current = null;
    }
  }, []);

  const resetDropZoneState = useCallback(() => {
    setIsSelectingDropZone(false);
    setPendingSectionRequest(null);
  }, []);

  const requestOverlayInit = useCallback(() => {
    sendOverlayInit();
    overlayDebug("[overlay] requested overlay init");

    if (overlayMountedRef.current) {
      clearOverlayInitInterval();
      return;
    }

    if (overlayInitIntervalRef.current === null) {
      overlayDebug("[overlay] starting overlay init polling interval");
      overlayInitIntervalRef.current = window.setInterval(() => {
        if (overlayMountedRef.current) {
          clearOverlayInitInterval();
          return;
        }

        sendOverlayInit();
        overlayDebug("[overlay] re-posted overlay init");
      }, 1000);
    }
  }, [clearOverlayInitInterval, sendOverlayInit]);

  const beginDropZoneSelection = useCallback(
    (request: PendingSectionRequest) => {
      const { sectionKey } = request;
      if (!sectionKey) {
        setInsertFeedback({
          status: "error",
          message: "Pick a section first.",
        });
        return;
      }

      setPendingSectionRequest(request);
      setInsertFeedback({ status: "idle" });
      setSectionLibraryOpen(false);
      setIsSelectingDropZone(true);
      postToIframe({
        source: "prempage-studio",
        type: "overlay-start-drop-mode",
      });
    },
    [postToIframe, setSectionLibraryOpen],
  );

  const handleIframeLoad = useCallback(() => {
    overlayMountedRef.current = false;
    requestOverlayInit();
  }, [requestOverlayInit]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      overlayDebug("[overlay] message event", event.data, event.origin);
      const { data } = event;
      if (!data || typeof data !== "object") {
        return;
      }

      if (data.source === "prempage-site") {
        if (data.type === "bridge-ready") {
          overlayDebug("[overlay] bridge-ready received from site");
          overlayMountedRef.current = false;
          requestOverlayInit();
        } else if (data.type === "overlay-mounted") {
          overlayDebug("[overlay] overlay-mounted received from site");
          overlayMountedRef.current = true;
          clearOverlayInitInterval();
          syncOverlayMode();
        } else if (data.type === "overlay-destroy") {
          overlayDebug("[overlay] overlay-destroy received from site");
          overlayMountedRef.current = false;
          requestOverlayInit();
        }
        return;
      }

      if (data.source === "prempage-overlay") {
        if (data.type === "overlay-edit") {
          overlayInfo("Overlay edit", data.payload, data.meta);
          void logOverlayEdit({
            projectSlug: slug,
            payload: data.payload,
            meta: data.meta,
          })
            .then((result) => {
              overlayInfo("Overlay edit applied", result);
            })
            .catch((error) => {
              console.error("Failed to log overlay edit", error);
            });
        } else if (data.type === "overlay-drop-mode-started") {
          setIsSelectingDropZone(true);
        } else if (data.type === "overlay-section-drop-selected") {
          setIsSelectingDropZone(false);

          const payload = data.payload as {
            sectionId?: string;
            position?: string;
          };

          const pendingRequest = pendingSectionRequest;
          if (!pendingRequest) {
            setInsertFeedback({
              status: "error",
              message: "Select a section before choosing a drop zone.",
            });
            setSectionLibraryOpen(true);
            resetDropZoneState();
            return;
          }

          if (
            !payload ||
            (payload.position !== "before" && payload.position !== "after")
          ) {
            setInsertFeedback({
              status: "error",
              message: "We couldn't understand that drop location.",
            });
            setSectionLibraryOpen(true);
            resetDropZoneState();
            return;
          }

          if (typeof payload.sectionId !== "string") {
            setInsertFeedback({
              status: "error",
              message: "We couldn't detect which section you selected.",
            });
            setSectionLibraryOpen(true);
            resetDropZoneState();
            return;
          }

          setIsInsertingSection(true);
          setInsertFeedback({ status: "idle" });
          const targetSectionId = payload.sectionId;

          void (async () => {
            try {
              await insertSection({
                projectSlug: slug,
                sectionKey: pendingRequest.sectionKey,
                customSectionPrompt: pendingRequest.customPrompt,
                position: payload.position as "before" | "after",
                targetSectionId,
              });

              setInsertFeedback({ status: "idle" });
              onSectionSelected(pendingRequest.sectionKey);
            } catch (error) {
              setInsertFeedback({
                status: "error",
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to insert section.",
              });
              setSectionLibraryOpen(true);
              resetDropZoneState();
              return;
            } finally {
              setIsInsertingSection(false);
              resetDropZoneState();
            }
          })();
        } else if (data.type === "overlay-drop-mode-cancelled") {
          resetDropZoneState();
          setInsertFeedback({ status: "idle" });
          setSectionLibraryOpen(true);
        }
        return;
      }
    };

    window.addEventListener("message", handleMessage);
    overlayDebug("[overlay] message listener mounted");
    return () => {
      window.removeEventListener("message", handleMessage);
      clearOverlayInitInterval();
    };
  }, [
    clearOverlayInitInterval,
    onSectionSelected,
    pendingSectionRequest,
    requestOverlayInit,
    resetDropZoneState,
    setSectionLibraryOpen,
    slug,
    syncOverlayMode,
  ]);

  useEffect(() => {
    overlayMountedRef.current = false;
    requestOverlayInit();
  }, [requestOverlayInit]);

  useEffect(() => {
    syncOverlayMode();
  }, [syncOverlayMode]);

  useEffect(() => {
    if (!isSectionLibraryOpen && !isSelectingDropZone) {
      setInsertFeedback((current) =>
        current.status === "success" || current.status === "error"
          ? current
          : { status: "idle" },
      );
    }
  }, [isSectionLibraryOpen, isSelectingDropZone]);

  return {
    beginDropZoneSelection,
    handleIframeLoad,
    insertFeedback,
    isInsertingSection,
    isSelectingDropZone,
    requestOverlayInit,
  };
}

export type OverlayBridgeState = ReturnType<typeof useOverlayBridge>;
