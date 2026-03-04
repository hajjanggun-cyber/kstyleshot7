"use client";

export type StyleSelectorItem = {
  id: string;
  name: string;
  detail: string;
};

export type StyleSelectorProps = {
  title: string;
  description: string;
  items: StyleSelectorItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  ctaLabel?: string;
  onSubmit?: () => void;
  ctaDisabled?: boolean;
  maxSelected?: number;
};

export function StyleSelector({
  title,
  description,
  items,
  selectedIds,
  onToggle,
  ctaLabel,
  onSubmit,
  ctaDisabled = false,
  maxSelected = 2
}: StyleSelectorProps) {
  return (
    <section className="card stack">
      <h1>{title}</h1>
      <p className="muted">{description}</p>
      <div className="actions">
        <span className="count-badge">
          {selectedIds.length}/{maxSelected} selected
        </span>
        {ctaLabel ? (
          <button
            className="button"
            disabled={ctaDisabled}
            onClick={onSubmit}
            type="button"
          >
            {ctaLabel}
          </button>
        ) : null}
      </div>
      <div className="selector-grid two">
        {items.map((item) => (
          <button
            className={
              selectedIds.includes(item.id)
                ? "selector-card is-active"
                : "selector-card"
            }
            key={item.id}
            onClick={() => onToggle(item.id)}
            type="button"
          >
            <strong>{item.name}</strong>
            <span className="muted">{item.detail}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
