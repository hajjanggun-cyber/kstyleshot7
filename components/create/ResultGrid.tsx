"use client";

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
  emptyMessage = "Results will appear here after generation."
}: ResultGridProps) {
  return (
    <section className="card stack">
      <div className="section-head">
        <h2>{title}</h2>
        <span className="count-badge">{results.length} result(s)</span>
      </div>
      {description ? <p className="muted">{description}</p> : null}
      {results.length === 0 ? (
        <div className="empty-state">{emptyMessage}</div>
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
                    {isSelected ? "Selected" : "Use this"}
                  </button>
                  <DownloadButton
                    filename={`${result.id}.jpg`}
                    href={result.blobUrl}
                    label="Download"
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
