"use client";

import { useEffect, useId, useState } from "react";

import { cn } from "@/lib/utils";
import { landingContent } from "@/content/landing";

type Status = "idle" | "submitting" | "success" | "already" | "soldout" | "error";

const DOWNLOAD_URL =
  "https://github.com/p-2411/sirius-releases/releases/download/v0.4.5/Sirius-0.4.5-arm64.dmg";

function startDownload() {
  const a = document.createElement("a");
  a.href = DOWNLOAD_URL;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function DownloadButton({ label, className }: { label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const text = label ?? landingContent.downloadCta.label;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn("btn btn-primary text-[13.5px]", className)}>
        <span className="inline-flex items-center gap-2">
          <span className="text-[15px] leading-none">⌘</span>
          {text}
        </span>
      </button>
      {open && <DownloadDialog onClose={() => setOpen(false)} />}
    </>
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
      if (res.status === 409 || data.soldOut) {
        setRemaining(0);
        setStatus("soldout");
        return;
      }
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
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] p-7 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]"
        style={{ animation: "sp-notif-in 240ms cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-[22px] font-normal leading-tight text-[var(--color-ink-1)]">
            {done ? "You're in." : status === "soldout" ? "Free spots are gone." : "Download Sirius for Mac"}
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
              {status === "already" ? "Welcome back — your download is starting." : "You're in. Your download is starting."}
              {remaining != null && remaining > 0 && (
                <span className="mt-2 block text-[var(--color-ink-3)]">{remaining} free spots left.</span>
              )}
            </p>
            <p className="mt-3 text-[13px] text-[var(--color-ink-3)]">
              Didn&rsquo;t start?{" "}
              <a
                href={DOWNLOAD_URL}
                className="text-[var(--color-accent)] underline underline-offset-2"
              >
                Download Sirius for Mac
              </a>
              .
            </p>
          </div>
        ) : status === "soldout" ? (
          <p className="mt-3 text-[14px] leading-[1.6] text-[var(--color-ink-2)]">
            All 20 free downloads have been claimed. Sirius Pro starts at $20/mo — same app, higher limits.
          </p>
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
              I&rsquo;d be happy to be reached out to for feedback.
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

        {(done || status === "soldout") && (
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
