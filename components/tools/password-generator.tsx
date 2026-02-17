"use client";

import { useState, useEffect, useCallback } from "react";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR = "il1Lo0O";
const AMBIGUOUS = "{}[]()/\\'\"`,;:.<>";

function cryptoPickChar(chars: string): string {
  const max = Math.floor(0xffffffff / chars.length) * chars.length;
  const buf = new Uint32Array(1);
  do { crypto.getRandomValues(buf); } while (buf[0] >= max);
  return chars[buf[0] % chars.length];
}

function generatePassword(
  length: number,
  useUppercase: boolean,
  useLowercase: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
  excludeSimilar: boolean,
  excludeAmbiguous: boolean
): string | null {
  if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
    return null;
  }

  let charset = "";
  if (useUppercase) charset += UPPERCASE;
  if (useLowercase) charset += LOWERCASE;
  if (useNumbers) charset += NUMBERS;
  if (useSymbols) charset += SYMBOLS;

  if (excludeSimilar) {
    charset = charset
      .split("")
      .filter((c) => !SIMILAR.includes(c))
      .join("");
  }
  if (excludeAmbiguous) {
    charset = charset
      .split("")
      .filter((c) => !AMBIGUOUS.includes(c))
      .join("");
  }

  if (charset.length === 0) return null;

  const maxValid =
    Math.floor(0xffffffff / charset.length) * charset.length;
  let password = "";
  while (password.length < length) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const value = array[0];
    if (value < maxValid) {
      password += charset[value % charset.length];
    }
  }

  // Ensure complexity
  const pass = password.split("");
  const needsUpper = useUppercase && !/[A-Z]/.test(password);
  const needsLower = useLowercase && !/[a-z]/.test(password);
  const needsNumber = useNumbers && !/[0-9]/.test(password);
  const needsSymbol =
    useSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

  let index = 0;
  if (needsUpper) {
    let chars = UPPERCASE;
    if (excludeSimilar)
      chars = chars.split("").filter((c) => !SIMILAR.includes(c)).join("");
    pass[index++] = cryptoPickChar(chars);
  }
  if (needsLower) {
    let chars = LOWERCASE;
    if (excludeSimilar)
      chars = chars.split("").filter((c) => !SIMILAR.includes(c)).join("");
    pass[index++] = cryptoPickChar(chars);
  }
  if (needsNumber) {
    let chars = NUMBERS;
    if (excludeSimilar)
      chars = chars.split("").filter((c) => !SIMILAR.includes(c)).join("");
    pass[index++] = cryptoPickChar(chars);
  }
  if (needsSymbol) {
    let chars = SYMBOLS;
    if (excludeAmbiguous)
      chars = chars.split("").filter((c) => !AMBIGUOUS.includes(c)).join("");
    pass[index++] = cryptoPickChar(chars);
  }

  // Fisher-Yates shuffle so required chars land at random positions
  for (let i = pass.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [pass[i], pass[j]] = [pass[j], pass[i]];
  }

  return pass.join("");
}

function calcStrength(password: string): {
  percent: number;
  color: string;
  label: string;
} {
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 20;
  if (password.length >= 16) strength += 10;
  if (/[a-z]/.test(password)) strength += 12.5;
  if (/[A-Z]/.test(password)) strength += 12.5;
  if (/[0-9]/.test(password)) strength += 12.5;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;

  if (strength < 40) return { percent: strength, color: "#ef4444", label: "Weak" };
  if (strength < 60) return { percent: strength, color: "#f59e0b", label: "Fair" };
  if (strength < 80) return { percent: strength, color: "#eab308", label: "Good" };
  return { percent: strength, color: "#22c55e", label: "Strong" };
}

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
    const result = generatePassword(
      length,
      useUppercase,
      useLowercase,
      useNumbers,
      useSymbols,
      excludeSimilar,
      excludeAmbiguous
    );
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
