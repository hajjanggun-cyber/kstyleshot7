type TermsPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function TermsPage({ params }: TermsPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <div className="legal-page">
      <h1>{isKo ? "서비스 이용약관" : "Terms of Service"}</h1>
      <p className="legal-updated">
        {isKo ? "최종 업데이트: 2026년 3월 19일" : "Last updated: March 19, 2026"}
      </p>

      {isKo ? (
        <>
          <section>
            <h2>1. 서비스 개요</h2>
            <p>K-StyleShot(이하 &quot;서비스&quot;, &quot;당사&quot;)은 AI 기술을 활용하여 사용자의 사진에 K-스타일 헤어, 의상, 배경을 합성하는 1회성 AI 포트레이트 서비스입니다. 본 서비스는 <strong>kstylewshot.com</strong>을 통해 제공됩니다. 본 약관에 동의하지 않는 경우 서비스를 이용하실 수 없습니다.</p>
          </section>

          <section>
            <h2>2. 이용 자격</h2>
            <ul>
              <li>본 서비스는 만 14세 이상인 경우에만 이용 가능합니다. 만 14세 미만의 경우 법정대리인(부모 또는 보호자)의 동의가 필요합니다.</li>
              <li>미국 캘리포니아 거주 만 13세 미만 아동의 이용은 금지됩니다.</li>
              <li>본 약관에 동의함으로써 귀하는 이용 자격을 충족함을 진술합니다.</li>
            </ul>
          </section>

          <section>
            <h2>3. 결제 및 이용</h2>
            <p>본 서비스는 <strong>1회 결제(One-time payment)</strong> 방식으로 운영됩니다. 결제는 Polar(polar.sh)를 통해 처리되며, 결제 완료 후 1회 세션이 제공됩니다.</p>
            <ul>
              <li>결제 금액: $2.99 USD (이벤트 기간 적용 가격)</li>
              <li>결제 통화: USD</li>
              <li>결제 처리: Polar(polar.sh)</li>
              <li>세션 유효기간: 결제 후 24시간</li>
            </ul>
            <p>모든 가격은 부가세 및 적용 가능한 세금이 포함되지 않을 수 있습니다. 해당 세금은 귀하의 관할 지역 법률에 따라 별도로 부과될 수 있습니다.</p>
          </section>

          <section>
            <h2>4. 서비스 이용 조건 및 금지 행위</h2>
            <ul>
              <li>본인 또는 사용 권한을 보유한 사진만 업로드할 수 있습니다.</li>
              <li>타인의 얼굴 사진을 무단으로 사용하는 행위를 금지합니다.</li>
              <li>아동 성착취 관련, 혐오, 폭력, 불법 콘텐츠를 포함한 사진 업로드를 금지합니다.</li>
              <li>생성된 이미지를 상업적 목적으로 무단 재판매하는 행위를 금지합니다.</li>
              <li>서비스의 비정상적 접근, 자동화된 대량 이용, 역공학(reverse engineering) 시도를 금지합니다.</li>
              <li>AI 생성 결과물은 참고용이며, 완벽한 합성을 보장하지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2>5. 결과물 저작권 및 라이선스</h2>
            <p>AI 생성 결과 이미지에 대한 <strong>개인적 비상업적 사용 권한</strong>은 사용자에게 있습니다. 단, 서비스 내에서 사용된 의상 및 배경 템플릿의 저작권은 K-StyleShot에 귀속됩니다. 사용자는 결과물을 제3자에게 라이선스하거나 상업적으로 판매할 수 없습니다.</p>
            <p>사용자가 업로드한 원본 사진의 저작권은 사용자 본인에게 있습니다. 당사는 AI 처리 목적 이외에 해당 사진을 사용하지 않습니다.</p>
          </section>

          <section>
            <h2>6. 개인정보 처리</h2>
            <p>서비스 이용 중 수집되는 개인정보는 별도의 <strong>개인정보 처리방침</strong>에 따라 처리됩니다. 개인정보 처리방침은 본 약관의 일부를 구성합니다. 결제 시 입력하신 이메일 주소로 결과 이미지가 자동 발송되며, 이메일 주소 오류로 인한 미수신은 당사의 책임이 아닙니다.</p>
          </section>

          <section>
            <h2>7. 면책 조항 및 책임 제한</h2>
            <p>AI 합성 결과는 사용자의 사진 품질, 촬영 각도, 조명 등에 따라 달라질 수 있습니다. 서비스는 결과물의 완성도에 대해 명시적 보증을 제공하지 않으며, 묵시적 보증(상품성, 특정 목적 적합성)도 부인합니다.</p>
            <p>당사의 책임은 어떠한 경우에도 귀하가 지불한 서비스 이용 금액을 초과하지 않습니다. 당사는 다음의 손해에 대해 책임을 지지 않습니다:</p>
            <ul>
              <li>간접적, 부수적, 특별한 손해 또는 결과적 손해</li>
              <li>일실 수익, 데이터 손실, 영업 기회 손실</li>
              <li>제3자 서비스(Polar, Replicate, Resend 등)의 장애로 인한 손해</li>
            </ul>
            <p>단, 기술적 오류로 인해 결과물 생성에 완전히 실패한 경우 자동 환불이 처리됩니다. (환불 정책 별도 참조)</p>
          </section>

          <section>
            <h2>8. 서비스 변경 및 중단</h2>
            <p>K-StyleShot은 사전 공지 없이 서비스 내용을 변경하거나 중단할 수 있습니다. 서비스 중단 시 미사용 세션에 대해서는 환불이 처리됩니다. 당사는 서비스 중단으로 인한 결과적 손해에 대해 책임을 지지 않습니다.</p>
          </section>

          <section>
            <h2>9. 분쟁 해결</h2>
            <p>본 약관과 관련된 분쟁은 먼저 당사 고객센터(<strong>kstylewshot.com</strong>)를 통해 해결을 시도합니다. EU 거주자는 소재 국가의 법원에서 소를 제기할 권리가 있습니다. 미국 캘리포니아 거주자는 CCPA에 따른 권리 행사 및 분쟁 해결 절차를 이용할 수 있습니다. 대한민국 거주자의 경우 대한민국 법원이 관할권을 가집니다.</p>
          </section>

          <section>
            <h2>10. 준거법</h2>
            <p>본 약관은 관할 법률에 따라 해석 및 적용됩니다. EU/EEA 거주자에게는 EU 소비자 보호법이 우선 적용됩니다. 대한민국 거주자에게는 전자상거래 등에서의 소비자 보호에 관한 법률, 콘텐츠산업 진흥법 등 관련 법률이 적용됩니다.</p>
          </section>

          <section>
            <h2>11. 약관 변경</h2>
            <p>본 약관이 변경될 경우 변경 7일 전 서비스 내 공지를 통해 안내합니다. 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하실 수 있습니다. 변경 후 서비스를 계속 이용하면 변경된 약관에 동의한 것으로 간주합니다.</p>
          </section>

          <section>
            <h2>12. 문의</h2>
            <p>서비스 이용 관련 문의: <strong>kstylewshot.com</strong>을 통해 연락주세요.</p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>1. Service Overview</h2>
            <p>K-StyleShot (&quot;the Service&quot;, &quot;we&quot;, &quot;us&quot;) is a one-time AI portrait service that uses AI technology to composite K-style hair, outfits, and backgrounds onto user-uploaded photos. The Service is provided through <strong>kstylewshot.com</strong>. By using the Service, you agree to these Terms. If you do not agree, you may not use the Service.</p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <ul>
              <li>You must be at least 14 years of age to use this Service. Users under 14 require consent from a parent or legal guardian.</li>
              <li>Users under 13 years of age residing in California (USA) are not permitted to use the Service.</li>
              <li>By agreeing to these Terms, you represent that you meet the eligibility requirements.</li>
            </ul>
          </section>

          <section>
            <h2>3. Payment & Access</h2>
            <p>This Service operates on a <strong>one-time payment</strong> basis. Payments are processed through Polar (polar.sh). Upon successful payment, one session is granted.</p>
            <ul>
              <li>Price: $2.99 USD (promotional pricing)</li>
              <li>Currency: USD</li>
              <li>Payment processor: Polar (polar.sh)</li>
              <li>Session validity: 24 hours after payment</li>
            </ul>
            <p>Prices are exclusive of applicable taxes, which may be charged separately in accordance with the laws of your jurisdiction.</p>
          </section>

          <section>
            <h2>4. Conditions of Use & Prohibited Conduct</h2>
            <ul>
              <li>You may only upload photos of yourself or photos you have the right to use.</li>
              <li>Uploading photos of other individuals without their consent is prohibited.</li>
              <li>Uploading photos containing child sexual abuse material, hate speech, violence, or other illegal content is strictly prohibited.</li>
              <li>Reselling AI-generated results for commercial purposes without authorization is prohibited.</li>
              <li>Unauthorized access, automated bulk usage, or reverse engineering of the Service is prohibited.</li>
              <li>AI-generated results are for personal reference only and are not guaranteed to be perfect.</li>
            </ul>
          </section>

          <section>
            <h2>5. Intellectual Property & License</h2>
            <p>You retain <strong>personal, non-commercial use rights</strong> to AI-generated result images. However, the outfit and background templates used within the Service remain the intellectual property of K-StyleShot. You may not license or commercially sell result images to third parties.</p>
            <p>Copyright in your original uploaded photos remains with you. We do not use your photos for any purpose other than AI processing.</p>
          </section>

          <section>
            <h2>6. Personal Data</h2>
            <p>Personal data collected during your use of the Service is processed in accordance with our <strong>Privacy Policy</strong>, which forms part of these Terms. Result images are automatically sent to the email address provided at checkout. We are not responsible for non-receipt caused by an incorrect email address.</p>
          </section>

          <section>
            <h2>7. Disclaimer & Limitation of Liability</h2>
            <p>AI compositing results may vary depending on photo quality, angle, and lighting conditions. The Service makes no express warranties regarding result quality and disclaims all implied warranties, including warranties of merchantability and fitness for a particular purpose.</p>
            <p>Our total liability to you shall not exceed the amount you paid for the Service. We are not liable for:</p>
            <ul>
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of revenue, data, or business opportunity</li>
              <li>Damages caused by the failure of third-party services (Polar, Replicate, Resend, etc.)</li>
            </ul>
            <p>In the event of a complete technical failure to generate results, an automatic refund will be issued. (See Refund Policy for details.)</p>
          </section>

          <section>
            <h2>8. Service Changes & Termination</h2>
            <p>K-StyleShot may modify or discontinue the Service without prior notice. In the event of discontinuation, refunds will be issued for unused sessions. We are not liable for any consequential damages arising from service discontinuation.</p>
          </section>

          <section>
            <h2>9. Dispute Resolution</h2>
            <p>Disputes arising from these Terms should first be directed to our support channel at <strong>kstylewshot.com</strong>. EU residents retain the right to bring proceedings before the courts of their country of residence. California residents may exercise their rights under the CCPA through applicable dispute resolution procedures. Nothing in these Terms limits your statutory consumer rights under applicable local law.</p>
          </section>

          <section>
            <h2>10. Governing Law</h2>
            <p>These Terms are governed by applicable law. For EU/EEA residents, EU consumer protection laws take precedence. Nothing in these Terms affects your mandatory statutory rights under the laws of your country of residence.</p>
          </section>

          <section>
            <h2>11. Changes to These Terms</h2>
            <p>We will provide 7 days&apos; notice of material changes to these Terms via in-service notice. If you do not agree to the updated Terms, you may discontinue use of the Service. Continued use after changes take effect constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>For inquiries: please contact us through <strong>kstylewshot.com</strong>.</p>
          </section>
        </>
      )}
    </div>
  );
}
