"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { outfits } from "@/data/outfits";
import { useCreateStore } from "@/store/createStore";

type Category = "stage" | "street" | "award";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "stage", label: "Stage Outfits" },
  { key: "street", label: "Street K-Style" },
  { key: "award", label: "Award Show" },
];

const COMPLETE_LOOK = [
  {
    title: "Visual Inspiration",
    sub: 'How the selected outfit styles on stage',
    color: "linear-gradient(160deg, #0a0a1a, #1a2a40, #0d2040)",
  },
  {
    title: "Street Lookbook",
    sub: "Mix & match with your current selection",
    color: "linear-gradient(160deg, #1a3a1a, #2a5a30, #1a4020)",
  },
];

export function OutfitFlow() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang ?? "en";

  const { photoBlobUrl, hair, setOutfitChosen, pickOutfit, setStatus } = useCreateStore();

  const [activeCategory, setActiveCategory] = useState<Category>("stage");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const filtered = outfits.filter((o) => o.category === activeCategory);
  const selectedOutfit = outfits.find((o) => o.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id === selectedId ? null : id);
  }

  async function handleApply() {
    if (isApplying) return;
    // TODO: restore — if (!selectedId || isApplying) return;
    setIsApplying(true);
    const chosen = selectedId ?? "demo-outfit";
    setOutfitChosen([chosen]);
    pickOutfit(chosen);
    setStatus("location_selecting");
    await new Promise((resolve) => setTimeout(resolve, 400));
    router.push(`/${lang}/create/location`);
  }

  if (!hair.chosen.length) {
    return (
      <div className="ot-root">
        <nav className="ot-nav">
          <Link className="ot-back-btn" href={`/${lang}/create/hair`}>←</Link>
          <h2 className="ot-nav-title">Step 3: Choose Your Outfit</h2>
          <div className="ot-nav-spacer" />
        </nav>
        <div className="ot-missing">
          <p>Please select a hair style first.</p>
          <Link className="ot-missing-link" href={`/${lang}/create/hair`}>
            ← Go to Hair Styling
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ot-root">
      {/* Nav */}
      <nav className="ot-nav">
        <Link className="ot-back-btn" href={`/${lang}/create/hair`}>←</Link>
        <h2 className="ot-nav-title">Step 3: Choose Your Outfit</h2>
        <div className="ot-nav-spacer" />
      </nav>

      {/* Progress dots — 3rd active */}
      <div className="ot-dots">
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--done" />
        <div className="ot-dot ot-dot--active" />
        <div className="ot-dot" />
      </div>

      {/* User avatar preview */}
      <div className="ot-avatar-wrap">
        <div className="ot-avatar-ring">
          {photoBlobUrl ? (
            <img alt="Your photo" className="ot-avatar-img" src={photoBlobUrl} />
          ) : (
            <div className="ot-avatar-placeholder">👤</div>
          )}
          <span className="ot-avatar-badge">✦</span>
        </div>
        <h2 className="ot-avatar-title">Looking Iconic!</h2>
        <p className="ot-avatar-sub">
          Now select an outfit to complete your debut look
        </p>
      </div>

      {/* Sticky category tabs */}
      <div className="ot-tabs-wrap">
        <div className="ot-tabs">
          {CATEGORIES.map((cat) => (
            <button
              className={`ot-tab${activeCategory === cat.key ? " ot-tab--active" : ""}`}
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit grid */}
      <div className="ot-grid">
        {filtered.map((outfit) => {
          const isSelected = selectedId === outfit.id;
          return (
            <button
              className={`ot-card${isSelected ? " ot-card--selected" : ""}`}
              key={outfit.id}
              onClick={() => handleSelect(outfit.id)}
              type="button"
            >
              <div
                className="ot-card-img"
                style={{
                  backgroundImage: outfit.thumbnail
                    ? `url(${outfit.thumbnail})`
                    : outfit.colorHint,
                }}
              />
              <div className="ot-card-info">
                <div className="ot-card-name-row">
                  <span className="ot-card-name">{outfit.name}</span>
                  {isSelected ? (
                    <span className="ot-card-check">✓</span>
                  ) : null}
                </div>
                <span className="ot-card-sub">{outfit.description}</span>
              </div>
              {!isSelected ? (
                <span className="ot-card-heart">♡</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Complete the Look */}
      <div className="ot-complete">
        <h3 className="ot-complete-title">
          <span className="ot-complete-star">✦</span>
          Complete the Look
        </h3>
        <div className="ot-complete-scroll">
          {COMPLETE_LOOK.map((item, i) => (
            <div className="ot-inspire-card" key={i}>
              <div
                className="ot-inspire-img"
                style={{ backgroundImage: item.color }}
              />
              <p className="ot-inspire-name">{item.title}</p>
              <p className="ot-inspire-sub">
                {i === 0 && selectedOutfit
                  ? `How the "${selectedOutfit.name}" outfit styles on stage`
                  : item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom */}
      <div className="ot-bottom">
        <button
          className="up-next-btn up-next-btn--active"
          disabled={isApplying}
          onClick={handleApply}
          type="button"
        >
          {isApplying ? "Applying…" : "Next Step →"}
        </button>
      </div>
    </div>
  );
}
