import { getTranslations } from "next-intl/server";

import { CreateShell } from "@/components/create/CreateShell";
import { PhotoUpload } from "@/components/create/PhotoUpload";

type UploadPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ checkout_id?: string; checkoutId?: string }>;
};

export default async function UploadPage({ params, searchParams }: UploadPageProps) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "create.uploadPage" });
  const resolvedSearchParams = await searchParams;
  const checkoutId =
    resolvedSearchParams.checkout_id ?? resolvedSearchParams.checkoutId ?? "";
  const allowDemoFlow =
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ALLOW_DEMO_FLOW === "1";

  return (
    <CreateShell
      current="upload"
      description={allowDemoFlow ? t("descriptionDemo") : t("descriptionProd")}
      title={t("title")}
    >
      <section className="card stack">
        <PhotoUpload allowDemoFlow={allowDemoFlow} checkoutIdFromUrl={checkoutId} />
      </section>
    </CreateShell>
  );
}
