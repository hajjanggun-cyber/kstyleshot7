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
    title: isKo ? "소개 및 편집 원칙 | K-StyleShot" : "About & Editorial Standards | K-StyleShot",
    description: isKo
      ? "K-StyleShot의 편집 기준, 사실 확인 및 공공 데이터 검증 절차, 에디토리얼팀 전문성과 정정보도 정책을 안내합니다."
      : "Learn about K-StyleShot's editorial standards, fact-checking processes against official public data, team expertise, and correction policies.",
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
          <h1>K-StyleShot 소개 및 편집 기준</h1>
          <p className="legal-updated">최종 업데이트: 2026년 3월</p>

          <section>
            <h2>1. K-StyleShot 미션과 정체성</h2>
            <p>
              K-StyleShot(kstyleshot.com)은 서울 여행, K-뷰티, K-패션에 관심 있는 국내외 방문객을 위한
              독립형 라이프스타일 가이드 미디어입니다. 겉핥기식 홍보성 글이나 피상적인 인터넷 정보 대신,
              실제 현장을 걷고 방문하는 여행자가 겪는 시행착오를 줄일 수 있는 고밀도 실무 가이드를 제공합니다.
              지하철 출구 번호부터 텐트 허용 규정, 웨이팅 앱 우회법, 카메라 렌즈 화각까지 구체적이고 실행 가능한
              정보만을 선별하여 발행합니다.
            </p>
          </section>

          <section>
            <h2>2. 사실 확인 및 공공 데이터 검증 원칙 (Fact-Checking Policy)</h2>
            <p>
              K-StyleShot의 모든 가이드는 발행 전 대한민국 정부 기관 및 지방자치단체 공식 데이터를 바탕으로
              교차 검증을 거칩니다:
            </p>
            <ul>
              <li>
                <strong>궁궐 및 문화유산:</strong> 국가유산청(구 문화재청) 궁능유적본부 및 경복궁관리소의
                공식 관람 규정, 수문장 교대의식 시간표, 한복 무료입장 가이드라인을 매월 대조 검증합니다.
              </li>
              <li>
                <strong>공원 및 도시 시설:</strong> 서울특별시 한강사업본부 조례(그늘막 텐트 설치 허용 기간 및 구역,
                과태료 기준) 및 서울시 교통정보시스템(TOPIS)을 통해 대중교통 노선과 주차 요금을 확인합니다.
              </li>
              <li>
                <strong>관광 및 축제 일정:</strong> 서울관광재단(VisitSeoul) 및 한국관광공사(VisitKorea)의
                공식 등록 데이터베이스를 기반으로 계절별 이벤트 일정을 업데이트합니다.
              </li>
              <li>
                <strong>화장품 및 뷰티 정보:</strong> 식품의약품안전처(MFDS) 화장품 성분 데이터베이스 및 EWG Skin Deep
                성분 기준을 교차 검토하여 피부 타입별 주의 성분을 안내합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. 에디토리얼팀 전문성 (Our Editorial Team)</h2>
            <p>
              K-StyleShot 콘텐츠는 서울 현지에 거주하며 해당 분야 실무 경험을 보유한 전문 에디터가 작성하고 감수합니다.
            </p>
            <ul>
              <li>
                <strong>조미래 (Mirae Jo) — 서울 여행 & 공간 건축 에디터:</strong>
                서울 거주 10년 차 로컬 에디터로 경복궁, 성수동, 여의도, 북촌, 홍대 등 서울 주요 권역의 도보 동선,
                포토존 화각, 건축 재생 공간을 집중 취재합니다. 실제 현장 답사를 기반으로 보행 소요 시간과 혼잡 회피
                시간대를 직접 측정하여 기록합니다.
              </li>
              <li>
                <strong>김소연 (Soyeon Kim) — K-뷰티 & 스킨케어 전문 에디터:</strong>
                뷰티 및 라이프스타일 콘텐츠를 5년 이상 기획·취재해 왔으며, 스킨케어 루틴, 베이스 메이크업 텍스처,
                민감성 피부 성분 분석을 전문으로 다룹니다. 과장 광고를 지양하고 피부 장벽 보호 관점에서 실용적인
                사용법을 안내합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. 편집권 독립 및 제휴 가이드라인 (Editorial Independence)</h2>
            <p>
              K-StyleShot은 독자의 신뢰를 최우선으로 여깁니다. 특정 매장이나 브랜드로부터 대가를 받고 작성하는
              유료 협찬 콘텐츠는 원칙적으로 배제하며, 모든 장소와 제품 추천은 에디터의 객관적 기준과 방문객 관점의
              유용성에 따라 독자적으로 결정됩니다. 제휴 링크나 파트너십이 포함되는 경우 본문 상단에 명확한 공지 문구를
              표기하여 투명성을 보장합니다.
            </p>
          </section>

          <section>
            <h2>5. 정정보도 및 업데이트 정책 (Correction & Update Policy)</h2>
            <p>
              서울의 매장, 전시, 공공 정책은 수시로 변경됩니다. K-StyleShot은 발행된 모든 글의 정확성을 유지하기 위해
              정기적인 재검수 체계를 운영합니다.
            </p>
            <p>
              폐점, 요금 변동, 운영시간 수정 등 정정이 필요한 정보를 발견하신 경우{" "}
              <a href={`/${lang}/contact`}>문의 페이지</a>나 공식 이메일(
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>)로 알려주시면 접수 후
              영업일 기준 48시간 이내에 현장 확인을 거쳐 수정 및 업데이트 로그를 반영합니다.
            </p>
          </section>

          <section>
            <h2>6. 운영 주체 및 문의</h2>
            <p>
              K-StyleShot은 <strong>https://kstyleshot.com</strong>에서 독립 미디어로 서비스됩니다.
              기타 취재 요청이나 제안은 <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>으로
              문의해주시기 바랍니다.
            </p>
          </section>
        </>
      ) : (
        <>
          <h1>About K-StyleShot & Editorial Standards</h1>
          <p className="legal-updated">Last updated: March 2026</p>

          <section>
            <h2>1. Our Mission & Philosophy</h2>
            <p>
              K-StyleShot (kstyleshot.com) is an independent lifestyle media guide dedicated to travelers and culture
              enthusiasts exploring Seoul, K-beauty, and K-fashion. Rather than generic promotional summaries or shallow
              sponsored reviews, we deliver high-density, field-tested guidance designed to help real travelers navigate
              the city effortlessly. From specific subway exit numbers and riverside shade-tent municipal codes to
              queue-bypass apps and optical smartphone lens tips, we focus on concrete, actionable details.
            </p>
          </section>

          <section>
            <h2>2. Fact-Checking & Source Verification Policy</h2>
            <p>
              Accuracy is the cornerstone of our editorial work. Every guide is cross-verified against official South Korean
              government agencies and public institutional resources before publication:
            </p>
            <ul>
              <li>
                <strong>Royal Palaces & Cultural Heritage:</strong> We cross-check operating hours, Royal Guard Changing
                Ceremony timetables, and free admission rules directly with the National Heritage Administration (formerly CHA)
                and the Gyeongbokgung Palace Management Office.
              </li>
              <li>
                <strong>Public Parks & Municipal Facilities:</strong> We verify regulations through the Seoul Metropolitan
                Government's Hangang Project Headquarters (shade tent seasons, designated zones, municipal fines) and Seoul's
                TOPIS traffic system.
              </li>
              <li>
                <strong>Tourism & Festivals:</strong> Seasonal events and public transit guidance are verified against the
                databases of the Seoul Tourism Organization (VisitSeoul) and the Korea Tourism Organization (VisitKorea).
              </li>
              <li>
                <strong>Skincare & Cosmetics:</strong> Cosmetic formulation notes are referenced against the Korean Ministry of
                Food and Drug Safety (MFDS) ingredient index and global EWG Skin Deep safety standards.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Our Editorial Team</h2>
            <p>
              K-StyleShot guides are authored and reviewed by local Seoul residents with dedicated domain expertise:
            </p>
            <ul>
              <li>
                <strong>Mirae Jo — Seoul Travel & Spatial Architecture Editor:</strong>
                A 10-year Seoul resident covering walking circuits, architectural photo spots, and urban regeneration spaces
                across Gyeongbokgung, Seongsu-dong, Yeouido, Bukchon, and Hongdae. She conducts firsthand on-site audits to
                measure walking times and identify optimal low-congestion photo windows.
              </li>
              <li>
                <strong>Soyeon Kim — K-Beauty & Skincare Specialist:</strong>
                With over five years of professional experience reporting on K-beauty routines, cosmetic ingredient safety,
                and base makeup application. Her reporting focuses on pragmatic, skin-barrier-first methods free from
                marketing exaggeration.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Editorial Independence & Non-Sponsored Reviews</h2>
            <p>
              We believe reader trust is paramount. K-StyleShot does not accept paid compensation for favorable coverage,
              and our recommendations are made strictly on editorial merit and traveler utility. Should an article include
              affiliate partnerships or sponsored context, explicit disclosures are prominently placed at the top of the
              guide to ensure complete transparency.
            </p>
          </section>

          <section>
            <h2>5. Correction Policy & Timely Updates</h2>
            <p>
              Seoul is one of the world's most rapidly evolving metropolitan areas, where venues, transit routes, and municipal
              rules change frequently. We maintain an active monitoring and revision cycle.
            </p>
            <p>
              If you identify an error, a closed venue, or outdated pricing, please notify us via our{" "}
              <a href={`/${lang}/contact`}>contact page</a> or directly at{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>. We review reports within 48 business
              hours, verify the on-site facts, and publish corrections with updated timestamps.
            </p>
          </section>

          <section>
            <h2>6. Operations & Inquiries</h2>
            <p>
              K-StyleShot is published independently at <strong>https://kstyleshot.com</strong>. For editorial inquiries,
              press releases, or feedback, please contact us at{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
