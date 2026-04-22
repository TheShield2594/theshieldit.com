"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function parsePageRange(input: string, total: number): number[] | null {
  const indices: number[] = [];
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (/^\d+-\d+$/.test(part)) {
      const [a, b] = part.split("-").map(Number);
      if (a < 1 || b > total || a > b) return null;
      for (let i = a; i <= b; i++) indices.push(i - 1);
    } else if (/^\d+$/.test(part)) {
      const n = Number(part);
      if (n < 1 || n > total) return null;
      indices.push(n - 1);
    } else {
      return null;
    }
  }
  return [...new Set(indices)].sort((a, b) => a - b);
}

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mode, setMode] = useState<"range" | "all">("range");
  const [rangeInput, setRangeInput] = useState("");
  const [splitting, setSplitting] = useState(false);
  const [error, setError] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadFile(f: File) {
    if (!f.type.includes("pdf") && !f.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      setPageCount(0);
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
      setFile(null);
      setPageCount(0);
      setError("Could not read the PDF. It may be encrypted or corrupted.");
    } finally {
      setLoadingInfo(false);
    }
  }

  async function handleSplit() {
    if (!file) return;
    setError("");
    setSplitting(true);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);

      if (mode === "all") {
        const zip = new JSZip();
        for (let i = 0; i < src.getPageCount(); i++) {
          const single = await PDFDocument.create();
          const [page] = await single.copyPages(src, [i]);
          single.addPage(page);
          const out = await single.save();
          zip.file(`page-${i + 1}.pdf`, new Uint8Array(out));
        }
        const zipBytes = await zip.generateAsync({ type: "uint8array" });
        const blob = new Blob([new Uint8Array(zipBytes)], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pages.zip";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 100);
      } else {
        const indices = parsePageRange(rangeInput, src.getPageCount());
        if (!indices || indices.length === 0) {
          setError(`Invalid range. Enter pages like "1-3, 5, 7-9" (1–${src.getPageCount()}).`);
          setSplitting(false);
          return;
        }
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, indices);
        pages.forEach((p) => out.addPage(p));
        const outBytes = await out.save();
        const blob = new Blob([new Uint8Array(outBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "extracted-pages.pdf";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 100);
      }
    } catch (e: unknown) {
      setError("Failed to split PDF: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSplitting(false);
    }
  }

  return (
    <div className="flex-1 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          {/* File drop */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload PDF"
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
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
                <p className="text-xs text-muted-foreground/60 mt-1">Select the PDF you want to split</p>
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

          {/* Mode selector */}
          {file && (
            <div className="mt-5 space-y-4">
              <div className="flex gap-2">
                {(["range", "all"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      mode === m
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {m === "range" ? "Extract page range" : `Split into ${pageCount} pages (ZIP)`}
                  </button>
                ))}
              </div>

              {mode === "range" && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Pages to extract <span className="text-muted-foreground/60">(e.g. 1-3, 5, 7-9)</span>
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder={`1-${Math.min(3, pageCount)}, ${Math.min(5, pageCount)}`}
                    className="w-full rounded-lg border border-border bg-background/80 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSplit}
            disabled={!file || splitting}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 w-full justify-center"
          >
            {splitting ? "Splitting…" : mode === "all" ? `Download ${pageCount} pages as ZIP` : "Extract pages"}
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
