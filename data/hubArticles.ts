export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "bullets"; items: Array<{ label?: string; text: string }> }
  | { type: "summary"; items: string[] };

export type HubArticle = {
  slug: string;
  category: string;
  readTime: string;
  title: string;
  authorName: string;
  authorRole: string;
  headerGradient: string;
  pullQuote: string;
  blocks: ContentBlock[];
  nextSlug?: string;
  nextTitle?: string;
};

export const hubArticles: Record<string, HubArticle> = {
  "seoul-nights": {
    slug: "seoul-nights",
    category: "Culture & Night Life",
    readTime: "6 Min Read",
    title: "Seoul Nights",
    authorName: "Ji-ho Choi",
    authorRole: "Culture Correspondent",
    headerGradient: "linear-gradient(135deg, #f4258c 0%, #7c2ae8 50%, #00d4ff 100%)",
    pullQuote:
      '"The neon underworld of Gangnam is no longer just a backdrop — it is the runway itself."',
    blocks: [
      {
        type: "paragraph",
        text: "When the sun sets over the Han River, Seoul transforms into something altogether different. The city's daytime identity — efficient, tech-forward, business-centric — dissolves into a luminous spectacle that has become the defining aesthetic of the K-pop generation.",
      },
      {
        type: "heading",
        text: "Gangnam After Dark",
      },
      {
        type: "paragraph",
        text: "The streets of Gangnam pulse with a rhythm borrowed from the stage. Every alley between Apgujeong and Cheongdam hides a new pop-up, a secret bar, or a members-only salon where idols decompress after sold-out shows. For fans, navigating this world is the ultimate fan experience.",
      },
      {
        type: "bullets",
        items: [
          {
            label: "Club Volume",
            text: "Where the underground DJ scene intersects with idol culture every Friday.",
          },
          {
            label: "Cake Shop Terrace",
            text: "A rooftop dessert bar that doubles as a celebrity spotting hotspot.",
          },
          {
            label: "The Neon Alley",
            text: "A 200-meter stretch of pop art murals lit entirely by hand-painted neon tubes.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "This is a city that has turned nightlife into cultural currency. The experiences unlocked after midnight in Seoul — from spontaneous flash-mob performances to exclusive brand launch parties — are becoming as aspirational as the music itself.",
      },
      {
        type: "summary",
        items: [
          "Gangnam's after-dark scene is now inseparable from the global K-pop brand.",
          "Fan experiences in Seoul's night districts rival any concert venue.",
          "The city's neon aesthetic is increasingly influencing global visual trends.",
        ],
      },
    ],
    nextSlug: "stage-skin",
    nextTitle: "Stage Skin: The 10-Step Idol Routine",
  },

  "stage-skin": {
    slug: "stage-skin",
    category: "Beauty & Style",
    readTime: "5 Min Read",
    title: "The Digital Renaissance of K-Beauty",
    authorName: "Mina Park",
    authorRole: "Style Consultant",
    headerGradient: "linear-gradient(135deg, #f4258c 0%, #7c2ae8 50%, #00d4ff 100%)",
    pullQuote:
      '"AI isn\'t just changing how we see ourselves; it\'s redefining the very fabric of K-Pop visual storytelling."',
    blocks: [
      {
        type: "paragraph",
        text: 'The intersection of technology and aesthetic expression has reached a fever pitch in Seoul. As we navigate the 2024 fashion landscape, the "Virtual Idol" aesthetic is no longer confined to digital screens — it\'s bleeding into the streets of Hongdae and Gangnam.',
      },
      {
        type: "heading",
        text: "Synchronized Aesthetics",
      },
      {
        type: "paragraph",
        text: "In the world of K-Culture, style is rarely a solitary endeavor. It is a highly curated, synchronized experience. With the rise of AI-driven styling apps, fans can now achieve the precision of a professional K-Pop coordinator from their own devices.",
      },
      {
        type: "bullets",
        items: [
          {
            label: "Hyper-Personalization",
            text: "Algorithms that analyze facial features to suggest specific palette matches.",
          },
          {
            label: "Virtual Try-Ons",
            text: "Instant AR overlays of the latest stage outfits.",
          },
          {
            label: "Global Accessibility",
            text: "Breaking the geographical barriers of high-end Korean boutiques.",
          },
        ],
      },
      {
        type: "paragraph",
        text: 'This digital shift is fostering a new kind of "Readable Style" — where every element of an outfit tells a clear story, optimized for both the lens and the eye.',
      },
      {
        type: "summary",
        items: [
          "AI is democratizing luxury K-Pop styling for global fans.",
          "Digital identity is now as important as physical appearance.",
          "Seoul remains the epicenter of high-tech fashion innovation.",
        ],
      },
    ],
    nextSlug: "cafe-hopping",
    nextTitle: "Cafe Hopping: Yeonnam-dong Secrets",
  },

  "cafe-hopping": {
    slug: "cafe-hopping",
    category: "Hidden Spots",
    readTime: "4 Min Read",
    title: "Cafe Hopping: Yeonnam-dong Secrets",
    authorName: "Soo-yeon Lim",
    authorRole: "Travel & Lifestyle Editor",
    headerGradient: "linear-gradient(135deg, #ffeb3b 0%, #f4258c 80%)",
    pullQuote:
      '"Yeonnam-dong\'s cafes are not just places to drink coffee — they are installations, sets, and scenes."',
    blocks: [
      {
        type: "paragraph",
        text: "Tucked behind Hongdae's main strip, Yeonnam-dong has emerged as Seoul's most quietly radical neighborhood. Its grid of low-rise streets hides an ever-rotating cast of concept cafes that blur the line between retail, art, and hospitality.",
      },
      {
        type: "heading",
        text: "The Concept Cafe Phenomenon",
      },
      {
        type: "paragraph",
        text: "Unlike the chain-dominated coffee culture of other global cities, Yeonnam's cafes are singular visions — each one built around a specific aesthetic universe. You might find a space designed entirely around a 90s Korean drama, or one where every surface is covered in vintage vinyl.",
      },
      {
        type: "bullets",
        items: [
          {
            label: "Cafe Comma",
            text: "Known for its analog photography theme and in-house darkroom.",
          },
          {
            label: "Blossom & Brew",
            text: "Seasonal floral installations that change every two weeks.",
          },
          {
            label: "The Vinyl Den",
            text: "A record shop, listening bar, and specialty coffee experience combined.",
          },
        ],
      },
      {
        type: "summary",
        items: [
          "Yeonnam-dong is redefining what a cafe can be.",
          "Concept spaces draw both locals and international visitors.",
          "The neighborhood's aesthetic is becoming a benchmark for global café design.",
        ],
      },
    ],
    nextSlug: "glass-skin-guide",
    nextTitle: "Glass Skin Guide: 12k Fans Can't Be Wrong",
  },

  "glass-skin-guide": {
    slug: "glass-skin-guide",
    category: "K-Beauty",
    readTime: "7 Min Read",
    title: "Glass Skin Guide",
    authorName: "Ye-jin Kang",
    authorRole: "K-Beauty Expert",
    headerGradient: "linear-gradient(135deg, #f4258c 0%, #4a0030 100%)",
    pullQuote:
      '"Glass skin is not a trend. It is a philosophy — the belief that your skin can reflect light the way a prism does."',
    blocks: [
      {
        type: "paragraph",
        text: "The glass skin trend has officially crossed from niche K-beauty subculture into mainstream consciousness. Characterized by an almost translucent, luminous complexion, glass skin requires patience, consistency, and a surprisingly simple roster of products.",
      },
      {
        type: "heading",
        text: "The 10-Step Foundation",
      },
      {
        type: "paragraph",
        text: "While the term '10-step routine' can feel daunting, the Korean approach to skincare is less about the number of products and more about the intentionality behind each layer. Every step serves a purpose: cleanse, balance, hydrate, treat, and protect.",
      },
      {
        type: "bullets",
        items: [
          { label: "Double Cleanse", text: "Oil cleanser followed by a foam cleanser removes all traces of makeup and pollution." },
          { label: "Toner", text: "Balances pH and preps skin for maximum absorption of subsequent products." },
          { label: "Essence", text: "The cornerstone of K-beauty — a lightweight treatment that boosts cell turnover." },
          { label: "Sheet Mask", text: "Weekly deep hydration that creates the signature glass-like finish." },
        ],
      },
      {
        type: "summary",
        items: [
          "Glass skin is about consistency above all else.",
          "Hydration layering is more effective than single heavy moisturizers.",
          "SPF is non-negotiable for maintaining luminosity long-term.",
        ],
      },
    ],
    nextSlug: "munja-do-art",
    nextTitle: "Munja-do Art: Korea's Hidden Calligraphy Trend",
  },

  "munja-do-art": {
    slug: "munja-do-art",
    category: "Trending",
    readTime: "3 Min Read",
    title: "Munja-do Art: Korea's Hidden Calligraphy Trend",
    authorName: "Tae-yang Oh",
    authorRole: "Art & Culture Writer",
    headerGradient: "linear-gradient(135deg, #1f0f17 0%, #f4258c 100%)",
    pullQuote:
      '"Munja-do transforms Hangul into something sacred — each brushstroke carrying the weight of centuries."',
    blocks: [
      {
        type: "paragraph",
        text: "Munja-do, the ancient Korean art of painting characters imbued with moral virtue, is experiencing a quiet but powerful renaissance. Once confined to palace walls and scholarly texts, it is now appearing on gallery walls, streetwear, and digital art platforms.",
      },
      {
        type: "heading",
        text: "Old Letters, New Walls",
      },
      {
        type: "paragraph",
        text: "Young Korean artists are reclaiming Munja-do as a vehicle for contemporary expression. By fusing traditional Hangul brushwork with neon palettes and streetwear aesthetics, they are creating a visual language that is unmistakably Korean yet globally legible.",
      },
      {
        type: "summary",
        items: [
          "Munja-do is bridging traditional Korean art and global streetwear culture.",
          "Young artists are leading the revival with bold, modern interpretations.",
          "Hangul calligraphy is increasingly featured in international design and fashion.",
        ],
      },
    ],
    nextSlug: "retro-pop",
    nextTitle: "Retro Pop: The Sound Defining 2024",
  },

  "retro-pop": {
    slug: "retro-pop",
    category: "Music",
    readTime: "4 Min Read",
    title: "Retro Pop: The Sound Defining 2024",
    authorName: "Da-eun Song",
    authorRole: "Music Critic",
    headerGradient: "linear-gradient(135deg, #00d2ff 0%, #7c2ae8 100%)",
    pullQuote:
      '"The synth lines of the 80s never went away — K-pop just gave them a new home."',
    blocks: [
      {
        type: "paragraph",
        text: "Across Korea's biggest stages and smallest streaming playlists, a retro-inflected sound is dominating 2024. Borrowing liberally from Japanese city pop, American synth-funk, and classic Eurodisco, the new wave of K-pop retro pop is less nostalgia and more reinvention.",
      },
      {
        type: "heading",
        text: "The Architecture of Retro Pop",
      },
      {
        type: "paragraph",
        text: "What makes this trend work is its production precision. These aren't simple throwbacks — they are painstakingly constructed sonic references filtered through K-pop's signature attention to detail: the perfect hook, the choreography-sync beat drop, the layered vocal harmony.",
      },
      {
        type: "bullets",
        items: [
          { label: "Synth Bass", text: "Punchy, analog-style bass lines that anchor every track." },
          { label: "City Pop Chords", text: "Lush, jazz-influenced chord progressions borrowed from late-70s Japan." },
          { label: "Disco Strings", text: "Sweeping string arrangements that add cinematic scale." },
        ],
      },
      {
        type: "summary",
        items: [
          "Retro pop is K-pop's most globally accessible sound yet.",
          "Production quality is what separates revival from mere nostalgia.",
          "The trend is driving renewed interest in 70s and 80s pop globally.",
        ],
      },
    ],
    nextSlug: "gen-z-hallyu",
    nextTitle: "Gen Z Hallyu: The New Wave",
  },

  "gen-z-hallyu": {
    slug: "gen-z-hallyu",
    category: "Weekly Digest",
    readTime: "5 Min Read",
    title: "Gen Z Hallyu: The New Wave",
    authorName: "Na-rae Shin",
    authorRole: "Culture Analyst",
    headerGradient: "linear-gradient(135deg, #ffeb3b 0%, #f4258c 100%)",
    pullQuote:
      '"Gen Z didn\'t discover Hallyu — they became it."',
    blocks: [
      {
        type: "paragraph",
        text: "The Hallyu wave — South Korea's cultural export phenomenon — has entered a new phase. Driven by a generation that grew up with BTS, Blackpink, and Parasite as cultural reference points, the new Hallyu is more personal, more participatory, and more global than ever.",
      },
      {
        type: "heading",
        text: "From Consumer to Creator",
      },
      {
        type: "paragraph",
        text: "What defines Gen Z's relationship with Korean culture is not passive consumption but active co-creation. TikTok covers, fan art, translated lyric threads, and AI-generated idol aesthetics are now as much a part of the Hallyu ecosystem as the original content itself.",
      },
      {
        type: "bullets",
        items: [
          { label: "Fan Creativity", text: "Gen Z fans produce millions of derivative works annually across all platforms." },
          { label: "Language Learning", text: "Korean is now the fastest-growing language on Duolingo globally." },
          { label: "Fashion Adoption", text: "K-fashion aesthetics are influencing mainstream retail from Zara to Uniqlo." },
        ],
      },
      {
        type: "summary",
        items: [
          "Gen Z sees Korean culture as a framework for self-expression, not just entertainment.",
          "Participation and co-creation define the new Hallyu.",
          "The movement is accelerating the global influence of Korean language and fashion.",
        ],
      },
    ],
    nextSlug: "seoul-nights",
    nextTitle: "Seoul Nights: Inside the Neon Underworld",
  },
};
