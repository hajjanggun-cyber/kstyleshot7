import type { HairStyle } from "@/types";

export const hairStyles: HairStyle[] = [
  {
    id: "hush-cut",
    name: "Hush Cut",
    thumbnail: "/samples/hair-hush-cut.svg",
    prompt: "K-style editorial portrait with a soft hush cut and glossy layers.",
    tags: ["soft", "layered", "editorial"]
  },
  {
    id: "curtain-bangs",
    name: "Curtain Bangs",
    thumbnail: "/samples/hair-curtain-bangs.svg",
    prompt: "K-style editorial portrait with curtain bangs and clean volume.",
    tags: ["bangs", "volume"]
  },
  {
    id: "see-through-bangs",
    name: "See-Through Bangs",
    thumbnail: "/samples/hair-see-through-bangs.svg",
    prompt: "K-style editorial portrait with wispy see-through bangs.",
    tags: ["bangs", "light"]
  },
  {
    id: "soft-wolf-cut",
    name: "Soft Wolf Cut",
    thumbnail: "/samples/hair-soft-wolf-cut.svg",
    prompt: "K-style editorial portrait with a soft wolf cut and movement.",
    tags: ["trendy", "textured"]
  }
];
