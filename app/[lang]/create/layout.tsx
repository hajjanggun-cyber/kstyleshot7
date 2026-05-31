import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true
  }
};

type CreateLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

function pickMessages(messages: Record<string, unknown>, keys: string[]) {
  return keys.reduce<Record<string, unknown>>((picked, key) => {
    if (messages[key] !== undefined) {
      picked[key] = messages[key];
    }
    return picked;
  }, {});
}

export default async function CreateLayout({ children, params }: CreateLayoutProps) {
  const { lang } = await params;
  const messages = (await getMessages()) as Record<string, unknown>;
  const createMessages = pickMessages(messages, ["create", "flow"]);

  return (
    <NextIntlClientProvider locale={lang} messages={createMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
