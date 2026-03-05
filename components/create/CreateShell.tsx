"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useCreateStore } from "@/store/createStore";
import { StepProgress, type StepKey } from "@/components/create/StepProgress";

type CreateShellProps = {
  current: StepKey;
  title: string;
  description: string;
  children: ReactNode;
  blockedSteps?: StepKey[];
};

const statusLabelMap: Record<string, string> = {
  payment_pending: "Payment pending",
  payment_confirmed: "Payment confirmed",
  upload_pending: "Upload pending",
  hair_selecting: "Hair selecting",
  hair_processing: "Hair generating",
  hair_completed: "Hair ready",
  outfit_selecting: "Outfit selecting",
  outfit_processing: "Outfit generating",
  outfit_completed: "Outfit ready",
  cutout_processing: "Cutout processing",
  cutout_completed: "Cutout ready",
  location_selecting: "Background selecting",
  composite_completed: "Composite ready",
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded"
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
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "en";
  const { status, orderId, sessionToken, photoBlobUrl, hair, outfit, location } = useCreateStore();

  return (
    <section className="create-shell">
      <aside className="create-sidebar">
        <div className="card stack sidebar-card">
          <div className="brand-row">
            <span className="brand-dot" aria-hidden>
              *
            </span>
            <strong>K-StyleMagic</strong>
          </div>
          <StepProgress blockedSteps={blockedSteps} compact current={current} />
          <div className="status-row">
            <span className="muted">Session</span>
            <span className={`status-chip ${statusClass(status)}`}>
              {statusLabelMap[status] ?? status}
            </span>
          </div>
          <div className="meta-list">
            <div className="meta-row">
              <span className="muted">Order</span>
              <strong>{orderId || "-"}</strong>
            </div>
            <div className="meta-row">
              <span className="muted">Session</span>
              <strong className="inline-code">{shortToken(sessionToken)}</strong>
            </div>
            <div className="meta-row">
              <span className="muted">Hair</span>
              <strong>{hair.picked || "-"}</strong>
            </div>
            <div className="meta-row">
              <span className="muted">Outfit</span>
              <strong>{outfit.picked || "-"}</strong>
            </div>
            <div className="meta-row">
              <span className="muted">Backdrop</span>
              <strong>{location.picked || "-"}</strong>
            </div>
          </div>
          {photoBlobUrl ? (
            <div className="preview-frame sidebar-preview">
              <img alt="Uploaded photo preview" src={photoBlobUrl} />
            </div>
          ) : (
            <div className="empty-state">Upload a selfie to see a live preview.</div>
          )}
          <div className="actions">
            <Link className="button secondary" href={`/${lang}/create`}>
              Restart flow
            </Link>
          </div>
        </div>
      </aside>

      <div className="create-stage">
        <header className="card stack stage-header">
          <p className="eyebrow">Create flow</p>
          <h1>{title}</h1>
          <p className="muted">{description}</p>
        </header>
        <div className="stack">{children}</div>
      </div>
    </section>
  );
}
