"use client";

import Link from "next/link";
import { useState } from "react";

type CreateCheckoutActionsProps = {
  lang: string;
};

type CheckoutCreateResponse =
  | {
      ok: true;
      checkoutId: string;
      checkoutUrl: string;
    }
  | {
      ok: false;
      message?: string;
    };

export function CreateCheckoutActions({ lang }: CreateCheckoutActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleStartCheckout() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ locale: lang })
      });
      const payload = (await response.json().catch(() => null)) as CheckoutCreateResponse | null;

      if (!response.ok || !payload || !payload.ok) {
        throw new Error(
          payload && "message" in payload && typeof payload.message === "string"
            ? payload.message
            : "Unable to create a checkout session."
        );
      }

      window.location.assign(payload.checkoutUrl);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create a checkout session."
      );
    }
  }

  return (
    <div className="stack">
      <div className="actions">
        <button className="button" disabled={isLoading} onClick={handleStartCheckout} type="button">
          {isLoading ? "Opening checkout..." : "Start Polar checkout"}
        </button>
        <Link className="button secondary" href={`/${lang}/create/upload`}>
          Open local demo flow
        </Link>
      </div>
      <p className="muted">
        For a full local handshake test, copy `.env.local.example` to `.env.local` and fill in the
        Polar and Upstash values first.
      </p>
      {errorMessage ? <div className="notice">{errorMessage}</div> : null}
    </div>
  );
}
