"use client";

type LoadingModalProps = {
  badge: string;
  title: string;
  description: string;
  progressMessage?: string;
  backdropImageUrl?: string | null;
};

export function LoadingModal({
  badge,
  title,
  description,
  progressMessage,
  backdropImageUrl,
}: LoadingModalProps) {
  return (
    <div aria-live="polite" aria-modal="true" className="create-loading-modal" role="dialog">
      {backdropImageUrl ? (
        <div
          aria-hidden
          className="create-loading-modal__bg"
          style={{ backgroundImage: `url(${backdropImageUrl})` }}
        />
      ) : null}
      <div aria-hidden className="create-loading-modal__veil" />
      <div className="create-loading-modal__panel">
        <div className="create-loading-modal__ring" />
        <p className="create-loading-modal__badge">{badge}</p>
        <h2 className="create-loading-modal__title">{title}</h2>
        <p className="create-loading-modal__description">{description}</p>
        {progressMessage ? <p className="create-loading-modal__progress">{progressMessage}</p> : null}
      </div>
    </div>
  );
}
