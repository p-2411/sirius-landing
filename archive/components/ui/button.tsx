import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
};

const VARIANT_CLASS = {
  primary: "btn btn-primary text-[13.5px]",
  secondary: "btn btn-ghost text-[13.5px]",
  quiet: "btn btn-quiet text-[13px]",
} as const;

export function ButtonLink({ children, href, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn("group", VARIANT_CLASS[variant], className)}>
      {children}
    </Link>
  );
}
