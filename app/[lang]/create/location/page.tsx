import { redirect } from "next/navigation";

type LocationPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function LocationPage({ params }: LocationPageProps) {
  const { lang } = await params;
  redirect(`/${lang}/create/outfit`);
}
