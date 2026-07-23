import "./styles/TokenPreview.css";

const colors = [
  { name: "Porcelain", token: "--bg", hex: "#FCFAF9", amended: true },
  { name: "Surface", token: "--surface", hex: "#FFFFFF" },
  { name: "Blush", token: "--surface-blush", hex: "#F9EDEE" },
  { name: "Deep blush", token: "--surface-deep", hex: "#F3E2E4" },
  { name: "Rose", token: "--accent", hex: "#C97489" },
  { name: "Deep rose", token: "--accent-strong", hex: "#B25F76" },
  { name: "Petal", token: "--accent-soft", hex: "#EFC3CC" },
  { name: "Ink", token: "--text", hex: "#453A3E" },
  { name: "Dust", token: "--text-muted", hex: "#8B7B80" },
  { name: "Hairline", token: "--line", hex: "#EFE4E2" },
  { name: "Sage", token: "--ok", hex: "#6F9678" },
  { name: "Sage soft", token: "--ok-soft", hex: "#E4EFE6" },
  { name: "Apricot", token: "--note", hex: "#C08A52" },
  { name: "Apricot soft", token: "--note-soft", hex: "#F8ECDF" },
];

const typeScale = [
  { label: "Page title · 38/600", size: "var(--fs-2xl)", sample: "Good morning" },
  { label: "Section · 28/600", size: "var(--fs-xl)", sample: "Your week so far" },
  { label: "Card title · 22/600", size: "var(--fs-lg)", sample: "Morning routine" },
  { label: "Body · 17/400", size: "var(--fs-md)", sample: "Small steps, real momentum." },
  { label: "Secondary · 15/400", size: "var(--fs-sm)", sample: "8:00 – 9:00" },
  { label: "Caption · 13/600", size: "var(--fs-xs)", sample: "TODAY'S INTENTION" },
];

const radii = [
  { name: "--r-sm · 10px", value: "var(--r-sm)", use: "inputs, tags" },
  { name: "--r-md · 16px", value: "var(--r-md)", use: "buttons, small cards" },
  { name: "--r-lg · 24px", value: "var(--r-lg)", use: "cards, panels" },
  { name: "--r-pill", value: "var(--r-pill)", use: "tags, progress" },
];

function App() {
  return (
    <div className="wrap">
      <header className="hero">
        <p className="eyebrow">Soft Start · Design foundation</p>
        <h1>Soft Focus tokens</h1>
        <p className="lede">
          The Soft Focus v1.0 design system, carried over from{" "}
          <code>docs/style-guide.html</code> with the two amendments approved
          for Soft Start.
        </p>
        <div className="amend">
          <strong>Amendments:</strong> <code>--bg</code> lightened to{" "}
          <code>#FCFAF9</code>, and <code>--font-script: "Ephesis"</code> added
          for the wordmark, the day-of-week heading, and the greeting — nowhere
          else.
        </div>
      </header>

      <section>
        <div className="section-head">
          <p className="eyebrow">01 — Type</p>
          <h2>The three fonts</h2>
          <p className="lede">
            Outfit for display and UI, Nunito Sans for body text, Ephesis for
            the three script accents only.
          </p>
        </div>
        <div className="grid c3">
          <div className="card font-card">
            <div className="name">Outfit</div>
            <div className="sample" style={{ fontFamily: "var(--font-display)" }}>
              Aa Bb Cc
            </div>
            <div className="use">Display, headings, buttons, tags</div>
          </div>
          <div className="card font-card">
            <div className="name">Nunito Sans</div>
            <div className="sample" style={{ fontFamily: "var(--font-body)" }}>
              Aa Bb Cc
            </div>
            <div className="use">Body copy, everything else</div>
          </div>
          <div className="card font-card">
            <div className="name">Ephesis</div>
            <div className="sample" style={{ fontFamily: "var(--font-script)" }}>
              Soft Start
            </div>
            <div className="use">
              Wordmark · day-of-week heading · greeting — nowhere else
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <p className="eyebrow">02 — Type scale</p>
          <h2>Scale</h2>
        </div>
        <div className="card">
          {typeScale.map((row) => (
            <div className="spec" key={row.label}>
              <span className="label">{row.label}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: row.size, fontWeight: 600 }}>
                {row.sample}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <p className="eyebrow">03 — Color</p>
          <h2>Palette</h2>
          <p className="lede">
            Rose-led, warm neutrals. No red anywhere. Sage means "done" only;
            apricot means a gentle question only.
          </p>
        </div>
        <div className="grid c4">
          {colors.map((c) => (
            <div className={`swatch${c.amended ? " amended" : ""}`} key={c.token}>
              <div className="chip" style={{ background: `var(${c.token})` }} />
              <div className="meta">
                <strong>{c.name}</strong>
                <span>{c.token} · {c.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <p className="eyebrow">04 — Radius</p>
          <h2>Corners</h2>
        </div>
        <div className="grid c4">
          {radii.map((r) => (
            <div className="radius-demo" style={{ borderRadius: r.value }} key={r.name}>
              {r.name}
              <br />
              {r.use}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <p className="eyebrow">05 — Shadow</p>
          <h2>Depth</h2>
          <p className="lede">Rose-tinted shadows only. No borders for depth.</p>
        </div>
        <div className="grid c2">
          <div className="shadow-demo" style={{ boxShadow: "var(--shadow-rest)" }}>
            <h3>Rest</h3>
            <p><code>--shadow-rest</code> — the default card elevation.</p>
          </div>
          <div className="shadow-demo" style={{ boxShadow: "var(--shadow-lift)" }}>
            <h3>Lift</h3>
            <p><code>--shadow-lift</code> — hover, current block, sheets.</p>
          </div>
        </div>
      </section>

      <footer>
        Soft Start · design foundation session · verify this page against{" "}
        <code>docs/style-guide.html</code> and{" "}
        <code>docs/mockup-s1-today.html</code>.
      </footer>
    </div>
  );
}

export default App;
