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
  title: "Sirius: your co-founder, best friend and executor all in one",
  description:
    "Across your inbox, calendar, files, and any app with an API, Sirius holds the context and does the work. Local-first, Mac.",
  metadataBase: new URL("https://sirius.so"),
  openGraph: {
    title: "Sirius: your co-founder, best friend and executor all in one",
    description:
      "Across your inbox, calendar, files, and any app with an API, Sirius holds the context and does the work. Local-first, Mac.",
    url: "https://sirius.so",
    siteName: "Sirius",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sirius: your co-founder, best friend and executor all in one",
    description:
      "Across your inbox, calendar, files, and any app with an API, Sirius holds the context and does the work. Local-first, Mac.",
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
