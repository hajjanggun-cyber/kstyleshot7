import type { Metadata } from "next";
import { toAbsoluteUrl, buildLocaleAlternatesAbsolute } from "@/lib/seo";

type RefundPolicyPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: RefundPolicyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === "ko";
  const canonical = toAbsoluteUrl(`/${lang}/refund-policy`);
  const languages = buildLocaleAlternatesAbsolute((l) => `/${l}/refund-policy`);
  return {
    title: isKo ? "환불 정책 | K-StyleShot" : "Refund Policy | K-StyleShot",
    description: isKo
      ? "K-StyleShot의 선택형 유료 기능에 적용되는 환불 기준과 문의 절차를 안내합니다."
      : "Refund standards and contact process for optional paid K-StyleShot features.",
    alternates: { canonical, languages },
  };
}

export default async function RefundPolicyPage({ params }: RefundPolicyPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <div className="legal-page">
      <h1>{isKo ? "환불 정책" : "Refund Policy"}</h1>
      <p className="legal-updated">
        {isKo ? "최종 업데이트: 2026년 5월 31일" : "Last updated: May 31, 2026"}
      </p>

      {isKo ? (
        <>
          <section>
            <h2>1. 적용 범위</h2>
            <p>
              K-StyleShot의 대부분 콘텐츠는 무료로 제공되는 가이드입니다. 본 환불 정책은
              사이트에서 별도로 제공될 수 있는 선택형 유료 이미지 기능 또는 실험 기능을 이용한
              경우에만 적용됩니다.
            </p>
          </section>

          <section>
            <h2>2. 환불 가능한 경우</h2>
            <ul>
              <li>결제는 완료되었으나 세션이 생성되지 않아 기능을 전혀 이용할 수 없는 경우</li>
              <li>기술적 오류로 처리 또는 결과 생성이 완전히 실패한 경우</li>
              <li>중복 결제가 확인되어 실제 이용 횟수보다 결제가 더 많이 처리된 경우</li>
            </ul>
          </section>

          <section>
            <h2>3. 환불이 어려운 경우</h2>
            <ul>
              <li>기능이 정상 처리된 뒤 결과물의 취향이나 주관적 품질이 기대와 다른 경우</li>
              <li>사용자가 잘못 입력한 이메일 주소나 잘못 업로드한 파일로 문제가 발생한 경우</li>
              <li>정상적으로 제공된 디지털 결과물을 다운로드하거나 확인한 뒤 단순 변심한 경우</li>
            </ul>
          </section>

          <section>
            <h2>4. 처리 방법</h2>
            <p>
              환불 검토가 필요한 경우 결제 이메일, 주문 ID, 오류 상황을 함께 적어{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>으로 보내주세요.
              확인 후 원 결제 수단 또는 결제 처리업체의 절차에 따라 처리합니다.
            </p>
          </section>

          <section>
            <h2>5. 처리 기간</h2>
            <p>
              환불 승인 후 실제 입금 시점은 결제 처리업체와 카드사 또는 결제 수단 정책에 따라
              달라질 수 있습니다. 일반적으로 영업일 기준 며칠이 소요될 수 있습니다.
            </p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>1. Scope</h2>
            <p>
              Most K-StyleShot content is provided as free editorial guides. This Refund Policy
              applies only if you use an optional paid image feature or experimental paid feature
              offered separately on the site.
            </p>
          </section>

          <section>
            <h2>2. Eligible Refund Cases</h2>
            <ul>
              <li>Payment was completed, but no usable session was created.</li>
              <li>A technical error caused processing or result generation to fail completely.</li>
              <li>A duplicate payment was confirmed for the same intended use.</li>
            </ul>
          </section>

          <section>
            <h2>3. Non-Refundable Cases</h2>
            <ul>
              <li>The feature processed normally, but the result does not match subjective preference.</li>
              <li>The issue was caused by an incorrect email address or an incorrect file uploaded by the user.</li>
              <li>A digital result was provided and accessed, and the request is based on change of mind.</li>
            </ul>
          </section>

          <section>
            <h2>4. How to Request Review</h2>
            <p>
              For refund review, email your payment email, order ID, and a description of the error
              to <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>. Approved
              refunds are processed through the original payment method or payment provider process.
            </p>
          </section>

          <section>
            <h2>5. Processing Time</h2>
            <p>
              After approval, the actual arrival of funds depends on the payment provider, card
              issuer, or payment method. It may take several business days.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
