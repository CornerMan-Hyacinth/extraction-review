import raw from "./sample-fields.json";

export type FieldStatus = "auto" | "needs_review" | "confirmed" | "edited";

export type ExtractedField = {
  id: string;
  label: string;
  value: string;
  confidence: number;
  page: number;
  box: [number, number, number, number];
  status: FieldStatus;
};

export const AUTO_THRESHOLD = 0.9;

export const sampleFields: ExtractedField[] = raw.map((f) => ({
  ...f,
  box: f.box as [number, number, number, number],
  status: "auto",
}));

export const withInitialStatus = (fields: ExtractedField[]) =>
  fields.map((f) => ({
    ...f,
    status: f.confidence >= AUTO_THRESHOLD ? "auto" : "needs_review",
  })) as ExtractedField[];
