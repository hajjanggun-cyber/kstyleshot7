import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type BlogLang = "en" | "ko";
export type BlogCategoryKey =
  | "product-faq"
  | "hair"
  | "photo-technique"
  | "beauty-prep"
  | "outfit-styling"
  | "backdrop-mood"
  | "seasonal-trend";

export type BlogPostMeta = {
  title: string;
  slug: string;
  lang: BlogLang;
  date: string;
  updated: string;
  description: string;
  tags: string[];
  category: string;
  draft: boolean;
  canonical: string;
  pairSlug: string;
  ctaVariant: string;
};

export type BlogPost = BlogPostMeta & {
  body: string;
};

export type BlogCategoryDefinition = {
  key: BlogCategoryKey;
  slug: string;
  name: string;
  description: string;
};

export type BlogCategorySummary = BlogCategoryDefinition & {
  count: number;
  featuredPost: BlogPost | null;
  posts: BlogPost[];
};

type ParsedFrontmatter = Record<string, string | string[] | boolean>;
type CategoryConfig = {
  key: BlogCategoryKey;
  slug: string;
  labels: Record<BlogLang, string>;
  descriptions: Record<BlogLang, string>;
  aliases?: Partial<Record<BlogLang, string[]>>;
};

const BLOG_ROOT = path.join(process.cwd(), "content", "blog");
const BLOG_LANGS: BlogLang[] = ["en", "ko"];
const BLOG_CATEGORY_CONFIG: CategoryConfig[] = [
  {
    key: "product-faq",
    slug: "product-faq",
    labels: {
      en: "Product / FAQ",
      ko: "제품 / FAQ"
    },
    descriptions: {
      en: "Start here for product logic, upload standards, expectations, and policy trust.",
      ko: "서비스 이해, 업로드 기준, 기대치 조정, 정책 신뢰를 먼저 잡는 허브입니다."
    }
  },
  {
    key: "hair",
    slug: "hair",
    labels: {
      en: "Hair",
      ko: "헤어"
    },
    descriptions: {
      en: "The core style category for face framing, bangs, layers, and lower-risk hair choices.",
      ko: "앞머리, 레이어, 가르마, 얼굴선 정리에 집중하는 핵심 스타일 카테고리입니다."
    }
  },
  {
    key: "photo-technique",
    slug: "photo-technique",
    labels: {
      en: "Photo Technique",
      ko: "촬영 팁"
    },
    descriptions: {
      en: "Lighting, angle, framing, and distance tips that improve the upload before styling.",
      ko: "조명, 각도, 거리, 구도를 먼저 잡아 업로드 품질을 높이는 실전 팁 묶음입니다."
    }
  },
  {
    key: "beauty-prep",
    slug: "beauty-prep",
    labels: {
      en: "Beauty Prep",
      ko: "K-뷰티 준비"
    },
    descriptions: {
      en: "Prep the face before the photo with lighter makeup, skin texture cleanup, and balance.",
      ko: "셀카 전에 피부결, 베이스, 눈썹, 립 밸런스를 정리하는 준비형 카테고리입니다."
    }
  },
  {
    key: "outfit-styling",
    slug: "outfit-styling",
    labels: {
      en: "Outfit / Styling",
      ko: "코디"
    },
    descriptions: {
      en: "Outfit silhouettes, necklines, color temperature, and cleaner camera-friendly styling.",
      ko: "실루엣, 넥라인, 톤온톤, 배경 매칭까지 보는 코디 허브입니다."
    },
    aliases: {
      en: ["Outfit"]
    }
  },
  {
    key: "backdrop-mood",
    slug: "backdrop-mood",
    labels: {
      en: "Backdrop / Mood",
      ko: "배경 / 무드"
    },
    descriptions: {
      en: "Backdrop choice, city mood, spatial tone, and the way scene selection changes the result.",
      ko: "서울 무드, 도심 배경, 배경 밀도, 합성 기대치를 다루는 배경 허브입니다."
    },
    aliases: {
      en: ["Seoul Backdrop"],
      ko: ["서울 배경"]
    }
  },
  {
    key: "seasonal-trend",
    slug: "seasonal-trend",
    labels: {
      en: "Seasonal / Trend",
      ko: "시즌 / 트렌드"
    },
    descriptions: {
      en: "Season-led styling updates for spring, summer, fall, winter, and evergreen trend shifts.",
      ko: "봄, 여름, 가을, 겨울 흐름을 따라가는 계절성 확장 카테고리입니다."
    }
  }
];

function assertBlogLang(lang: string): BlogLang {
  if (lang !== "en" && lang !== "ko") {
    throw new Error(`Unsupported blog language: ${lang}`);
  }

  return lang;
}

function parseBoolean(value: string): boolean {
  return value.trim().toLowerCase() === "true";
}

function parseStringArray(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return [];
  }

  const content = trimmed.slice(1, -1).trim();
  if (!content) {
    return [];
  }

  return content
    .split(",")
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function parseFrontmatter(raw: string): { frontmatter: ParsedFrontmatter; body: string } {
  if (!raw.startsWith("---")) {
    return { frontmatter: {}, body: raw.trim() };
  }

  const endIndex = raw.indexOf("\n---", 3);
  if (endIndex === -1) {
    return { frontmatter: {}, body: raw.trim() };
  }

  const frontmatterBlock = raw.slice(4, endIndex).trim();
  const body = raw.slice(endIndex + 4).trim();
  const frontmatter: ParsedFrontmatter = {};

  for (const line of frontmatterBlock.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) {
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();

    if (rawValue.startsWith("[")) {
      frontmatter[key] = parseStringArray(rawValue);
      continue;
    }

    if (rawValue === "true" || rawValue === "false") {
      frontmatter[key] = parseBoolean(rawValue);
      continue;
    }

    frontmatter[key] = rawValue.replace(/^["']|["']$/g, "");
  }

  return { frontmatter, body };
}

function buildPost(meta: ParsedFrontmatter, body: string, lang: BlogLang, fallbackSlug: string): BlogPost {
  return {
    title: String(meta.title ?? fallbackSlug),
    slug: String(meta.slug ?? fallbackSlug),
    lang,
    date: String(meta.date ?? ""),
    updated: String(meta.updated ?? meta.date ?? ""),
    description: String(meta.description ?? ""),
    tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
    category: String(meta.category ?? "General"),
    draft: Boolean(meta.draft ?? false),
    canonical: String(meta.canonical ?? ""),
    pairSlug: String(meta.pairSlug ?? ""),
    ctaVariant: String(meta.ctaVariant ?? "default"),
    body
  };
}

function toCategoryDefinition(config: CategoryConfig, lang: BlogLang): BlogCategoryDefinition {
  return {
    key: config.key,
    slug: config.slug,
    name: config.labels[lang],
    description: config.descriptions[lang]
  };
}

function getCategoryConfigByName(category: string): CategoryConfig | null {
  for (const config of BLOG_CATEGORY_CONFIG) {
    const labels = [config.labels.en, config.labels.ko];
    const aliases = [
      ...(config.aliases?.en ?? []),
      ...(config.aliases?.ko ?? [])
    ];

    if ([...labels, ...aliases].includes(category)) {
      return config;
    }
  }

  return null;
}

function getCategoryConfigBySlug(slug: string): CategoryConfig | null {
  return BLOG_CATEGORY_CONFIG.find((config) => config.slug === slug) ?? null;
}

async function readPostFile(lang: BlogLang, fileName: string): Promise<BlogPost> {
  const fullPath = path.join(BLOG_ROOT, lang, fileName);
  const raw = await readFile(fullPath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const fallbackSlug = fileName.replace(/\.mdx$/i, "");
  return buildPost(frontmatter, body, lang, fallbackSlug);
}

export async function getBlogPosts(lang: string): Promise<BlogPost[]> {
  const safeLang = assertBlogLang(lang);
  const dirPath = path.join(BLOG_ROOT, safeLang);
  const files = await readdir(dirPath);

  const posts = await Promise.all(
    files
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => readPostFile(safeLang, fileName))
  );

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlogPostBySlug(lang: string, slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts(lang);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getAllBlogParams(): Promise<Array<{ lang: BlogLang; slug: string }>> {
  const postsByLang = await Promise.all(BLOG_LANGS.map((lang) => getBlogPosts(lang)));

  return postsByLang.flatMap((posts, index) =>
    posts.map((post) => ({
      lang: BLOG_LANGS[index],
      slug: post.slug
    }))
  );
}

export async function getRecentPosts(limit = 6): Promise<BlogPost[]> {
  const allPosts = (await Promise.all(BLOG_LANGS.map((lang) => getBlogPosts(lang)))).flat();
  return allPosts.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function getBlogCategoryDefinitions(lang: string): BlogCategoryDefinition[] {
  const safeLang = assertBlogLang(lang);
  return BLOG_CATEGORY_CONFIG.map((config) => toCategoryDefinition(config, safeLang));
}

export async function getBlogCategories(lang: string): Promise<BlogCategorySummary[]> {
  const safeLang = assertBlogLang(lang);
  const posts = await getBlogPosts(safeLang);

  return BLOG_CATEGORY_CONFIG.map((config) => {
    const categoryPosts = posts.filter((post) => {
      const resolvedConfig = getCategoryConfigByName(post.category);
      return resolvedConfig?.key === config.key;
    });

    return {
      ...toCategoryDefinition(config, safeLang),
      count: categoryPosts.length,
      featuredPost: categoryPosts[0] ?? null,
      posts: categoryPosts
    };
  });
}

export async function getBlogCategoryPageData(
  lang: string,
  categorySlug: string
): Promise<{ category: BlogCategoryDefinition; posts: BlogPost[] } | null> {
  const safeLang = assertBlogLang(lang);
  const config = getCategoryConfigBySlug(categorySlug);
  if (!config) {
    return null;
  }

  const posts = await getBlogPosts(safeLang);
  const categoryPosts = posts.filter((post) => {
    const resolvedConfig = getCategoryConfigByName(post.category);
    return resolvedConfig?.key === config.key;
  });

  return {
    category: toCategoryDefinition(config, safeLang),
    posts: categoryPosts
  };
}

export async function getAllBlogCategoryParams(): Promise<Array<{ lang: BlogLang; category: string }>> {
  return BLOG_LANGS.flatMap((lang) =>
    BLOG_CATEGORY_CONFIG.map((config) => ({
      lang,
      category: config.slug
    }))
  );
}

