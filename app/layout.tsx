import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import type { ReactNode } from "react";

import { MotionProvider } from "@/components/ui/motion-provider";
import { SITE_URL } from "@/lib/site";

import "./globals.css";
import "./sirius-design.css";

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

export const metadata: Metadata = {
  title: "Sirius: your AI cofounder",
  description:
    "Sirius learns your business — sits in on meetings, reads your inbox and CRM — then runs the work across the tools you already use. On your Mac.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Sirius: your AI cofounder",
    description:
      "Sirius learns your business and runs the work across the tools you already use. On your Mac.",
    url: SITE_URL,
    siteName: "Sirius",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sirius: your AI cofounder",
    description:
      "Sirius learns your business and runs the work across the tools you already use. On your Mac.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable}`}>
      <body>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
