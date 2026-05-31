import type { Metadata } from "next";
import { toAbsoluteUrl, buildLocaleAlternatesAbsolute } from "@/lib/seo";

type PrivacyPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === "ko";
  const canonical = toAbsoluteUrl(`/${lang}/privacy`);
  const languages = buildLocaleAlternatesAbsolute((l) => `/${l}/privacy`);
  return {
    title: isKo ? "개인정보 처리방침 | K-StyleShot" : "Privacy Policy | K-StyleShot",
    description: isKo
      ? "K-StyleShot의 문의 이메일, 분석 도구, 선택형 기능 이용 시 처리되는 개인정보 기준을 안내합니다."
      : "How K-StyleShot handles contact emails, analytics, and optional feature data.",
    alternates: { canonical, languages },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <div className="legal-page">
      <h1>{isKo ? "개인정보 처리방침" : "Privacy Policy"}</h1>
      <p className="legal-updated">
        {isKo ? "최종 업데이트: 2026년 5월 31일" : "Last updated: May 31, 2026"}
      </p>

      {isKo ? (
        <>
          <section>
            <h2>1. 개요</h2>
            <p>
              K-StyleShot은 사이트 운영, 콘텐츠 오류 제보 처리, 보안, 분석, 선택형 기능 제공을
              위해 필요한 범위에서 개인정보를 처리합니다. 당사는 개인정보를 판매하지 않습니다.
            </p>
          </section>

          <section>
            <h2>2. 처리하는 정보</h2>
            <ul>
              <li>
                <strong>문의 정보:</strong> 사용자가 이메일로 보내는 이름, 이메일 주소,
                문의 내용, 첨부 자료
              </li>
              <li>
                <strong>자동 수집 정보:</strong> IP 주소, 브라우저, 기기, 접속 시간, 페이지
                이용 흐름 등 서버 로그와 분석 데이터
              </li>
              <li>
                <strong>선택형 기능 정보:</strong> 사용자가 별도 기능을 이용하는 경우 업로드한
                이미지, 세션 토큰, 주문 ID, 결과 발송에 필요한 이메일 주소
              </li>
            </ul>
          </section>

          <section>
            <h2>3. 이용 목적</h2>
            <ul>
              <li>콘텐츠 오류 제보, 협업 제안, 일반 문의에 대한 응답</li>
              <li>사이트 보안, 오류 분석, 부정 이용 방지</li>
              <li>가이드 콘텐츠와 사용자 경험 개선을 위한 익명화된 분석</li>
              <li>선택형 기능의 세션 확인, 처리, 결과 전달, 환불 또는 기술 지원</li>
            </ul>
          </section>

          <section>
            <h2>4. 제3자 서비스</h2>
            <p>사이트 운영을 위해 다음 제공자가 개인정보 또는 이용 데이터를 처리할 수 있습니다.</p>
            <ul>
              <li><strong>Vercel:</strong> 사이트 호스팅, 서버 로그, 배포 인프라</li>
              <li><strong>Google Analytics:</strong> 익명화된 이용 분석</li>
              <li><strong>Microsoft Clarity:</strong> 사용성 분석 및 오류 파악</li>
              <li><strong>Google AdSense:</strong> 광고 심사, 광고 게재 준비, 부정 트래픽 방지</li>
              <li><strong>Polar, Replicate, Resend, Upstash:</strong> 선택형 이미지 기능 이용 시 결제, 처리, 결과 발송, 임시 세션 저장</li>
            </ul>
          </section>

          <section>
            <h2>5. 보관 및 삭제</h2>
            <ul>
              <li>문의 이메일은 응답과 기록 확인을 위해 필요한 기간 동안 보관됩니다.</li>
              <li>서버 로그와 분석 데이터는 각 제공자의 보관 정책에 따라 처리됩니다.</li>
              <li>선택형 기능의 업로드 이미지는 처리 목적 달성 후 삭제되도록 운영합니다.</li>
              <li>법령상 보존 의무가 있는 결제·거래 기록은 해당 기간 동안 보관될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2>6. 사용자의 권리</h2>
            <p>
              사용자는 본인의 개인정보 열람, 정정, 삭제, 처리 제한을 요청할 수 있습니다. 요청은{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>으로 보내주세요.
            </p>
          </section>

          <section>
            <h2>7. 방침 변경</h2>
            <p>
              개인정보 처리방침이 변경될 경우 이 페이지에 반영합니다. 중요한 변경은 사이트 내
              공지 또는 이메일로 안내할 수 있습니다.
            </p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>1. Overview</h2>
            <p>
              K-StyleShot processes personal information only as needed for site operations, content
              correction reports, security, analytics, and optional site features. We do not sell
              personal information.
            </p>
          </section>

          <section>
            <h2>2. Information We Process</h2>
            <ul>
              <li>
                <strong>Contact information:</strong> Name, email address, message content, and
                attachments you send by email
              </li>
              <li>
                <strong>Automatically collected information:</strong> IP address, browser, device,
                request time, page flow, server logs, and analytics data
              </li>
              <li>
                <strong>Optional feature information:</strong> Uploaded images, session tokens,
                order IDs, and email addresses needed for result delivery if you use an optional
                feature
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Purposes</h2>
            <ul>
              <li>Responding to content corrections, collaboration inquiries, and general messages</li>
              <li>Security, troubleshooting, and prevention of abusive use</li>
              <li>Anonymous analytics for improving guides and page experience</li>
              <li>Session checks, processing, result delivery, refunds, or technical support for optional features</li>
            </ul>
          </section>

          <section>
            <h2>4. Third-Party Providers</h2>
            <p>The following providers may process personal information or usage data for site operation.</p>
            <ul>
              <li><strong>Vercel:</strong> Hosting, server logs, and deployment infrastructure</li>
              <li><strong>Google Analytics:</strong> Anonymous usage analytics</li>
              <li><strong>Microsoft Clarity:</strong> Usability analysis and error review</li>
              <li><strong>Google AdSense:</strong> Ad review, ad-serving readiness, and invalid traffic protection</li>
              <li><strong>Polar, Replicate, Resend, Upstash:</strong> Payment, processing, result delivery, and temporary session storage for optional image features</li>
            </ul>
          </section>

          <section>
            <h2>5. Retention and Deletion</h2>
            <ul>
              <li>Contact emails are kept as needed to respond and maintain records.</li>
              <li>Server logs and analytics data follow each provider&apos;s retention settings.</li>
              <li>Uploaded images for optional features are operated so they are deleted after processing is complete.</li>
              <li>Payment and transaction records may be retained where legally required.</li>
            </ul>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>
              You may request access, correction, deletion, or restriction of your personal data by
              emailing <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2>7. Changes</h2>
            <p>
              Changes to this Privacy Policy will be reflected on this page. Important changes may
              also be announced on the site or by email.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
