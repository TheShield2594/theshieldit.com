"use client";

import { useState, useRef } from "react";

function md5(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);

  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function add32(a: number, b: number) { return (a + b) & 0xFFFFFFFF; }

  const n = bytes.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  const tail: number[] = new Array(16).fill(0);
  let i, j;

  for (i = 64; i <= n; i += 64) {
    const block: number[] = [];
    for (j = 0; j < 16; j++) {
      block[j] = bytes[i - 64 + j * 4] | (bytes[i - 64 + j * 4 + 1] << 8) | (bytes[i - 64 + j * 4 + 2] << 16) | (bytes[i - 64 + j * 4 + 3] << 24);
    }
    md5cycle(state, block);
  }

  for (j = 0; j < 16; j++) tail[j] = 0;
  const rem = n % 64;
  for (j = 0; j < rem; j++) {
    tail[j >> 2] |= bytes[n - rem + j] << ((j % 4) << 3);
  }
  tail[j >> 2] |= 0x80 << ((j % 4) << 3);
  if (j > 55) { md5cycle(state, tail); for (j = 0; j < 16; j++) tail[j] = 0; }
  tail[14] = n * 8;
  tail[15] = 0;
  md5cycle(state, tail);

  let hex = '';
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      hex += ((state[i] >> (j * 8)) & 0xFF).toString(16).padStart(2, '0');
    }
  }
  return hex;
}

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
      if (!textInput) { alert("Please enter some text to hash."); return; }
      data = new TextEncoder().encode(textInput).buffer;
    } else {
      if (!currentFile) { alert("Please select a file to hash."); return; }
      data = await currentFile.arrayBuffer();
    }
    setGenerating(true);
    try {
      const result = await generateHashes(data);
      setHashes(result);
      setShowResults(true);
      setVerifyResult({ type: null, message: "" });
    } catch (e: unknown) {
      alert("Error generating hashes: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setGenerating(false);
    }
  }

  function handleCopy(hash: string) {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
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
