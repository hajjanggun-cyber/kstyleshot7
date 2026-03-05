import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "kstyleshot",
  description: "Execution scaffold for kstyleshot."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
