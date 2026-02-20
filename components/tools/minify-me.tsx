"use client";

import { useState } from "react";

type Tab = "css" | "json" | "sql" | "xml";

// ─── Minifiers ──────────────────────────────────────────────────────────────

function minifyCSS(input: string): string {
  let result = input;
  // Remove /* ... */ comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Collapse whitespace around key characters
  result = result.replace(/\s*([{}:;,>~+])\s*/g, "$1");
  // Remove trailing semicolons before closing braces
  result = result.replace(/;}/g, "}");
  // Collapse all remaining whitespace runs to a single space
  result = result.replace(/\s+/g, " ");
  return result.trim();
}

function minifyJSON(input: string): string {
  const parsed = JSON.parse(input); // throws on invalid JSON
  return JSON.stringify(parsed);
}

function minifySQL(input: string): string {
  let result = input;
  // Remove -- line comments
  result = result.replace(/--[^\n]*/g, "");
  // Remove /* ... */ block comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Collapse all whitespace runs (including newlines) to a single space
  result = result.replace(/\s+/g, " ");
  return result.trim();
}

function minifyXML(input: string): string {
  let result = input;
  // Remove <!-- ... --> comments
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  // Remove whitespace between tags
  result = result.replace(/>\s+</g, "><");
  // Collapse whitespace in text nodes / leading-trailing inside tags
  result = result.replace(/\s+/g, " ");
  return result.trim();
}

// ─── Stat helpers ────────────────────────────────────────────────────────────

function byteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

function pct(original: number, minified: number): string {
  if (original === 0) return "0";
  return ((1 - minified / original) * 100).toFixed(1);
}

// ─── Tab config ──────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; placeholder: string }[] = [
  {
    id: "css",
    label: "CSS",
    placeholder: `/* Paste your CSS here */\nbody {\n  margin: 0;\n  padding: 0;\n  background-color: #fff;\n}`,
  },
  {
    id: "json",
    label: "JSON",
    placeholder: `{\n  "name": "example",\n  "version": "1.0.0"\n}`,
  },
  {
    id: "sql",
    label: "SQL",
    placeholder: `-- Paste your SQL here\nSELECT\n  id,\n  name\nFROM\n  users\nWHERE\n  active = 1;`,
  },
  {
    id: "xml",
    label: "XML",
    placeholder: `<!-- Paste your XML here -->\n<root>\n  <item id="1">\n    <name>Example</name>\n  </item>\n</root>`,
  },
];

const MINIFIERS: Record<Tab, (input: string) => string> = {
  css: minifyCSS,
  json: minifyJSON,
  sql: minifySQL,
  xml: minifyXML,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function MinifyMe() {
  const [activeTab, setActiveTab] = useState<Tab>("css");
  const [inputs, setInputs] = useState<Record<Tab, string>>({ css: "", json: "", sql: "", xml: "" });
  const [outputs, setOutputs] = useState<Record<Tab, string>>({ css: "", json: "", sql: "", xml: "" });
  const [errors, setErrors] = useState<Record<Tab, string>>({ css: "", json: "", sql: "", xml: "" });
  const [copied, setCopied] = useState(false);

  const input = inputs[activeTab];
  const output = outputs[activeTab];
  const error = errors[activeTab];

  const originalBytes = byteSize(input);
  const minifiedBytes = byteSize(output);
  const hasResult = output.length > 0;

  function setInput(value: string) {
    setInputs((prev) => ({ ...prev, [activeTab]: value }));
    // Clear stale output when input changes
    setOutputs((prev) => ({ ...prev, [activeTab]: "" }));
    setErrors((prev) => ({ ...prev, [activeTab]: "" }));
  }

  function handleMinify() {
    const raw = input.trim();
    if (!raw) {
      setErrors((prev) => ({ ...prev, [activeTab]: "Please paste some content to minify." }));
      return;
    }
    try {
      const result = MINIFIERS[activeTab](raw);
      setOutputs((prev) => ({ ...prev, [activeTab]: result }));
      setErrors((prev) => ({ ...prev, [activeTab]: "" }));
    } catch (e: unknown) {
      setErrors((prev) => ({
        ...prev,
        [activeTab]: e instanceof Error ? e.message : "Failed to parse input.",
      }));
      setOutputs((prev) => ({ ...prev, [activeTab]: "" }));
    }
  }

  function handleClear() {
    setInputs((prev) => ({ ...prev, [activeTab]: "" }));
    setOutputs((prev) => ({ ...prev, [activeTab]: "" }));
    setErrors((prev) => ({ ...prev, [activeTab]: "" }));
    setCopied(false);
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-background/80 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-y";

  return (
    <div className="flex-1 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Tab bar */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCopied(false); }}
                className={`px-5 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/15 border-primary text-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
            className={inputClass + " min-h-[180px]"}
          />

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleMinify}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex-1 justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
              Minify
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Privacy note */}
          <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-xs text-muted-foreground">
            <svg className="shrink-0 mt-0.5 text-cyan-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>All minification runs entirely in your browser. No data is sent to any server.</span>
          </div>
        </div>

        {/* Output */}
        {hasResult && (
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-background/40 p-3 text-center">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Original</div>
                <div className="font-mono text-sm text-foreground font-medium">{originalBytes.toLocaleString()} B</div>
              </div>
              <div className="rounded-lg bg-background/40 p-3 text-center">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Minified</div>
                <div className="font-mono text-sm text-foreground font-medium">{minifiedBytes.toLocaleString()} B</div>
              </div>
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Saved</div>
                <div className="font-mono text-sm text-green-400 font-semibold">{pct(originalBytes, minifiedBytes)}%</div>
              </div>
            </div>

            {/* Output textarea + copy */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Minified Output
                </label>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-primary/10 border border-primary/30 rounded text-primary text-xs hover:bg-primary/20 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <textarea
                readOnly
                value={output}
                className={inputClass + " min-h-[120px]"}
              />
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Why Minify?</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong className="text-foreground">Faster load times</strong> — smaller files transfer and parse quicker in browsers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong className="text-foreground">Lower bandwidth</strong> — especially meaningful on mobile and high-traffic APIs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong className="text-foreground">Cleaner payloads</strong> — minified JSON and XML are ideal for API responses and config files.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong className="text-foreground">SQL portability</strong> — compact SQL is easier to embed in scripts and log entries.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
