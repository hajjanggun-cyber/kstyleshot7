import Link from "next/link";

type SiteHeaderProps = {
  lang: string;
};

export function SiteHeader({ lang }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-brand" href={`/${lang}`}>
          <span className="brand-dot" aria-hidden>
            *
          </span>
          <strong>K-StyleMagic</strong>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <Link href={`/${lang}`}>Home</Link>
          <Link href={`/${lang}/create`}>Create</Link>
          <Link href={`/blog/${lang}`}>Blog</Link>
          <Link href={`/${lang}/terms`}>Terms</Link>
        </nav>
        <div className="site-actions" aria-hidden>
          <span className="icon-dot" />
          <span className="icon-dot" />
        </div>
      </div>
    </header>
  );
}
