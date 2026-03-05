"use client";

import { useTranslations } from "next-intl";

import { DownloadButton } from "@/components/common/DownloadButton";

export type ResultGridItem = {
  id: string;
  name: string;
  blobUrl: string;
  detail?: string;
};

type ResultGridProps = {
  title: string;
  description?: string;
  results: ResultGridItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  emptyMessage?: string;
};

export function ResultGrid({
  title,
  description,
  results,
  selectedId,
  onSelect,
  emptyMessage
}: ResultGridProps) {
  const t = useTranslations("create.resultGrid");
  const resolvedEmptyMessage = emptyMessage ?? t("empty");

  return (
    <section className="card stack">
      <div className="section-head">
        <h2>{title}</h2>
        <span className="count-badge">{t("count", { count: results.length })}</span>
      </div>
      {description ? <p className="muted">{description}</p> : null}
      {results.length === 0 ? (
        <div className="empty-state">{resolvedEmptyMessage}</div>
      ) : (
        <div className="grid two">
          {results.map((result) => {
            const isSelected = result.id === selectedId;

            return (
              <article className={isSelected ? "card stack result-card is-selected" : "card stack result-card"} key={result.id}>
                <div className="preview-frame">
                  <img alt={result.name} src={result.blobUrl} />
                </div>
                <div className="stack">
                  <strong>{result.name}</strong>
                  {result.detail ? <span className="muted">{result.detail}</span> : null}
                </div>
                <div className="actions">
                  <button
                    className={isSelected ? "button" : "button secondary"}
                    onClick={() => onSelect?.(result.id)}
                    type="button"
                  >
                    {isSelected ? t("selected") : t("useThis")}
                  </button>
                  <DownloadButton
                    filename={`${result.id}.jpg`}
                    href={result.blobUrl}
                    label={t("download")}
                    className="ghost"
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
