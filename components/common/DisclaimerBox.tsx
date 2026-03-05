"use client";

import { useTranslations } from "next-intl";

export function DisclaimerBox() {
  const t = useTranslations("disclaimer");

  return (
    <footer className="card stack disclaimer-card">
      <strong>{t("title")}</strong>
      <span className="muted">{t("line1")}</span>
      <span className="muted">{t("line2")}</span>
      <span className="muted">{t("line3")}</span>
    </footer>
  );
}
