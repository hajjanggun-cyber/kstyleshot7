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
  return (
    <StyleSelector
      ctaDisabled={ctaDisabled}
      ctaLabel={ctaLabel}
      description="Pick two Seoul backdrops, then generate two composite previews and keep one."
      items={items}
      onSubmit={onSubmit}
      onToggle={onToggle}
      selectedIds={selectedIds}
      title="Choose 2 backdrops"
    />
  );
}
