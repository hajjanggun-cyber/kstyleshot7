import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isAdsenseReviewHubSlug } from "@/data/adsenseReview";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const ROOT_DOMAIN = "kstyleshot.com";
const WWW_DOMAIN = `www.${ROOT_DOMAIN}`;

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const hubArticleMatch = nextUrl.pathname.match(/^\/(?:(ko|en)\/)?hub\/([^/]+)\/?$/);

  if (hubArticleMatch) {
    const slug = decodeURIComponent(hubArticleMatch[2]);

    if (!isAdsenseReviewHubSlug(slug)) {
      return new NextResponse("Not Found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }
  }

  if (nextUrl.hostname === ROOT_DOMAIN) {
    const redirectUrl = nextUrl.clone();
    redirectUrl.hostname = WWW_DOMAIN;
    return NextResponse.redirect(redirectUrl, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
