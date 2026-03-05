"use client";

import { useState } from "react";

export type StyleSelectorItem = {
  id: string;
  name: string;
  detail: string;
  thumbnail?: string;
  tags?: string[];
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

function StyleThumb({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="selector-fallback">
        <span>{name.slice(0, 1).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <img
      alt={name}
      className="selector-image"
      loading="lazy"
      onError={() => setFailed(true)}
      src={src}
    />
  );
}

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
      <h2>{title}</h2>
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
      <div className="selector-grid three">
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
            <div className="selector-media">
              <StyleThumb name={item.name} src={item.thumbnail} />
            </div>
            <div className="stack">
              <strong>{item.name}</strong>
              <span className="muted">{item.detail}</span>
              {item.tags?.length ? <span className="tag-row">{item.tags.join(" · ")}</span> : null}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
