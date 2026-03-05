import Link from "next/link";

export function HeroSection() {
  return (
    <section className="hero card">
      <div className="hero-overlay" />
      <div className="hero-content stack">
        <p className="eyebrow">Next-gen AI transformation</p>
        <h1>
          Transform into your favorite <span className="hot">K-POP</span> star.
        </h1>
        <p className="muted">
          Upload one selfie, pick your style, and run a paid session flow built for reliable
          checkout-to-generation handoff.
        </p>
        <div className="actions">
          <Link className="button" href="/en/create">
            Start experience
          </Link>
          <a className="button secondary" href="#trending">
            View gallery
          </a>
        </div>
      </div>
      <div className="hero-badges" aria-hidden>
        <span>500+ styles</span>
        <span>Real async jobs</span>
        <span>Session-safe flow</span>
      </div>
    </section>
  );
}
