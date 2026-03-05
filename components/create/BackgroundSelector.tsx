"use client";

import { useTranslations } from "next-intl";

import {
  StyleSelector,
  type StyleSelectorItem
} from "@/components/create/StyleSelector";

type BackgroundSelectorItem = StyleSelectorItem;

type BackgroundSelectorProps = {
  items: BackgroundSelectorItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  ctaLabel?: string;
  onSubmit?: () => void;
  ctaDisabled?: boolean;
};

export function BackgroundSelector({
  items,
  selectedIds,
  onToggle,
  ctaLabel,
  onSubmit,
  ctaDisabled
}: BackgroundSelectorProps) {
  const t = useTranslations("create.location");

  return (
    <StyleSelector
      ctaDisabled={ctaDisabled}
      ctaLabel={ctaLabel}
      description={t("selectorDescription")}
      items={items}
      onSubmit={onSubmit}
      onToggle={onToggle}
      selectedIds={selectedIds}
      title={t("selectorTitle")}
    />
  );
}
