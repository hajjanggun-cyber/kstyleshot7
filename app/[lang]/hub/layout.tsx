import type { ReactNode } from "react";

/* Hub section uses its own full-screen layout — no global SiteHeader */
export default function HubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="hf-shell">
      {children}
    </div>
  );
}
