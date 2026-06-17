import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import type { ReactNode } from "react";

import { MotionProvider } from "@/components/ui/motion-provider";
import { DownloadProvider } from "@/components/ui/download-modal";

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
  title: "Sirus: your AI cofounder",
  description:
    "Sirus learns your business — sits in on meetings, reads your inbox and CRM — then runs the work across the tools you already use. On your Mac.",
  metadataBase: new URL("https://sirius.so"),
  openGraph: {
    title: "Sirus: your AI cofounder",
    description:
      "Sirus learns your business and runs the work across the tools you already use. On your Mac.",
    url: "https://sirius.so",
    siteName: "Sirus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sirus: your AI cofounder",
    description:
      "Sirus learns your business and runs the work across the tools you already use. On your Mac.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable}`}>
      <body>
        <MotionProvider>
          <DownloadProvider>{children}</DownloadProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
