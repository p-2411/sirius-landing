"use client";

import { createContext, useCallback, useContext, useEffect, useId, useState } from "react";

type Status = "idle" | "submitting" | "success" | "already" | "error";

const DOWNLOAD_URL =
  "https://github.com/p-2411/sirius-releases/releases/download/v0.5.5/Sirius-0.5.5-arm64.dmg";

function startDownload() {
  const a = document.createElement("a");
  a.href = DOWNLOAD_URL;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// One shared modal for every "Download for Mac" trigger on the page.
const DownloadModalContext = createContext<{ open: () => void } | null>(null);

export function useDownloadModal() {
  const ctx = useContext(DownloadModalContext);
  if (!ctx) throw new Error("useDownloadModal must be used within <DownloadProvider>");
  return ctx;
}

export function DownloadProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  return (
    <DownloadModalContext.Provider value={{ open: openModal }}>
      {children}
      {open && <DownloadDialog onClose={close} />}
    </DownloadModalContext.Provider>
  );
}

function DownloadDialog({ onClose }: { onClose: () => void }) {
  const ids = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [pastFree, setPastFree] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setErr("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/free-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, consent }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        already?: boolean;
        soldOut?: boolean;
        remaining?: number;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setErr(
          data.error === "consent"
            ? "Please agree to be contacted."
            : data.error === "email"
              ? "Enter a valid email address."
              : data.error === "name"
                ? "Enter your name."
                : "Something went wrong — please try again.",
        );
        setStatus("error");
        return;
      }
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      setPastFree(Boolean(data.soldOut));
      setStatus(data.already ? "already" : "success");
      startDownload();
    } catch {
      setErr("Network error — please try again.");
      setStatus("error");
    }
  }

  const done = status === "success" || status === "already";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Download Sirius for Mac"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.66)", backdropFilter: "blur(4px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] overflow-hidden rounded-[20px] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] p-7 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)]"
        style={{ animation: "sp-notif-in 240ms cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-[22px] font-normal leading-tight text-[var(--color-ink-1)]">
            {done ? "You're in." : "Download Sirius for Mac"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-ink-3)] hover:text-[var(--color-ink-1)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="mt-3 text-[14px] leading-[1.6] text-[var(--color-ink-2)]">
            <p>
              {status === "already" ? "Welcome back. Your download is starting." : "You're in. Your download is starting."}
              {pastFree ? (
                <span className="mt-2 block text-[var(--color-ink-3)]">The 20 free spots are gone, so you&rsquo;re on the $20 plan.</span>
              ) : remaining != null && remaining > 0 ? (
                <span className="mt-2 block text-[var(--color-ink-3)]">{remaining} free spots left.</span>
              ) : null}
            </p>
            <p className="mt-3 text-[13px] text-[var(--color-ink-3)]">
              Didn&rsquo;t start?{" "}
              <a href={DOWNLOAD_URL} className="text-[var(--color-accent)] underline underline-offset-2">
                Download Sirius for Mac
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
            <Field id={`${ids}-name`} label="Name">
              <input
                id={`${ids}-name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className={inputClass}
              />
            </Field>
            <Field id={`${ids}-email`} label="Email">
              <input
                id={`${ids}-email`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
              />
            </Field>
            <Field id={`${ids}-mobile`} label="Mobile number (optional)">
              <input
                id={`${ids}-mobile`}
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="tel"
                className={inputClass}
              />
            </Field>

            <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.5] text-[var(--color-ink-2)]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
              />
              It&rsquo;s okay to email me for feedback.
            </label>

            {status === "error" && <p className="text-[13px] text-[var(--color-danger)]">{err}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn btn-primary mt-1 text-[13.5px] disabled:cursor-wait disabled:opacity-70"
            >
              {status === "submitting" ? "Starting…" : "Download"}
            </button>
          </form>
        )}

        {done && (
          <button type="button" onClick={onClose} className="btn btn-ghost mt-5 w-full text-[13.5px]">
            Close
          </button>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface-deep)] px-3 py-2.5 text-[14px] text-[var(--color-ink-1)] outline-none transition-colors focus:border-[rgba(240,179,90,0.55)]";

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={id} className="text-[12px] text-[var(--color-ink-3)]">
        {label}
      </label>
      {children}
    </div>
  );
}
