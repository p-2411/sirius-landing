"use client";

import { cn } from "@/lib/utils";
import { landingContent } from "@/content/landing";
import { useDownloadModal } from "@/components/ui/download-modal";

// Every "Download for Mac" trigger opens the one shared modal (DownloadProvider).
export function DownloadButton({
  label,
  className,
  variant = "primary",
}: {
  label?: string;
  className?: string;
  variant?: "primary" | "ghost" | "quiet";
}) {
  const { open } = useDownloadModal();
  const text = label ?? landingContent.downloadCta.label;
  const variantClass = variant === "ghost" ? "btn-ghost" : variant === "quiet" ? "btn-quiet" : "btn-primary";
  return (
    <button type="button" onClick={open} className={cn("btn text-[13.5px]", variantClass, className)}>
      <span className="inline-flex items-center gap-2">
        {variant !== "quiet" && (
          <span aria-hidden="true" className="text-[15px] leading-none">⌘</span>
        )}
        {text}
      </span>
    </button>
  );
}
