"use client";

import { useTranslations } from "next-intl";

export function ConsentCheckbox() {
  const t = useTranslations("create.consent");

  return (
    <label className="checkline">
      <input type="checkbox" />
      <span>{t("ownership")}</span>
    </label>
  );
}
