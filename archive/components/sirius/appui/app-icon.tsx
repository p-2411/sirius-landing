import React from "react";

export type AppIconName =
  | "work"
  | "flows"
  | "feed"
  | "voice"
  | "settings"
  | "play"
  | "send"
  | "clock"
  | "mail"
  | "doc"
  | "git"
  | "search"
  | "check"
  | "spark"
  | "table"
  | "plus"
  | "arrow"
  | "dots";

/**
 * AppIcon — verbatim SVG paths from the app's Icon.tsx.
 * viewBox 0 0 24 24, strokeWidth 1.4, round caps/joins, stroke="currentColor".
 */
export function AppIcon({
  name,
  size = 16,
  stroke = "currentColor",
}: {
  name: AppIconName;
  size?: number;
  stroke?: string;
}) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "voice":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="12" cy="12" r="7.5" opacity="0.5" />
          <circle cx="12" cy="12" r="10.5" opacity="0.25" />
        </svg>
      );
    case "work":
      return (
        <svg {...p}>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case "flows":
      return (
        <svg {...p}>
          <circle cx="5" cy="6" r="2" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="M7 6h10M6.5 7.5 11 16.5M17.5 7.5 13 16.5" />
        </svg>
      );
    case "feed":
      return (
        <svg {...p}>
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1.5" fill={stroke} />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="M4 12l16-8-6 18-3-7-7-3z" />
        </svg>
      );
    case "play":
      return (
        <svg {...p}>
          <path d="M7 4l13 8-13 8z" fill={stroke} stroke="none" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "plus":
      return (
        <svg {...p}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "dots":
      return (
        <svg {...p}>
          <circle cx="5" cy="12" r="1" fill={stroke} />
          <circle cx="12" cy="12" r="1" fill={stroke} />
          <circle cx="19" cy="12" r="1" fill={stroke} />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="M5 13l4 4 10-10" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
        </svg>
      );
    case "doc":
      return (
        <svg {...p}>
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M14 3v5h5M10 13h7M10 17h5" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="3" y="6" width="18" height="13" rx="1.5" />
          <path d="M3 7l9 7 9-7" />
        </svg>
      );
    case "git":
      return (
        <svg {...p}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="13" r="2" />
          <path d="M6 8v8M8 6h6a4 4 0 0 1 4 4v1" />
        </svg>
      );
    case "table":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="M3 10h18M9 10v9" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "settings":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.2-1.6l2-1.5-2-3.4-2.4.9a7 7 0 0 0-2.7-1.6L13.2 2h-2.4l-.5 2.8a7 7 0 0 0-2.7 1.6L5.2 5.5l-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .5.1 1.1.2 1.6l-2 1.5 2 3.4 2.4-.9a7 7 0 0 0 2.7 1.6l.5 2.8h2.4l.5-2.8a7 7 0 0 0 2.7-1.6l2.4.9 2-3.4-2-1.5c.1-.5.2-1.1.2-1.6z" />
        </svg>
      );
    default:
      return <svg {...p} />;
  }
}
