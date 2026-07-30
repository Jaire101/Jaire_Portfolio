import { useEffect, useMemo, useState } from 'react';

const signals = [
  { id: 'hero', label: 'Marvel', type: 'word', mark: 'M' },
  { id: 'spider', label: 'Spider-Man', type: 'spider' },
  { id: 'iron', label: 'Iron-Man', type: 'arc' },
  { id: 'work', label: 'Portfolio', type: 'mask' },
];

const projects = [
  {
    title: 'Web-Slinger Command Center',
    tag: 'Interface Design',
    theme: 'spider',
    description:
      'A responsive operations dashboard concept with alert states, rapid actions, and web-like information paths.',
  },
  {
    title: 'Arc Reactor Analytics',
    tag: 'Frontend Engineering',
    theme: 'iron',
    description:
      'A high-contrast metrics experience built around glowing status cards, kinetic panels, and precision layout systems.',
  },
  {
    title: 'Hero Protocol Studio',
    tag: 'Creative Systems',
    theme: 'hybrid',
    description:
      'A portfolio-ready design language blending comic-book energy with polished product storytelling.',
  },
];

const skills = [
  'React interfaces',
  'Motion systems',
  'Responsive layouts',
  'Design direction',
  'Component architecture',
  'Visual polish',
];

function SignalMark({ type, label, isActive }) {
  if (type === 'word') {
    return (
      <span className="marvel-wordmark" aria-hidden="true">
        M
      </span>
    );
  }

  if (type === 'spider') {
    return (
      <svg
        className="signal-svg"
        viewBox="0 0 64 64"
        aria-hidden="true"
        data-active={isActive}
      >
        <path d="M32 9c5 7 10 12 10 24 0 13-5 20-10 22-5-2-10-9-10-22C22 21 27 16 32 9Z" />
        <path d="M22 27 7 18M22 35 5 36M24 43 9 54M42 27l15-9M42 35l17 1M40 43l15 11" />
        <path d="M32 18v34M24 28h16" />
      </svg>
    );
  }

  if (type === 'arc') {
    return (
      <svg
        className="signal-svg"
        viewBox="0 0 64 64"
        aria-hidden="true"
        data-active={isActive}
      >
        <circle cx="32" cy="32" r="18" />
        <circle cx="32" cy="32" r="8" />
        <path d="M32 4v12M32 48v12M4 32h12M48 32h12M13 13l9 9M42 42l9 9M51 13l-9 9M22 42l-9 9" />
      </svg>
    );
  }

  return (
    <svg
      className="signal-svg"
      viewBox="0 0 64 64"
      aria-label={label}
      data-active={isActive}
    >
      <path d="M13 18c8-7 30-7 38 0l-4 28c-9 8-21 8-30 0L13 18Z" />
      <path d="M21 31h11l-8 8M43 31H32l8 8" />
      <path d="M25 48c5 3 9 3 14 0" />
    </svg>
  );
}

function App() {
  const [activeSignal, setActiveSignal] = useState('hero');
  const signalIds = useMemo(() => signals.map((signal) => signal.id), []);

  useEffect(() => {
    const observedSections = signalIds
      .map((id) => document.querySelector(`[data-signal="${id}"]`))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSignal(visible.target.dataset.signal);
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.15, 0.35, 0.65],
      },
    );

    observedSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [signalIds]);

  return (
    <main className="portfolio-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <aside className="signal-rail" aria-label="Theme signal tracker">
        {signals.map((signal) => (
          <div
            className="signal-chip"
            data-active={activeSignal === signal.id}
            key={signal.id}
          >
            <SignalMark
              type={signal.type}
              label={signal.label}
              isActive={activeSignal === signal.id}
            />
            <span>{signal.label}</span>
          </div>
        ))}
      </aside>

      <nav className="topbar" aria-label="Portfolio navigation">
        <a href="#home">Portfolio</a>
        <div>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero-section reveal-zone" id="home" data-signal="hero">
        <div className="hero-copy">
          <p className="eyebrow">Marvel inspired portfolio</p>
          <h1>
            Building cinematic web experiences with hero-level precision.
          </h1>
          <p>
            A futuristic portfolio concept powered by Spider-Man agility,
            Iron-Man engineering, and scroll-reactive visual signals.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a href="#projects">View work</a>
            <a href="#contact">Start a mission</a>
          </div>
        </div>

        <div className="hero-stage" aria-hidden="true">
          <div className="reactor-core">
            <span />
            <span />
            <span />
          </div>
          <div className="web-lines">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="hero-card spider-card">
            <SignalMark type="spider" label="Spider-Man signal" isActive />
            <span>Agile motion</span>
          </div>
          <div className="hero-card iron-card">
            <SignalMark type="arc" label="Iron-Man signal" isActive />
            <span>Powered systems</span>
          </div>
        </div>
      </section>

      <section className="theme-split reveal-zone" data-signal="spider">
        <article className="theme-panel spider-panel">
          <p className="eyebrow">Spider-Man energy</p>
          <h2>Fast, flexible, and responsive from every angle.</h2>
          <p>
            Fluid grids, snappy transitions, and webbed connection lines create
            a portfolio that feels nimble without losing clarity.
          </p>
        </article>
        <div className="logo-fade-field" aria-hidden="true">
          <SignalMark type="spider" label="Spider-Man inspired mark" isActive />
          <SignalMark type="spider" label="Spider-Man inspired mark" />
          <SignalMark type="spider" label="Spider-Man inspired mark" />
        </div>
      </section>

      <section className="theme-split reveal-zone iron-layout" data-signal="iron">
        <div className="logo-fade-field reactor-field" aria-hidden="true">
          <SignalMark type="arc" label="Iron-Man inspired mark" isActive />
          <SignalMark type="arc" label="Iron-Man inspired mark" />
          <SignalMark type="arc" label="Iron-Man inspired mark" />
        </div>
        <article className="theme-panel iron-panel">
          <p className="eyebrow">Iron-Man engineering</p>
          <h2>Precision interfaces with armor-grade polish.</h2>
          <p>
            Metallic surfaces, reactor glow, and layered HUD details give the
            layout a premium technical feel.
          </p>
        </article>
      </section>

      <section
        className="projects-section reveal-zone"
        id="projects"
        data-signal="work"
      >
        <div className="section-heading">
          <p className="eyebrow">Featured builds</p>
          <h2>Selected portfolio missions</h2>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article
              className={`project-card ${project.theme}`}
              style={{ '--delay': `${index * 120}ms` }}
              key={project.title}
            >
              <span className="project-tag">{project.tag}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-meter" aria-hidden="true">
                <span />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="skills-section reveal-zone" id="skills">
        <div className="section-heading">
          <p className="eyebrow">Toolkit</p>
          <h2>Designed for impact, built for speed.</h2>
        </div>
        <div className="skill-grid">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="contact-section reveal-zone" id="contact">
        <div>
          <p className="eyebrow">Next mission</p>
          <h2>Ready for a portfolio that feels alive?</h2>
        </div>
        <a href="mailto:hello@example.com">hello@example.com</a>
      </section>
    </main>
  );
}

export default App;
