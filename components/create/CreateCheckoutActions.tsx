"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

type CreateCheckoutActionsProps = {
  lang: string;
};

type CheckoutCreateResponse =
  | {
      ok: true;
      checkoutId: string;
      checkoutUrl: string;
      requestId?: string;
    }
  | {
      ok: false;
      message?: string;
      requestId?: string;
    };

function readErrorMessage(payload: unknown, fallback: string): string {
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

export function CreateCheckoutActions({ lang }: CreateCheckoutActionsProps) {
  const t = useTranslations("create.checkoutActions");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const allowDemoFlow =
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ALLOW_DEMO_FLOW === "1";

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
        throw new Error(readErrorMessage(payload, t("errors.create")));
      }

      window.location.assign(payload.checkoutUrl);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error instanceof Error ? error.message : t("errors.create"));
    }
  }

  return (
    <div className="stack">
      <div className="actions">
        <button className="button" disabled={isLoading} onClick={handleStartCheckout} type="button">
          {isLoading ? t("opening") : t("start")}
        </button>
        {allowDemoFlow ? (
          <Link className="button secondary" href={`/${lang}/create/upload`}>
            {t("demo")}
          </Link>
        ) : null}
      </div>
      <p className="muted">{t("description")}</p>
      {errorMessage ? <div className="notice">{errorMessage}</div> : null}
    </div>
  );
}
