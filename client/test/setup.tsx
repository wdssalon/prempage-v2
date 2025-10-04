import "@testing-library/jest-dom/vitest";
import { forwardRef, type AnchorHTMLAttributes, type ComponentPropsWithoutRef } from "react";
import { vi } from "vitest";

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

if (typeof window !== "undefined" && !window.matchMedia) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const createList = (matches: boolean): MediaQueryList => ({
    matches,
    media: "",
    onchange: null,
    addEventListener: (_event, listener) => {
      listeners.add(listener);
    },
    removeEventListener: (_event, listener) => {
      listeners.delete(listener);
    },
    addListener: (listener) => {
      listeners.add(listener);
    },
    removeListener: (listener) => {
      listeners.delete(listener);
    },
    dispatchEvent: (event) => {
      listeners.forEach((listener) => listener(event));
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
