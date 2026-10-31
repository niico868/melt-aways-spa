import morpheus from "@/assets/certs/Morpheus_8.png.asset.json";
import buttLifting from "@/assets/certs/Butt_Lifting.png.asset.json";
import fatDissolving from "@/assets/certs/Fat_Dissolving.png.asset.json";
import breastAug from "@/assets/certs/Breast_Augmentation.png.asset.json";
import stretchMark from "@/assets/certs/Stretch_Mark_Therapy.png.asset.json";
import microneedling from "@/assets/certs/Micro-needling.png.asset.json";
import basicFacial from "@/assets/certs/Basic_Facial.png.asset.json";
import cavitation from "@/assets/certs/Cavitation.png.asset.json";
import phlebotomy from "@/assets/certs/Phlebotomy.png.asset.json";

export type Certification = {
  id: string;
  course: string;
  institution: string;
  date: string;
  year: number;
  certificate: string;
  skills: string[];
};

export const INSTITUTIONS = [
  "AJ's Body Concept",
  "iLaB Lashes Brows & Beauty Studio",
  "Synergy Training Institute",
  "Body N Beauty by K",
  "Toronto Beauty Academy",
  "School of Advanced Esthetics",
] as const;

export const CATEGORY_PILLS = [
  "Advanced Body Contouring",
  "Skin Tightening",
  "Facial Treatments",
  "Microneedling",
  "Medical Aesthetic Techniques",
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: "morpheus8",
    course: "Morpheus 8",
    institution: "AJ's Body Concept",
    date: "29 October 2025",
    year: 2025,
    certificate: morpheus.url,
    skills: ["RF microneedling", "Skin remodelling", "Deep tissue tightening"],
  },
  {
    id: "lemon-bottle",
    course: "Lemon Bottle Fat Dissolving",
    institution: "AJ's Body Concept",
    date: "26 October 2024",
    year: 2024,
    certificate: fatDissolving.url,
    skills: ["Fat dissolving protocols", "Client assessment", "Aftercare"],
  },
  {
    id: "butt-breast-aug",
    course: "Butt & Breast Augmentation (Sculptra / HA)",
    institution: "AJ's Body Concept",
    date: "26 September 2024",
    year: 2024,
    certificate: breastAug.url,
    skills: ["Sculptra technique", "Hyaluronic acid", "Volume enhancement"],
  },
  {
    id: "sqt-microneedling",
    course: "SQT Bio Microneedling",
    institution: "School of Advanced Esthetics",
    date: "18 November 2024",
    year: 2024,
    certificate: microneedling.url,
    skills: ["Bio microneedling", "Advanced protocols", "Skin rejuvenation"],
  },
  {
    id: "stretch-mark",
    course: "Stretch Mark Therapy",
    institution: "Toronto Beauty Academy",
    date: "3 March 2024",
    year: 2024,
    certificate: stretchMark.url,
    skills: ["Stretch mark rejuvenation", "Skin resurfacing", "Consultation"],
  },
  {
    id: "basic-facial",
    course: "Basic Facial Course",
    institution: "Body N Beauty by K",
    date: "21 May 2023",
    year: 2023,
    certificate: basicFacial.url,
    skills: ["Anatomy & physiology", "Facial massage", "Mask therapy", "Extractions", "Sanitation"],
  },
  {
    id: "butt-lifting",
    course: "Butt Lifting Training",
    institution: "Kams Body Spa",
    date: "8 May 2022",
    year: 2022,
    certificate: buttLifting.url,
    skills: ["Butt lifting technique", "Body contouring fundamentals"],
  },
  {
    id: "cavitation-rf",
    course: "Ultrasonic Cavitation, RF, Lipo Laser & Lymphatic Drainage",
    institution: "iLaB Lashes Brows & Beauty Studio",
    date: "27 January 2026",
    year: 2026,
    certificate: cavitation.url,
    skills: [
      "Ultrasonic cavitation",
      "RF skin tightening",
      "Low-level laser therapy",
      "Lymphatic drainage",
    ],
  },
  {
    id: "phlebotomy",
    course: "Phlebotomy",
    institution: "Synergy Training Institute",
    date: "22 March 2026",
    year: 2026,
    certificate: phlebotomy.url,
    skills: ["Venipuncture", "Sample handling", "Clinical safety"],
  },
];

export const CERT_COUNT = CERTIFICATIONS.length;

export const CREDENTIAL_TAGS: { id: string; label: string }[] = [
  { id: "morpheus8",         label: "Morpheus8" },
  { id: "lemon-bottle",      label: "Lemon Bottle" },
  { id: "cavitation-rf",     label: "Cavitation" },
  { id: "cavitation-rf",     label: "RF Skin Tightening" },
  { id: "cavitation-rf",     label: "Lymphatic Drainage" },
  { id: "sqt-microneedling", label: "Bio Microneedling" },
  { id: "stretch-mark",      label: "Stretch Mark Therapy" },
  { id: "butt-breast-aug",   label: "Butt Enhancement" },
  { id: "basic-facial",      label: "Basic Facial" },
];

export const TREATMENT_MAP: { treatment: string; certified: boolean }[] = [
  { treatment: "Cavitation",           certified: true },
  { treatment: "RF Skin Tightening",   certified: true },
  { treatment: "Lipo Laser",           certified: true },
  { treatment: "Morpheus8",            certified: true },
  { treatment: "Microneedling",        certified: true },
  { treatment: "Lemon Bottle",         certified: true },
  { treatment: "Lymphatic Drainage",   certified: true },
  { treatment: "Stretch Mark Therapy", certified: true },
  { treatment: "Facial Treatments",    certified: true },
];
