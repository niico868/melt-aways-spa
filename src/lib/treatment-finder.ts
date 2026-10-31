import type { Lead } from "@/lib/site";

export type FinderAnswers = {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  goals: string[];
  targetAreas: string[];
  timeline: "under-1-month" | "1-3-months" | "3-6-months" | "flexible" | "";
  concerns: string;
  pregnancy: "yes" | "no" | "na" | "";
  medications: string;
  preferredDate: string;
};

export const FINDER_GOALS = [
  "Fat reduction",
  "Skin tightening",
  "Anti-aging",
  "Weight loss support",
  "Body contouring",
  "Confidence rebuild",
];

export const FINDER_AREAS = [
  "Abdomen",
  "Love handles / flanks",
  "Back",
  "Thighs",
  "Arms",
  "Buttocks",
  "Chin / face",
  "Full body",
];

/** Lightweight rule-based recommender → returns a Melt Aways package name. */
export function suggestPackage(a: FinderAnswers): string {
  const g = a.goals.map((x) => x.toLowerCase());
  const has = (k: string) => g.some((x) => x.includes(k));

  if (has("weight loss")) return "Melt & Tighten";
  if (has("anti-aging") || has("skin tightening")) return "Glow & Firm";
  if (has("fat reduction") && has("body contouring")) return "Full Body Confidence";
  if (has("fat reduction")) return "Melt & Tighten";
  if (has("body contouring")) return "Sculpt & Smooth";
  return "Sculpt & Smooth";
}

/** Qualifies the lead for a free consultation. */
export function qualifiesForConsult(a: FinderAnswers): boolean {
  if (a.pregnancy === "yes") return false;
  return Boolean(a.fullName && (a.email || a.phone));
}

export function toLead(a: FinderAnswers, suggested: string): Lead {
  return {
    id: `lead_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "New Lead",
    fullName: a.fullName,
    phone: a.phone,
    email: a.email,
    location: "",
    concern: a.concerns,
    targetArea: a.targetAreas.join(", "),
    targetAreas: a.targetAreas,
    targetAreaOther: "",
    priorTreatments: "",
    medical: a.concerns,
    medication: a.medications,
    pregnancy: a.pregnancy,
    preferredDate: a.preferredDate,
    preferredTime: "",
    notes: `Treatment Finder — goals: ${a.goals.join(", ")}; timeline: ${a.timeline}; age: ${a.age}`,
    suggestedPackage: suggested,
  };
}