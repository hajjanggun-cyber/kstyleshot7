"use client";

import { useTranslations } from "next-intl";

export function AgeGate() {
  const t = useTranslations("create.consent");

  return (
    <label className="checkline">
      <input type="checkbox" />
      <span>{t("age")}</span>
    </label>
  );
}
