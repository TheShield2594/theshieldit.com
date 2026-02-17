# Code Complexity Audit — The Shield IT

**Date:** 2026-02-17
**Scope:** All TypeScript source files under `app/`, `components/`, and `lib/`
**Tool stack:** Next.js 15 / React 19 / TypeScript 5.7

---

## Executive Summary

The codebase is a 50-tool privacy-focused web app. The React layer is **generally lightweight** — 43 of 46 tool components are thin 15-line iframe wrappers. Complexity concentrates in four areas: a hand-rolled MD5 implementation, the password-generation logic, a massively-coupled dynamic-import registry, and a growing tool metadata file that now acts as both a type definition and a 500-line data store.

---

## Finding Index

| # | Finding | File | Importance |
|---|---------|------|-----------|
| F-01 | `generatePassword` — cyclomatic complexity ~25 | `components/tools/password-generator.tsx` | **8/10** |
| F-02 | Inline MD5 implementation — cognitive complexity ~15 | `components/tools/hash-generator.tsx` | **7/10** |
| F-03 | `hash-generator.tsx` — 326 lines, multi-responsibility | `components/tools/hash-generator.tsx` | **6/10** |
| F-04 | `lib/tools.ts` — 533 lines, single flat data file | `lib/tools.ts` | **5/10** |
| F-05 | `TOOLS_MAP` manual sync — efferent coupling of 48 | `app/tools/[slug]/client.tsx` | **9/10** |
| F-06 | `ICON_MAP` manual sync — 32 icon imports, silent failures | `components/tool-card.tsx` | **7/10** |
| F-07 | `password-generator.tsx` — mixed utility + UI responsibilities | `components/tools/password-generator.tsx` | **5/10** |
| F-08 | `calcStrength()` — cyclomatic complexity ~11 | `components/tools/password-generator.tsx` | **4/10** |
| F-09 | `ToolsGrid` keyboard shortcut — inline side-effect in component | `components/tools-grid.tsx` | **3/10** |
| F-10 | `client.tsx` triple-registration cost for every new tool | `app/tools/[slug]/client.tsx` + `lib/tools.ts` | **9/10** |

---

## 1. Cyclomatic Complexity

### F-01 — `generatePassword()` — Cyclomatic Complexity ≈ 25
**File:** `components/tools/password-generator.tsx:19–108`
**Importance: 8/10**

```
Decision points (each +1 to base of 1):
  !useUppercase && !useLowercase && …       +1
  if (useUppercase) charset +=              +1
  if (useLowercase) charset +=              +1
  if (useNumbers) charset +=               +1
  if (useSymbols) charset +=               +1
  if (excludeSimilar) charset.filter()      +1
  if (excludeAmbiguous) charset.filter()    +1
  if (charset.length === 0)                +1
  while (password.length < length)          +1
  if (value < maxValid)                    +1
  needsUpper: useUppercase && !/…/.test()  +1 (short-circuit)
  needsLower: useLowercase && !/…/.test()  +1
  needsNumber: useNumbers && !/…/.test()   +1
  needsSymbol: useSymbols && !/…/.test()   +1
  if (needsUpper)                          +1
    if (excludeSimilar) inside needsUpper  +1
  if (needsLower)                          +1
    if (excludeSimilar) inside needsLower  +1
  if (needsNumber)                         +1
    if (excludeSimilar) inside needsNumber +1
  if (needsSymbol)                         +1
    if (excludeAmbiguous) inside needsSymbol +1
  for (Fisher-Yates shuffle)               +1
  ─────────────────────────────────────
  Total CC ≈ 25   (threshold: 10)
```

**Remediation — extract each responsibility:**

```typescript
// lib/crypto/charset.ts
export function buildCharset(
  opts: Pick<PasswordOptions, 'useUppercase' | 'useLowercase' | 'useNumbers' | 'useSymbols' | 'excludeSimilar' | 'excludeAmbiguous'>
): string { /* ... single responsibility: charset assembly */ }

// lib/crypto/enforce-complexity.ts
export function enforceComplexity(
  pass: string[],
  opts: PasswordOptions
): string[] { /* ... single responsibility: required-char insertion */ }

// lib/crypto/shuffle.ts
export function cryptoShuffle(arr: string[]): string[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// generatePassword becomes a thin orchestrator (~15 lines, CC ≈ 3)
export function generatePassword(opts: PasswordOptions): string | null {
  const charset = buildCharset(opts);
  if (!charset) return null;
  const raw = sampleUniform(charset, opts.length);
  const enforced = enforceComplexity(raw.split(''), opts);
  return cryptoShuffle(enforced).join('');
}
```

---

### F-08 — `calcStrength()` — Cyclomatic Complexity ≈ 11
**File:** `components/tools/password-generator.tsx:110–128`
**Importance: 4/10**

Seven sequential `if` additions + 3 return branches = CC ≈ 11 (just above threshold).

**Remediation — table-driven approach:**

```typescript
const STRENGTH_RULES: Array<(p: string) => number> = [
  (p) => (p.length >= 8  ? 20 : 0),
  (p) => (p.length >= 12 ? 20 : 0),
  (p) => (p.length >= 16 ? 10 : 0),
  (p) => (/[a-z]/.test(p)        ? 12.5 : 0),
  (p) => (/[A-Z]/.test(p)        ? 12.5 : 0),
  (p) => (/[0-9]/.test(p)        ? 12.5 : 0),
  (p) => (/[^a-zA-Z0-9]/.test(p) ? 12.5 : 0),
];

const STRENGTH_LEVELS = [
  { min: 80, color: '#22c55e', label: 'Strong' },
  { min: 60, color: '#eab308', label: 'Good'   },
  { min: 40, color: '#f59e0b', label: 'Fair'   },
  { min:  0, color: '#ef4444', label: 'Weak'   },
] as const;

function calcStrength(password: string) {
  const percent = STRENGTH_RULES.reduce((s, fn) => s + fn(password), 0);
  const { color, label } = STRENGTH_LEVELS.find((l) => percent >= l.min)!;
  return { percent, color, label };
}
// CC = 2 (1 base + 1 reduce callback)
```

---

## 2. Cognitive Complexity

### F-02 — Inline MD5 Implementation — Cognitive Complexity ≈ 15+
**File:** `components/tools/hash-generator.tsx:5–86`
**Importance: 7/10**

The hand-rolled `md5()` function is **81 lines** occupying the top of a UI component file. Problems:

- Nested function definitions (`md5cycle`, `cmn`, `ff`, `gg`, `hh`, `ii`, `add32`) inside the outer function scope — confusing nesting.
- Magic numeric constants (e.g., `-680876936`, `1732584193`) with no inline comment linking them to the MD5 spec.
- Two nested loops for block processing + two more for hex encoding — four loop depths total.
- Mixed levels of abstraction: bit operations beside `new Uint8Array(buffer)` API calls.

**Remediation — replace with Web Crypto + a drop-in MD5 note:**

The browser already provides SHA-1, SHA-256, SHA-384, SHA-512 via `crypto.subtle.digest()`. MD5 is only kept for legacy checksum comparison. Move it to a dedicated utility and document why it is retained:

```typescript
// lib/crypto/md5.ts
/**
 * Pure-JS MD5 — retained ONLY for legacy checksum comparison (e.g., ISOs
 * still ship MD5 sums). SHA-256 is preferred for all new use-cases.
 *
 * Implementation: RFC 1321, Table 3–6 constants.
 */
export function md5(buffer: ArrayBuffer): string {
  // ... (move verbatim from hash-generator.tsx:5–86)
}
```

Then `hash-generator.tsx` shrinks from 326 → ~245 lines and the crypto detail is isolated where it can be tested independently.

---

### F-07 — `password-generator.tsx` Mixed Responsibilities
**File:** `components/tools/password-generator.tsx`
**Importance: 5/10**

The file contains:
1. Module-level charset constants (`UPPERCASE`, `SIMILAR`, etc.)
2. Cryptographic utilities (`cryptoPickChar`, `generatePassword`)
3. Strength heuristic (`calcStrength`)
4. React UI component (`PasswordGenerator`, 169 lines)

These are distinct concerns sharing one file. The crypto utilities are untestable without rendering React.

**Remediation:**

```
components/tools/password-generator.tsx  → UI component only (~80 lines)
lib/crypto/password.ts                  → generatePassword, cryptoPickChar, charsets
lib/crypto/strength.ts                  → calcStrength
```

---

## 3. Lines of Code Metrics

### F-03 — `hash-generator.tsx` — 326 Lines
**File:** `components/tools/hash-generator.tsx`
**Importance: 6/10**

Breakdown:

| Section | Lines |
|---------|-------|
| `md5()` implementation | 5–86 (81 lines) |
| `bufToHex`, `formatSize`, `generateHashes` | 88–107 (20 lines) |
| `HashGenerator` React component | 111–326 (215 lines) |

The component itself (215 lines) is above the 50-line function guideline but is primarily JSX — acceptable if the logic is extracted. The real offender is the 81-line MD5 implementation that has no business living in a UI file.

**Fix:** Extract `md5()` to `lib/crypto/md5.ts` (see F-02).

---

### F-04 — `lib/tools.ts` — 533 Lines
**File:** `lib/tools.ts`
**Importance: 5/10**

The file is a pure data store but at 533 lines it is past the 300-line file guideline. It mixes:

- Type definitions (`ToolCategory`, `Tool` interface)
- Category metadata (`CATEGORIES`)
- 50 tool records (`TOOLS`)
- Derived computation (`CATEGORY_COUNTS`)

No single function exceeds 50 lines, but the file as a whole imposes a long scroll for any edit.

**Remediation:**

```typescript
// lib/tools/types.ts        — ToolCategory, Tool interface
// lib/tools/categories.ts   — CATEGORIES, CATEGORY_COUNTS
// lib/tools/data.ts         — TOOLS array (data only)
// lib/tools/index.ts        — re-exports everything (no breaking changes)
```

---

## 4. Coupling Metrics

### F-05 — `TOOLS_MAP` — Manual Sync, Efferent Coupling of 48
**File:** `app/tools/[slug]/client.tsx`
**Importance: 9/10**

`client.tsx` maintains a `TOOLS_MAP` record with **48 hand-written `dynamic()` entries** (lines 29–77). Every time a new tool is added three files must change in lockstep:

1. `lib/tools.ts` — add `Tool` record with the slug
2. `app/tools/[slug]/client.tsx` — add `dynamic()` entry to `TOOLS_MAP`
3. `components/tools/<slug>.tsx` — create the component

If step 2 is forgotten, `ToolClientContent` silently renders nothing (the `console.error` on line 82 is only visible in dev tools).

**Coupling metrics:**

| Metric | Value |
|--------|-------|
| Fan-out (efferent) | 48 dynamic imports |
| Fan-in (afferent) | 1 (`app/tools/[slug]/page.tsx`) |
| Instability index | 48/49 ≈ 0.98 (highly unstable) |

**Remediation — convention-based auto-registration:**

Replace the manual dictionary with a Next.js `dynamic()` call that derives the path from the slug at runtime:

```typescript
// app/tools/[slug]/client.tsx
import dynamic from "next/dynamic"

const loading = () => <LoadingDots />

export function ToolClientContent({ slug }: { slug: string }) {
  // Turbopack/webpack does NOT support fully dynamic paths, so we keep a thin
  // manifest but generated automatically at build time via a script.
  // Alternatively: use a known path convention and catch missing modules.
  const Component = dynamic(
    () =>
      import(`@/components/tools/${slug}`).catch(() => ({
        default: () => (
          <p className="p-8 text-muted-foreground">
            Tool not found: <code>{slug}</code>
          </p>
        ),
      })),
    { loading }
  )
  return <Component />
}
```

> **Note:** Turbopack requires static import path prefixes for code splitting. A build-time script that generates `TOOLS_MAP` from the filesystem at `components/tools/*.tsx` is the safest production solution. This removes the manual step entirely and makes step 2 above automatic.

---

### F-06 — `ICON_MAP` — 32 Named Imports, Silent Fallback
**File:** `components/tool-card.tsx:1–65`
**Importance: 7/10**

`tool-card.tsx` imports **32 named Lucide icons** and maps them to string keys that must match the `icon` field in every `Tool` record in `lib/tools.ts`. The coupling is:

- `lib/tools.ts:icon` string → `tool-card.tsx:ICON_MAP` key
- If a string in `tools.ts` has no matching key, it silently falls back to `Shield` (line 68: `ICON_MAP[tool.icon] || Shield`)

**Coupling metrics:**

| Metric | Value |
|--------|-------|
| Fan-out (efferent) | 32 Lucide imports + `lib/tools`, `lib/utils`, `next/link` |
| Fan-in (afferent) | 1 (`components/tools-grid.tsx`) |
| Instability index | 35/36 ≈ 0.97 (highly unstable) |

**Remediation — co-locate the icon map with the type:**

```typescript
// lib/tools/types.ts
import type { LucideIcon } from "lucide-react"

// Keep icon as a discriminated union of valid strings so TypeScript
// catches typos at compile time instead of silently falling back.
export type ToolIcon =
  | "mail" | "search" | "lock" | "globe" | "key-round"
  | "hash" | "qr-code" | "shield-check" | "activity" | "shield"
  | "fingerprint" | "file-certificate" | "pen-line" | "shield-alert"
  | "image" | "map-pin" | "link" | "key" | "file-search"
  | "key-square" | "shield-off" | "wifi" | "radar" | "wrench"
  | "scan-search" | "network" | "clock" | "star" | "history"
  | "layout-grid" | "book-open" | "book-marked" | "book"
  | "newspaper" | "clipboard-list" | "trophy" | "drama"
  | "lock-keyhole" | "circle-help" | "file-diff" | "code"
  | "braces" | "regex" | "key-round"

export interface Tool {
  // ...
  icon: ToolIcon  // ← was `string`; typos now caught at compile time
}
```

Any `icon` value not in the union becomes a compile error instead of a silent Shield fallback.

---

## 5. Cohesion Analysis

### F-09 — `ToolsGrid` Keyboard Shortcut — Inline Side-Effect
**File:** `components/tools-grid.tsx:31–40`
**Importance: 3/10**

The `useEffect` that registers the `/` keyboard shortcut mixes DOM event management with search-filter state in a single component. It is a minor cohesion issue but obscures intent.

**Remediation — extract to a custom hook:**

```typescript
// hooks/useSearchShortcut.ts
export function useSearchShortcut(ref: React.RefObject<HTMLInputElement>) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [ref])
}

// Usage in ToolsGrid:
useSearchShortcut(inputRef)
```

---

### F-10 — Triple-Registration Cost for Every New Tool
**Files:** `lib/tools.ts`, `app/tools/[slug]/client.tsx`, `components/tools/<slug>.tsx`
**Importance: 9/10**

Adding a new tool requires three coordinated changes:

| Step | File | What to add |
|------|------|-------------|
| 1 | `lib/tools.ts` | New `Tool` object in `TOOLS[]` |
| 2 | `app/tools/[slug]/client.tsx` | New `dynamic()` entry in `TOOLS_MAP` |
| 3 | `components/tools/<slug>.tsx` | New component file |

Forgetting step 2 is silent in production. Forgetting to update `ICON_MAP` in `tool-card.tsx` is also silent (falls back to `Shield`). This is an **architectural coupling smell**, not just a style issue.

**Recommended fix:** Auto-generate `TOOLS_MAP` and validate `icon` strings at build time (see F-05 and F-06). A simple approach:

```typescript
// scripts/gen-tools-map.ts  (run as part of prebuild)
import { readdirSync } from "fs"
import { writeFileSync } from "fs"

const slugs = readdirSync("components/tools")
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(".tsx", ""))

const entries = slugs
  .map((s) => `  "${s}": dynamic(() => import("@/components/tools/${s}"), { loading }),`)
  .join("\n")

writeFileSync(
  "app/tools/[slug]/_tools-map.generated.ts",
  `// AUTO-GENERATED — do not edit\n` +
  `import dynamic from "next/dynamic"\n` +
  `import { LoadingDots } from "./_loading"\n\n` +
  `const loading = () => <LoadingDots />\n\n` +
  `export const TOOLS_MAP = {\n${entries}\n} as const\n`
)
```

Add to `package.json`:
```json
"scripts": {
  "prebuild": "tsx scripts/gen-tools-map.ts",
  "predev": "tsx scripts/gen-tools-map.ts"
}
```

---

## Metric Summary Table

| File | LOC | Largest function (LOC) | Cyclomatic CC | Notes |
|------|-----|------------------------|---------------|-------|
| `components/tools/hash-generator.tsx` | 326 | `md5()` 81 | ~10 | Over 300-line limit |
| `components/tools/password-generator.tsx` | 299 | `generatePassword()` 89 | **~25** | CC critical |
| `components/tools/jwt-decoder.tsx` | 240 | `JwtDecoder` component 199 | ~5 | Acceptable |
| `components/tools-grid.tsx` | 167 | `ToolsGrid` 158 | ~5 | Minor |
| `components/tool-card.tsx` | 116 | `ToolCard` 49 | ~2 | OK |
| `lib/tools.ts` | 533 | `CATEGORY_COUNTS` 4 | ~2 | Data file, over 300 lines |
| `app/tools/[slug]/client.tsx` | 87 | `TOOLS_MAP` literal 48 entries | ~2 | Coupling critical |
| `components/site-header.tsx` | 122 | `SiteHeader` 55 | ~4 | OK |
| `lib/utils.ts` | 6 | `cn()` 1 | 1 | Minimal |

---

## Coupling Summary Table

| Module | Fan-in (afferent) | Fan-out (efferent) | Instability | Risk |
|--------|-------------------|-------------------|-------------|------|
| `lib/tools.ts` | 4 | 0 | **0.00 (Stable)** | High — all consumers break on rename |
| `lib/utils.ts` | 3 | 2 | 0.40 | Low |
| `components/tool-card.tsx` | 1 | 35 | **0.97 (Unstable)** | ICON_MAP silent failures |
| `app/tools/[slug]/client.tsx` | 1 | 49 | **0.98 (Unstable)** | TOOLS_MAP manual sync |
| `components/tools-grid.tsx` | 1 | 5 | 0.83 | Moderate |
| `components/site-header.tsx` | 1 | 4 | 0.80 | Low |

---

## Prioritised Remediation Roadmap

| Priority | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 1 | **F-05 + F-10** — Auto-generate `TOOLS_MAP` | Medium | Eliminates silent tool-404s, reduces new-tool steps from 3 to 2 |
| 2 | **F-06** — Type `icon` as a union, not `string` | Low | Catches ICON_MAP typos at compile time |
| 3 | **F-01** — Extract `generatePassword` sub-functions | Medium | Reduces CC 25 → ~3 per function, enables unit testing |
| 4 | **F-02 + F-03** — Move `md5()` to `lib/crypto/md5.ts` | Low | Cuts `hash-generator.tsx` by 81 lines |
| 7 | **F-07** — Move crypto utilities out of `password-generator.tsx` | Low | Enables isolated unit tests |
| 8 | **F-08** — Table-driven `calcStrength` | Low | Cuts CC 11 → 2 |
| 9 | **F-04** — Split `lib/tools.ts` into sub-files | Low | Improves file navigability |
| 10 | **F-09** — Extract `useSearchShortcut` hook | Low | Cohesion improvement |
