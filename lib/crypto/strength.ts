/**
 * Password strength scoring.
 * Extracted from components/tools/password-generator.tsx.
 * Uses a table-driven approach to keep cyclomatic complexity low.
 */

export interface StrengthResult {
  percent: number;
  color: string;
  label: string;
}

/** Each rule returns the score bonus it contributes. */
const STRENGTH_RULES: Array<(p: string) => number> = [
  (p) => (p.length >= 8  ? 20   : 0),
  (p) => (p.length >= 12 ? 20   : 0),
  (p) => (p.length >= 16 ? 10   : 0),
  (p) => (/[a-z]/.test(p)        ? 12.5 : 0),
  (p) => (/[A-Z]/.test(p)        ? 12.5 : 0),
  (p) => (/[0-9]/.test(p)        ? 12.5 : 0),
  (p) => (/[^a-zA-Z0-9]/.test(p) ? 12.5 : 0),
];

const STRENGTH_LEVELS: ReadonlyArray<{ min: number; color: string; label: string }> = [
  { min: 80, color: "hsl(var(--accent))",      label: "Strong" },
  { min: 60, color: "hsl(var(--chart-4))",     label: "Good"   },
  { min: 40, color: "hsl(var(--chart-4))",     label: "Fair"   },
  { min:  0, color: "hsl(var(--destructive))", label: "Weak"   },
];

export function calcStrength(password: string): StrengthResult {
  const percent = STRENGTH_RULES.reduce((score, rule) => score + rule(password), 0);
  const { color, label } = STRENGTH_LEVELS.find((l) => percent >= l.min)!;
  return { percent, color, label };
}
