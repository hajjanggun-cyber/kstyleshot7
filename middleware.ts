import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const ROOT_DOMAIN = "kstyleshot.com";
const WWW_DOMAIN = `www.${ROOT_DOMAIN}`;

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;

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
