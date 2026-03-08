"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const STEPS = [
  {
    num: "01",
    icon: "📸",
    titleKo: "사진 업로드",
    titleEn: "Upload Your Photo",
    descKo: "정면을 바라보는 밝은 조명의 셀카 한 장을 올려주세요. 얼굴이 잘 보일수록 AI 합성이 더 자연스러워요.",
    descEn: "Upload one clear, front-facing selfie in good lighting. The clearer your face, the better the AI result.",
  },
  {
    num: "02",
    icon: "💇",
    titleKo: "헤어 스타일 & 컬러 선택",
    titleEn: "Choose Hair Style & Color",
    descKo: "원하는 헤어 스타일과 색상을 고르면 AI가 내 사진에 자연스럽게 합성해드려요.",
    descEn: "Pick your preferred hairstyle and color — AI blends it naturally onto your photo.",
  },
  {
    num: "03",
    icon: "👗",
    titleKo: "의상 선택",
    titleEn: "Select an Outfit",
    descKo: "무대룩, 스트릿, 시상식 스타일 중 원하는 K-아이돌 의상을 선택하세요.",
    descEn: "Choose from stage, street, or award-show K-idol outfits.",
  },
  {
    num: "04",
    icon: "📍",
    titleKo: "배경 선택 & 완성",
    titleEn: "Choose Background & Finish",
    descKo: "서울의 다양한 배경 중 원하는 촬영 장소를 고르면 최종 결과물이 완성돼요.",
    descEn: "Pick a Seoul backdrop and your final K-style portrait is ready.",
  },
];

export function IntroFlow() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang ?? "ko";
  const isKo = lang === "ko";

  return (
    <div className="intro-root">
      {/* Nav */}
      <nav className="intro-nav">
        <Link className="intro-back" href={`/${lang}`}>←</Link>
        <span className="intro-nav-label">
          {isKo ? "사용 가이드" : "How It Works"}
        </span>
        <div style={{ width: 44 }} />
      </nav>

      <main className="intro-main">
        {/* Hero text */}
        <div className="intro-hero">
          <p className="intro-eyebrow">KSTYLESHOT</p>
          <h1 className="intro-title">
            {isKo ? "이렇게\n진행돼요" : "Here's how\nit works"}
          </h1>
          <p className="intro-sub">
            {isKo
              ? "총 4단계로 나만의 K-아이돌 스타일 사진을 완성할 수 있어요"
              : "4 simple steps to your own K-idol style portrait"}
          </p>
        </div>

        {/* Steps */}
        <div className="intro-steps">
          {STEPS.map((step, i) => (
            <div className="intro-step" key={i}>
              <div className="intro-step-aside">
                <span className="intro-step-num">{step.num}</span>
                {i < STEPS.length - 1 && <span className="intro-step-line" />}
              </div>
              <div className="intro-step-card">
                <span className="intro-step-icon">{step.icon}</span>
                <div className="intro-step-text">
                  <p className="intro-step-title">
                    {isKo ? step.titleKo : step.titleEn}
                  </p>
                  <p className="intro-step-desc">
                    {isKo ? step.descKo : step.descEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="intro-warn">
          <span className="intro-warn-icon">⚠️</span>
          <p className="intro-warn-text">
            {isKo
              ? "AI 생성이 시작되면 뒤로가기를 누르거나 다른 페이지로 이동하면 생성이 중단될 수 있어요. 완료될 때까지 화면을 그대로 유지해 주세요."
              : "Once AI generation starts, pressing back or switching pages may interrupt it. Keep the screen open until generation is complete."}
          </p>
        </div>
      </main>

      {/* Fixed CTA */}
      <div className="intro-bottom">
        <Link className="intro-cta" href={`/${lang}/create/upload`}>
          {isKo ? "시작하기 →" : "Get Started →"}
        </Link>
      </div>
    </div>
  );
}
