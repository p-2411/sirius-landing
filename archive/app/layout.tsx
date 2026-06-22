import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { MotionProvider } from "@/components/ui/motion-provider";
import { SITE_URL } from "@/lib/site";

import "./globals.css";
import "./sirius-design.css";
import "./os.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"],
});

// System voice — section telemetry labels and the readouts on the OS visuals.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["500", "600"],
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  title: "Sirius — The operating system for your business",
  description:
    "Sirius learns how your business runs — every meeting, message, and client — finds what's slipping, then does the work to fix it, across the tools you already use.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Sirius — The operating system for your business",
    description:
      "It learns how your business runs, then runs it with you — across the tools you already use.",
    url: SITE_URL,
    siteName: "Sirius",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sirius — The operating system for your business",
    description:
      "It learns how your business runs, then runs it with you — across the tools you already use.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable}`}>
      <body>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
