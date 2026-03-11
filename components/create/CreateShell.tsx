"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useCreateStore } from "@/store/createStore";
import { StepProgress, type StepKey } from "@/components/create/StepProgress";

type CreateShellProps = {
  current: StepKey;
  title: string;
  description: string;
  children: ReactNode;
  blockedSteps?: StepKey[];
};

function shortToken(token: string) {
  if (!token) {
    return "-";
  }

  if (token.length < 16) {
    return token;
  }

  return `${token.slice(0, 6)}...${token.slice(-6)}`;
}

function statusClass(status: string) {
  if (status === "failed" || status === "refunded") {
    return "is-missing";
  }

  if (status === "payment_pending" || status === "upload_pending") {
    return "is-blocked";
  }

  return "is-ready";
}

export function CreateShell({
  current,
  title,
  description,
  children,
  blockedSteps = []
}: CreateShellProps) {
  const t = useTranslations("create.shell");
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "en";
  const { status, orderId, sessionToken, photoBlobUrl, hair, outfit } = useCreateStore();
  const stageVisual = {
    create: "/visuals/create/create.svg",
    upload: "/visuals/create/upload.svg",
    hair: "/visuals/create/hair.svg",
    outfit: "/visuals/create/outfit.svg",
    location: "/visuals/create/location.svg",
    done: "/visuals/create/done.svg"
  }[current];

  return (
    <section className="create-shell">
      <aside className="create-sidebar">
        <div className="card stack sidebar-card">
          <div className="brand-row">
            <span className="brand-dot" aria-hidden>
              *
            </span>
            <strong>K-StyleShot</strong>
          </div>
          <StepProgress blockedSteps={blockedSteps} compact current={current} />
          <div className="status-row">
            <span className="muted">{t("session")}</span>
            <span className={`status-chip ${statusClass(status)}`}>
              {t(`status.${status}`)}
            </span>
          </div>
          <div className="meta-list">
            <div className="meta-row">
              <span className="muted">{t("order")}</span>
              <strong>{orderId || "-"}</strong>
            </div>
            <div className="meta-row">
              <span className="muted">{t("session")}</span>
              <strong className="inline-code">{shortToken(sessionToken)}</strong>
            </div>
            <div className="meta-row">
              <span className="muted">{t("hair")}</span>
              <strong>{hair.picked || "-"}</strong>
            </div>
            <div className="meta-row">
              <span className="muted">{t("outfit")}</span>
              <strong>{outfit.picked || "-"}</strong>
            </div>
          </div>
          {photoBlobUrl ? (
            <div className="preview-frame sidebar-preview">
              <img alt={t("uploadedPreviewAlt")} src={photoBlobUrl} />
            </div>
          ) : (
            <div className="empty-state">{t("uploadPrompt")}</div>
          )}
          <div className="actions">
            <Link className="button secondary" href={`/${lang}/create`}>
              {t("restart")}
            </Link>
          </div>
        </div>
      </aside>

      <div className="create-stage">
        <header className="card stack stage-header">
          <div className="preview-frame stage-visual">
            <img alt={`${title} preview`} loading="lazy" src={stageVisual} />
          </div>
          <p className="eyebrow">{t("flowEyebrow")}</p>
          <h1>{title}</h1>
          <p className="muted">{description}</p>
        </header>
        <div className="stack">{children}</div>
      </div>
    </section>
  );
}
