"use client";

import { useState, useEffect, useCallback } from "react";
import { generatePassword, type PasswordOptions } from "@/lib/crypto/password";
import { calcStrength } from "@/lib/crypto/strength";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = useCallback(() => {
    const opts: PasswordOptions = { length, useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar, excludeAmbiguous };
    const result = generatePassword(opts);
    if (result === null) {
      setError("Please select at least one character type.");
      return;
    }
    setError("");
    setPassword(result);
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar, excludeAmbiguous]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const strength = password ? calcStrength(password) : null;

  const inputClass =
    "w-full rounded-lg border border-border bg-background/80 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

  return (
    <div className="flex-1 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Password display card */}
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <div className="rounded-lg border border-primary/30 bg-background/60 px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <code className="font-mono text-sm text-primary break-all flex-1 min-h-[1.5rem]">
              {password || "Click Generate Password to start"}
            </code>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={generate}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Generate Password
            </button>
            <button
              onClick={handleCopy}
              disabled={!password}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy Password"}
            </button>
          </div>

          {strength && (
            <div className="rounded-lg bg-background/40 p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Password Strength
              </p>
              <div className="h-2 rounded-full bg-border/30 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${strength.percent}%`,
                    background: strength.color,
                  }}
                />
              </div>
              <p className="text-sm font-semibold" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* Options card */}
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-5">
          <h2 className="text-base font-semibold text-primary">Customize Your Password</h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Password Length:{" "}
              <span className="rounded-md bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary ml-1">
                {length}
              </span>
            </label>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "uppercase", label: "Uppercase (A-Z)", value: useUppercase, setter: setUseUppercase },
              { id: "lowercase", label: "Lowercase (a-z)", value: useLowercase, setter: setUseLowercase },
              { id: "numbers", label: "Numbers (0-9)", value: useNumbers, setter: setUseNumbers },
              { id: "symbols", label: "Symbols (!@#$%)", value: useSymbols, setter: setUseSymbols },
              { id: "excludeSimilar", label: "Exclude Similar (il1Lo0)", value: excludeSimilar, setter: setExcludeSimilar },
              { id: "excludeAmbiguous", label: "Exclude Ambiguous ({}[]()...)", value: excludeAmbiguous, setter: setExcludeAmbiguous },
            ].map(({ id, label, value, setter }) => (
              <label
                key={id}
                htmlFor={id}
                className="flex items-center gap-3 cursor-pointer rounded-lg bg-background/40 px-4 py-3 hover:bg-background/60 transition-colors"
              >
                <input
                  type="checkbox"
                  id={id}
                  checked={value}
                  onChange={(e) => setter(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <span className="text-sm text-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tips card */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 border-l-4 border-l-primary">
          <h3 className="text-sm font-semibold text-primary mb-3">Password Security Tips</h3>
          <ul className="space-y-2 ml-4 list-disc">
            {[
              "Use at least 12-16 characters for strong security",
              "Never reuse passwords across different accounts",
              "Use a password manager to store unique passwords",
              "Enable two-factor authentication (2FA) whenever possible",
              "Change passwords immediately if a service is breached",
              "Avoid using personal information in passwords",
              "Don't share passwords via email or text messages",
            ].map((tip) => (
              <li key={tip} className="text-sm text-muted-foreground">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
