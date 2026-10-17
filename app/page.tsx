"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import FieldList from "@/components/FieldList";
import {
  sampleFields,
  withInitialStatus,
  type ExtractedField,
} from "@/lib/sample";

// pdf.js touches browser APIs, skip server rendering for it.
const PdfPane = dynamic(() => import("@/components/PdfPane"), { ssr: false });

export default function Home() {
  const [fields, setFields] = useState<ExtractedField[]>(() =>
    withInitialStatus(sampleFields),
  );
  const [activeId, setActiveId] = useState<string>();

  const active = fields.find((f) => f.id === activeId);
  const validated = useMemo(
    () => fields.filter((f) => f.status !== "needs_review").length,
    [fields],
  );

  const update = (id: string, patch: Partial<ExtractedField>) =>
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );

  return (
    <main className="flex h-screen flex-col">
      <header className="border-b px-4 py-3">
        <div className="text-sm font-medium">
          {validated}/{fields.length} fields validated
        </div>
        <div className="mt-2 h-1.5 rounded bg-slate-200">
          <div
            className="h-full rounded bg-emerald-500 transition-all"
            style={{ width: `${(validated / fields.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[1fr_380px] overflow-hidden">
        <section className="overflow-auto bg-slate-100 p-6">
          <PdfPane
            url="/samples/capital-call.pdf"
            page={active?.page ?? 1}
            active={active}
          />
        </section>
        <aside className="overflow-auto border-l bg-white">
          <FieldList
            fields={fields}
            activeId={activeId}
            onSelect={setActiveId}
            onConfirm={(id) => update(id, { status: "confirmed" })}
            onEdit={(id, value) => update(id, { value, status: "edited" })}
          />
        </aside>
      </div>
    </main>
  );
}
