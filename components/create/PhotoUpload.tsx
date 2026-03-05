"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";

import type { JobStatus, SessionStatusResponse } from "@/types";
import { useCreateStore } from "@/store/createStore";

const SESSION_STORAGE_KEY = "kstyleshot.create.session";
const POLL_INTERVAL_MS = 1500;

type StoredSession = {
  checkoutId: string;
  orderId: string;
  sessionToken: string;
  status: JobStatus;
};

type PhotoUploadProps = {
  checkoutIdFromUrl?: string;
  allowDemoFlow?: boolean;
};

function revokeObjectUrl(url: string | null) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (
      typeof parsed.checkoutId !== "string" ||
      typeof parsed.orderId !== "string" ||
      typeof parsed.sessionToken !== "string" ||
      typeof parsed.status !== "string"
    ) {
      return null;
    }

    return {
      checkoutId: parsed.checkoutId,
      orderId: parsed.orderId,
      sessionToken: parsed.sessionToken,
      status: parsed.status as JobStatus
    };
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoredSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function removeCheckoutIdFromUrl() {
  if (typeof window === "undefined") {
    return;
  }

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.delete("checkout_id");
  nextUrl.searchParams.delete("checkoutId");
  window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
}

function readApiErrorMessage(payload: unknown, fallback: string): string {
  let message = fallback;
  let requestId = "";

  if (payload && typeof payload === "object") {
    if ("message" in payload && typeof payload.message === "string") {
      message = payload.message;
    }

    if ("requestId" in payload && typeof payload.requestId === "string") {
      requestId = payload.requestId;
    }
  }

  return requestId ? `${message} (requestId: ${requestId})` : message;
}

export function PhotoUpload({ checkoutIdFromUrl = "", allowDemoFlow = false }: PhotoUploadProps) {
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
  const [fileName, setFileName] = useState("");
  const [isPollingSession, setIsPollingSession] = useState(false);
  const [isPaidSessionReady, setIsPaidSessionReady] = useState(false);
  const [pollError, setPollError] = useState("");
  const [sessionNotice, setSessionNotice] = useState("");

  const lang = params.lang ?? "en";

  useEffect(() => {
    if (!checkoutIdFromUrl) {
      setPollError("");
      setSessionNotice(
        allowDemoFlow
          ? "No checkout_id found. Demo flow is available in this environment."
          : ""
      );
      setIsPollingSession(false);
      setIsPaidSessionReady(false);
      return;
    }

    setCheckout(checkoutIdFromUrl);
    setIsPaidSessionReady(false);

    const cachedSession = readStoredSession();
    if (cachedSession && cachedSession.checkoutId === checkoutIdFromUrl) {
      setSession({
        orderId: cachedSession.orderId,
        sessionToken: cachedSession.sessionToken,
        status: cachedSession.status
      });
      setIsPaidSessionReady(true);
      setSessionNotice("Payment confirmed. Existing session restored from this browser.");
      removeCheckoutIdFromUrl();
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const pollSession = async () => {
      setIsPollingSession(true);
      setPollError("");
      setSessionNotice("Waiting for payment confirmation. This page polls the real session handshake.");

      try {
        const response = await fetch(
          `/api/session/status?checkoutId=${encodeURIComponent(checkoutIdFromUrl)}`,
          { cache: "no-store" }
        );
        const payload = (await response.json().catch(() => null)) as
          | SessionStatusResponse
          | { ok?: false; message?: string }
          | null;

        if (!response.ok && response.status !== 202) {
          throw new Error(readApiErrorMessage(payload, "Unable to check the paid session yet."));
        }

        if (payload && "ready" in payload && payload.ready) {
          if (cancelled) {
            return;
          }

          writeStoredSession({
            checkoutId: checkoutIdFromUrl,
            orderId: payload.orderId,
            sessionToken: payload.sessionToken,
            status: payload.status
          });
          setSession({
            orderId: payload.orderId,
            sessionToken: payload.sessionToken,
            status: payload.status
          });
          setIsPaidSessionReady(true);
          setIsPollingSession(false);
          setSessionNotice("Payment confirmed. Your session is ready.");
          removeCheckoutIdFromUrl();
          return;
        }

        if (!cancelled) {
          timer = setTimeout(pollSession, POLL_INTERVAL_MS);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setIsPollingSession(false);
        setIsPaidSessionReady(false);
        setPollError(
          error instanceof Error ? error.message : "Unable to check the current paid session."
        );
      }
    };

    void pollSession();

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [allowDemoFlow, checkoutIdFromUrl, setCheckout, setSession]);

  function ensureDemoSession() {
    if (!allowDemoFlow) {
      return;
    }

    if (sessionToken) {
      return;
    }

    const resolvedCheckoutId = checkoutId || "local-demo";
    setSession({
      orderId: `demo-order-${resolvedCheckoutId}`,
      sessionToken: `demo-session-${resolvedCheckoutId}`,
      status: "payment_confirmed"
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

    if (!checkoutIdFromUrl && allowDemoFlow) {
      ensureDemoSession();
    }
  }

  function handleContinue() {
    if (!photoBlobUrl) {
      return;
    }

    if (!checkoutIdFromUrl) {
      if (!allowDemoFlow) {
        setPollError("A paid checkout session is required. Start from Step 1 first.");
        return;
      }

      ensureDemoSession();
    } else if (!isPaidSessionReady || !sessionToken) {
      setPollError("The paid session is still pending. Wait for the webhook to finish first.");
      return;
    }

    setStatus("hair_selecting");
    router.push(`/${lang}/create/hair`);
  }

  const canContinue = Boolean(photoBlobUrl) &&
    (checkoutIdFromUrl ? isPaidSessionReady && Boolean(sessionToken) : allowDemoFlow);

  return (
    <div className="stack">
      <div className="notice">
        {checkoutIdFromUrl ? (
          <span className="muted">
            Checkout detected: <span className="inline-code">{checkoutIdFromUrl}</span>. Polling
            session handshake before unlock.
          </span>
        ) : allowDemoFlow ? (
          <span className="muted">No `checkout_id` found. Development demo path is enabled.</span>
        ) : (
          <span className="muted">No `checkout_id` found. Start checkout on Step 1 first.</span>
        )}
      </div>
      {sessionNotice ? <div className="notice">{sessionNotice}</div> : null}
      {pollError ? <div className="notice">{pollError}</div> : null}
      <section className="upload-layout">
        <label className="card stack upload-card">
          <div className="upload-icon" aria-hidden>
            UP
          </div>
          <strong>Upload your selfie</strong>
          <span className="muted">
            Use a clear front-facing image with good lighting for stable generation quality.
          </span>
          <input
            accept="image/*"
            className="upload-input"
            disabled={!checkoutIdFromUrl && !allowDemoFlow}
            onChange={handleFileChange}
            type="file"
          />
        </label>
        <div className="card stack">
          <div className="actions">
            <span className="count-badge">{photoBlobUrl ? "Photo ready" : "Awaiting upload"}</span>
            <span className="muted">{fileName || "No file selected"}</span>
          </div>
          <div className="preview-frame">
            {photoBlobUrl ? (
              <img alt="Uploaded preview" src={photoBlobUrl} />
            ) : (
              <div className="preview-fallback">Preview appears here</div>
            )}
          </div>
        </div>
      </section>
      <div className="actions">
        <button className="button" disabled={!canContinue} onClick={handleContinue} type="button">
          {checkoutIdFromUrl && isPollingSession
            ? "Waiting for paid session..."
            : !checkoutIdFromUrl && !allowDemoFlow
              ? "Checkout required"
              : "Continue to hair"}
        </button>
      </div>
    </div>
  );
}
