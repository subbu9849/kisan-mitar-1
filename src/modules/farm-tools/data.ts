/* ═══════════════════════════════════════════════════════════
   Farm Tools — shared reference data
   General, textbook-level agronomic figures (ICAR / state
   agriculture department style guidance) for common crops grown
   in Andhra Pradesh & Telangana. These are typical/average
   figures for planning purposes only — always clearly labeled as
   estimates, never precise chemical dosing. Real recommendations
   should come from a soil test or the local agriculture officer.
   ═══════════════════════════════════════════════════════════ */

export type Season = "Kharif" | "Rabi" | "Zaid (Summer)";

export interface CropInfo {
  name: string;
  season: Season[];
  sowingMonths: string; // human readable
  harvestMonths: string; // human readable
  durationDays: string;
  /** Typical recommended N-P-K, in kg per acre (general guidance, not a substitute for soil testing) */
  npkPerAcre: { n: number; p: number; k: number };
  /** Typical yield range, quintals (100kg) per acre, for the profit estimator's placeholder */
  typicalYieldQtlPerAcre: [number, number];
  notes?: string;
}

export const CROPS: CropInfo[] = [
  {
    name: "Paddy (Rice)",
    season: ["Kharif", "Rabi"],
    sowingMonths: "Jun–Jul (Kharif) or Nov–Dec (Rabi)",
    harvestMonths: "Oct–Nov (Kharif) or Mar–Apr (Rabi)",
    durationDays: "120–150 days",
    npkPerAcre: { n: 48, p: 24, k: 24 },
    typicalYieldQtlPerAcre: [20, 28],
  },
  {
    name: "Maize",
    season: ["Kharif", "Rabi"],
    sowingMonths: "Jun–Jul or Oct–Nov",
    harvestMonths: "Sep–Oct or Jan–Feb",
    durationDays: "90–110 days",
    npkPerAcre: { n: 48, p: 24, k: 16 },
    typicalYieldQtlPerAcre: [20, 30],
  },
  {
    name: "Cotton",
    season: ["Kharif"],
    sowingMonths: "May–Jun",
    harvestMonths: "Nov–Jan (picked in rounds)",
    durationDays: "160–200 days",
    npkPerAcre: { n: 40, p: 20, k: 20 },
    typicalYieldQtlPerAcre: [6, 10],
  },
  {
    name: "Groundnut",
    season: ["Kharif", "Rabi"],
    sowingMonths: "Jun–Jul or Jan–Feb",
    harvestMonths: "Oct–Nov or Apr–May",
    durationDays: "100–110 days",
    npkPerAcre: { n: 8, p: 16, k: 16 },
    typicalYieldQtlPerAcre: [8, 14],
    notes: "Groundnut fixes some of its own nitrogen, so N needs are low.",
  },
  {
    name: "Chilli",
    season: ["Kharif", "Rabi"],
    sowingMonths: "Jun–Jul (nursery) / Aug–Sep (transplant)",
    harvestMonths: "Dec–Mar (picked in rounds)",
    durationDays: "150–180 days",
    npkPerAcre: { n: 40, p: 24, k: 24 },
    typicalYieldQtlPerAcre: [6, 10],
  },
  {
    name: "Tomato",
    season: ["Kharif", "Rabi", "Zaid (Summer)"],
    sowingMonths: "Jun (nursery) or Oct–Nov or Jan–Feb",
    harvestMonths: "60–70 days after transplant, picked in rounds",
    durationDays: "90–120 days",
    npkPerAcre: { n: 40, p: 20, k: 20 },
    typicalYieldQtlPerAcre: [80, 140],
  },
  {
    name: "Onion",
    season: ["Rabi", "Kharif"],
    sowingMonths: "Oct–Nov (Rabi) or Jun–Jul (Kharif)",
    harvestMonths: "Feb–Mar or Oct–Nov",
    durationDays: "110–130 days",
    npkPerAcre: { n: 32, p: 16, k: 16 },
    typicalYieldQtlPerAcre: [60, 90],
  },
  {
    name: "Sugarcane",
    season: ["Kharif", "Rabi"],
    sowingMonths: "Dec–Feb (main) or Jun–Jul (adsali)",
    harvestMonths: "10–12 months after planting",
    durationDays: "300–365 days",
    npkPerAcre: { n: 100, p: 24, k: 40 },
    typicalYieldQtlPerAcre: [300, 400],
  },
  {
    name: "Bengal Gram (Chana)",
    season: ["Rabi"],
    sowingMonths: "Oct–Nov",
    harvestMonths: "Feb–Mar",
    durationDays: "90–100 days",
    npkPerAcre: { n: 8, p: 20, k: 8 },
    typicalYieldQtlPerAcre: [4, 7],
    notes: "A pulse crop — needs little nitrogen, fixes much of its own.",
  },
  {
    name: "Red Gram (Toor/Arhar)",
    season: ["Kharif"],
    sowingMonths: "Jun–Jul",
    harvestMonths: "Dec–Jan",
    durationDays: "150–180 days",
    npkPerAcre: { n: 8, p: 16, k: 8 },
    typicalYieldQtlPerAcre: [4, 7],
  },
  {
    name: "Sunflower",
    season: ["Kharif", "Rabi", "Zaid (Summer)"],
    sowingMonths: "Jun–Jul or Oct–Nov or Jan–Feb",
    harvestMonths: "90–100 days after sowing",
    durationDays: "90–100 days",
    npkPerAcre: { n: 24, p: 16, k: 16 },
    typicalYieldQtlPerAcre: [6, 9],
  },
  {
    name: "Turmeric",
    season: ["Kharif"],
    sowingMonths: "May–Jun",
    harvestMonths: "Jan–Mar",
    durationDays: "230–270 days",
    npkPerAcre: { n: 40, p: 24, k: 40 },
    typicalYieldQtlPerAcre: [70, 100],
  },
];

/** Straight fertilizers used to supply the N-P-K, with their nutrient content */
export const FERTILIZERS = {
  urea: { name: "Urea", nutrient: "N", content: 0.46 }, // 46% N
  dap: { name: "DAP", nutrient: "P", content: 0.46 }, // 46% P2O5 (also ~18% N, ignored for simplicity)
  mop: { name: "MOP (Muriate of Potash)", nutrient: "K", content: 0.6 }, // 60% K2O
};

export const CURRENT_MONTH_INDEX = new Date().getMonth(); // 0 = Jan

export const MONTH_TO_SEASON: Season[] = [
  "Rabi", "Rabi", "Rabi", // Jan, Feb, Mar
  "Zaid (Summer)", "Zaid (Summer)", // Apr, May
  "Kharif", "Kharif", "Kharif", "Kharif", // Jun–Sep
  "Rabi", "Rabi", "Rabi", // Oct, Nov, Dec
];

export const SEASON_INFO: Record<Season, { months: string; description: string }> = {
  Kharif: {
    months: "June – October",
    description: "Monsoon-sown crops. Sowing starts with the first good rains (typically June), harvested Sep–Nov.",
  },
  Rabi: {
    months: "October/November – March",
    description: "Winter-sown crops, grown on residual moisture or irrigation after the monsoon retreats.",
  },
  "Zaid (Summer)": {
    months: "March – June",
    description: "Short summer season between Rabi harvest and Kharif sowing — needs reliable irrigation.",
  },
};
