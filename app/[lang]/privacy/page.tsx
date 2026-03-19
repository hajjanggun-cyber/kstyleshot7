type PrivacyPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <div className="legal-page">
      <h1>{isKo ? "개인정보 처리방침" : "Privacy Policy"}</h1>
      <p className="legal-updated">
        {isKo ? "최종 업데이트: 2026년 3월 19일" : "Last updated: March 19, 2026"}
      </p>

      {isKo ? (
        <>
          <section>
            <h2>1. 개요</h2>
            <p>K-StyleShot(이하 "서비스", "당사")은 사용자의 개인정보를 중요하게 여기며, 대한민국 「개인정보 보호법」, EU 일반 개인정보 보호 규정(GDPR), 미국 캘리포니아 소비자 개인정보 보호법(CCPA) 등 적용 가능한 모든 개인정보 보호 법령을 준수합니다.</p>
          </section>

          <section>
            <h2>2. 수집하는 개인정보 항목 및 수집 방법</h2>
            <p><strong>필수 수집 항목:</strong></p>
            <ul>
              <li>이메일 주소 (결제 시 Polar를 통해 수집)</li>
              <li>업로드 사진 (AI 처리 목적, 처리 완료 즉시 삭제)</li>
              <li>결제 관련 정보 (Polar에서 직접 처리, 당사는 카드 정보를 수집·저장하지 않음)</li>
              <li>세션 토큰 및 주문 ID (서비스 인증 목적, 24시간 후 자동 삭제)</li>
            </ul>
            <p><strong>자동 수집 항목:</strong></p>
            <ul>
              <li>IP 주소, 브라우저 유형, 기기 정보 (서버 로그)</li>
              <li>서비스 이용 행태 데이터 (Microsoft Clarity — 익명 처리)</li>
            </ul>
          </section>

          <section>
            <h2>3. 개인정보 처리 목적 및 법적 근거 (GDPR 제6조)</h2>
            <ul>
              <li><strong>계약 이행(제6조 1항 b):</strong> AI 이미지 합성 처리, 결과물 이메일 발송, 결제 처리 및 환불</li>
              <li><strong>정당한 이익(제6조 1항 f):</strong> 서비스 보안, 사기 방지, 오류 디버깅</li>
              <li><strong>법적 의무(제6조 1항 c):</strong> 관련 법령에 따른 기록 보존</li>
            </ul>
          </section>

          <section>
            <h2>4. 개인정보 보유 및 파기</h2>
            <ul>
              <li>업로드 사진: AI 처리 완료 즉시 삭제</li>
              <li>세션 데이터(주문 ID, 세션 토큰): 결제 후 24시간 자동 삭제</li>
              <li>이메일 주소: Polar 서비스 정책에 따름 (삭제 요청 시 당사 문의)</li>
              <li>서버 로그: 최대 30일 보관 후 자동 삭제</li>
            </ul>
          </section>

          <section>
            <h2>5. 제3자 제공 및 처리 위탁</h2>
            <p>당사는 다음의 제3자 서비스 제공자에게 개인정보 처리를 위탁합니다:</p>
            <ul>
              <li><strong>Polar (polar.sh, 미국)</strong> — 결제 처리, 고객 이메일 관리</li>
              <li><strong>Replicate (replicate.com, 미국)</strong> — AI 이미지 생성 (업로드 사진 전송, 처리 후 삭제)</li>
              <li><strong>Resend (resend.com, 미국)</strong> — 결과물 이메일 발송</li>
              <li><strong>Upstash (upstash.com, 미국)</strong> — 세션 데이터 임시 저장</li>
              <li><strong>Vercel (vercel.com, 미국)</strong> — 서비스 호스팅 및 서버 로그</li>
              <li><strong>Microsoft Clarity (미국)</strong> — 익명 사용자 행태 분석</li>
            </ul>
            <p>위탁받은 업체들은 GDPR 표준 계약 조항(SCCs) 또는 동등한 수준의 개인정보 보호 메커니즘을 통해 운영됩니다. 마케팅 목적의 제3자 제공은 일절 없습니다.</p>
          </section>

          <section>
            <h2>6. 국제 개인정보 이전</h2>
            <p>본 서비스는 미국에 소재한 서버를 사용합니다. EU/EEA 거주자의 개인정보는 GDPR 제46조에 따른 적절한 보호 조치(표준 계약 조항) 하에 이전됩니다.</p>
          </section>

          <section>
            <h2>7. 정보주체의 권리 (GDPR / 개인정보 보호법)</h2>
            <p>사용자는 다음의 권리를 가집니다:</p>
            <ul>
              <li><strong>열람권:</strong> 수집된 개인정보 확인 요청</li>
              <li><strong>정정권:</strong> 부정확한 개인정보 수정 요청</li>
              <li><strong>삭제권(잊혀질 권리):</strong> 개인정보 삭제 요청</li>
              <li><strong>처리 제한권:</strong> 특정 상황에서 처리 제한 요청</li>
              <li><strong>이동권:</strong> 개인정보를 기계 판독 가능한 형식으로 수령 요청</li>
              <li><strong>반대권:</strong> 정당한 이익에 근거한 처리에 대한 반대</li>
              <li><strong>자동화 결정 거부권:</strong> 자동화된 의사결정의 적용 거부</li>
            </ul>
            <p>권리 행사 요청: <strong>kstylewshot.com</strong> 문의 채널을 통해 접수 (1개월 이내 처리)</p>
            <p>EU 거주자는 소재지 국가의 감독기관(DPA)에 불만을 제기할 권리가 있습니다.</p>
          </section>

          <section>
            <h2>8. 캘리포니아 거주자 권리 (CCPA)</h2>
            <p>캘리포니아 거주자는 다음의 추가 권리를 가집니다:</p>
            <ul>
              <li>수집된 개인정보 카테고리 및 목적 열람 권리</li>
              <li>개인정보 삭제 요청 권리</li>
              <li>개인정보 판매 거부 권리 (당사는 개인정보를 판매하지 않습니다)</li>
              <li>차별받지 않을 권리</li>
            </ul>
          </section>

          <section>
            <h2>9. 아동 개인정보 보호</h2>
            <p>본 서비스는 만 14세 미만(미국의 경우 만 13세 미만)의 아동을 대상으로 하지 않으며, 의도적으로 아동의 개인정보를 수집하지 않습니다. 아동의 개인정보가 수집된 것을 인지한 경우 즉시 삭제합니다.</p>
          </section>

          <section>
            <h2>10. 쿠키 및 트래킹</h2>
            <p>본 서비스는 필수 기능 쿠키 및 Microsoft Clarity 분석 스크립트를 사용합니다. 브라우저 설정을 통해 쿠키를 거부할 수 있으나, 일부 서비스 기능이 제한될 수 있습니다.</p>
          </section>

          <section>
            <h2>11. 개인정보 보호책임자</h2>
            <p>개인정보 처리에 관한 문의, 불만 처리, 권리 행사 요청은 아래로 연락해 주시기 바랍니다:</p>
            <p>문의처: <strong>kstylewshot.com</strong></p>
          </section>

          <section>
            <h2>12. 방침 변경</h2>
            <p>본 방침이 변경될 경우 변경 7일 전 서비스 내 공지를 통해 안내합니다. 중요한 변경사항의 경우 이메일로 별도 고지할 수 있습니다.</p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>1. Overview</h2>
            <p>K-StyleShot ("the Service", "we", "us") is committed to protecting your personal information and complies with all applicable data protection laws, including the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and the Korean Personal Information Protection Act (PIPA).</p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p><strong>Information you provide:</strong></p>
            <ul>
              <li>Email address (collected via Polar at checkout)</li>
              <li>Uploaded photo (used solely for AI processing, deleted immediately after)</li>
              <li>Payment information (processed directly by Polar; we do not store card details)</li>
              <li>Session token and order ID (for service authentication, auto-deleted after 24 hours)</li>
            </ul>
            <p><strong>Automatically collected information:</strong></p>
            <ul>
              <li>IP address, browser type, device information (server logs)</li>
              <li>Anonymized usage behavior (Microsoft Clarity)</li>
            </ul>
          </section>

          <section>
            <h2>3. Legal Basis for Processing (GDPR Article 6)</h2>
            <ul>
              <li><strong>Contract performance (Art. 6(1)(b)):</strong> AI image compositing, result email delivery, payment processing and refunds</li>
              <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> Service security, fraud prevention, error debugging</li>
              <li><strong>Legal obligation (Art. 6(1)(c)):</strong> Record retention as required by applicable law</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Retention</h2>
            <ul>
              <li>Uploaded photos: Deleted immediately after AI processing</li>
              <li>Session data (order ID, session token): Auto-deleted 24 hours after payment</li>
              <li>Email address: Subject to Polar's data retention policy (contact us for deletion requests)</li>
              <li>Server logs: Automatically deleted after a maximum of 30 days</li>
            </ul>
          </section>

          <section>
            <h2>5. Third-Party Service Providers</h2>
            <p>We share data with the following processors to provide the Service:</p>
            <ul>
              <li><strong>Polar (polar.sh, USA)</strong> — Payment processing and customer email management</li>
              <li><strong>Replicate (replicate.com, USA)</strong> — AI image generation (photos transmitted and deleted after processing)</li>
              <li><strong>Resend (resend.com, USA)</strong> — Result email delivery</li>
              <li><strong>Upstash (upstash.com, USA)</strong> — Temporary session data storage</li>
              <li><strong>Vercel (vercel.com, USA)</strong> — Service hosting and server logs</li>
              <li><strong>Microsoft Clarity (USA)</strong> — Anonymous usage analytics</li>
            </ul>
            <p>All processors operate under GDPR Standard Contractual Clauses (SCCs) or equivalent safeguards. We do not sell or share your data for marketing purposes.</p>
          </section>

          <section>
            <h2>6. International Data Transfers</h2>
            <p>This Service uses servers located in the United States. Personal data of EU/EEA residents is transferred under appropriate safeguards pursuant to GDPR Article 46 (Standard Contractual Clauses).</p>
          </section>

          <section>
            <h2>7. Your Rights (GDPR / PIPA)</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Right of access:</strong> Request confirmation and a copy of your personal data</li>
              <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to erasure ("right to be forgotten"):</strong> Request deletion of your data</li>
              <li><strong>Right to restriction:</strong> Request restricted processing in certain circumstances</li>
              <li><strong>Right to data portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Rights related to automated decision-making:</strong> Not to be subject to solely automated decisions</li>
            </ul>
            <p>To exercise your rights, contact us through <strong>kstylewshot.com</strong>. We will respond within one month.</p>
            <p>EU residents have the right to lodge a complaint with their local supervisory authority (DPA).</p>
          </section>

          <section>
            <h2>8. California Residents (CCPA)</h2>
            <p>California residents have the following additional rights:</p>
            <ul>
              <li>Right to know what personal information is collected and why</li>
              <li>Right to request deletion of personal information</li>
              <li>Right to opt out of the sale of personal information (we do not sell personal data)</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>This Service is not directed at children under 13 (or under 14 in certain jurisdictions) and we do not knowingly collect personal information from children. If we become aware that a child's data has been collected, we will delete it promptly.</p>
          </section>

          <section>
            <h2>10. Cookies & Tracking</h2>
            <p>We use essential functional cookies and the Microsoft Clarity analytics script. You may disable cookies through your browser settings, though some service features may be affected.</p>
          </section>

          <section>
            <h2>11. Data Controller Contact</h2>
            <p>For inquiries, complaints, or to exercise your rights, please contact us through:</p>
            <p><strong>kstylewshot.com</strong></p>
          </section>

          <section>
            <h2>12. Changes to This Policy</h2>
            <p>We will provide 7 days' notice of material changes to this Policy via in-service notice. For significant changes, we may also notify you by email.</p>
          </section>
        </>
      )}
    </div>
  );
}
