"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function PricingSection() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "ko";
  const isKo = lang === "ko";

  return (
    <section className="lp-pricing" aria-label={isKo ? "AI 프로필 도구" : "AI portrait tool"}>
      <div className="lp-pricing-inner">
        <div>
          <p className="lp-pricing-label">{isKo ? "Optional Tool" : "Optional Tool"}</p>
          <h2 className="lp-pricing-title">
            {isKo ? "AI K-style 프로필 도구" : "AI K-style Portrait Tool"}
          </h2>
          <p className="lp-pricing-body muted">
            {isKo
              ? "가이드와 별도로, 셀카에 헤어·의상·서울 배경을 합성해 보는 유료 이미지 도구도 운영합니다."
              : "Separate from the guide library, K-StyleShot also offers a paid image tool for trying hair, outfit, and Seoul backdrop concepts."}
          </p>
          <p className="lp-pricing-note muted">
            {isKo
              ? "홈에서는 정보성 가이드와 정책 페이지를 우선 안내하고, 생성 도구는 별도 흐름으로 분리합니다."
              : "The homepage prioritizes editorial guides and policy pages, while the image tool remains in a separate flow."}
          </p>
        </div>
        <div className="lp-pricing-right">
          <span className="lp-pricing-badge">{isKo ? "AI Tool" : "AI Tool"}</span>
          <span className="muted">{isKo ? "선택형 유료 기능" : "Optional paid feature"}</span>
          <Link className="lp-cta-btn lp-cta-btn--sm" href={`/${lang}/create/upload`}>
            {isKo ? "도구 열기" : "Open tool"}
          </Link>
        </div>
      </div>
    </section>
  );
}
