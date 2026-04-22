"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

interface PdfInfo {
  pageCount: number;
  fileSize: number;
  title: string | undefined;
  author: string | undefined;
  subject: string | undefined;
  keywords: string | undefined;
  creator: string | undefined;
  producer: string | undefined;
  creationDate: Date | undefined;
  modificationDate: Date | undefined;
  pdfVersion: string;
}

const FIELD_LABELS: [keyof PdfInfo, string][] = [
  ["pageCount", "Page Count"],
  ["fileSize", "File Size"],
  ["pdfVersion", "PDF Version"],
  ["title", "Title"],
  ["author", "Author"],
  ["subject", "Subject"],
  ["keywords", "Keywords"],
  ["creator", "Creator Application"],
  ["producer", "PDF Producer"],
  ["creationDate", "Creation Date"],
  ["modificationDate", "Last Modified"],
];

function formatValue(key: keyof PdfInfo, value: PdfInfo[keyof PdfInfo]): string {
  if (value === undefined || value === null) return "—";
  if (key === "fileSize") return formatSize(value as number);
  if (value instanceof Date) return value.toLocaleString();
  return String(value);
}

export default function PdfMetadata() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<PdfInfo | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadFile(f: File) {
    if (!f.type.includes("pdf") && !f.name.toLowerCase().endsWith(".pdf")) {
      setInfo(null);
      setError("Please select a PDF file.");
      return;
    }
    setError("");
    setInfo(null);
    setLoading(true);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      const raw = new Uint8Array(bytes);
      const header = new TextDecoder().decode(raw.slice(0, 8));
      const versionMatch = header.match(/%PDF-(\d+\.\d+)/);

      setFileName(f.name);
      setInfo({
        pageCount: doc.getPageCount(),
        fileSize: f.size,
        title: doc.getTitle() ?? undefined,
        author: doc.getAuthor() ?? undefined,
        subject: doc.getSubject() ?? undefined,
        keywords: doc.getKeywords() ?? undefined,
        creator: doc.getCreator() ?? undefined,
        producer: doc.getProducer() ?? undefined,
        creationDate: doc.getCreationDate() ?? undefined,
        modificationDate: doc.getModificationDate() ?? undefined,
        pdfVersion: versionMatch ? versionMatch[1] : "Unknown",
      });
    } catch {
      setError("Could not read the PDF. It may be corrupted.");
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    if (!info) return;
    const lines = FIELD_LABELS.map(([k, label]) => `${label}: ${formatValue(k, info[k])}`).join("\n");
    navigator.clipboard.writeText(`File: ${fileName}\n${lines}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch((err) => {
      console.error("Clipboard write failed:", err);
    });
  }

  return (
    <div className="flex-1 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-border/50 bg-card p-6">
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
            {loading ? (
              <p className="text-muted-foreground">Reading metadata…</p>
            ) : (
              <>
                <p className="text-muted-foreground">Drop a PDF here or click to browse</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Inspect title, author, dates, page count, and more</p>
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

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        {info && (
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Metadata</p>
                <p className="text-sm font-medium text-foreground mt-0.5 truncate max-w-xs">{fileName}</p>
              </div>
              <button
                onClick={copyAll}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                {copied ? "Copied!" : "Copy all"}
              </button>
            </div>

            <div className="divide-y divide-border/50">
              {FIELD_LABELS.map(([key, label]) => {
                const raw = info[key];
                const display = formatValue(key, raw);
                const missing = display === "—";
                return (
                  <div key={key} className="py-3 flex items-start justify-between gap-4">
                    <span className="text-xs font-medium text-muted-foreground shrink-0 w-40">{label}</span>
                    <span className={`text-sm text-right break-all ${missing ? "text-muted-foreground/40 italic" : "text-foreground font-mono"}`}>
                      {display}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-xs text-muted-foreground">
          <svg className="shrink-0 mt-0.5 text-cyan-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Your PDF is read entirely in your browser. No data is uploaded or stored.</span>
        </div>
      </div>
    </div>
  );
}
