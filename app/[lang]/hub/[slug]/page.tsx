"use client";

import { notFound } from "next/navigation";
import { use } from "react";

import { HubArticle } from "@/components/hub/HubArticle";
import { hubArticles } from "@/data/hubArticles";

type ArticlePageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = use(params);
  const article = hubArticles[slug];

  if (!article) {
    notFound();
  }

  return <HubArticle article={article} />;
}
