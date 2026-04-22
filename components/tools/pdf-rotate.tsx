"use client";

import { useState, useRef } from "react";
import { PDFDocument, degrees } from "pdf-lib";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

type RotationAngle = 90 | 180 | 270;

export default function PdfRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [scope, setScope] = useState<"all" | "range">("all");
  const [rangeInput, setRangeInput] = useState("");
  const [angle, setAngle] = useState<RotationAngle>(90);
  const [rotating, setRotating] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadFile(f: File) {
    if (!f.type.includes("pdf") && !f.name.endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }
    setError("");
    setLoadingInfo(true);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
      setFile(f);
    } catch {
      setError("Could not read the PDF. It may be encrypted or corrupted.");
    } finally {
      setLoadingInfo(false);
    }
  }

  function parseIndices(input: string, total: number): number[] | null {
    const result: number[] = [];
    for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
      if (part.includes("-")) {
        const [a, b] = part.split("-").map((s) => parseInt(s.trim(), 10));
        if (isNaN(a) || isNaN(b) || a < 1 || b > total || a > b) return null;
        for (let i = a; i <= b; i++) result.push(i - 1);
      } else {
        const n = parseInt(part, 10);
        if (isNaN(n) || n < 1 || n > total) return null;
        result.push(n - 1);
      }
    }
    return [...new Set(result)];
  }

  async function handleRotate() {
    if (!file) return;
    setError("");
    setRotating(true);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const total = doc.getPageCount();

      let indices: number[];
      if (scope === "all") {
        indices = Array.from({ length: total }, (_, i) => i);
      } else {
        const parsed = parseIndices(rangeInput, total);
        if (!parsed || parsed.length === 0) {
          setError(`Invalid page range. Use format like "1-3, 5" (1–${total}).`);
          setRotating(false);
          return;
        }
        indices = parsed;
      }

      for (const idx of indices) {
        const page = doc.getPage(idx);
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      }

      const outBytes = await doc.save();
      const blob = new Blob([new Uint8Array(outBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "-rotated.pdf");
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setError("Failed to rotate PDF: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setRotating(false);
    }
  }

  const ANGLES: RotationAngle[] = [90, 180, 270];

  return (
    <div className="flex-1 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); }}
          >
            <svg className="mx-auto mb-3 opacity-50" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {loadingInfo ? (
              <p className="text-muted-foreground">Reading PDF…</p>
            ) : file ? (
              <>
                <p className="text-sm font-medium text-primary">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{pageCount} pages · {formatSize(file.size)}</p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">Drop a PDF here or click to browse</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Rotate all pages or a specific range</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = ""; }}
            />
          </div>

          {file && (
            <div className="mt-5 space-y-4">
              {/* Rotation angle */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Rotation</p>
                <div className="flex gap-2">
                  {ANGLES.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAngle(a)}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        angle === a
                          ? "bg-primary/15 border-primary text-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                    >
                      {a === 90 ? "90° clockwise" : a === 180 ? "180°" : "90° counter-clockwise"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scope */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Apply to</p>
                <div className="flex gap-2">
                  {(["all", "range"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setScope(s)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        scope === s
                          ? "bg-primary/15 border-primary text-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                    >
                      {s === "all" ? "All pages" : "Page range"}
                    </button>
                  ))}
                </div>
                {scope === "range" && (
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder={`e.g. 1-3, 5, 7-9`}
                    className="mt-2 w-full rounded-lg border border-border bg-background/80 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleRotate}
            disabled={!file || rotating}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 w-full justify-center"
          >
            {rotating ? "Rotating…" : "Rotate & Download"}
          </button>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-xs text-muted-foreground">
            <svg className="shrink-0 mt-0.5 text-cyan-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>All processing happens locally in your browser. Your files never leave your device.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
