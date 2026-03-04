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
      description="Pick two backdrops, then create local composite previews."
      items={items}
      onSubmit={onSubmit}
      onToggle={onToggle}
      selectedIds={selectedIds}
      title="Choose 2 backgrounds"
    />
  );
}
