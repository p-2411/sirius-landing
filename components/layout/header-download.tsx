"use client";

import { AppIcon } from "@/components/sirius/appui";
import { useDownloadModal } from "@/components/ui/download-modal";

// The header's quiet "Download for Mac" link — opens the shared download modal.
export function HeaderDownload({ label }: { label: string }) {
  const { open } = useDownloadModal();
  return (
    <button
      type="button"
      onClick={open}
      className="group inline-flex cursor-pointer items-center text-[13px] text-[var(--color-ink-1)] outline-none transition focus-visible:ring-2 focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)]"
    >
      <span className="inline-flex items-center gap-1.5 transition-colors duration-200 group-hover:text-[var(--color-accent)]">
        {label}
        <span className="inline-flex motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:translate-x-0.5">
          <AppIcon name="arrow" size={13} stroke="currentColor" />
        </span>
      </span>
    </button>
  );
}
