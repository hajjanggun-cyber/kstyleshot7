"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";

import { useCreateStore } from "@/store/createStore";

function revokeObjectUrl(url: string | null) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

type PhotoUploadProps = {
  checkoutIdFromUrl?: string;
};

export function PhotoUpload({ checkoutIdFromUrl = "" }: PhotoUploadProps) {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const {
    checkoutId,
    sessionToken,
    photoBlobUrl,
    setCheckout,
    setPhotoBlobUrl,
    setSession,
    setStatus
  } = useCreateStore();
  const [fileName, setFileName] = useState<string>("");

  const lang = params.lang ?? "en";

  useEffect(() => {
    if (checkoutIdFromUrl) {
      setCheckout(checkoutIdFromUrl);
    }
  }, [checkoutIdFromUrl, setCheckout]);

  function ensureLocalSession() {
    if (sessionToken) {
      setStatus("hair_selecting");
      return;
    }

    const resolvedCheckoutId = checkoutIdFromUrl || checkoutId || "local-demo";
    setSession({
      orderId: `demo-order-${resolvedCheckoutId}`,
      sessionToken: `demo-session-${resolvedCheckoutId}`,
      status: "hair_selecting"
    });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    revokeObjectUrl(photoBlobUrl);

    const nextBlobUrl = URL.createObjectURL(file);
    setPhotoBlobUrl(nextBlobUrl);
    setFileName(file.name);
    ensureLocalSession();
  }

  function handleContinue() {
    if (!photoBlobUrl) {
      return;
    }

    ensureLocalSession();
    router.push(`/${lang}/create/hair`);
  }

  return (
    <div className="stack">
      <div className="notice">
        {checkoutIdFromUrl ? (
          <span className="muted">
            Checkout detected: <span className="inline-code">{checkoutIdFromUrl}</span>. The
            real session poll is not wired yet, so this scaffold uses a local demo session.
          </span>
        ) : (
          <span className="muted">
            No `checkout_id` is present. You can still test the full UX in local demo mode.
          </span>
        )}
      </div>
      <label className="card stack">
        <strong>Select a selfie</strong>
        <span className="muted">
          Use a clear front-facing image. The production client should resize it before API upload.
        </span>
        <input accept="image/*" onChange={handleFileChange} type="file" />
      </label>
      {photoBlobUrl ? (
        <div className="card stack">
          <div className="actions">
            <span className="count-badge">Ready to continue</span>
            <span className="muted">{fileName || "Selected image"}</span>
          </div>
          <div className="preview-frame">
            <img alt="Uploaded preview" src={photoBlobUrl} />
          </div>
        </div>
      ) : null}
      <div className="actions">
        <button className="button" disabled={!photoBlobUrl} onClick={handleContinue} type="button">
          Continue to hair
        </button>
      </div>
    </div>
  );
}
