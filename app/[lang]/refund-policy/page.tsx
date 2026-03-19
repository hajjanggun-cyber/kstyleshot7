type RefundPolicyPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function RefundPolicyPage({ params }: RefundPolicyPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <div className="legal-page">
      <h1>{isKo ? "환불 규정" : "Refund Policy"}</h1>
      <p className="legal-updated">{isKo ? "최종 업데이트: 2026년 3월" : "Last updated: March 2026"}</p>

      {isKo ? (
        <>
          <section>
            <h2>1. 기본 원칙</h2>
            <p>K-StyleShot은 AI 생성 서비스의 특성상 <strong>원칙적으로 환불이 불가</strong>합니다. 단, 아래 명시된 예외 사항에 해당하는 경우에 한해 환불이 처리됩니다.</p>
          </section>

          <section>
            <h2>2. 자동 환불 조건 (무조건 환불)</h2>
            <p>다음의 경우 시스템이 자동으로 전액 환불을 처리합니다:</p>
            <ul>
              <li>AI 헤어 합성 생성에 기술적 오류로 완전히 실패한 경우</li>
              <li>최종 의상·배경 합성 이미지 생성에 기술적 오류로 완전히 실패한 경우</li>
              <li>결제 후 세션이 정상적으로 생성되지 않아 서비스 이용이 불가한 경우</li>
            </ul>
            <p>자동 환불은 Polar(polar.sh)를 통해 처리되며, 영업일 기준 3~5일 내 원결제 수단으로 반환됩니다.</p>
          </section>

          <section>
            <h2>3. 환불 불가 조건</h2>
            <ul>
              <li>결제 시 입력한 이메일 주소가 잘못되어 결과물을 수신하지 못한 경우</li>
              <li>AI 결과물의 품질이 기대와 다른 경우 (주관적 불만족)</li>
              <li>사용자가 업로드한 사진 품질 문제로 인한 합성 품질 저하</li>
              <li>세션을 이미 일부 또는 전부 사용한 경우</li>
              <li>단순 변심</li>
            </ul>
          </section>

          <section>
            <h2>4. 이메일 수신 관련 안내</h2>
            <p>결과 이미지는 <strong>결제 시 입력하신 이메일 주소로 자동 발송</strong>됩니다. 잘못된 이메일 주소 입력으로 인한 미수신은 환불 사유에 해당하지 않습니다. 결제 전 이메일 주소를 반드시 확인해 주세요.</p>
          </section>

          <section>
            <h2>5. 환불 처리 방법</h2>
            <p>환불은 결제에 사용한 Polar 계정을 통해 처리됩니다. 자동 환불 외 환불 요청은 <strong>kstylewshot.com</strong>을 통해 문의하시기 바랍니다.</p>
          </section>

          <section>
            <h2>6. 결제 수단</h2>
            <p>본 서비스의 결제는 Polar(polar.sh)를 통해 처리됩니다. 결제 관련 분쟁은 Polar의 정책을 우선 적용합니다.</p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>1. General Policy</h2>
            <p>Due to the nature of AI generation services, K-StyleShot maintains a <strong>no-refund policy</strong> in principle. Refunds are only issued in the specific cases outlined below.</p>
          </section>

          <section>
            <h2>2. Automatic Refund Conditions</h2>
            <p>The system will automatically process a full refund in the following cases:</p>
            <ul>
              <li>Complete technical failure to generate AI hair style results</li>
              <li>Complete technical failure to generate the final outfit and background composite image</li>
              <li>Failure to create a session after payment, making the service inaccessible</li>
            </ul>
            <p>Automatic refunds are processed through Polar (polar.sh) and will be returned to the original payment method within 3–5 business days.</p>
          </section>

          <section>
            <h2>3. Non-Refundable Conditions</h2>
            <ul>
              <li>Non-receipt of results due to an incorrect email address entered at checkout</li>
              <li>Dissatisfaction with AI result quality (subjective preference)</li>
              <li>Poor composite quality caused by low-quality user-uploaded photos</li>
              <li>Session already partially or fully used</li>
              <li>Change of mind</li>
            </ul>
          </section>

          <section>
            <h2>4. Email Delivery Notice</h2>
            <p>Result images are <strong>automatically sent to the email address provided at checkout</strong>. Failure to receive results due to an incorrect email address is not eligible for a refund. Please verify your email address before completing payment.</p>
          </section>

          <section>
            <h2>5. Refund Process</h2>
            <p>Refunds are processed through the Polar account used for payment. For refund requests beyond automatic refunds, please contact us through <strong>kstylewshot.com</strong>.</p>
          </section>

          <section>
            <h2>6. Payment Processor</h2>
            <p>All payments are processed through Polar (polar.sh). Payment-related disputes are subject to Polar's policies.</p>
          </section>
        </>
      )}
    </div>
  );
}
