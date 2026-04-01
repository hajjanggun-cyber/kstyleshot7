import type { Metadata } from "next";
import { toAbsoluteUrl, buildLocaleAlternatesAbsolute } from "@/lib/seo";

type AboutPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === "ko";
  const canonical = toAbsoluteUrl(`/${lang}/about`);
  const languages = buildLocaleAlternatesAbsolute((l) => `/${l}/about`);
  return {
    title: isKo ? "소개 | K-StyleShot" : "About | K-StyleShot",
    description: isKo
      ? "K-StyleShot은 서울 여행, K-뷰티, K-패션을 직접 경험하고 기록하는 라이프스타일 가이드와 AI 포트레이트 서비스를 함께 제공합니다."
      : "K-StyleShot is a lifestyle guide and AI portrait service covering Seoul travel, K-beauty, and K-fashion, written from direct on-the-ground experience.",
    alternates: { canonical, languages },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <div className="legal-page">
      {isKo ? (
        <>
          <h1>K-StyleShot 소개</h1>
          <p className="legal-updated">최종 업데이트: 2026년 3월</p>

          <section>
            <h2>K-StyleShot이란</h2>
            <p>
              K-StyleShot은 K-뷰티, 서울 여행, K-패션에 관심 있는 사람들을 위한 라이프스타일
              가이드 미디어이자 AI 포트레이트 서비스입니다. 직접 걷고, 직접 발라보고, 직접
              사진 찍어가며 확인한 내용을 바탕으로 서울 포토존 가이드, K-뷰티 루틴, 스타일
              팁을 작성합니다.
            </p>
            <p>
              저희 서비스의 AI 포트레이트 기능은 본인 사진에 K-스타일 헤어, 의상, 서울 배경을
              합성해 케이팝 스타일의 프로필 이미지를 만들어드립니다.
            </p>
          </section>

          <section>
            <h2>콘텐츠 제작 기준</h2>
            <ul>
              <li>
                <strong>직접 방문 확인:</strong> 서울 명소 가이드는 실제 현장 방문을 바탕으로
                작성합니다. 사진 포인트, 이동 동선, 방문 시간대 등 현장에서만 알 수 있는
                정보를 담습니다.
              </li>
              <li>
                <strong>제품 직접 사용:</strong> K-뷰티 가이드는 실제 제품을 사용해보고 작성한
                후기와 팁을 기반으로 합니다.
              </li>
              <li>
                <strong>정기 업데이트:</strong> 서울의 카페, 팝업스토어, 포토존은 빠르게
                변합니다. 주요 가이드는 현장 변화에 맞춰 정기적으로 내용을 갱신합니다.
              </li>
              <li>
                <strong>한국어·영어 병행:</strong> 모든 가이드는 한국어와 영어로 별도
                작성됩니다. 단순 번역이 아니라 각 언어 독자의 검색 의도와 배경 지식에 맞춰
                다시 씁니다.
              </li>
            </ul>
          </section>

          <section>
            <h2>에디토리얼팀</h2>
            <p>
              K-StyleShot 가이드는 서울에 거주하며 K-뷰티, 서울 명소, K-팝 문화를 직접
              경험해온 작가들이 작성합니다.
            </p>
            <ul>
              <li>
                <strong>김소연 (Soyeon Kim)</strong> — K-뷰티·스킨케어 담당. 5년 이상 K-뷰티
                루틴을 직접 테스트하고 기록해왔으며, 베이스 메이크업, 피부 준비 단계, 눈·립
                메이크업 기법을 전문으로 다룹니다.
              </li>
              <li>
                <strong>조미래 (Mirae Jo)</strong> — 서울 여행·라이프스타일 담당. 홍대,
                북촌, 성수, 인사동 등 서울 주요 지역을 직접 방문하며 포토스팟, 도보 루트,
                동네 가이드를 작성합니다.
              </li>
            </ul>
            <p>
              콘텐츠에 오류가 있거나 업데이트가 필요한 정보를 발견하시면{" "}
              <a href={`/${lang}/contact`}>문의 페이지</a>를 통해 알려주세요. 검토 후
              반영합니다.
            </p>
          </section>

          <section>
            <h2>서비스 운영</h2>
            <p>
              K-StyleShot 서비스(AI 포트레이트)는 <strong>kstylewshot.com</strong>을 통해
              운영됩니다. 서비스 이용 관련 문의, 환불, 기술 지원은 해당 채널을 이용해주세요.
            </p>
            <p>
              본 사이트는 공식 케이팝 아티스트와 무관한 독립 팬 도구입니다. 아티스트 이름,
              이미지, 음악은 각 권리자에게 귀속됩니다.
            </p>
          </section>
        </>
      ) : (
        <>
          <h1>About K-StyleShot</h1>
          <p className="legal-updated">Last updated: March 2026</p>

          <section>
            <h2>What is K-StyleShot?</h2>
            <p>
              K-StyleShot is a lifestyle guide and AI portrait service for people interested in
              K-beauty, Seoul travel, and K-fashion. Every guide we publish is based on
              firsthand experience — walking the streets, testing the products, and finding the
              right angles for the shots ourselves.
            </p>
            <p>
              Our AI portrait feature lets you composite K-style hair, outfits, and Seoul
              backdrops onto your own photo, creating a K-pop-inspired profile image.
            </p>
          </section>

          <section>
            <h2>Editorial Standards</h2>
            <ul>
              <li>
                <strong>On-the-ground verification:</strong> Seoul location guides are written
                from actual visits. We include photo angles, walking routes, and timing details
                that only come from being there.
              </li>
              <li>
                <strong>Product testing:</strong> K-beauty guides are based on hands-on product
                use, not spec sheets.
              </li>
              <li>
                <strong>Regular updates:</strong> Seoul&apos;s cafés, pop-up stores, and photo
                spots change quickly. Key guides are revised as locations evolve.
              </li>
              <li>
                <strong>Separate Korean and English editions:</strong> All guides are written
                separately for each language — not translated, but adapted to match how each
                audience searches and what background they bring.
              </li>
            </ul>
          </section>

          <section>
            <h2>Our Team</h2>
            <p>
              K-StyleShot guides are written by Seoul-based writers with direct experience in
              K-beauty routines, Seoul neighborhoods, and K-pop culture.
            </p>
            <ul>
              <li>
                <strong>Soyeon Kim</strong> — K-beauty and skincare writer. Has tested and
                documented K-beauty routines for over five years, with a focus on base makeup,
                skin prep, and eye and lip techniques suited for everyday wear.
              </li>
              <li>
                <strong>Mirae Jo</strong> — Seoul travel and lifestyle writer. Covers Seoul photo
                spots, walking routes, and neighborhood guides from regular on-the-ground visits
                across Hongdae, Bukchon, Seongsu, and beyond.
              </li>
            </ul>
            <p>
              If you spot an error or outdated information in any of our guides, please let us
              know via our <a href={`/${lang}/contact`}>contact page</a>. We review and update
              accordingly.
            </p>
          </section>

          <section>
            <h2>The Service</h2>
            <p>
              The K-StyleShot AI portrait service is operated through{" "}
              <strong>kstylewshot.com</strong>. For service inquiries, refunds, or technical
              support, please use that channel.
            </p>
            <p>
              This site is an independent fan tool unaffiliated with any official K-pop artists.
              Artist names, images, and music belong to their respective rights holders.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
