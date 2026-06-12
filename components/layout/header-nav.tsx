"use client";

import Link from "next/link";

type NavItem = { id?: string; href?: string; label: string };

const linkClass =
  "text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink-3)] transition hover:text-[var(--color-ink-1)]";

export function HeaderNav({ items }: { items: readonly NavItem[] }) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return; // let the default hash jump handle it
    e.preventDefault();
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className="hidden items-center gap-6 sm:flex">
      {items.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href} className={linkClass}>
            {item.label}
          </Link>
        ) : (
          <a
            key={item.label}
            href={`#${item.id}`}
            onClick={(e) => item.id && onClick(e, item.id)}
            className={linkClass}
          >
            {item.label}
          </a>
        ),
      )}
    </nav>
  );
}
