// Seasonal campaign logic for Melt Aways.
// Adjust the date windows here to retune which season is active.

export type Season = {
  key: string;
  title: string;
  description: string;
  cta: string;
  href: string;
};

export const SEASONS: Record<string, Season> = {
  carnival: {
    key: "carnival",
    title: "Get Ready For Carnival",
    description:
      "Body contouring, skin tightening, slimming treatments, lymphatic drainage, and consultation support for clients preparing months or weeks before the season.",
    cta: "Plan My Carnival Prep",
    href: "/booking",
  },
  christmas: {
    key: "christmas",
    title: "Christmas & Holiday Body Prep",
    description:
      "Treatments for clients coming home, attending events, taking photos, or wanting to feel more confident before the holiday season.",
    cta: "Plan My Holiday Prep",
    href: "/booking",
  },
  summer: {
    key: "summer",
    title: "Vacation & Summer Prep",
    description:
      "Treatments for clients preparing for beach days, trips, birthdays, and resort stays.",
    cta: "Plan My Summer Prep",
    href: "/booking",
  },
  wedding: {
    key: "wedding",
    title: "Wedding & Birthday Prep",
    description:
      "Treatment planning for clients who want a cleaner, more confident look before a major day.",
    cta: "Plan My Special Day",
    href: "/booking",
  },
  birthday: {
    key: "birthday",
    title: "Birthday Treatment Prep",
    description:
      "Treatment planning for clients who want to feel more confident, polished, and ready before their birthday or special celebration.",
    cta: "Plan My Birthday Prep",
    href: "/booking",
  },
};

// Determine active season based on Trinidad event calendar.
// Carnival: Jan to mid March (safe default)
// Summer/vacation: Jun to Aug
// Wedding: Sep to Oct
// Christmas: Nov to Dec
// Fallback: Birthday Treatment Prep
export function getActiveSeason(date: Date = new Date()): Season {
  const m = date.getMonth() + 1; // 1-12
  if (m >= 1 && m <= 3) return SEASONS.carnival;
  if (m >= 6 && m <= 8) return SEASONS.summer;
  if (m === 9 || m === 10) return SEASONS.wedding;
  if (m === 11 || m === 12) return SEASONS.christmas;
  return SEASONS.birthday;
}