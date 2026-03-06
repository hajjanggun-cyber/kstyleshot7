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
  // TODO: restore payment gate when checkout is ready
  const allowDemoFlow = true;

  return <UploadFlow allowDemoFlow={allowDemoFlow} checkoutIdFromUrl={checkoutId} />;
}
