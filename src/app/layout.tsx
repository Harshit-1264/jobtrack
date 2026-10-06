import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// next/font downloads Inter at BUILD time and serves it from your own domain.
// `variable` exposes it as a CSS custom property so Tailwind can use it (see globals.css).
// `display: swap` shows fallback text immediately instead of invisible text while loading.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Shows in the browser tab, bookmarks, and link previews when the URL is shared.
export const metadata: Metadata = {
  title: "JobTrack — Job Application Tracker",
  description:
    "Track every job application in one place: status, interviews, offers and notes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      {/* bg-slate-50 is the page background from the design; cards sit on it in white. */}
      <body className={`${inter.variable} bg-slate-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
