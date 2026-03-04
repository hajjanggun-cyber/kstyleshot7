import { PhotoUpload } from "@/components/create/PhotoUpload";
import { StepProgress } from "@/components/create/StepProgress";

type UploadPageProps = {
  searchParams: Promise<{ checkout_id?: string; checkoutId?: string }>;
};

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const resolvedSearchParams = await searchParams;
  const checkoutId =
    resolvedSearchParams.checkout_id ?? resolvedSearchParams.checkoutId ?? "";

  return (
    <div className="stack">
      <StepProgress current="upload" />
      <section className="card stack">
        <p className="muted">Step 2</p>
        <h1>Upload your selfie</h1>
        <p className="muted">
          If `checkout_id` is present, this page polls `GET /api/session/status` until the paid
          session is ready, then clears the query string and continues with the same flow.
        </p>
        <PhotoUpload checkoutIdFromUrl={checkoutId} />
      </section>
    </div>
  );
}
