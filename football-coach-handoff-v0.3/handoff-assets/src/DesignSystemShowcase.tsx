import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Dribbble,
  FileText,
  Info,
  LayoutDashboard,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import "./design-showcase.css";

type SectionId =
  | "foundations"
  | "buttons"
  | "forms"
  | "feedback"
  | "content"
  | "diagrams"
  | "accessibility";

type Position = { x: number; y: number };

const navigation: { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: "foundations", label: "Foundations", icon: LayoutDashboard },
  { id: "buttons", label: "Buttons & controls", icon: Plus },
  { id: "forms", label: "Forms", icon: FileText },
  { id: "feedback", label: "Feedback & status", icon: Bell },
  { id: "content", label: "Cards & content", icon: ClipboardList },
  { id: "diagrams", label: "Exercise diagrams", icon: Dribbble },
  { id: "accessibility", label: "Accessibility", icon: ShieldCheck },
];

const colourGroups = [
  {
    title: "Brand",
    swatches: [
      ["Forest green", "#174D32", "Strong emphasis and focus"],
      ["Primary green", "#267A43", "Primary actions and links"],
      ["Natural green", "#59A66B", "Decorative use only on light surfaces"],
      ["Pale green", "#E8F2EA", "Selected and soft surfaces"],
    ],
  },
  {
    title: "Neutrals",
    swatches: [
      ["App background", "#F7F9F7", "Main page background"],
      ["White", "#FFFFFF", "Cards and controls"],
      ["Primary text", "#202821", "Headings and body text"],
      ["Secondary text", "#5B665E", "Supporting text"],
      ["Functional border", "#6F8374", "Input and control boundaries"],
      ["Decorative border", "#DDE3DE", "Non-essential separation"],
    ],
  },
  {
    title: "Semantic",
    swatches: [
      ["Success", "#174D32", "#E8F2EA background"],
      ["Error", "#B42318", "#FEF3F2 background"],
      ["Warning", "#8A4B08", "#FFF7ED background"],
      ["Information", "#1D4ED8", "#EFF6FF background"],
    ],
  },
];


export default function DesignSystemShowcase() {
  const [activeSection, setActiveSection] = useState<SectionId>("foundations");
  const [sampleInput, setSampleInput] = useState("Rondo 4v2");
  const [ageGroup, setAgeGroup] = useState("U13–U15");
  const [includeNotes, setIncludeNotes] = useState(true);
  const [notice, setNotice] = useState("Your exercise has been saved.");
  const [showNotice, setShowNotice] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState("Blue team · Player 1");
  const [playerPositions, setPlayerPositions] = useState<Record<"blue" | "red", Position>>({
    blue: { x: 160, y: 128 },
    red: { x: 390, y: 190 },
  });

  const selectedTeam = selectedPlayer.startsWith("Blue") ? "blue" : "red";
  const activePosition = playerPositions[selectedTeam];

  const movePlayer = (dx: number, dy: number) => {
    setPlayerPositions((current) => ({
      ...current,
      [selectedTeam]: {
        x: Math.min(540, Math.max(42, current[selectedTeam].x + dx)),
        y: Math.min(278, Math.max(42, current[selectedTeam].y + dy)),
      },
    }));
  };

  const announce = (message: string) => {
    setNotice(message);
    setShowNotice(true);
  };

  return (
    <div className="ds-shell">
      <a className="ds-skip-link" href="#ds-main">Skip to main content</a>

      <aside className="ds-sidebar" aria-label="Design system navigation">
        <div className="ds-brand">
          <div className="ds-brand-mark" aria-hidden="true"><Dribbble size={22} /></div>
          <div>
            <div className="ds-brand-name">Football Coach</div>
            <div className="ds-brand-caption">Design system · v0.1</div>
          </div>
        </div>

        <nav className="ds-nav" aria-label="Showcase sections">
          <p className="ds-nav-heading">COMPONENT LIBRARY</p>
          {navigation.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`ds-nav-link${activeSection === id ? " is-active" : ""}`}
              aria-current={activeSection === id ? "location" : undefined}
              onClick={() => setActiveSection(id)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="ds-sidebar-note">
          <ShieldCheck size={18} aria-hidden="true" />
          <div>
            <strong>Accessibility target</strong>
            <span>WCAG 2.2 AA</span>
          </div>
        </div>
      </aside>

      <main id="ds-main" className="ds-main" tabIndex={-1}>
        <header className="ds-page-header">
          <div>
            <p className="ds-eyebrow">FOUNDATIONS & COMPONENTS</p>
            <h1>Design system</h1>
            <p className="ds-page-intro">
              A shared visual language for a clear, accessible football coaching experience.
            </p>
          </div>
          <span className="ds-version-pill">Version 0.1 · Prototype</span>
        </header>

        <div className="ds-content">
          <section id="foundations" className="ds-section" aria-labelledby="foundations-title">
            <div className="ds-section-heading">
              <div>
                <p className="ds-eyebrow">01 · FOUNDATIONS</p>
                <h2 id="foundations-title">Colour and typography</h2>
                <p>Quiet neutral surfaces, purposeful green accents and readable type.</p>
              </div>
            </div>

            {colourGroups.map((group) => (
              <div className="ds-panel" key={group.title}>
                <div className="ds-panel-heading"><h3>{group.title}</h3></div>
                <div className="ds-swatch-grid">
                  {group.swatches.map(([name, hex, usage]) => (
                    <div className="ds-swatch" key={name}>
                      <div className="ds-swatch-colour" style={{ backgroundColor: hex }} aria-hidden="true" />
                      <div className="ds-swatch-copy">
                        <strong>{name}</strong>
                        <code>{hex}</code>
                        <span>{usage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="ds-two-column">
              <div className="ds-panel ds-type-panel">
                <div className="ds-panel-heading"><h3>Typography · Manrope</h3></div>
                <p className="ds-type-display">Training sessions</p>
                <h3 className="ds-type-h2">Plan with confidence</h3>
                <h4 className="ds-type-h3">Passing and movement</h4>
                <p className="ds-type-body">Use clear instructions and coaching points to help everyone understand the exercise.</p>
                <p className="ds-type-muted">U14 · 16 players · 20 minutes</p>
              </div>
              <div className="ds-panel">
                <div className="ds-panel-heading"><h3>Spacing and shape</h3></div>
                <div className="ds-spacing-list">
                  {[4, 8, 12, 16, 24, 32, 48].map((size) => (
                    <div className="ds-spacing-row" key={size}>
                      <code>{size}px</code>
                      <div className="ds-spacing-track"><div style={{ width: `${size * 2.1}px` }} /></div>
                    </div>
                  ))}
                </div>
                <div className="ds-radius-row">
                  <div><span className="ds-radius-sample radius-sm" /><code>6px</code></div>
                  <div><span className="ds-radius-sample radius-md" /><code>8px</code></div>
                  <div><span className="ds-radius-sample radius-lg" /><code>10px</code></div>
                  <div><span className="ds-radius-sample radius-xl" /><code>12px</code></div>
                </div>
              </div>
            </div>
          </section>

          <section id="buttons" className="ds-section" aria-labelledby="buttons-title">
            <div className="ds-section-heading">
              <div>
                <p className="ds-eyebrow">02 · ACTIONS</p>
                <h2 id="buttons-title">Buttons and controls</h2>
                <p>Clear action hierarchy with visible keyboard focus and generous targets.</p>
              </div>
            </div>
            <div className="ds-panel">
              <div className="ds-example-row">
                <div className="ds-example-label"><strong>Primary</strong><span>Main action</span></div>
                <button className="ds-button ds-button-primary" type="button" onClick={() => announce("Primary button action activated.")}> <Plus size={17} aria-hidden="true" /> Create exercise</button>
              </div>
              <div className="ds-example-row">
                <div className="ds-example-label"><strong>Secondary</strong><span>Alternative action</span></div>
                <button className="ds-button ds-button-secondary" type="button" onClick={() => announce("Secondary button action activated.")}>Preview session</button>
              </div>
              <div className="ds-example-row">
                <div className="ds-example-label"><strong>Tertiary</strong><span>Low emphasis</span></div>
                <button className="ds-button ds-button-tertiary" type="button" onClick={() => announce("Tertiary action activated.")}>View details <ArrowRight size={16} aria-hidden="true" /></button>
              </div>
              <div className="ds-example-row">
                <div className="ds-example-label"><strong>Destructive</strong><span>Use with care</span></div>
                <button className="ds-button ds-button-danger" type="button" onClick={() => announce("Destructive action example selected. No data was deleted.")}> <X size={16} aria-hidden="true" /> Delete example</button>
              </div>
              <div className="ds-example-row">
                <div className="ds-example-label"><strong>Disabled</strong><span>Unavailable action</span></div>
                <button className="ds-button ds-button-primary" type="button" disabled>Save changes</button>
              </div>
              <div className="ds-example-row">
                <div className="ds-example-label"><strong>Icon button</strong><span>Accessible name required</span></div>
                <button className="ds-icon-button" type="button" aria-label="Search exercises" onClick={() => announce("Search action activated.")}><Search size={19} aria-hidden="true" /></button>
              </div>
            </div>
          </section>

          <section id="forms" className="ds-section" aria-labelledby="forms-title">
            <div className="ds-section-heading">
              <div>
                <p className="ds-eyebrow">03 · INPUT</p>
                <h2 id="forms-title">Forms and fields</h2>
                <p>Persistent labels, clear boundaries and helpful instructions.</p>
              </div>
            </div>
            <div className="ds-panel ds-form-grid">
              <div className="ds-field">
                <label htmlFor="sample-exercise-name">Exercise name <span className="ds-required">Required</span></label>
                <input id="sample-exercise-name" className="ds-input" required value={sampleInput} onChange={(event) => setSampleInput(event.target.value)} />
                <span className="ds-help">Use a short name coaches can recognise.</span>
              </div>
              <div className="ds-field">
                <label htmlFor="sample-age-group">Age group</label>
                <div className="ds-select-wrap">
                  <select id="sample-age-group" className="ds-input" value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}>
                    <option>U9–U11</option>
                    <option>U12</option>
                    <option>U13–U15</option>
                    <option>U16–Senior</option>
                    <option>All age groups</option>
                  </select>
                  <ChevronDown size={17} aria-hidden="true" />
                </div>
              </div>
              <div className="ds-field ds-field-full">
                <label htmlFor="sample-description">Description</label>
                <textarea id="sample-description" className="ds-input ds-textarea" defaultValue="A possession exercise focused on quick decisions and supporting angles." />
                <span className="ds-help">Explain the setup and objective in plain language.</span>
              </div>
              <div className="ds-field ds-field-full">
                <label className="ds-checkbox-label">
                  <input type="checkbox" checked={includeNotes} onChange={(event) => setIncludeNotes(event.target.checked)} />
                  <span className="ds-checkbox-visual" aria-hidden="true"><Check size={13} /></span>
                  <span>Include coaching notes in the session overview</span>
                </label>
              </div>
              <div className="ds-field ds-field-full">
                <label htmlFor="sample-error">Validation example</label>
                <input id="sample-error" className="ds-input ds-input-error" aria-invalid="true" aria-describedby="sample-error-message" placeholder="Enter an exercise name" />
                <span id="sample-error-message" className="ds-field-error"><AlertCircle size={15} aria-hidden="true" /> Exercise name is required.</span>
              </div>
              <div className="ds-field ds-field-full ds-form-actions">
                <button type="button" className="ds-button ds-button-primary" onClick={() => announce(`Saved example: ${sampleInput || "Untitled exercise"} · ${ageGroup}${includeNotes ? " · Notes included" : ""}.`)}>Save example</button>
                <span className="ds-help">This is an interactive sample; it does not save application data.</span>
              </div>
            </div>
          </section>

          <section id="feedback" className="ds-section" aria-labelledby="feedback-title">
            <div className="ds-section-heading">
              <div>
                <p className="ds-eyebrow">04 · FEEDBACK</p>
                <h2 id="feedback-title">Feedback and status</h2>
                <p>Messages use text and icons as well as colour.</p>
              </div>
            </div>
            <div className="ds-panel ds-alert-stack">
              <div className="ds-alert ds-alert-success" role="status"><CheckCircle2 size={19} aria-hidden="true" /><div><strong>Exercise saved</strong><span>Your changes have been saved successfully.</span></div></div>
              <div className="ds-alert ds-alert-error" role="alert"><AlertCircle size={19} aria-hidden="true" /><div><strong>Couldn't save exercise</strong><span>Check the required fields and try again.</span></div></div>
              <div className="ds-alert ds-alert-warning"><AlertTriangle size={19} aria-hidden="true" /><div><strong>Review before deleting</strong><span>This action cannot be undone.</span></div></div>
              <div className="ds-alert ds-alert-info"><Info size={19} aria-hidden="true" /><div><strong>Club library</strong><span>Shared exercises can be used directly or duplicated.</span></div></div>
              <div className="ds-notice-demo">
                <div className="ds-notice-copy" role="status" aria-live="polite">{showNotice ? notice : "No new message."}</div>
                <button className="ds-button ds-button-secondary" type="button" onClick={() => announce("A new example status message was announced.")}>Show message</button>
                <button className="ds-button ds-button-tertiary" type="button" onClick={() => setShowNotice(false)}>Clear message</button>
              </div>
            </div>
          </section>

          <section id="content" className="ds-section" aria-labelledby="content-title">
            <div className="ds-section-heading">
              <div>
                <p className="ds-eyebrow">05 · CONTENT</p>
                <h2 id="content-title">Cards and content patterns</h2>
                <p>Consistent ways to display exercises, sessions and metadata.</p>
              </div>
            </div>
            <div className="ds-two-column">
              <article className="ds-content-card">
                <div className="ds-card-art" aria-hidden="true">
                  <svg viewBox="0 0 340 150" role="presentation">
                    <rect x="1" y="1" width="338" height="148" rx="8" fill="#E8F2EA" />
                    <rect x="18" y="16" width="304" height="118" rx="2" fill="none" stroke="#6F8374" strokeWidth="1.5" />
                    <path d="M170 16 V134 M170 53 A24 24 0 1 0 170 101 A24 24 0 1 0 170 53" fill="none" stroke="#6F8374" strokeWidth="1.3" />
                    <circle cx="90" cy="56" r="11" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" /><text x="90" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">1</text>
                    <circle cx="140" cy="99" r="11" fill="#B42318" stroke="#FFFFFF" strokeWidth="2" /><text x="140" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">2</text>
                    <path d="M101 61 L128 91" stroke="#174D32" strokeWidth="2.5" fill="none" /><path d="M120 88 L128 91 L126 82" stroke="#174D32" strokeWidth="2.5" fill="none" />
                  </svg>
                </div>
                <div className="ds-card-body">
                  <div className="ds-card-meta"><span className="ds-chip">Passing</span><span>15 min</span></div>
                  <h3>Passing combination</h3>
                  <p>Quick passing and movement to create a supporting angle.</p>
                  <div className="ds-card-footer"><span>12–16 players</span><button className="ds-button ds-button-tertiary" type="button" onClick={() => announce("Exercise detail action selected.")}>View exercise <ArrowRight size={15} aria-hidden="true" /></button></div>
                </div>
              </article>
              <div className="ds-panel ds-session-panel">
                <div className="ds-panel-heading"><div><span className="ds-chip">U14 · Passing</span><h3>Passing and movement</h3></div><span className="ds-duration">90 min</span></div>
                <ol className="ds-session-list">
                  <li><span className="ds-session-index">01</span><div><strong>Passing square</strong><span>Warm-up · 15 minutes</span></div></li>
                  <li><span className="ds-session-index">02</span><div><strong>Passing combinations</strong><span>Main exercise · 25 minutes</span></div></li>
                  <li><span className="ds-session-index">03</span><div><strong>Small-sided match</strong><span>Game · 50 minutes</span></div></li>
                </ol>
                <button className="ds-button ds-button-secondary ds-full-button" type="button" onClick={() => announce("Session overview opened in the example.")}>Open session</button>
              </div>
            </div>
          </section>

          <section id="diagrams" className="ds-section" aria-labelledby="diagrams-title">
            <div className="ds-section-heading">
              <div>
                <p className="ds-eyebrow">06 · TACTICAL VISUALS</p>
                <h2 id="diagrams-title">Exercise diagram language</h2>
                <p>Team colours, shapes and line styles work together so the diagram is not colour-dependent.</p>
              </div>
            </div>
            <div className="ds-panel">
              <div className="ds-diagram-legend" aria-label="Diagram legend">
                <span><i className="ds-legend-dot team-a" aria-hidden="true" /> Team A · Blue circle</span>
                <span><i className="ds-legend-dot team-b" aria-hidden="true" /> Team B · Red circle</span>
                <span><i className="ds-legend-cone" aria-hidden="true" /> Cone</span>
                <span><i className="ds-legend-line movement" aria-hidden="true" /> Movement</span>
                <span><i className="ds-legend-line pass" aria-hidden="true" /> Pass</span>
              </div>
              <figure className="ds-pitch-figure">
                <svg className="ds-pitch" viewBox="0 0 600 320" role="img" aria-labelledby="ds-pitch-title ds-pitch-description">
                  <title id="ds-pitch-title">Example passing exercise diagram</title>
                  <desc id="ds-pitch-description">A football pitch with a blue team player one, a red team player two, an orange cone and a dashed blue passing route. Use the movement controls below to reposition the selected blue player without dragging.</desc>
                  <rect x="2" y="2" width="596" height="316" rx="8" fill="#E8F2EA" stroke="#6F8374" strokeWidth="2" />
                  <rect x="20" y="20" width="560" height="280" fill="none" stroke="#6F8374" strokeWidth="2" />
                  <path d="M300 20 V300 M300 105 A45 45 0 1 0 300 215 A45 45 0 1 0 300 105" fill="none" stroke="#6F8374" strokeWidth="2" />
                  <rect x="20" y="95" width="72" height="130" fill="none" stroke="#6F8374" strokeWidth="2" />
                  <rect x="508" y="95" width="72" height="130" fill="none" stroke="#6F8374" strokeWidth="2" />
                  <path d={`M${playerPositions.blue.x} ${playerPositions.blue.y} L${playerPositions.red.x} ${playerPositions.red.y}`} stroke="#174D32" strokeWidth="3" fill="none" />
                  <path d={`M${playerPositions.red.x - 10} ${playerPositions.red.y - 9} L${playerPositions.red.x} ${playerPositions.red.y} L${playerPositions.red.x - 13} ${playerPositions.red.y + 3}`} stroke="#174D32" strokeWidth="3" fill="none" />
                  <path d={`M${playerPositions.red.x} ${playerPositions.red.y} L490 100`} stroke="#1D4ED8" strokeWidth="3" strokeDasharray="8 6" fill="none" />
                  <path d="M479 102 L490 100 L488 111" stroke="#1D4ED8" strokeWidth="3" fill="none" />
                  <circle cx={activePosition.x} cy={activePosition.y} r="24" fill="none" stroke="#174D32" strokeWidth="3" strokeDasharray="4 4" />
                  <circle cx={playerPositions.blue.x} cy={playerPositions.blue.y} r="17" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="3" />
                  <text x={playerPositions.blue.x} y={playerPositions.blue.y + 5} fill="#FFFFFF" textAnchor="middle" fontSize="13" fontWeight="700">1</text>
                  <circle cx={playerPositions.red.x} cy={playerPositions.red.y} r="17" fill="#B42318" stroke="#FFFFFF" strokeWidth="3" />
                  <text x={playerPositions.red.x} y={playerPositions.red.y + 5} fill="#FFFFFF" textAnchor="middle" fontSize="13" fontWeight="700">2</text>
                  <path d="M490 85 L505 112 L475 112 Z" fill="#A34A00" stroke="#202821" strokeWidth="1.5" />
                  <circle cx="250" cy="235" r="8" fill="#FFFFFF" stroke="#202821" strokeWidth="2" />
                </svg>
                <figcaption>Example only. The written exercise instructions remain available independently of the diagram.</figcaption>
              </figure>
              <div className="ds-diagram-controls">
                <div className="ds-field">
                  <label htmlFor="diagram-player">Selected object</label>
                  <select id="diagram-player" className="ds-input" value={selectedPlayer} onChange={(event) => setSelectedPlayer(event.target.value)}>
                    <option>Blue team · Player 1</option>
                    <option>Red team · Player 2</option>
                  </select>
                </div>
                <div className="ds-nudge-control" role="group" aria-labelledby="ds-nudge-label">
                  <span id="ds-nudge-label">Move selected object</span>
                  <div className="ds-nudge-grid">
                    <span />
                    <button type="button" className="ds-icon-button" aria-label="Move selected object up" onClick={() => movePlayer(0, -8)}><ArrowUp size={18} aria-hidden="true" /></button>
                    <span />
                    <button type="button" className="ds-icon-button" aria-label="Move selected object left" onClick={() => movePlayer(-8, 0)}><ArrowLeft size={18} aria-hidden="true" /></button>
                    <button type="button" className="ds-icon-button" aria-label="Move selected object down" onClick={() => movePlayer(0, 8)}><ArrowDown size={18} aria-hidden="true" /></button>
                    <button type="button" className="ds-icon-button" aria-label="Move selected object right" onClick={() => movePlayer(8, 0)}><ArrowRight size={18} aria-hidden="true" /></button>
                  </div>
                </div>
                <p className="ds-help" role="status" aria-live="polite">Selected: {selectedPlayer}. Position {Math.round(activePosition.x)}, {Math.round(activePosition.y)}. Use the direction buttons to move the selected player.</p>
              </div>
              <div className="ds-diagram-description">
                <BookOpen size={18} aria-hidden="true" />
                <div><strong>Written explanation</strong><p>Blue player 1 plays forward towards red player 2, then moves into space. Red player 2 returns the pass. The orange cone marks the movement point.</p></div>
              </div>
            </div>
          </section>

          <section id="accessibility" className="ds-section" aria-labelledby="accessibility-title">
            <div className="ds-section-heading">
              <div>
                <p className="ds-eyebrow">07 · QUALITY</p>
                <h2 id="accessibility-title">Accessibility checklist</h2>
                <p>Design and implementation requirements to verify as the prototype grows.</p>
              </div>
            </div>
            <div className="ds-panel ds-checklist">
              {[
                "Text contrast meets WCAG AA for every foreground/background pair.",
                "All functionality is available with a keyboard.",
                "Focus indicators are visible and not obscured.",
                "Controls have persistent labels and accessible names.",
                "Touch targets are 44px where practical; WCAG minimum is checked.",
                "Diagram meaning is not conveyed by colour alone.",
                "Diagram editing has a non-drag alternative.",
                "Content reflows at 320 CSS pixels without loss of functionality, except the diagram workspace itself.",
                "Reduced-motion preferences are respected.",
                "Automated and manual accessibility tests are completed before release.",
              ].map((item) => (
                <div className="ds-check-row" key={item}><CheckCircle2 size={18} aria-hidden="true" /><span>{item}</span></div>
              ))}
              <p className="ds-help">This is a checklist, not an assertion that the full application has already been audited or certified.</p>
            </div>
          </section>

          <footer className="ds-footer">
            <span>Football Coach · Design system v0.1</span>
            <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">WCAG 2.2 guidelines <ArrowRight size={14} aria-hidden="true" /></a>
          </footer>
        </div>
      </main>
    </div>
  );
}
