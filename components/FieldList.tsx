"use client";
import { useState } from "react";
import type { ExtractedField } from "@/lib/sample";

type Props = {
  fields: ExtractedField[];
  activeId?: string;
  onSelect: (id: string) => void;
  onConfirm: (id: string) => void;
  onEdit: (id: string, value: string) => void;
};

function badgeClass(f: ExtractedField) {
  if (f.status === "confirmed" || f.status === "edited")
    return "bg-emerald-100 text-emerald-800";
  if (f.confidence >= 0.9) return "bg-emerald-100 text-emerald-800";
  if (f.confidence >= 0.7) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

export default function FieldList({
  fields,
  activeId,
  onSelect,
  onConfirm,
  onEdit,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  return (
    <ul className="divide-y">
      {fields.map((f) => {
        const needsReview = f.status === "needs_review";
        return (
          <li
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`cursor-pointer p-3 ${activeId === f.id ? "bg-indigo-50" : "hover:bg-slate-50"}`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{f.label}</span>
              <span
                className={`rounded px-2 py-0.5 font-medium ${badgeClass(f)}`}
              >
                {Math.round(f.confidence * 100)}%
              </span>
            </div>

            {editingId === f.id ? (
              <div className="mt-1 flex gap-2">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <button
                  className="text-sm text-indigo-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(f.id, draft);
                    setEditingId(null);
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-medium text-black">
                  {f.value}
                </span>
                {needsReview && (
                  <span className="flex gap-2 text-xs">
                    <button
                      className="text-emerald-700 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onConfirm(f.id);
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="text-slate-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDraft(f.value);
                        setEditingId(f.id);
                      }}
                    >
                      Edit
                    </button>
                  </span>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
