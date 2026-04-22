"use client";

import { useState, useRef, useEffect } from "react";
import { PDFDocument, PageSizes } from "pdf-lib";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const PAGE_SIZE_OPTIONS = [
  { label: "A4", value: "A4" },
  { label: "Letter", value: "Letter" },
  { label: "Fit to image", value: "fit" },
] as const;

type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number]["value"];

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pageSize, setPageSize] = useState<PageSizeOption>("A4");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"];

  function addImages(incoming: FileList | File[]) {
    const imgs = Array.from(incoming).filter((f) => ACCEPTED.includes(f.type));
    if (imgs.length === 0) { setError("Please select image files (JPEG, PNG, WebP, GIF, BMP)."); return; }
    setError("");
    setImages((prev) => [
      ...prev,
      ...imgs.map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        preview: URL.createObjectURL(f),
      })),
    ]);
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  }

  function moveImage(id: string, dir: -1 | 1) {
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }

  async function handleConvert() {
    if (images.length === 0) { setError("Add at least one image."); return; }
    setError("");
    setConverting(true);
    try {
      const doc = await PDFDocument.create();

      for (const { file } of images) {
        const bytes = await file.arrayBuffer();
        let img;
        if (file.type === "image/jpeg") {
          img = await doc.embedJpg(bytes);
        } else {
          img = await doc.embedPng(
            file.type === "image/png" ? bytes : await convertToPng(bytes, file.type)
          );
        }

        let page;
        if (pageSize === "fit") {
          page = doc.addPage([img.width, img.height]);
        } else {
          const dims = pageSize === "A4" ? PageSizes.A4 : PageSizes.Letter;
          page = doc.addPage(dims);
          const [pw, ph] = dims;
          const scale = Math.min(pw / img.width, ph / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          page.drawImage(img, {
            x: (pw - w) / 2,
            y: (ph - h) / 2,
            width: w,
            height: h,
          });
          continue;
        }
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const outBytes = await doc.save();
      const blob = new Blob([new Uint8Array(outBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setError("Conversion failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setConverting(false);
    }
  }

  async function convertToPng(bytes: ArrayBuffer, mimeType: string): Promise<ArrayBuffer> {
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob((b) => {
          if (!b) { reject(new Error("Canvas conversion failed")); return; }
          b.arrayBuffer().then(resolve).catch(reject);
        }, "image/png");
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
      img.src = url;
    });
  }

  return (
    <div className="flex-1 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload images"
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); addImages(e.dataTransfer.files); }}
          >
            <svg className="mx-auto mb-3 opacity-50" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-muted-foreground">Drop images here or click to browse</p>
            <p className="text-xs text-muted-foreground/60 mt-1">JPEG, PNG, WebP, GIF, BMP — each image becomes one page</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) addImages(e.target.files); e.target.value = ""; }}
            />
          </div>

          {/* Page size selector */}
          <div className="mt-5">
            <p className="text-sm font-medium text-muted-foreground mb-2">Page size</p>
            <div className="flex gap-2">
              {PAGE_SIZE_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setPageSize(value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    pageSize === value
                      ? "bg-primary/15 border-primary text-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Image list */}
          {images.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Images ({images.length})
              </p>
              {images.map(({ id, file, preview }, idx) => (
                <div key={id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 px-3 py-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="h-10 w-10 rounded object-cover shrink-0 border border-border/50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => moveImage(id, -1)} disabled={idx === 0} className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors" aria-label="Move up">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                    </button>
                    <button onClick={() => moveImage(id, 1)} disabled={idx === images.length - 1} className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors" aria-label="Move down">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    <button onClick={() => removeImage(id)} className="p-1.5 rounded border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors" aria-label="Remove">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={converting || images.length === 0}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 w-full justify-center"
          >
            {converting ? "Converting…" : `Convert ${images.length > 0 ? images.length : ""} image${images.length !== 1 ? "s" : ""} to PDF`}
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
