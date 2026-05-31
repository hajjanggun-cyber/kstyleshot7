"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function HeroSection() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "ko";
  const isKo = lang === "ko";
  const copy = isKo
    ? {
        eyebrow: "K-Style Editorial Guides",
        title: "서울, K뷰티, K패션을 실제 선택 기준으로 읽는 곳",
        description:
          "K-StyleShot은 포토존 동선, 뷰티 루틴, 한국 패션 코디를 검색자가 바로 판단할 수 있는 정보 중심으로 정리합니다.",
        primary: "가이드 허브 보기",
        secondary: "제작 기준",
        service: "AI 프로필 도구는 하단에서 확인할 수 있습니다.",
        points: ["서울 포토존과 방문 동선", "K-뷰티 성분과 사용 순서", "K-패션 계절별 코디 기준"]
      }
    : {
        eyebrow: "K-Style Editorial Guides",
        title: "Practical Seoul, K-Beauty, and K-Fashion Guides",
        description:
          "K-StyleShot organizes Seoul photo routes, Korean beauty routines, and K-fashion choices around decisions readers can actually use.",
        primary: "Open Guide Hub",
        secondary: "Editorial Standards",
        service: "The AI portrait tool is available further down the page.",
        points: ["Seoul photo spots and routes", "K-beauty ingredients and order", "K-fashion outfits by season"]
      };

  return (
    <section className="lp-hero">
      <div className="lp-hero-visual">
        <img
          alt={isKo ? "서울 K-style 가이드 대표 이미지" : "KStyleShot Seoul K-style guide hero image"}
          className="lp-hero-img"
          fetchPriority="high"
          src="/visuals/landing/seoul-kstyle-landing-hero.webp"
        />
        <div className="lp-hero-fade" />
        {/* Desktop only: text overlaid on image */}
        <div className="lp-hero-overlay">
          <p className="lp-hero-eyebrow">{copy.eyebrow}</p>
          <h1 className="lp-hero-h1">{copy.title}</h1>
          <p className="lp-hero-sub">{copy.description}</p>
          <div className="lp-hero-actions">
            <Link className="lp-cta-btn" href={`/${lang}/hub`}>
              {copy.primary}
            </Link>
            <Link className="lp-hero-secondary" href={`/${lang}/about`}>
              {copy.secondary}
            </Link>
          </div>
          <ul className="lp-hero-points" aria-label={isKo ? "주요 가이드 주제" : "Main guide topics"}>
            {copy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="lp-hero-service-note">{copy.service}</p>
        </div>
      </div>

      {/* Mobile only: card below the image */}
      <div className="lp-hero-card">
        <p className="lp-hero-eyebrow">{copy.eyebrow}</p>
        <h1 className="lp-hero-h1">{copy.title}</h1>
        <p className="lp-hero-sub">{copy.description}</p>
        <div className="lp-hero-actions lp-hero-actions--mobile">
          <Link className="lp-cta-btn lp-cta-btn--full" href={`/${lang}/hub`}>
            {copy.primary}
          </Link>
          <Link className="lp-hero-secondary" href={`/${lang}/about`}>
            {copy.secondary}
          </Link>
        </div>
        <ul className="lp-hero-points" aria-label={isKo ? "주요 가이드 주제" : "Main guide topics"}>
          {copy.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
