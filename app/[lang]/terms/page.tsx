import type { Metadata } from "next";
import { toAbsoluteUrl, buildLocaleAlternatesAbsolute } from "@/lib/seo";

type TermsPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === "ko";
  const canonical = toAbsoluteUrl(`/${lang}/terms`);
  const languages = buildLocaleAlternatesAbsolute((l) => `/${l}/terms`);
  return {
    title: isKo ? "이용약관 | K-StyleShot" : "Terms of Service | K-StyleShot",
    description: isKo
      ? "K-StyleShot 가이드 이용, 콘텐츠 책임 범위, 외부 링크, 선택형 기능 이용 기준을 안내합니다."
      : "Terms for using K-StyleShot guides, content, external links, and optional site features.",
    alternates: { canonical, languages },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <div className="legal-page">
      <h1>{isKo ? "서비스 이용약관" : "Terms of Service"}</h1>
      <p className="legal-updated">
        {isKo ? "최종 업데이트: 2026년 5월 31일" : "Last updated: May 31, 2026"}
      </p>

      {isKo ? (
        <>
          <section>
            <h2>1. 서비스 개요</h2>
            <p>
              K-StyleShot은 서울 여행, K-뷰티, K-패션을 다루는 라이프스타일 가이드
              사이트입니다. 본 약관은 <strong>kstyleshot.com</strong>에서 제공하는 가이드,
              정책 페이지, 문의 채널, 선택형 기능 이용에 적용됩니다.
            </p>
          </section>

          <section>
            <h2>2. 콘텐츠 이용 기준</h2>
            <p>
              사이트의 글은 방문 계획, 스타일 선택, 뷰티 루틴 판단을 돕기 위한 정보성
              콘텐츠입니다. 운영시간, 가격, 행사, 제품 표시 정보는 변경될 수 있으므로 중요한
              결정을 하기 전에는 공식 사이트나 현장 공지를 함께 확인해야 합니다.
            </p>
            <p>
              뷰티 관련 내용은 일반적인 정보 제공 목적이며 의학적 진단, 치료, 전문 상담을
              대체하지 않습니다. 피부 이상 반응이 있거나 질환이 의심되는 경우 전문의와
              상담해야 합니다.
            </p>
          </section>

          <section>
            <h2>3. 저작권 및 사용 제한</h2>
            <ul>
              <li>사이트의 글, 이미지, 구성, 데이터 정리는 K-StyleShot 또는 각 권리자에게 귀속됩니다.</li>
              <li>개인적인 열람과 공유는 가능하지만, 무단 복제·재배포·상업적 재사용은 허용되지 않습니다.</li>
              <li>출처를 밝히더라도 본문 전체를 복사해 다른 사이트나 서비스에 게시할 수 없습니다.</li>
            </ul>
          </section>

          <section>
            <h2>4. 외부 링크와 제3자 서비스</h2>
            <p>
              일부 글은 공식 기관, 관광 안내, 화장품 규정, 외부 도구로 연결되는 링크를
              포함합니다. 외부 사이트의 내용, 보안, 개인정보 처리, 결제 조건은 해당 운영자의
              정책을 따릅니다.
            </p>
          </section>

          <section>
            <h2>5. 선택형 기능</h2>
            <p>
              K-StyleShot은 가이드와 별도로 선택형 이미지 도구나 실험 기능을 제공할 수
              있습니다. 해당 기능이 결제, 업로드, 이메일 발송을 포함하는 경우 화면에 표시되는
              안내, 개인정보 처리방침, 환불 정책이 함께 적용됩니다.
            </p>
          </section>

          <section>
            <h2>6. 금지 행위</h2>
            <ul>
              <li>사이트를 자동화 방식으로 과도하게 수집하거나 서비스 안정성을 해치는 행위</li>
              <li>타인의 권리, 개인정보, 초상권을 침해하는 자료를 업로드하거나 전송하는 행위</li>
              <li>허위 제보, 악성 코드 삽입, 비정상적 접근, 결제 또는 세션 조작 시도</li>
            </ul>
          </section>

          <section>
            <h2>7. 면책 및 책임 제한</h2>
            <p>
              K-StyleShot은 정보를 정확하게 유지하기 위해 노력하지만 모든 정보의 실시간
              완전성을 보장하지 않습니다. 법령상 허용되는 범위에서, 사이트 이용 또는 외부 링크
              이용으로 발생한 간접 손해에 대해 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2>8. 약관 변경 및 문의</h2>
            <p>
              본 약관은 서비스 운영 상황과 법령 변경에 따라 수정될 수 있습니다. 문의는{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>으로 보내주세요.
            </p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>1. Service Overview</h2>
            <p>
              K-StyleShot is a lifestyle guide site covering Seoul travel, K-beauty, and K-fashion.
              These Terms apply to the guides, policy pages, contact channels, and optional features
              provided through <strong>kstyleshot.com</strong>.
            </p>
          </section>

          <section>
            <h2>2. Use of Content</h2>
            <p>
              The content on this site is informational and is intended to help readers plan visits,
              compare style choices, and evaluate beauty routines. Hours, prices, events, and product
              label information can change, so readers should confirm important details through
              official sources before making decisions.
            </p>
            <p>
              Beauty content is general information and does not replace medical diagnosis,
              treatment, or professional advice. If you experience irritation or suspect a skin
              condition, consult a qualified professional.
            </p>
          </section>

          <section>
            <h2>3. Intellectual Property and Restrictions</h2>
            <ul>
              <li>Articles, images, layout, and curated data belong to K-StyleShot or their respective owners.</li>
              <li>Personal reading and ordinary sharing are allowed, but copying, republishing, or commercial reuse is not allowed without permission.</li>
              <li>Attribution does not permit copying full articles onto another site or service.</li>
            </ul>
          </section>

          <section>
            <h2>4. External Links and Third-Party Services</h2>
            <p>
              Some pages link to official institutions, tourism references, cosmetic regulations, or
              external tools. Those external sites are governed by their own content, security,
              privacy, and payment policies.
            </p>
          </section>

          <section>
            <h2>5. Optional Features</h2>
            <p>
              K-StyleShot may offer optional image tools or experimental features separate from the
              guide library. If a feature involves payment, uploads, or email delivery, the on-screen
              notices, Privacy Policy, and Refund Policy also apply.
            </p>
          </section>

          <section>
            <h2>6. Prohibited Conduct</h2>
            <ul>
              <li>Automated scraping or activity that harms site stability</li>
              <li>Uploading or transmitting material that violates another person&apos;s rights, privacy, or likeness</li>
              <li>False reports, malware, unauthorized access, or attempts to manipulate payments or sessions</li>
            </ul>
          </section>

          <section>
            <h2>7. Disclaimer and Limitation of Liability</h2>
            <p>
              K-StyleShot works to keep information accurate, but does not guarantee that every
              detail is complete or current in real time. To the extent permitted by law, we are not
              liable for indirect losses arising from site use or external links.
            </p>
          </section>

          <section>
            <h2>8. Changes and Contact</h2>
            <p>
              These Terms may be updated as the site or applicable laws change. For questions, email{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
