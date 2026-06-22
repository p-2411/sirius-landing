import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sirius — Coming soon",
  description: "Sirius is being reworked.",
};

export default function ComingSoonPage() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        overflow: "hidden",
      }}
    >
      <h1 className="cs-title">
        Coming soon<span className="cs-dots" aria-hidden="true" />
      </h1>

      <p className="cs-sub">We&rsquo;re reworking Sirius from the ground up.</p>

      <style>{`
        .cs-title {
          margin: 0;
          font-family: var(--font-display, "Fraunces", Georgia, serif);
          font-size: clamp(2.75rem, 9vw, 5.5rem);
          font-weight: 500;
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: #f4ede0;
        }
        .cs-dots {
          display: inline-block;
          width: 1.6ch;
          text-align: left;
        }
        .cs-dots::after {
          content: "...";
          animation: cs-dots 1.4s steps(4, jump-none) infinite;
        }
        @keyframes cs-dots {
          0%   { content: ""; }
          25%  { content: "."; }
          50%  { content: ".."; }
          75%, 100% { content: "..."; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-dots::after { animation: none; }
        }
        .cs-sub {
          margin: 1.75rem 0 0;
          max-width: 30rem;
          font-size: clamp(1rem, 2.4vw, 1.2rem);
          line-height: 1.6;
          color: rgba(244, 237, 224, 0.62);
        }
      `}</style>
    </main>
  );
}
