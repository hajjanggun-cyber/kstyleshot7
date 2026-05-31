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
      ? "K-StyleShot은 서울 여행, K-뷰티, K-패션을 에디토리얼 기준으로 정리하는 실용 라이프스타일 가이드입니다."
      : "K-StyleShot is a practical lifestyle guide covering Seoul travel, K-beauty, and K-fashion with editorial standards.",
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
              가이드 미디어입니다. 공개 정보, 현장성 있는 선택 기준, 스타일링 실무 관점,
              사용자 제보를 함께 검토해 서울 포토존 가이드, K-뷰티 루틴, 스타일 팁을
              작성합니다.
            </p>
          </section>

          <section>
            <h2>콘텐츠 제작 기준</h2>
            <ul>
              <li>
                <strong>현장성 기준 검토:</strong> 서울 명소 가이드는 이동 동선, 방문 시간대,
                사진 포인트, 혼잡 흐름처럼 실제 방문자가 판단해야 하는 기준을 중심으로
                작성합니다.
              </li>
              <li>
                <strong>성분과 사용 조건 확인:</strong> K-뷰티 가이드는 성분, 피부 상태,
                사용 순서, 실패하기 쉬운 조건을 함께 검토해 작성합니다.
              </li>
              <li>
                <strong>정기 업데이트:</strong> 서울의 카페, 팝업스토어, 포토존은 빠르게
                변합니다. 주요 가이드는 공개 정보와 사용자 제보를 반영해 정기적으로 내용을
                갱신합니다.
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
              K-StyleShot 가이드는 K-뷰티, 서울 명소, K-팝 문화에 익숙한 에디토리얼팀이
              주제별 기준을 나누어 작성하고 검토합니다.
            </p>
            <ul>
              <li>
                <strong>김소연 (Soyeon Kim)</strong> — K-뷰티·스킨케어 담당. 5년 이상 K-뷰티
                루틴과 성분 기준을 꾸준히 기록해왔으며, 베이스 메이크업, 피부 준비 단계,
                눈·립 메이크업 기법을 전문으로 다룹니다.
              </li>
              <li>
                <strong>조미래 (Mirae Jo)</strong> — 서울 여행·라이프스타일 담당. 홍대,
                북촌, 성수, 인사동 등 서울 주요 지역의 포토스팟, 도보 루트, 동네 가이드를
                작성합니다.
              </li>
            </ul>
            <p>
              콘텐츠에 오류가 있거나 업데이트가 필요한 정보를 발견하시면{" "}
              <a href={`/${lang}/contact`}>문의 페이지</a>를 통해 알려주세요. 검토 후
              반영합니다.
            </p>
          </section>

          <section>
            <h2>운영 및 문의</h2>
            <p>
              K-StyleShot은 <strong>kstyleshot.com</strong>에서 운영됩니다. 콘텐츠 오류,
              업데이트 요청, 협업 제안은{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>으로 보내주세요.
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
              K-StyleShot is a lifestyle guide for people interested in K-beauty, Seoul travel,
              and K-fashion. Our guides combine public information, practical editorial checks,
              styling context, and reader feedback.
            </p>
          </section>

          <section>
            <h2>Editorial Standards</h2>
            <ul>
              <li>
                <strong>Visit-oriented checks:</strong> Seoul location guides focus on walking
                routes, timing, photo angles, crowd flow, and the decisions real visitors need to
                make.
              </li>
              <li>
                <strong>Ingredient and usage checks:</strong> K-beauty guides consider ingredients,
                skin conditions, application order, and common failure points instead of relying on
                broad claims.
              </li>
              <li>
                <strong>Regular updates:</strong> Seoul&apos;s cafés, pop-up stores, and photo
                spots change quickly. Key guides are revised as public information and reader
                reports change.
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
              K-StyleShot guides are written and reviewed by an editorial team familiar with
              K-beauty routines, Seoul neighborhoods, and K-pop culture.
            </p>
            <ul>
              <li>
                <strong>Soyeon Kim</strong> — K-beauty and skincare writer. Has tested and
                documented K-beauty routines and ingredient notes for over five years, with a focus on base makeup,
                skin prep, and eye and lip techniques suited for everyday wear.
              </li>
              <li>
                <strong>Mirae Jo</strong> — Seoul travel and lifestyle writer. Covers Seoul photo
                spots, walking routes, and neighborhood guides across Hongdae, Bukchon, Seongsu,
                and beyond.
              </li>
            </ul>
            <p>
              If you spot an error or outdated information in any of our guides, please let us
              know via our <a href={`/${lang}/contact`}>contact page</a>. We review and update
              accordingly.
            </p>
          </section>

          <section>
            <h2>Operations and Contact</h2>
            <p>
              K-StyleShot is operated through <strong>kstyleshot.com</strong>. For content
              corrections, update requests, or collaboration inquiries, email{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
