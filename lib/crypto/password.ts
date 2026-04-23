/**
 * Password generation utilities.
 * Extracted from components/tools/password-generator.tsx so the logic can be
 * shared and tested independently of any UI component.
 */

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR = "il1Lo0O";
const AMBIGUOUS = "{}[]()/\\'\"`,;:.<>";

export interface PasswordOptions {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

/** Bias-free random character from a non-empty string. */
function cryptoPickChar(chars: string): string {
  const max = Math.floor(0xffffffff / chars.length) * chars.length;
  const buf = new Uint32Array(1);
  do { crypto.getRandomValues(buf); } while (buf[0] >= max);
  return chars[buf[0] % chars.length];
}

/** Build the allowed character set from the given options. */
function buildCharset(opts: PasswordOptions): string {
  let charset = "";
  if (opts.useUppercase) charset += UPPERCASE;
  if (opts.useLowercase) charset += LOWERCASE;
  if (opts.useNumbers) charset += NUMBERS;
  if (opts.useSymbols) charset += SYMBOLS;
  if (opts.excludeSimilar) charset = charset.split("").filter((c) => !SIMILAR.includes(c)).join("");
  if (opts.excludeAmbiguous) charset = charset.split("").filter((c) => !AMBIGUOUS.includes(c)).join("");
  return charset;
}

/**
 * Guarantee that every required character class appears at least once.
 * Replaces early positions in the array in-place (caller shuffles afterwards).
 */
function enforceComplexity(pass: string[], opts: PasswordOptions): void {
  let idx = 0;
  if (opts.useUppercase && !/[A-Z]/.test(pass.join(""))) {
    let chars = UPPERCASE;
    if (opts.excludeSimilar) chars = chars.split("").filter((c) => !SIMILAR.includes(c)).join("");
    pass[idx++] = cryptoPickChar(chars);
  }
  if (opts.useLowercase && !/[a-z]/.test(pass.join(""))) {
    let chars = LOWERCASE;
    if (opts.excludeSimilar) chars = chars.split("").filter((c) => !SIMILAR.includes(c)).join("");
    pass[idx++] = cryptoPickChar(chars);
  }
  if (opts.useNumbers && !/[0-9]/.test(pass.join(""))) {
    let chars = NUMBERS;
    if (opts.excludeSimilar) chars = chars.split("").filter((c) => !SIMILAR.includes(c)).join("");
    pass[idx++] = cryptoPickChar(chars);
  }
  if (opts.useSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pass.join(""))) {
    let chars = SYMBOLS;
    if (opts.excludeAmbiguous) chars = chars.split("").filter((c) => !AMBIGUOUS.includes(c)).join("");
    pass[idx++] = cryptoPickChar(chars);
  }
}

/** Cryptographically uniform Fisher-Yates shuffle (in-place). */
function cryptoShuffle(arr: string[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Generate a cryptographically random password from the given options.
 * Returns `null` if no character class is selected or the resulting charset
 * is empty after exclusions.
 */
export function generatePassword(opts: PasswordOptions): string | null {
  if (!opts.useUppercase && !opts.useLowercase && !opts.useNumbers && !opts.useSymbols) {
    return null;
  }
  const charset = buildCharset(opts);
  if (!charset) return null;

  const maxValid = Math.floor(0xffffffff / charset.length) * charset.length;
  const pass: string[] = [];
  while (pass.length < opts.length) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    if (buf[0] < maxValid) pass.push(charset[buf[0] % charset.length]);
  }

  enforceComplexity(pass, opts);
  cryptoShuffle(pass);
  return pass.join("");
}
