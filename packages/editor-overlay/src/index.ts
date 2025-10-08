const OVERLAY_SOURCE = "prempage-overlay";
const HOVER_CLASS = "prem-overlay--hover";
const EDITING_CLASS = "prem-overlay--editing";
const DROP_HOVER_CLASS = "prem-overlay--drop-hover";
const DROP_MODE_CLASS = "prem-overlay--drop-mode";
const CONTENTEDITABLE_MODE = "plaintext-only";

export type OverlayEditPayload = {
  ppid: string;
  text: string;
};

type CommitMeta = {
  reason: "enter" | "blur";
};

export type OverlayOptions = {
  /** Root node to observe for data-ppid elements. Defaults to document. */
  root?: Document | HTMLElement;
  /** Called whenever a text edit is committed. */
  onCommit?: (payload: OverlayEditPayload, meta: CommitMeta) => void;
  /** Whether editing should be enabled when the overlay boots. Defaults to false. */
  editingInitiallyEnabled?: boolean;
};

type EditableElement = HTMLElement & { dataset: { ppid?: string } };
type SectionElement = HTMLElement & { dataset: { sectionId?: string } };

type InternalState = {
  current: EditableElement | null;
  originalText: string;
  editingEnabled: boolean;
  dropModeActive: boolean;
  dropHover: SectionElement | null;
  resumeEditingOnExit: boolean;
};

const CLICK_CAPTURE_OPTIONS: AddEventListenerOptions = { capture: true };

function createInitialState(editingInitiallyEnabled: boolean): InternalState {
  return {
    current: null,
    originalText: "",
    editingEnabled: editingInitiallyEnabled,
    dropModeActive: false,
    dropHover: null,
    resumeEditingOnExit: false,
  };
}

function resolveDocument(root: Document | HTMLElement | undefined): Document {
  if (!root) {
    return window.document;
  }
  return root instanceof Document ? root : root.ownerDocument ?? window.document;
}

function getEditableElement(node: EventTarget | null): EditableElement | null {
  if (!node) return null;

  if (node instanceof HTMLElement) {
    return node.closest<EditableElement>("[data-ppid]");
  }

  if (node instanceof Node) {
    return (node.parentElement && node.parentElement.closest<EditableElement>("[data-ppid]")) || null;
  }

  return null;
}

function getSectionElement(node: EventTarget | null): SectionElement | null {
  if (!node) return null;

  if (node instanceof HTMLElement) {
    return node.closest<SectionElement>("[data-section-id]");
  }

  if (node instanceof Node) {
    return (
      (node.parentElement &&
        node.parentElement.closest<SectionElement>("[data-section-id]")) ||
      null
    );
  }

  return null;
}

function selectContents(el: HTMLElement) {
  const owner = el.ownerDocument ?? document;
  const range = owner.createRange();
  range.selectNodeContents(el);
  const selection = owner.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function injectStyles(rootDoc: Document) {
  if (rootDoc.getElementById("prem-overlay-style")) {
    return;
  }

  const style = rootDoc.createElement("style");
  style.id = "prem-overlay-style";
  style.textContent = `
    [data-ppid] {
      cursor: text;
    }
    [data-ppid].${HOVER_CLASS} {
      outline: 2px solid rgba(59, 130, 246, 0.55);
      outline-offset: 2px;
    }
    [data-ppid].${EDITING_CLASS} {
      outline: 2px solid rgba(16, 185, 129, 0.85);
      outline-offset: 2px;
      background-color: rgba(16, 185, 129, 0.08);
    }
    [data-section-id].${DROP_HOVER_CLASS} {
      outline: 3px dashed rgba(59, 130, 246, 0.75);
      outline-offset: 6px;
      cursor: copy;
    }
    body.${DROP_MODE_CLASS} {
      cursor: copy;
    }
  `;
  rootDoc.head.append(style);
}

function defaultDispatch(payload: OverlayEditPayload, meta: CommitMeta) {
  if (typeof window === "undefined") return;
  try {
    window.parent?.postMessage({ source: OVERLAY_SOURCE, type: "overlay-edit", payload, meta }, "*");
  } catch (error) {
    console.warn("prempage overlay: failed to postMessage", error);
  }
}

function setHover(el: EditableElement | null, shouldHover: boolean) {
  if (!el) return;
  if (shouldHover) {
    el.classList.add(HOVER_CLASS);
  } else {
    el.classList.remove(HOVER_CLASS);
  }
}

function setDropHover(el: SectionElement | null, shouldHover: boolean) {
  if (!el) return;
  if (shouldHover) {
    el.classList.add(DROP_HOVER_CLASS);
  } else {
    el.classList.remove(DROP_HOVER_CLASS);
  }
}

function clearHoverState(root: Document | HTMLElement) {
  root
    .querySelectorAll<EditableElement>(`[data-ppid].${HOVER_CLASS}`)
    .forEach((el) => el.classList.remove(HOVER_CLASS));
}

function setEditing(el: EditableElement | null, isEditing: boolean) {
  if (!el) return;
  if (isEditing) {
    el.classList.add(EDITING_CLASS);
  } else {
    el.classList.remove(EDITING_CLASS);
  }
}

function teardownEditing(state: InternalState) {
  const { current } = state;
  if (!current) return;

  current.removeAttribute("contenteditable");
  current.removeEventListener("keydown", stateKeyDownHandler as EventListener);
  current.removeEventListener("blur", stateBlurHandler as EventListener);
  setEditing(current, false);
  current.classList.remove(HOVER_CLASS);
  state.current = null;
  state.originalText = "";
}

let stateKeyDownHandler: (event: KeyboardEvent) => void;
let stateBlurHandler: (event: FocusEvent) => void;

export function initOverlay(options: OverlayOptions = {}) {
  console.debug("[overlay] initOverlay invoked");
  const root = options.root ?? window.document;
  const rootDoc = resolveDocument(root);
  const dispatch = options.onCommit ?? defaultDispatch;
  const state: InternalState = createInitialState(
    options.editingInitiallyEnabled ?? false,
  );

  injectStyles(rootDoc);

  function exitDropMode(reason: "selected" | "cancelled") {
    if (!state.dropModeActive) {
      return;
    }

    console.debug("[overlay] exiting drop mode", reason);
    state.dropModeActive = false;
    if (state.dropHover) {
      setDropHover(state.dropHover, false);
      state.dropHover = null;
    }
    rootDoc.body.classList.remove(DROP_MODE_CLASS);

    if (reason === "cancelled") {
      window.parent?.postMessage(
        { source: OVERLAY_SOURCE, type: "overlay-drop-mode-cancelled" },
        "*",
      );
    }

    if (state.resumeEditingOnExit) {
      setEditingEnabled(true);
      state.resumeEditingOnExit = false;
    }
  }

  function enterDropMode() {
    if (state.dropModeActive) {
      return;
    }

    console.debug("[overlay] entering drop mode");
    state.resumeEditingOnExit = state.editingEnabled;
    if (state.editingEnabled) {
      setEditingEnabled(false);
    }
    state.dropModeActive = true;
    state.dropHover = null;
    rootDoc.body.classList.add(DROP_MODE_CLASS);
    window.parent?.postMessage(
      { source: OVERLAY_SOURCE, type: "overlay-drop-mode-started" },
      "*",
    );
  }

  const handlePointerOver = (event: Event) => {
    if (state.dropModeActive) {
      const dropTarget = getSectionElement(event.target);
      if (!dropTarget || dropTarget === state.dropHover) return;
      if (state.dropHover) {
        setDropHover(state.dropHover, false);
      }
      setDropHover(dropTarget, true);
      state.dropHover = dropTarget;
      return;
    }

    if (!state.editingEnabled) return;
    const target = getEditableElement(event.target);
    if (!target || target === state.current) return;
    setHover(target, true);
  };

  const handlePointerOut = (event: Event) => {
    if (state.dropModeActive) {
      const target = getSectionElement(event.target);
      if (!target) return;

      const related = (event as PointerEvent).relatedTarget as Node | null;
      if (related && target.contains(related)) {
        return;
      }

      setDropHover(target, false);
      if (state.dropHover === target) {
        state.dropHover = null;
      }
      return;
    }

    if (!state.editingEnabled) return;
    const target = getEditableElement(event.target);
    if (!target || target === state.current) return;

    const related = (event as PointerEvent).relatedTarget as Node | null;
    if (related && target.contains(related)) {
      return;
    }

    setHover(target, false);
  };

  const commitEdit = (reason: CommitMeta["reason"]) => {
    const { current } = state;
    if (!current) return;

    const ppid = current.dataset.ppid;
    if (!ppid) {
      teardownEditing(state);
      return;
    }

    const text = current.textContent ?? "";
    const trimmed = text.trim();
    const originalTrimmed = state.originalText.trim();

    teardownEditing(state);

    if (trimmed === originalTrimmed) {
      return;
    }

    dispatch({ ppid, text }, { reason });
  };

  stateKeyDownHandler = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      commitEdit("enter");
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (state.current) {
        state.current.textContent = state.originalText;
      }
      teardownEditing(state);
    }
  };

  stateBlurHandler = () => {
    commitEdit("blur");
  };

  const activateEditing = (element: EditableElement) => {
    if (!state.editingEnabled) return;
    if (state.current === element) return;
    if (state.current) {
      teardownEditing(state);
    }

    setHover(element, false);
    setEditing(element, true);

    state.current = element;
    state.originalText = element.textContent ?? "";

    element.setAttribute("contenteditable", CONTENTEDITABLE_MODE);
    element.addEventListener("keydown", stateKeyDownHandler as EventListener);
    element.addEventListener("blur", stateBlurHandler as EventListener, { once: true });

    element.focus({ preventScroll: true });
    selectContents(element);
  };

  const handleClick = (event: MouseEvent) => {
    if (state.dropModeActive) {
      const sectionTarget = getSectionElement(event.target);
      if (!sectionTarget) {
        return;
      }

      const sectionId = sectionTarget.dataset.sectionId;
      if (!sectionId) {
        return;
      }

      const rect = sectionTarget.getBoundingClientRect();
      const offset = event.clientY - rect.top;
      const position = offset < rect.height / 2 ? "before" : "after";

      window.parent?.postMessage(
        {
          source: OVERLAY_SOURCE,
          type: "overlay-section-drop-selected",
          payload: {
            sectionId,
            position,
          },
        },
        "*",
      );

      exitDropMode("selected");
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const target = getEditableElement(event.target);
    if (!target) return;

    if (!state.editingEnabled) {
      console.debug("[overlay] click ignored; editing disabled", {
        ppid: target.dataset.ppid,
        tag: target.tagName,
      });
      return;
    }

    console.debug("[overlay] intercepting click for editing", {
      ppid: target.dataset.ppid,
      tag: target.tagName,
      defaultPrevented: event.defaultPrevented,
    });

    event.preventDefault();
    event.stopImmediatePropagation();
    activateEditing(target);
  };

  const addListener = (
    node: Document | HTMLElement,
    type: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions,
  ) => {
    node.addEventListener(type, handler, options);
  };

  addListener(root, "pointerover", handlePointerOver as EventListener);
  addListener(root, "pointerout", handlePointerOut as EventListener);
  addListener(root, "click", handleClick as EventListener, CLICK_CAPTURE_OPTIONS);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!state.dropModeActive) return;
    if (event.key === "Escape") {
      event.preventDefault();
      exitDropMode("cancelled");
    }
  };

  addListener(rootDoc, "keydown", handleKeyDown as EventListener);

  const setEditingEnabled = (enabled: boolean) => {
    if (state.editingEnabled === enabled) {
      return;
    }

    console.debug("[overlay] editing mode", enabled ? "enabled" : "disabled");

    if (!enabled) {
      teardownEditing(state);
      clearHoverState(root);
    }

    state.editingEnabled = enabled;
  };

  const destroy = () => {
    teardownEditing(state);
    clearHoverState(root);
    if (state.dropModeActive) {
      exitDropMode("cancelled");
    }
    root.removeEventListener("pointerover", handlePointerOver as EventListener);
    root.removeEventListener("pointerout", handlePointerOut as EventListener);
    root.removeEventListener("click", handleClick as EventListener, CLICK_CAPTURE_OPTIONS);
    rootDoc.removeEventListener("keydown", handleKeyDown as EventListener);
  };

  return {
    destroy,
    setEditingEnabled,
    enterSectionDropMode: enterDropMode,
    cancelSectionDropMode: () => exitDropMode("cancelled"),
  };
}

export type OverlayController = ReturnType<typeof initOverlay>;
