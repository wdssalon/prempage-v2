const OVERLAY_SOURCE = "prempage-overlay";
const HOVER_CLASS = "prem-overlay--hover";
const EDITING_CLASS = "prem-overlay--editing";
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
};

type EditableElement = HTMLElement & { dataset: { ppid?: string } };

type InternalState = {
  current: EditableElement | null;
  originalText: string;
};

const defaultState: InternalState = {
  current: null,
  originalText: "",
};

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
  const state: InternalState = { ...defaultState };

  injectStyles(rootDoc);

  const handlePointerOver = (event: Event) => {
    const target = getEditableElement(event.target);
    if (!target || target === state.current) return;
    setHover(target, true);
  };

  const handlePointerOut = (event: Event) => {
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
    const target = getEditableElement(event.target);
    if (!target) return;

    event.preventDefault();
    activateEditing(target);
  };

  const addListener = (node: Document | HTMLElement, type: string, handler: EventListener) => {
    node.addEventListener(type, handler);
  };

  addListener(root, "pointerover", handlePointerOver as EventListener);
  addListener(root, "pointerout", handlePointerOut as EventListener);
  addListener(root, "click", handleClick as EventListener);

  const destroy = () => {
    teardownEditing(state);
    root.removeEventListener("pointerover", handlePointerOver as EventListener);
    root.removeEventListener("pointerout", handlePointerOut as EventListener);
    root.removeEventListener("click", handleClick as EventListener);
  };

  return { destroy };
}

export type OverlayController = ReturnType<typeof initOverlay>;
