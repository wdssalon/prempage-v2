import "@testing-library/jest-dom/vitest";
import { forwardRef, type AnchorHTMLAttributes, type ComponentPropsWithoutRef } from "react";
import { vi } from "vitest";

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

if (typeof window !== "undefined" && !window.matchMedia) {
  type MediaQueryListener = (event: MediaQueryListEvent) => void;
  const listeners = new Set<MediaQueryListener>();
  const listenerStore = new WeakMap<EventListenerOrEventListenerObject, MediaQueryListener>();

  const toListener = (
    candidate: EventListenerOrEventListenerObject,
  ): MediaQueryListener | null => {
    if (typeof candidate === "function") {
      return candidate as MediaQueryListener;
    }

    if (
      candidate &&
      typeof (candidate as EventListenerObject).handleEvent === "function"
    ) {
      const handler = candidate as EventListenerObject;
      return (event: MediaQueryListEvent) => {
        handler.handleEvent(event);
      };
    }

    return null;
  };

  const createList = (matches: boolean): MediaQueryList => ({
    matches,
    media: "",
    onchange: null,
    addEventListener: (
      _event: keyof MediaQueryListEventMap | string,
      listener: EventListenerOrEventListenerObject,
      _options?: boolean | AddEventListenerOptions,
    ) => {
      const resolved = toListener(listener);
      if (resolved) {
        listenerStore.set(listener, resolved);
        listeners.add(resolved);
      }
    },
    removeEventListener: (
      _event: keyof MediaQueryListEventMap | string,
      listener: EventListenerOrEventListenerObject,
      _options?: boolean | EventListenerOptions,
    ) => {
      const resolved = listenerStore.get(listener);
      if (resolved) {
        listeners.delete(resolved);
        listenerStore.delete(listener);
      }
    },
    addListener: (listener: MediaQueryListener | null) => {
      if (listener) {
        listeners.add(listener);
      }
    },
    removeListener: (listener: MediaQueryListener | null) => {
      if (listener) {
        listeners.delete(listener);
      }
    },
    dispatchEvent: (event: Event) => {
      listeners.forEach((listener) => listener(event as MediaQueryListEvent));
      return true;
    },
  });

  window.matchMedia = (query: string) =>
    createList(window.innerWidth >= 1024 || query.includes("min-width"));
}

vi.mock("next/link", () => {
  const Link = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
    ({ href, ...props }, ref) => (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a ref={ref} href={href ?? "#"} {...props} />
    ),
  );
  Link.displayName = "NextLink";

  return { __esModule: true, default: Link };
});

vi.mock("next/image", () => {
  const NextImage = (
    props: ComponentPropsWithoutRef<"img"> & {
      width?: number;
      height?: number;
      fill?: boolean;
      priority?: boolean;
    },
  ) => {
    const { alt, priority: _priority, fill: _fill, ...rest } = props;
    return <img alt={alt ?? ""} {...rest} />;
  };
  NextImage.displayName = "NextImage";

  return { __esModule: true, default: NextImage };
});

vi.mock("next/navigation", () => {
  const notFound = vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  });

  return {
    __esModule: true,
    notFound,
  };
});
