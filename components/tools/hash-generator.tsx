"use client";

import { useState, useRef } from "react";
import { md5 } from "@/lib/crypto/md5";

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

async function generateHashes(data: ArrayBuffer): Promise<Record<string, string>> {
  const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
  const results: Record<string, string> = {};
  results["MD5"] = md5(data);
  for (const algo of algos) {
    const hash = await crypto.subtle.digest(algo, data);
    results[algo] = bufToHex(hash);
  }
  return results;
}

const HASH_ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export default function HashGenerator() {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [textInput, setTextInput] = useState("");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<{ type: "match" | "no-match" | null; message: string }>({ type: null, message: "" });
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(file: File) {
    setCurrentFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  async function handleGenerate() {
    let data: ArrayBuffer;
    if (activeTab === "text") {
      if (!textInput) { setError("Please enter some text to hash."); return; }
      data = new TextEncoder().encode(textInput).buffer;
    } else {
      if (!currentFile) { setError("Please select a file to hash."); return; }
      data = await currentFile.arrayBuffer();
    }
    setError("");
    setGenerating(true);
    try {
      const result = await generateHashes(data);
      setHashes(result);
      setShowResults(true);
      setVerifyResult({ type: null, message: "" });
    } catch (e: unknown) {
      setError("Error generating hashes: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy(hash: string) {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 1500);
    } catch (e) {
      console.error("Clipboard write failed", e);
    }
  }

  function handleVerify() {
    const expected = verifyInput.trim().toLowerCase();
    if (!expected) return;
    const matched = Object.values(hashes).some((h) => h.toLowerCase() === expected);
    setVerifyResult({
      type: matched ? "match" : "no-match",
      message: matched
        ? "Hash matches! File integrity verified."
        : "No match found. The hash does not match any generated hash.",
    });
  }

  const inputClass = "w-full rounded-lg border border-border bg-background/80 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

  return (
    <div className="flex-1 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Input Panel */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {(["text", "file"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-primary/15 border-primary text-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {tab === "text" ? "Text Input" : "File Input"}
              </button>
            ))}
          </div>

          {activeTab === "text" && (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text to hash..."
              className={inputClass + " resize-y min-h-[120px]"}
            />
          )}

          {activeTab === "file" && (
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary hover:bg-primary/5"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <svg className="mx-auto mb-3 opacity-50" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div className="text-muted-foreground">Drop a file here or click to browse</div>
              {currentFile && (
                <div className="mt-3 text-sm text-primary font-medium">
                  {currentFile.name} ({formatSize(currentFile.size)})
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
              />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 w-full justify-center mt-4"
          >
            {generating ? "Generating..." : "Generate Hashes"}
          </button>

          {error && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}

          <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-xs text-muted-foreground">
            <svg className="shrink-0 mt-0.5 text-cyan-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>All hashing is done locally in your browser using the Web Crypto API. No data leaves your device.</span>
          </div>
        </div>

        {/* Results Panel */}
        {showResults && (
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Hash Results</p>
            <div className="flex flex-col gap-3">
              {HASH_ALGOS.map((algo) => (
                <div key={algo} className="bg-background/40 rounded-lg p-3">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{algo}</div>
                  <div className="flex items-start gap-2">
                    <code className="font-mono text-sm text-primary break-all flex-1">{hashes[algo]}</code>
                    <button
                      onClick={() => handleCopy(hashes[algo])}
                      className="shrink-0 px-2 py-1 bg-primary/10 border border-primary/30 rounded text-primary text-xs hover:bg-primary/20 transition-colors"
                    >
                      {copiedHash === hashes[algo] ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Verify Section */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Verify Hash</p>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Paste a hash to compare</label>
                  <input
                    type="text"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="Paste expected hash here..."
                    className={inputClass}
                  />
                </div>
                <button
                  onClick={handleVerify}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground transition-colors whitespace-nowrap"
                >
                  Verify
                </button>
              </div>
              {verifyResult.type && (
                <div
                  className={`mt-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    verifyResult.type === "match"
                      ? "bg-green-500/10 border border-green-500/30 text-green-400"
                      : "bg-destructive/10 border border-destructive/30 text-destructive"
                  }`}
                >
                  {verifyResult.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
