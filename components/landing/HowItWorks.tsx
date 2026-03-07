"use client";

import { useTranslations } from "next-intl";

type StepItem = {
  icon: string;
  colorVar?: string;
  gradient?: boolean;
};

const STEPS: StepItem[] = [
  { icon: "📸", colorVar: "#FF4EBD" },
  { icon: "✂️", colorVar: "#9D50FF" },
  { icon: "🏙️", colorVar: "#38bdf8" },
  { icon: "✨", gradient: true },
];

export function HowItWorks() {
  const t = useTranslations("landing.how");

  const labels = [
    t("step1.title"),
    t("step2.title"),
    t("step3.title"),
    t("step4.title"),
  ];

  return (
    <section className="lp-steps card">
      <h3 className="lp-steps-head">{t("sectionTitle")}</h3>
      <div className="lp-steps-list">
        {STEPS.map((step, i) => (
          <div className="lp-step-row" key={i}>
            <div
              className={`lp-step-icon${step.gradient ? " lp-step-icon--gradient" : ""}`}
              style={!step.gradient && step.colorVar ? { borderColor: `${step.colorVar}44`, color: step.colorVar } : {}}
            >
              {step.icon}
            </div>
            <div>
              <p className="lp-step-num">Step 0{i + 1}</p>
              <h4 className="lp-step-label">{labels[i]}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
