/**
 * Exact toolbar icons copied from the live Notion Library page (viewBox 0 0 16 16,
 * filled with currentColor). These match Notion pixel-for-pixel.
 */

export function NotionFilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M2.4 3.7a.7.7 0 1 0 0 1.4h11.2a.7.7 0 1 0 0-1.4zm9.5 3.594H4.1a.7.7 0 1 0 0 1.4h7.8a.7.7 0 1 0 0-1.4M5.8 10.9a.7.7 0 1 0 0 1.4h4.4a.7.7 0 1 0 0-1.4z" />
    </svg>
  );
}

export function NotionSearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M7.1 1.975a5.125 5.125 0 1 0 3.155 9.164l3.107 3.107a.625.625 0 1 0 .884-.884l-3.107-3.107A5.125 5.125 0 0 0 7.1 1.975M3.225 7.1a3.875 3.875 0 1 1 7.75 0 3.875 3.875 0 0 1-7.75 0" />
    </svg>
  );
}

/** Notion AI "nosey" face mark — two eyebrows, two eyes, and a curvy nose stroke. */
export function NotionAiMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" fill="none" className={className} aria-hidden>
      {/* left eyebrow */}
      <path d="M150 168 Q204 118 259 160" stroke="currentColor" strokeWidth="32" strokeLinecap="round" />
      {/* right eyebrow */}
      <path d="M303 164 Q350 116 396 156" stroke="currentColor" strokeWidth="32" strokeLinecap="round" />
      {/* nose / mouth stroke */}
      <path
        d="M324 150 C 314 222 250 304 178 374 L 372 392"
        stroke="currentColor"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* eyes */}
      <circle cx="212" cy="208" r="24" fill="currentColor" />
      <circle cx="316" cy="212" r="24" fill="currentColor" />
    </svg>
  );
}

export function NotionSettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M2.25 5.531h5.692a2.126 2.126 0 0 0 4.116 0h1.692a.625.625 0 1 0 0-1.25H12a2.126 2.126 0 0 0-4 0H2.25a.625.625 0 1 0 0 1.25M10 4.125a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75m-4 9c.921 0 1.706-.586 2-1.406h5.75a.625.625 0 0 0 0-1.25H8.058a2.126 2.126 0 0 0-4.116 0H2.25a.625.625 0 1 0 0 1.25H4a2.13 2.13 0 0 0 2 1.406m0-1.25a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75" />
    </svg>
  );
}
