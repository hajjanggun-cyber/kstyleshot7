import type { Metadata } from "next";
import { toAbsoluteUrl, buildLocaleAlternatesAbsolute } from "@/lib/seo";

type CookiePolicyPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: CookiePolicyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const canonical = toAbsoluteUrl(`/${lang}/cookie-policy`);
  const languages = buildLocaleAlternatesAbsolute((l) => `/${l}/cookie-policy`);
  return {
    alternates: { canonical, languages },
  };
}

export default async function CookiePolicyPage({ params }: CookiePolicyPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <div className="legal-page">
      {isKo ? (
        <>
          <h1>쿠키 정책</h1>
          <p className="legal-updated">최종 업데이트: 2026년 9월 27일</p>

          <section>
            <h2>1. 쿠키 사용 목적</h2>
            <p>
              K-StyleShot은 사이트가 정상적으로 동작하도록 필수 쿠키와 브라우저 저장소를
              사용합니다. 또한 방문자가 어떤 가이드를 읽고 어떤 기기에서 문제가 발생하는지
              파악하기 위해 제한적인 분석 도구를 사용합니다.
            </p>
          </section>

          <section>
            <h2>2. 사용하는 항목</h2>
            <ul>
              <li>
                <strong>필수 저장 항목:</strong> 언어 설정, 쿠키 동의 상태, 보안 및 세션 확인에
                필요한 값입니다.
              </li>
              <li>
                <strong>분석 도구:</strong> Google Analytics와 Microsoft Clarity를 사용해
                페이지 이용 흐름, 오류 가능성, 콘텐츠 개선에 필요한 익명화된 사용 패턴을
                확인합니다.
              </li>
              <li>
                <strong>서버 로그:</strong> IP 주소, 브라우저, 요청 시간 같은 기본 접속 기록은
                보안과 장애 대응 목적으로 호스팅 환경에서 처리될 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. 광고 및 제3자 쿠키 (Google AdSense)</h2>
            <p>
              사이트는 Google AdSense를 통한 광고 게재 및 서비스 유지를 위해 제3자 광고 쿠키를 사용합니다.
            </p>
            <ul>
              <li>Google 및 파트너사는 사용자의 과거 방문 기록을 바탕으로 쿠키를 사용하여 광고를 게재합니다.</li>
              <li>사용자는 <strong><a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google 광고 설정</a></strong> 페이지에서 맞춤형 광고를 직접 관리하거나 비활성화할 수 있습니다.</li>
              <li>또한 제3자 공급업체의 맞춤형 쿠키 사용은 <strong><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a></strong>에서 선택 해제할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2>4. 쿠키 관리 방법</h2>
            <p>
              브라우저 설정에서 쿠키를 삭제하거나 차단할 수 있습니다. 다만 필수 쿠키를 차단하면
              언어 설정, 동의 상태, 일부 보안 확인 기능이 정상적으로 유지되지 않을 수 있습니다.
            </p>
          </section>

          <section>
            <h2>5. 문의</h2>
            <p>
              쿠키와 분석 도구 사용에 관한 문의는{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>으로 보내주세요.
            </p>
          </section>
        </>
      ) : (
        <>
          <h1>Cookie Policy</h1>
          <p className="legal-updated">Last updated: September 27, 2026</p>

          <section>
            <h2>1. Why We Use Cookies</h2>
            <p>
              K-StyleShot uses essential cookies and browser storage to keep the site working
              properly. We also use limited analytics to understand which guides readers use and
              where technical issues may occur.
            </p>
          </section>

          <section>
            <h2>2. What We Use</h2>
            <ul>
              <li>
                <strong>Essential storage:</strong> Language preference, cookie consent status,
                and values needed for security or session checks.
              </li>
              <li>
                <strong>Analytics tools:</strong> Google Analytics and Microsoft Clarity help us
                review page flow, possible errors, and anonymized usage patterns for content
                improvement.
              </li>
              <li>
                <strong>Server logs:</strong> Basic access records such as IP address, browser,
                and request time may be processed by our hosting environment for security and
                troubleshooting.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Ads and Third-Party Cookies (Google AdSense)</h2>
            <p>
              The site uses third-party cookies for advertising via Google AdSense.
            </p>
            <ul>
              <li>Google and third-party vendors use cookies to serve ads based on your prior visits to this and other websites.</li>
              <li>You can manage or opt out of personalized advertising at any time by visiting <strong><a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></strong>.</li>
              <li>Alternatively, you can opt out of third-party personalized advertising cookies via <strong><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a></strong>.</li>
            </ul>
          </section>

          <section>
            <h2>4. Managing Cookies</h2>
            <p>
              You can delete or block cookies in your browser settings. Blocking essential cookies
              may prevent language preferences, consent status, or some security checks from
              working consistently.
            </p>
          </section>

          <section>
            <h2>5. Contact</h2>
            <p>
              For questions about cookies or analytics, email{" "}
              <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a>.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
