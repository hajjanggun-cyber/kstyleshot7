import { getTranslations } from "next-intl/server";

import { CreateShell } from "@/components/create/CreateShell";
import { FinalResult } from "@/components/create/FinalResult";

type DonePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function DonePage({ params }: DonePageProps) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "create.donePage" });

  return (
    <CreateShell
      current="done"
      description={t("description")}
      title={t("title")}
    >
      <FinalResult />
    </CreateShell>
  );
}
