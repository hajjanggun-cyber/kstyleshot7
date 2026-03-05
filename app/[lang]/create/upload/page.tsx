import { PhotoUpload } from "@/components/create/PhotoUpload";
import { StepProgress } from "@/components/create/StepProgress";

type UploadPageProps = {
  searchParams: Promise<{ checkout_id?: string; checkoutId?: string }>;
};

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const resolvedSearchParams = await searchParams;
  const checkoutId =
    resolvedSearchParams.checkout_id ?? resolvedSearchParams.checkoutId ?? "";
  const allowDemoFlow =
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ALLOW_DEMO_FLOW === "1";

  return (
    <div className="stack">
      <StepProgress current="upload" />
      <section className="card stack">
        <p className="muted">Step 2</p>
        <h1>Upload your selfie</h1>
        <p className="muted">
          This page polls `GET /api/session/status` when `checkout_id` exists and continues only
          after the paid session is ready.
          {allowDemoFlow
            ? " Demo flow without checkout_id is enabled for local development."
            : " In production, checkout_id is required."}
        </p>
        <PhotoUpload allowDemoFlow={allowDemoFlow} checkoutIdFromUrl={checkoutId} />
      </section>
    </div>
  );
}
