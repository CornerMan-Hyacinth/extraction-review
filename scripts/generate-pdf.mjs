import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { mkdirSync, writeFileSync } from "node:fs";

const PAGE_W = 612;
const PAGE_H = 792;
const SIZE = 11;
const LABEL_X = 72;
const VALUE_X = 250;
const ROW_STEP = 36;

// One place to define each field: what's printed, and how confident the "AI" is.
const rows = [
  {
    id: "fund",
    label: "Fund name",
    value: "Meridian Growth Partners III",
    confidence: 0.99,
  },
  {
    id: "notice-date",
    label: "Notice date",
    value: "2026-09-30",
    confidence: 0.97,
  },
  {
    id: "investor",
    label: "Investor",
    value: "Harlow Pension Trust",
    confidence: 0.95,
  },
  {
    id: "commitment",
    label: "Total commitment",
    value: "USD 5,000,000.00",
    confidence: 0.96,
  },
  {
    id: "call-pct",
    label: "Call percentage",
    value: "25.0%",
    confidence: 0.88,
  },
  {
    id: "call-amount",
    label: "Capital call amount",
    value: "USD 1,250,000.00",
    confidence: 0.74,
  },
  { id: "due-date", label: "Due date", value: "2026-10-15", confidence: 0.58 },
  {
    id: "bank",
    label: "Beneficiary bank",
    value: "First Harbor Bank",
    confidence: 0.96,
  },
  {
    id: "account",
    label: "Account number",
    value: "004821937",
    confidence: 0.93,
  },
  {
    id: "wire-ref",
    label: "Wire reference",
    value: "MGP3-CC-0042",
    confidence: 0.91,
  },
];

const doc = await PDFDocument.create();
const page = doc.addPage([PAGE_W, PAGE_H]);
const regular = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);

page.drawText("CAPITAL CALL NOTICE", {
  x: LABEL_X,
  y: PAGE_H - 80,
  size: 20,
  font: bold,
});
page.drawText("Synthetic document generated for demo purposes", {
  x: LABEL_X,
  y: PAGE_H - 98,
  size: 9,
  font: regular,
  color: rgb(0.5, 0.5, 0.5),
});

const round = (n) => Math.round(n * 10) / 10;
const fields = [];
let top = 150; // distance from the top of the page to the top of the row

for (const row of rows) {
  // pdf-lib measures y from the bottom, so convert from our top-left layout.
  const baseline = PAGE_H - (top + SIZE * 0.72);

  page.drawText(row.label, {
    x: LABEL_X,
    y: baseline,
    size: 10,
    font: regular,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(row.value, { x: VALUE_X, y: baseline, size: SIZE, font: bold });

  // Measure the real text width so the highlight box fits the value exactly.
  const width = bold.widthOfTextAtSize(row.value, SIZE);

  fields.push({
    id: row.id,
    label: row.label,
    value: row.value,
    confidence: row.confidence,
    page: 1,
    box: [
      round(VALUE_X - 2),
      round(top - 1),
      round(width + 4),
      round(SIZE * 0.93 + 2),
    ],
  });

  top += ROW_STEP;
}

mkdirSync("public/samples", { recursive: true });
writeFileSync("public/samples/capital-call.pdf", await doc.save());
writeFileSync("lib/sample-fields.json", JSON.stringify(fields, null, 2));

console.log(`Wrote capital-call.pdf and ${fields.length} fields`);
