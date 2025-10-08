const OVERLAY_SOURCE = "prempage-overlay";
const HOVER_CLASS = "prem-overlay--hover";
const EDITING_CLASS = "prem-overlay--editing";
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
    body.${DROP_MODE_CLASS} {
      cursor: pointer;
    }
  `;
  rootDoc.head.append(style);
}

type DropOverlayController = {
  mount: () => void;
  update: (section: SectionElement, pointerY: number) => void;
  hide: () => void;
  destroy: () => void;
};

function createDropOverlay(rootDoc: Document): DropOverlayController {
  const container = rootDoc.createElement("div");
  container.id = "prem-overlay-drop-container";
  Object.assign(container.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    display: "none",
    zIndex: "2147483647",
  });

  const backdrop = rootDoc.createElement("div");
  Object.assign(backdrop.style, {
    position: "absolute",
    inset: "0",
    background: "rgba(17, 24, 39, 0.45)",
    borderRadius: "18px",
    transition: "opacity 120ms ease",
  });

  const split = rootDoc.createElement("div");
  Object.assign(split.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    pointerEvents: "none",
  });

  const createHalf = (label: string) => {
    const half = rootDoc.createElement("div");
    Object.assign(half.style, {
      flex: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      transition: "background 120ms ease",
    });

    const text = rootDoc.createElement("span");
    text.textContent = label;
    Object.assign(text.style, {
      padding: "8px 14px",
      borderRadius: "9999px",
      background: "rgba(15, 15, 15, 0.65)",
      backdropFilter: "blur(10px)",
      pointerEvents: "none",
      transition: "transform 120ms ease, background 120ms ease, box-shadow 120ms ease",
    });

    half.append(text);
    return { half, text };
  };

  const top = createHalf("Insert above");
  const bottom = createHalf("Insert below");

  const divider = rootDoc.createElement("div");
  Object.assign(divider.style, {
    height: "2px",
    background: "rgba(30, 41, 59, 0.6)",
    margin: "0 18px",
  });

  split.append(top.half, divider, bottom.half);
  container.append(backdrop, split);
  rootDoc.body.append(container);

  const updateStyles = (active: "top" | "bottom") => {
    const activate = (item: typeof top | typeof bottom, isActive: boolean) => {
      item.half.style.background = isActive
        ? "linear-gradient(180deg, rgba(15,15,15,0.55) 0%, rgba(15,15,15,0.2) 100%)"
        : "rgba(15, 23, 42, 0.0)";
      item.text.style.background = isActive
        ? "rgba(15, 15, 15, 0.85)"
        : "rgba(15, 15, 15, 0.65)";
      item.text.style.transform = isActive ? "scale(1.05)" : "scale(1)";
      item.text.style.boxShadow = isActive
        ? "0 12px 35px rgba(15,15,15,0.55)"
        : "none";
    };

    activate(top, active === "top");
    activate(bottom, active === "bottom");
  };

  let mounted = false;

  return {
    mount() {
      if (!mounted) {
        container.style.display = "block";
        mounted = true;
      }
    },
    update(section, pointerY) {
      const rect = section.getBoundingClientRect();

      Object.assign(container.style, {
        display: "block",
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });

      const halfway = rect.height / 2;
      const localY = pointerY - rect.top;
      updateStyles(localY <= halfway ? "top" : "bottom");
    },
    hide() {
      container.style.display = "none";
      mounted = false;
    },
    destroy() {
      container.remove();
    },
  };
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
  const dropOverlay = createDropOverlay(rootDoc);

  const updateDropOverlay = (section: SectionElement, pointerY: number) => {
    dropOverlay.mount();
    dropOverlay.update(section, pointerY);
  };

  function exitDropMode(reason: "selected" | "cancelled") {
    if (!state.dropModeActive) {
      return;
    }

    console.debug("[overlay] exiting drop mode", reason);
    state.dropModeActive = false;
    if (state.dropHover) {
      state.dropHover = null;
    }
    rootDoc.body.classList.remove(DROP_MODE_CLASS);
    dropOverlay.hide();

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
      if (!dropTarget) return;
      state.dropHover = dropTarget;
      updateDropOverlay(dropTarget, (event as PointerEvent).clientY);
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

      if (state.dropHover === target) {
        state.dropHover = null;
        dropOverlay.hide();
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

  const handlePointerMove = (event: Event) => {
    if (!state.dropModeActive) {
      return;
    }

    const target = getSectionElement(event.target);
    if (!target || target !== state.dropHover) {
      return;
    }

    updateDropOverlay(target, (event as PointerEvent).clientY);
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
  addListener(root, "pointermove", handlePointerMove as EventListener);
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
    root.removeEventListener("pointermove", handlePointerMove as EventListener);
    root.removeEventListener("click", handleClick as EventListener, CLICK_CAPTURE_OPTIONS);
    rootDoc.removeEventListener("keydown", handleKeyDown as EventListener);
    dropOverlay.destroy();
  };

  return {
    destroy,
    setEditingEnabled,
    enterSectionDropMode: enterDropMode,
    cancelSectionDropMode: () => exitDropMode("cancelled"),
  };
}

export type OverlayController = ReturnType<typeof initOverlay>;
