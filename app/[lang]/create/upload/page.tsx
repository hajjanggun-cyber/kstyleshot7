import { UploadFlow } from "@/components/create/UploadFlow";

type UploadPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ checkout_id?: string; checkoutId?: string }>;
};

export default async function UploadPage({ params, searchParams }: UploadPageProps) {
  await params;
  const resolvedSearchParams = await searchParams;
  const checkoutId =
    resolvedSearchParams.checkout_id ?? resolvedSearchParams.checkoutId ?? "";
  const allowDemoFlow =
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ALLOW_DEMO_FLOW === "1";

  return <UploadFlow allowDemoFlow={allowDemoFlow} checkoutIdFromUrl={checkoutId} />;
}
