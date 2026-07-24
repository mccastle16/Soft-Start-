/** Lucide-style icons, 1.75px stroke, round caps — matches the mockup's inline SVGs exactly. */

export function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="4" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

export function WavesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M3 9c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3M3 15c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3M3 21c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3"
        transform="translate(0,-2)"
      />
    </svg>
  );
}
