"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "cookie-consent";

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const { lang } = useParams<{ lang: string }>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const respond = useCallback((accepted: boolean) => {
    localStorage.setItem(STORAGE_KEY, accepted ? "accepted" : "declined");
    setVisible(false);

    if (!accepted) {
      // Disable GA and Clarity by removing their cookies
      document.cookie = "_ga=; Max-Age=0; path=/;";
      document.cookie = "_ga_Q3QEDGYL0D=; Max-Age=0; path=/;";
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
      });
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "var(--surface)",
        borderTop: "1px solid var(--line)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        flexWrap: "wrap",
        fontSize: 14,
        color: "var(--muted)",
      }}
    >
      <p style={{ margin: 0, flex: "1 1 280px" }}>
        {t("message")}{" "}
        <Link
          href={`/${lang ?? "ko"}/cookie-policy`}
          style={{ color: "var(--accent)", textDecoration: "underline" }}
        >
          {t("learnMore")}
        </Link>
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => respond(false)}
          style={{
            padding: "6px 16px",
            borderRadius: 6,
            border: "1px solid var(--line)",
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          {t("decline")}
        </button>
        <button
          onClick={() => respond(true)}
          style={{
            padding: "6px 16px",
            borderRadius: 6,
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
