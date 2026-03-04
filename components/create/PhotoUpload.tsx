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
  const [fileName, setFileName] = useState("");
  const [isPollingSession, setIsPollingSession] = useState(false);
  const [isPaidSessionReady, setIsPaidSessionReady] = useState(false);
  const [pollError, setPollError] = useState("");
  const [sessionNotice, setSessionNotice] = useState("");

  const lang = params.lang ?? "en";

  useEffect(() => {
    if (!checkoutIdFromUrl) {
      setPollError("");
      setSessionNotice("");
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
          throw new Error(
            payload && "message" in payload && typeof payload.message === "string"
              ? payload.message
              : "Unable to check the paid session yet."
          );
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
  }, [checkoutIdFromUrl, setCheckout, setSession]);

  function ensureDemoSession() {
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

    if (!checkoutIdFromUrl) {
      ensureDemoSession();
    }
  }

  function handleContinue() {
    if (!photoBlobUrl) {
      return;
    }

    if (!checkoutIdFromUrl) {
      ensureDemoSession();
    } else if (!isPaidSessionReady || !sessionToken) {
      setPollError("The paid session is still pending. Wait for the webhook to finish first.");
      return;
    }

    setStatus("hair_selecting");
    router.push(`/${lang}/create/hair`);
  }

  const canContinue =
    Boolean(photoBlobUrl) && (!checkoutIdFromUrl || (isPaidSessionReady && Boolean(sessionToken)));

  return (
    <div className="stack">
      <div className="notice">
        {checkoutIdFromUrl ? (
          <span className="muted">
            Checkout detected: <span className="inline-code">{checkoutIdFromUrl}</span>. The page
            now polls the real session handshake before you can continue.
          </span>
        ) : (
          <span className="muted">
            No `checkout_id` is present. You can still test the full UX in local demo mode.
          </span>
        )}
      </div>
      {sessionNotice ? <div className="notice">{sessionNotice}</div> : null}
      {pollError ? <div className="notice">{pollError}</div> : null}
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
        <button className="button" disabled={!canContinue} onClick={handleContinue} type="button">
          {checkoutIdFromUrl && isPollingSession ? "Waiting for paid session..." : "Continue to hair"}
        </button>
      </div>
    </div>
  );
}
