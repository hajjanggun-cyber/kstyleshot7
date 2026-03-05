import { CreateShell } from "@/components/create/CreateShell";
import { PhotoUpload } from "@/components/create/PhotoUpload";

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
    <CreateShell
      current="upload"
      description={
        allowDemoFlow
          ? "When checkout_id exists this page polls real session status. Development demo is allowed without checkout_id."
          : "This page polls real session status and unlocks only after paid session confirmation."
      }
      title="Upload your selfie"
    >
      <section className="card stack">
        <PhotoUpload allowDemoFlow={allowDemoFlow} checkoutIdFromUrl={checkoutId} />
      </section>
    </CreateShell>
  );
}
