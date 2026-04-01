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
      ? "K-StyleShot 서비스 문의, 콘텐츠 오류 제보, 협업 제안은 이 페이지를 통해 연락해주세요."
      : "Contact K-StyleShot for service support, content corrections, or collaboration inquiries.",
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
            <h2>서비스 문의 (결제·환불·기술 지원)</h2>
            <p>
              AI 포트레이트 서비스 이용, 결제 오류, 환불 요청 등 서비스 관련 문의는{" "}
              <strong>kstylewshot.com</strong>의 고객 지원 채널을 이용해주세요.
            </p>
            <ul>
              <li>결제 완료 후 결과를 받지 못한 경우</li>
              <li>환불 요청 (환불 정책 내 조건 해당 시 자동 처리됩니다)</li>
              <li>기술적 오류 및 서비스 이용 불가 상황</li>
            </ul>
            <p>일반적으로 영업일 기준 1~2일 내에 답변드립니다.</p>
          </section>

          <section>
            <h2>콘텐츠 오류 제보 및 업데이트 요청</h2>
            <p>
              블로그 가이드(서울 명소, K-뷰티, K-패션)에서 오류를 발견하거나, 폐점·변경된
              정보를 알고 계신 경우 <strong>kstylewshot.com</strong>을 통해 알려주세요.
            </p>
            <p>제보 내용은 검토 후 해당 가이드에 반영합니다.</p>
          </section>

          <section>
            <h2>콘텐츠 협업 및 제안</h2>
            <p>
              K-뷰티 브랜드, 서울 로컬 비즈니스, 여행 관련 협업 제안은{" "}
              <strong>kstylewshot.com</strong>을 통해 문의해주세요. 저희 에디토리얼
              기준에 맞는 경우 검토합니다.
            </p>
          </section>

          <section>
            <h2>자주 묻는 질문</h2>
            <ul>
              <li>
                <strong>결과 이미지는 어디서 받나요?</strong> — 결제 시 입력한 이메일로
                자동 발송됩니다. 스팸함도 확인해보세요.
              </li>
              <li>
                <strong>어떤 사진이 잘 나오나요?</strong> — 정면을 향한 밝은 조명의 단독
                사진이 가장 잘 합성됩니다.
              </li>
              <li>
                <strong>재사용(재촬영)이 가능한가요?</strong> — 1회 결제 시 1회 세션이
                제공됩니다. 추가 이용 시 재결제가 필요합니다.
              </li>
            </ul>
          </section>
        </>
      ) : (
        <>
          <h1>Contact Us</h1>
          <p className="legal-updated">Support channels and response times</p>

          <section>
            <h2>Service Support (Payments, Refunds, Technical Issues)</h2>
            <p>
              For AI portrait service inquiries — payment errors, refund requests, or technical
              issues — please use the support channel at <strong>kstylewshot.com</strong>.
            </p>
            <ul>
              <li>Did not receive results after payment</li>
              <li>Refund requests (eligible cases are processed automatically per our Refund Policy)</li>
              <li>Technical errors or service unavailability</li>
            </ul>
            <p>We typically respond within 1–2 business days.</p>
          </section>

          <section>
            <h2>Content Corrections & Update Requests</h2>
            <p>
              If you find an error in one of our guides — a closed location, changed pricing, or
              outdated information — please let us know via <strong>kstylewshot.com</strong>.
            </p>
            <p>All reports are reviewed and reflected in the relevant guide.</p>
          </section>

          <section>
            <h2>Collaboration Inquiries</h2>
            <p>
              For K-beauty brand partnerships, Seoul local business features, or travel
              collaboration proposals, reach out via <strong>kstylewshot.com</strong>. We review
              inquiries that align with our editorial standards.
            </p>
          </section>

          <section>
            <h2>Frequently Asked Questions</h2>
            <ul>
              <li>
                <strong>Where do I receive my result image?</strong> — It&apos;s automatically
                sent to the email you entered at checkout. Check your spam folder too.
              </li>
              <li>
                <strong>What kind of photo works best?</strong> — A front-facing, well-lit solo
                photo produces the best results.
              </li>
              <li>
                <strong>Can I use the service again?</strong> — Each payment covers one session.
                A new payment is required for additional sessions.
              </li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
