import { redirect } from "next/navigation";

type CreatePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function CreatePage({ params }: CreatePageProps) {
  const { lang } = await params;
  redirect(`/${lang}/create/upload`);
}
