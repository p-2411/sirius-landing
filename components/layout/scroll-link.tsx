"use client";

import type { CSSProperties, ReactNode } from "react";

/** Anchor that smooth-scrolls the target id to the center of the viewport. */
export function ScrollLink({
  id,
  className,
  style,
  children,
}: {
  id: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    history.replaceState(null, "", `#${id}`);
  };
  return (
    <a href={`#${id}`} onClick={onClick} className={className} style={style}>
      {children}
    </a>
  );
}
