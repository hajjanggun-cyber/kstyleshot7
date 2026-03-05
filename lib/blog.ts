import { access, readdir, readFile } from "node:fs/promises";
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
  heroImage: string;
  heroAlt: string;
  heroPromptId: string;
  galleryImages: string[];
  galleryAlts: string[];
  galleryPromptIds: string[];
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
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const BLOG_LANGS: BlogLang[] = ["en", "ko"];
const MIN_GALLERY_IMAGE_COUNT = 6;
const assetExistsCache = new Map<string, Promise<boolean>>();
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
      ko: "서비스 흐름, 업로드 기준, 결과 기대치, 환불 정책을 먼저 확인하는 안내 카테고리입니다."
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
      ko: "얼굴선 정리, 앞머리, 레이어드, 실패 확률이 낮은 헤어 선택을 다루는 핵심 카테고리입니다."
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
      ko: "조명, 각도, 구도, 거리 세팅으로 업로드 품질을 높이는 실전 촬영 팁 모음입니다."
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
      ko: "가벼운 베이스, 피부결 정리, 얼굴 밸런스 체크로 셀카 준비를 돕는 카테고리입니다."
    }
  },
  {
    key: "outfit-styling",
    slug: "outfit-styling",
    labels: {
      en: "Outfit / Styling",
      ko: "의상 / 스타일링"
    },
    descriptions: {
      en: "Outfit silhouettes, necklines, color temperature, and cleaner camera-friendly styling.",
      ko: "실루엣, 넥라인, 색온도, 배경 매칭까지 다루는 카메라 친화 스타일링 허브입니다."
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
      ko: "장소 무드, 공간 톤, 배경 선택에 따른 결과 차이를 다루는 배경 중심 카테고리입니다."
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
      ko: "봄, 여름, 가을, 겨울 시즌 변화에 맞춘 스타일 가이드를 다루는 트렌드 카테고리입니다."
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
  const normalizedRaw = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!normalizedRaw.startsWith("---")) {
    return { frontmatter: {}, body: normalizedRaw.trim() };
  }

  const endIndex = normalizedRaw.indexOf("\n---", 3);
  if (endIndex === -1) {
    return { frontmatter: {}, body: normalizedRaw.trim() };
  }

  const frontmatterBlock = normalizedRaw.slice(4, endIndex).trim();
  const body = normalizedRaw.slice(endIndex + 4).trim();
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

function parseMediaArray(
  value: string | string[] | boolean | undefined
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 10);
}

function buildPost(meta: ParsedFrontmatter, body: string, lang: BlogLang, fallbackSlug: string): BlogPost {
  const slug = String(meta.slug ?? fallbackSlug);
  const heroImage = String(meta.heroImage ?? `/blog/hero/${slug}.webp`);
  const heroAlt = String(meta.heroAlt ?? String(meta.title ?? fallbackSlug));
  const heroPromptId = String(
    meta.heroPromptId ?? (slug.endsWith("-ko") ? slug.slice(0, -3) : slug)
  );
  const galleryImages = parseMediaArray(meta.galleryImages);
  const galleryAlts = parseMediaArray(meta.galleryAlts);
  const galleryPromptIds = parseMediaArray(meta.galleryPromptIds);

  return {
    title: String(meta.title ?? fallbackSlug),
    slug,
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
    heroImage,
    heroAlt,
    heroPromptId,
    galleryImages,
    galleryAlts,
    galleryPromptIds,
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

export function getBlogCategorySlug(category: string): string | null {
  return getCategoryConfigByName(category)?.slug ?? null;
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

function toPublicFilePath(assetUrl: string): string | null {
  if (!assetUrl || !assetUrl.startsWith("/")) {
    return null;
  }

  const normalized = assetUrl.split("#")[0].split("?")[0];
  if (!normalized) {
    return null;
  }

  return path.join(PUBLIC_ROOT, normalized.replace(/^\//, ""));
}

async function fileExists(absolutePath: string | null): Promise<boolean> {
  if (!absolutePath) {
    return false;
  }

  if (!assetExistsCache.has(absolutePath)) {
    assetExistsCache.set(
      absolutePath,
      access(absolutePath)
        .then(() => true)
        .catch(() => false)
    );
  }

  return assetExistsCache.get(absolutePath) as Promise<boolean>;
}

async function isPublishReady(post: BlogPost): Promise<boolean> {
  if (post.draft) {
    return false;
  }

  const heroReady = await fileExists(toPublicFilePath(post.heroImage));
  if (!heroReady) {
    return false;
  }

  const galleryImages = post.galleryImages.filter(Boolean);
  if (galleryImages.length < MIN_GALLERY_IMAGE_COUNT) {
    return false;
  }

  const galleryReady = await Promise.all(
    galleryImages.map((imageUrl) => fileExists(toPublicFilePath(imageUrl)))
  );

  return galleryReady.every(Boolean);
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
  const ready = await Promise.all(posts.map((post) => isPublishReady(post)));

  return posts.filter((_, index) => ready[index]).sort((a, b) => b.date.localeCompare(a.date));
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

