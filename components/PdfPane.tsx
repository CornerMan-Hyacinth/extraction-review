"use client";
import { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import type { ExtractedField } from "@/lib/sample";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const SCALE = 1.4;

type Props = { url: string; page: number; active?: ExtractedField };

export default function PdfPane({ url, page, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const doc = await pdfjs.getDocument({ url }).promise;
      const pdfPage = await doc.getPage(page);
      const viewport = pdfPage.getViewport({ scale: SCALE });
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setSize({ w: viewport.width, h: viewport.height });

      await pdfPage.render({ canvas, viewport }).promise;
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [url, page]);

  const [x, y, w, h] = active?.box ?? [0, 0, 0, 0];

  return (
    <div
      className="relative inline-block shadow-md"
      style={{ width: size.w, height: size.h }}
    >
      <canvas ref={canvasRef} />
      {active && active.page === page && (
        <div
          className="pointer-events-none absolute rounded-sm border-2 border-indigo-500 bg-indigo-400/20 transition-all duration-200"
          style={{
            left: x * SCALE,
            top: y * SCALE,
            width: w * SCALE,
            height: h * SCALE,
          }}
        />
      )}
    </div>
  );
}
