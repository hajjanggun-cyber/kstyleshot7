import { getArticleSourceInfo } from "@/data/articleSources";

type ArticleSourceBoxProps = {
  slug: string;
  lang: string;
};

function formatCheckedDate(value: string, locale: "ko" | "en") {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;

  if (locale === "ko") {
    return `${year}년 ${month}월 ${day}일`;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function ArticleSourceBox({ slug, lang }: ArticleSourceBoxProps) {
  const info = getArticleSourceInfo(slug);
  if (!info) return null;

  const locale = lang === "ko" ? "ko" : "en";
  const labels =
    locale === "ko"
      ? {
          kicker: "EDITORIAL CHECK",
          title: "공식 정보 확인 기준",
          checked: "마지막 확인",
        }
      : {
          kicker: "EDITORIAL CHECK",
          title: "Source and Review Basis",
          checked: "Last checked",
        };

  return (
    <section className="ha-source-box" aria-labelledby={`source-${slug}`}>
      <div className="ha-source-head">
        <div>
          <p className="ha-source-kicker">{labels.kicker}</p>
          <h2 id={`source-${slug}`} className="ha-source-title">
            {labels.title}
          </h2>
        </div>
        <time className="ha-source-date" dateTime={info.checkedAt}>
          {labels.checked}: {formatCheckedDate(info.checkedAt, locale)}
        </time>
      </div>

      <p className="ha-source-note">{info.note[locale]}</p>

      <div className="ha-source-list" aria-label={labels.title}>
        {info.sources.map((source) => (
          <a
            className="ha-source-item"
            href={source.url}
            key={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ha-source-publisher">{source.publisher[locale]}</span>
            <span className="ha-source-link">{source.title[locale]}</span>
            <span className="ha-source-use">{source.use[locale]}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
