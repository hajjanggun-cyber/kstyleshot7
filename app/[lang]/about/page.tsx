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
    title: isKo ? "K-StyleShot 소개" : "About K-StyleShot",
    description: isKo
      ? "K-StyleShot은 서울의 가볼 만한 곳과 K-뷰티, K-패션 정보를 정리해 소개하는 1인 운영 사이트입니다."
      : "K-StyleShot is a one-person site that curates places to visit in Seoul, K-Beauty, and K-Fashion info.",
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
          
          <section>
            <h2>운영자 정보</h2>
            <ul>
              <li><strong>운영자:</strong> Hajjanggun</li>
              <li><strong>이메일:</strong> <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a></li>
            </ul>
          </section>

          <section>
            <h2>사이트 소개</h2>
            <p>
              K-StyleShot은 서울의 가볼 만한 곳과 K-뷰티, K-패션 정보를 정리해 소개하는 1인 운영 사이트입니다.
              오류를 발견하시면 위 연락처로 알려 주세요.
            </p>
          </section>
        </>
      ) : (
        <>
          <h1>About K-StyleShot</h1>
          
          <section>
            <h2>Operator Info</h2>
            <ul>
              <li><strong>Operator:</strong> Hajjanggun</li>
              <li><strong>Email:</strong> <a href="mailto:hajjanggun77@gmail.com">hajjanggun77@gmail.com</a></li>
            </ul>
          </section>

          <section>
            <h2>About the Site</h2>
            <p>
              K-StyleShot is a one-person site that curates places to visit in Seoul, K-Beauty, and K-Fashion info.
              If you find any errors, please contact us at the email above.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
