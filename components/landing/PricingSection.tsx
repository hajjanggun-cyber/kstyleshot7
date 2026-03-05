export function PricingSection() {
  return (
    <section className="card stack">
      <div className="section-head">
        <h2>Simple pricing</h2>
        <span className="count-badge">$3.99</span>
      </div>
      <p>Per completed generation flow.</p>
      <p className="muted">
        Automatic refund is triggered only after retry and confirmed pipeline failure.
      </p>
    </section>
  );
}
