export type FieldStatus = "auto" | "needs_review" | "confirmed" | "edited";

export type ExtractedField = {
  id: string;
  label: string;
  value: string;
  confidence: number; // 0 to 1
  page: number;
  box: [number, number, number, number];
  status: FieldStatus;
};

export const AUTO_THRESHOLD = 0.9;

export const sampleFields: ExtractedField[] = [
  {
    id: "fund",
    label: "Fund name",
    value: "Meridian Growth Partners III",
    confidence: 0.99,
    page: 1,
    box: [72, 120, 260, 18],
    status: "auto",
  },
  {
    id: "notice-date",
    label: "Notice date",
    value: "2026-09-30",
    confidence: 0.97,
    page: 1,
    box: [72, 150, 90, 14],
    status: "auto",
  },
  {
    id: "call-amount",
    label: "Capital call amount",
    value: "USD 1,250,000.00",
    confidence: 0.74,
    page: 1,
    box: [320, 300, 130, 14],
    status: "needs_review",
  },
  {
    id: "due-date",
    label: "Due date",
    value: "2026-10-15",
    confidence: 0.58,
    page: 1,
    box: [320, 330, 90, 14],
    status: "needs_review",
  },
  // ...add the rest to match your generated PDF
];

// Decide the initial status from confidence, the way a real pipeline would.
export const withInitialStatus = (fields: ExtractedField[]) =>
  fields.map((f) => ({
    ...f,
    status: f.confidence >= AUTO_THRESHOLD ? "auto" : "needs_review",
  })) as ExtractedField[];
