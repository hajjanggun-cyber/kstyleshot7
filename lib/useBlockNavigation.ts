"use client";

import { useEffect } from "react";

export function useBlockNavigation(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Push dummy history entry to intercept back button
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Re-push to block back navigation
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [active]);
}
