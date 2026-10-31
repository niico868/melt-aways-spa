export const VIP_GOALS = [
  "Stubborn fat reduction",
  "Body contouring or definition",
  "Muscle toning",
  "Loose or firmer-looking skin",
  "Lymphatic support",
  "Laser hair removal",
  "Red light therapy",
  "Postpartum body concerns",
  "General wellness support",
  "Preparing for a wedding, Carnival, vacation or special event",
  "I am not sure which treatment I need",
  "Other",
] as const;

export const VIP_AREAS = [
  "Abdomen",
  "Waist",
  "Back",
  "Arms",
  "Thighs",
  "Hips",
  "Buttocks",
  "Face, neck or chin",
  "Full body",
  "Postpartum area",
  "Not sure",
  "Other",
] as const;

export const VIP_HEALTH_QUESTIONS = [
  { key: "pregnancy", label: "Are you currently pregnant, breastfeeding or recently postpartum?" },
  { key: "doctor_care", label: "Are you currently under a doctor's care?" },
  { key: "conditions", label: "Do you have any diagnosed medical conditions that may affect treatment?" },
  { key: "implants", label: "Do you have a pacemaker, metal implants or another implanted medical device?" },
  { key: "surgery", label: "Have you had surgery within the past 12 months?" },
  { key: "medication", label: "Are you taking medication, injections or supplements the practitioner should know about?" },
  { key: "adverse", label: "Have you experienced an adverse reaction to an aesthetic or wellness treatment?" },
  { key: "allergies", label: "Do you have allergies or skin sensitivities relevant to treatment?" },
  { key: "weight_change", label: "Have you experienced significant recent weight changes?" },
] as const;

export type YesNo = "yes" | "no" | "";

export type VipHealthAnswer = { answer: YesNo; details: string };

export type VipFormState = {
  // Step 1
  full_name: string;
  phone: string;
  email: string;
  preferred_contact: "Call" | "WhatsApp" | "Email" | "";
  location: string;
  preferred_date: string;
  preferred_time: string;
  // Step 2
  goals: string[];
  goals_other: string;
  primary_goal: string;
  target_areas: string[];
  target_areas_other: string;
  worthwhile: string;
  prior_treatments: YesNo;
  prior_treatments_detail: string;
  event_related: string;
  event_date: string;
  current_weight: string;
  goal_weight: string;
  // Step 3
  start_period: string;
  weekly_ok: YesNo;
  biweekly_ok: YesNo;
  best_days: string;
  open_three_months: YesNo;
  open_six_months: YesNo;
  monthly_payment_ok: YesNo;
  wants_payment_info: YesNo;
  support_level: string;
  attendance_barriers: string;
  // Step 4
  health: Record<string, VipHealthAnswer>;
  health_other: string;
  // Step 5
  confirm_accurate: boolean;
  confirm_not_guaranteed: boolean;
  confirm_consultation_required: boolean;
  consent_contact: boolean;
  confirm_privacy: boolean;
};

export const VIP_START_PERIODS = [
  "As soon as possible",
  "Within 1 month",
  "In 1–3 months",
  "In 3–6 months",
  "Not sure yet",
];

export const emptyVipForm = (): VipFormState => ({
  full_name: "",
  phone: "",
  email: "",
  preferred_contact: "",
  location: "El Dorado",
  preferred_date: "",
  preferred_time: "",
  goals: [],
  goals_other: "",
  primary_goal: "",
  target_areas: [],
  target_areas_other: "",
  worthwhile: "",
  prior_treatments: "",
  prior_treatments_detail: "",
  event_related: "",
  event_date: "",
  current_weight: "",
  goal_weight: "",
  start_period: "",
  weekly_ok: "",
  biweekly_ok: "",
  best_days: "",
  open_three_months: "",
  open_six_months: "",
  monthly_payment_ok: "",
  wants_payment_info: "",
  support_level: "",
  attendance_barriers: "",
  health: {},
  health_other: "",
  confirm_accurate: false,
  confirm_not_guaranteed: false,
  confirm_consultation_required: false,
  consent_contact: false,
  confirm_privacy: false,
});

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
export const phoneDigits = (v: string) => v.replace(/\D/g, "");

/** Returns a map of field -> error message for the given step (1-indexed). */
export function validateVipStep(step: number, f: VipFormState): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 1) {
    if (f.full_name.trim().length < 2) e.full_name = "Please enter your full name.";
    const d = phoneDigits(f.phone);
    if (d.length < 7 || d.length > 15) e.phone = "Please enter a valid phone number.";
    if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address.";
    if (!f.preferred_contact) e.preferred_contact = "Please choose a preferred contact method.";
    if (!f.preferred_date) e.preferred_date = "Please choose a preferred consultation date.";
    if (!f.preferred_time) e.preferred_time = "Please choose a preferred consultation time.";
  }
  if (step === 2) {
    if (f.goals.length === 0) e.goals = "Please select at least one goal.";
    if (f.goals.includes("Other") && !f.goals_other.trim()) e.goals_other = "Please tell us more.";
    if (!f.primary_goal) e.primary_goal = "Please choose your highest priority goal.";
    if (f.target_areas.length === 0) e.target_areas = "Please select at least one area.";
    if (f.target_areas.includes("Other") && !f.target_areas_other.trim()) e.target_areas_other = "Please tell us more.";
    if (f.prior_treatments === "") e.prior_treatments = "Please answer this question.";
    if (f.prior_treatments === "yes" && !f.prior_treatments_detail.trim())
      e.prior_treatments_detail = "Please tell us which treatments and your experience.";
  }
  if (step === 3) {
    if (!f.start_period) e.start_period = "Please choose when you would like to begin.";
    if (f.weekly_ok === "") e.weekly_ok = "Please answer this question.";
    if (f.biweekly_ok === "") e.biweekly_ok = "Please answer this question.";
    if (f.open_three_months === "") e.open_three_months = "Please answer this question.";
    if (f.open_six_months === "") e.open_six_months = "Please answer this question.";
    if (f.monthly_payment_ok === "") e.monthly_payment_ok = "Please answer this question.";
  }
  if (step === 4) {
    for (const q of VIP_HEALTH_QUESTIONS) {
      const a = f.health[q.key];
      if (!a || a.answer === "") e[`health_${q.key}`] = "Please answer this question.";
      else if (a.answer === "yes" && !a.details.trim()) e[`health_${q.key}_details`] = "Please add a short detail.";
    }
  }
  if (step === 5) {
    if (!f.confirm_accurate) e.confirm_accurate = "Required.";
    if (!f.confirm_not_guaranteed) e.confirm_not_guaranteed = "Required.";
    if (!f.confirm_consultation_required) e.confirm_consultation_required = "Required.";
    if (!f.consent_contact) e.consent_contact = "Required.";
    if (!f.confirm_privacy) e.confirm_privacy = "Required.";
  }
  return e;
}
