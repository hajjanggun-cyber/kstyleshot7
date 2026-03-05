export function HowItWorks() {
  return (
    <section className="card stack">
      <div className="section-head">
        <h2>How the magic happens</h2>
      </div>
      <p className="muted">
        Three steps for users, with real payment/session safeguards under the hood.
      </p>
      <div className="grid three">
        <article className="card stack step-card">
          <span className="step-chip">1</span>
          <strong>Checkout</strong>
          <span className="muted">
            Start paid checkout, return with `checkout_id`, and wait for session handshake.
          </span>
        </article>
        <article className="card stack step-card">
          <span className="step-chip">2</span>
          <strong>Upload + Hair</strong>
          <span className="muted">
            Upload one selfie, pick two hairstyles, run async generation, then choose one.
          </span>
        </article>
        <article className="card stack step-card">
          <span className="step-chip">3</span>
          <strong>Finish</strong>
          <span className="muted">
            Continue through outfit/background stages and download your final selected result.
          </span>
        </article>
      </div>
    </section>
  );
}
