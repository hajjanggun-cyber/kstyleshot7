import type { Metadata } from "next";
import { toAbsoluteUrl, buildLocaleAlternatesAbsolute } from "@/lib/seo";

type ContactPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === "ko";
  const canonical = toAbsoluteUrl(`/${lang}/contact`);
  const languages = buildLocaleAlternatesAbsolute((l) => `/${l}/contact`);
  return {
    title: isKo ? "문의하기 | K-StyleShot" : "Contact | K-StyleShot",
    description: isKo
      ? "K-StyleShot 콘텐츠 오류 제보, 업데이트 요청, 협업 제안은 이 페이지를 통해 연락해주세요."
      : "Contact K-StyleShot for content corrections, update requests, or collaboration inquiries.",
    alternates: { canonical, languages },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <div className="legal-page">
      {isKo ? (
        <>
          <h1>문의하기</h1>
          <p className="legal-updated">운영 채널 및 응답 안내</p>

          <section>
            <h2>콘텐츠 오류 제보 및 업데이트 요청</h2>
            <p>
              서울 명소, K-뷰티, K-패션 가이드에서 오류를 발견하거나 폐점·운영시간 변경·가격
              변경 같은 정보를 알고 계신 경우{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>으로
              알려주세요.
            </p>
            <p>제보 내용은 검토 후 해당 가이드에 반영합니다.</p>
          </section>

          <section>
            <h2>콘텐츠 협업 및 제안</h2>
            <p>
              K-뷰티 브랜드, 서울 로컬 비즈니스, 여행 관련 협업 제안은{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>으로
              문의해주세요. 저희 에디토리얼 기준에 맞는 경우 검토합니다.
            </p>
          </section>

          <section>
            <h2>일반 문의</h2>
            <p>
              그 외 문의사항은{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>으로
              연락해주세요. 영업일 기준 1~2일 내에 답변드립니다.
            </p>
          </section>
        </>
      ) : (
        <>
          <h1>Contact Us</h1>
          <p className="legal-updated">Support channels and response times</p>

          <section>
            <h2>Content Corrections & Update Requests</h2>
            <p>
              If you find an error in one of our guides — a closed location, changed pricing, or
              outdated information — please email us at{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>.
            </p>
            <p>All reports are reviewed and reflected in the relevant guide.</p>
          </section>

          <section>
            <h2>Collaboration Inquiries</h2>
            <p>
              For K-beauty brand partnerships, Seoul local business features, or travel
              collaboration proposals, reach out at{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>. We review
              inquiries that align with our editorial standards.
            </p>
          </section>

          <section>
            <h2>General Contact</h2>
            <p>
              For all other inquiries, you can reach us directly at{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>. We typically
              respond within 1–2 business days.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
