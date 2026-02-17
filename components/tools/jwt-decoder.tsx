"use client";

import { useState } from "react";

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return atob(str);
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type DecodedJWT = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
};

type ValidityInfo = {
  status: "valid" | "expired" | "no-exp";
  daysRemaining?: number;
};

function getValidity(payload: Record<string, unknown>): ValidityInfo {
  if (!payload.exp) return { status: "no-exp" };
  const now = Math.floor(Date.now() / 1000);
  const exp = payload.exp as number;
  if (now > exp) return { status: "expired" };
  const daysRemaining = Math.ceil((exp - now) / (60 * 60 * 24));
  return { status: "valid", daysRemaining };
}

function formatTimestamp(ts: unknown): string {
  if (typeof ts !== "number") return String(ts);
  return new Date(ts * 1000).toUTCString();
}

export default function JwtDecoder() {
  const [jwtInput, setJwtInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState<string | null>(null);

  function decodeJWT(value: string) {
    setJwtInput(value);
    const trimmed = value.trim();
    if (!trimmed) {
      setDecoded(null);
      setError(null);
      return;
    }
    try {
      const parts = trimmed.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Expected 3 parts separated by dots.");
      }
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];
      setDecoded({ header, payload, signature });
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setDecoded(null);
    }
  }

  const inputClass = "w-full rounded-lg border border-border bg-background/80 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-y min-h-[120px]";

  return (
    <div className="flex-1 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Input */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">JSON Web Token</label>
          <textarea
            value={jwtInput}
            onChange={(e) => decodeJWT(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            className={inputClass}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center">
            <div className="text-2xl mb-2">&#9888;&#65039;</div>
            <div className="text-base font-semibold text-destructive mb-2">Invalid JWT</div>
            <div className="text-sm text-muted-foreground">{error}</div>
          </div>
        )}

        {/* Decoded Results */}
        {decoded && (
          <>
            {/* Three sections grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Header */}
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <h3 className="text-sm font-semibold text-primary mb-3">Header</h3>
                <div className="bg-primary/5 border-l-2 border-primary rounded p-3">
                  <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-all max-h-[300px] overflow-y-auto">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Payload */}
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <h3 className="text-sm font-semibold text-purple-400 mb-3">Payload</h3>
                <div className="bg-purple-500/5 border-l-2 border-purple-500 rounded p-3">
                  <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-all max-h-[300px] overflow-y-auto">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Signature */}
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <h3 className="text-sm font-semibold text-cyan-400 mb-3">Signature</h3>
                <div className="bg-cyan-500/5 border-l-2 border-cyan-500 rounded p-3">
                  <code className="font-mono text-xs text-foreground break-all">{decoded.signature}</code>
                </div>
              </div>
            </div>

            {/* Token Information */}
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Token Information</h3>

              {/* Validity badge */}
              {(() => {
                const validity = getValidity(decoded.payload);
                if (validity.status === "expired") {
                  return (
                    <div className="inline-block px-3 py-1.5 rounded-lg text-sm font-semibold mb-4 bg-destructive/20 text-destructive border border-destructive/50">
                      Expired
                    </div>
                  );
                }
                if (validity.status === "valid") {
                  return (
                    <div className="inline-block px-3 py-1.5 rounded-lg text-sm font-semibold mb-4 bg-green-500/20 text-green-400 border border-green-500/50">
                      Valid ({validity.daysRemaining} days remaining)
                    </div>
                  );
                }
                return null;
              })()}

              <div className="space-y-3">
                {/* Algorithm */}
                <div className="pb-3 border-b border-border">
                  <div className="text-xs text-muted-foreground mb-1">Algorithm</div>
                  <div className="text-sm font-medium text-foreground">{escapeHtml(String(decoded.header.alg ?? "Unknown"))}</div>
                </div>

                {decoded.header.typ != null && (
                  <div className="pb-3 border-b border-border">
                    <div className="text-xs text-muted-foreground mb-1">Type</div>
                    <div className="text-sm font-medium text-foreground">{escapeHtml(String(decoded.header.typ))}</div>
                  </div>
                )}

                {decoded.payload.iss != null && (
                  <div className="pb-3 border-b border-border">
                    <div className="text-xs text-muted-foreground mb-1">Issuer</div>
                    <div className="text-sm font-medium text-foreground">{escapeHtml(String(decoded.payload.iss))}</div>
                  </div>
                )}

                {decoded.payload.sub != null && (
                  <div className="pb-3 border-b border-border">
                    <div className="text-xs text-muted-foreground mb-1">Subject</div>
                    <div className="text-sm font-medium text-foreground">{escapeHtml(String(decoded.payload.sub))}</div>
                  </div>
                )}

                {decoded.payload.aud != null && (
                  <div className="pb-3 border-b border-border">
                    <div className="text-xs text-muted-foreground mb-1">Audience</div>
                    <div className="text-sm font-medium text-foreground">{escapeHtml(String(decoded.payload.aud))}</div>
                  </div>
                )}

                {decoded.payload.iat != null && (
                  <div className="pb-3 border-b border-border">
                    <div className="text-xs text-muted-foreground mb-1">Issued At</div>
                    <div className="text-sm font-medium text-foreground">{formatTimestamp(decoded.payload.iat)}</div>
                  </div>
                )}

                {decoded.payload.exp != null && (
                  <div className="pb-3 border-b border-border">
                    <div className="text-xs text-muted-foreground mb-1">Expires At</div>
                    <div className="text-sm font-medium text-foreground">{formatTimestamp(decoded.payload.exp)}</div>
                  </div>
                )}

                {decoded.payload.nbf != null && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Not Before</div>
                    <div className="text-sm font-medium text-foreground">{formatTimestamp(decoded.payload.nbf)}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-sm font-semibold text-primary mb-3">About JSON Web Tokens</h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li><strong className="text-foreground">Header:</strong> Contains token type (typ) and signing algorithm (alg)</li>
            <li><strong className="text-foreground">Payload:</strong> Contains the claims (data) - subject, expiration, custom data, etc.</li>
            <li><strong className="text-foreground">Signature:</strong> Cryptographic signature to verify token integrity</li>
            <li><strong className="text-foreground">Format:</strong> Three Base64-URL encoded parts separated by dots (header.payload.signature)</li>
          </ul>

          <h3 className="text-sm font-semibold text-primary mt-5 mb-3">Common Claims</h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li><strong className="text-foreground">iss (Issuer):</strong> Who issued the token</li>
            <li><strong className="text-foreground">sub (Subject):</strong> Who the token is about (usually user ID)</li>
            <li><strong className="text-foreground">aud (Audience):</strong> Who the token is intended for</li>
            <li><strong className="text-foreground">exp (Expiration):</strong> When the token expires (Unix timestamp)</li>
            <li><strong className="text-foreground">iat (Issued At):</strong> When the token was issued (Unix timestamp)</li>
            <li><strong className="text-foreground">nbf (Not Before):</strong> Token not valid before this time</li>
          </ul>

          <h3 className="text-sm font-semibold text-primary mt-5 mb-3">Security Notes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>JWTs are signed but not encrypted - anyone can decode and read the contents</li>
            <li>Never put sensitive information (passwords, credit cards) in JWT payloads</li>
            <li>Always verify the signature on the server side</li>
            <li>Use strong signing algorithms (RS256, ES256) for production</li>
            <li>All decoding happens locally in your browser - no data is sent to any server</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
