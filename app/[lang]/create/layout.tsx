import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true
  }
};

type CreateLayoutProps = {
  children: ReactNode;
};

export default function CreateLayout({ children }: CreateLayoutProps) {
  return children;
}
