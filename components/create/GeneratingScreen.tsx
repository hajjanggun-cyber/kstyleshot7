type GeneratingScreenProps = {
  title: string;
};

export function GeneratingScreen({ title }: GeneratingScreenProps) {
  return (
    <section className="card stack">
      <h2>{title}</h2>
      <p className="muted">
        Replace this with a polling client component against `GET /api/jobs/status`.
      </p>
    </section>
  );
}

