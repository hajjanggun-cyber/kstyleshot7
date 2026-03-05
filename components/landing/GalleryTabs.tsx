export function GalleryTabs() {
  return (
    <section className="card stack" id="trending">
      <div className="section-head">
        <h2>Trending this week</h2>
        <span className="muted">Explore all styles</span>
      </div>
      <div className="grid four">
        <article className="trend-card trend-cyber">
          <strong>Cyber Idol</strong>
          <span>2.4k uses</span>
        </article>
        <article className="trend-card trend-soft">
          <strong>Soft Glam</strong>
          <span>1.8k uses</span>
        </article>
        <article className="trend-card trend-street">
          <strong>Street Beat</strong>
          <span>4.1k uses</span>
        </article>
        <article className="trend-card trend-clean">
          <strong>Clean Royal</strong>
          <span>900 uses</span>
        </article>
      </div>
    </section>
  );
}
