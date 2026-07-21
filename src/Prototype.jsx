import { useState } from 'react';
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Asterisk } from 'lucide-react';
import ClickSpark from './components/ClickSpark.jsx';
import Magnet from './components/Magnet.jsx';
import MagnetLines from './components/MagnetLines.jsx';

const projects = [
  {
    id: 'WB/MULTI',
    name: 'WorldBox Multiplayer',
    field: 'Realtime systems',
    year: '2026',
    note: 'Versioned multiplayer releases with synchronized state and SHA-256 verified updates.',
    tech: 'C# / .NET / UNITY',
    href: 'https://github.com/ParrrotVR/WorldBoxMultiplayer-Releases',
    visual: 'world'
  },
  {
    id: 'CP/WEB',
    name: 'CloverPit Web Port',
    field: 'Game preservation',
    year: '2026',
    note: 'A zero-install browser port where player progress persists between sessions.',
    tech: 'HTML5 / JS / LOCAL STATE',
    href: 'https://github.com/ParrrotVR/cloverpit',
    visual: 'clover'
  },
  {
    id: 'FR/GODOT',
    name: 'Funi Raccoon Port',
    field: 'Build engineering',
    year: '2026',
    note: 'A heavyweight Godot export split into deterministic chunks for GitHub-native delivery.',
    tech: 'GODOT / WASM / SHELL',
    href: 'https://github.com/ParrrotVR/funiracoondemowebport',
    visual: 'chunks'
  },
  {
    id: 'UP/RUN',
    name: 'Ultrapool Web Port',
    field: 'Browser runtime',
    year: '2026',
    note: 'A desktop game adapted into a fast, portable, static web experience.',
    tech: 'JAVASCRIPT / HTML5',
    href: 'https://github.com/ParrrotVR/ultrapoolwebport',
    visual: 'pool'
  }
];

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M12 .7C5.7.7.6 5.8.6 12.1c0 5 3.3 9.2 7.8 10.7.6.1.8-.2.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6a11.5 11.5 0 0 0 7.8-10.7C23.4 5.8 18.3.7 12 .7Z" />
    </svg>
  );
}

function PreviewGraphic({ type }) {
  return (
    <div className={`proto-graphic visual-${type}`} aria-hidden="true">
      <div className="proto-crosshair"><i /><i /></div>
      {type === 'world' && <><b className="world-ring ring-one" /><b className="world-ring ring-two" /><span className="world-core">SYNC</span></>}
      {type === 'clover' && <div className="proto-clover"><i /><i /><i /><i /></div>}
      {type === 'chunks' && <div className="proto-chunks"><i /><i /><i /><i /><i /><i /></div>}
      {type === 'pool' && <div className="proto-pool"><i>8</i><i>3</i><i>12</i></div>}
    </div>
  );
}

export default function Prototype() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <ClickSpark colors={['#ff5b35', '#1538cf']} sparkCount={12}>
      <div className="prototype-shell">
        <header className="prototype-nav">
          <a className="proto-brand" href="/">P///VR</a>
          <p>Independent engineering<br />and browser systems</p>
          <span className="proto-status"><i /> Prototype 02 / Live</span>
          <nav className="proto-switch-group">
            <a className="proto-switch" href="/monochrome/">03 / Mono</a>
            <a className="proto-switch" href="/"><ArrowLeft size={15} /> Original</a>
          </nav>
        </header>

        <main>
          <section className="prototype-hero">
            <div className="proto-ruler ruler-top">0&nbsp;&nbsp;&nbsp;&nbsp;20&nbsp;&nbsp;&nbsp;&nbsp;40&nbsp;&nbsp;&nbsp;&nbsp;60&nbsp;&nbsp;&nbsp;&nbsp;80&nbsp;&nbsp;&nbsp;&nbsp;100</div>
            <div className="hero-title-block">
              <p className="proto-kicker">Selected experiments / 2026</p>
              <h1>
                <span>PORT THE</span>
                <span className="outline-word">IMPOSSIBLE</span>
              </h1>
              <div className="hero-note">
                <ArrowDownRight />
                <p>Old runtimes. New environments.<br />No install required.</p>
              </div>
            </div>
            <div className="signal-field">
              <MagnetLines rows={8} columns={8} />
              <span className="signal-label">Pointer field / Active</span>
            </div>
            <div className="hero-spec">
              <span>DISCIPLINES</span>
              <p>Browser engineering<br />Game systems<br />Security research</p>
              <span>OPERATING PRINCIPLE</span>
              <p>Ship it fast.<br />Make it persist.<br />Run it anywhere.</p>
            </div>
            <div className="rotating-stamp" aria-hidden="true"><span>PROTO / 02</span><Asterisk /></div>
          </section>

          <section className="prototype-work" id="prototype-work">
            <div className="proto-section-head">
              <p>INDEX_01</p>
              <h2>Work archive</h2>
              <span>Hover to inspect</span>
            </div>
            <div className="work-console">
              <div className="work-index">
                {projects.map((item, index) => (
                  <a
                    className={`work-row ${active === index ? 'is-active' : ''}`}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    key={item.id}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                  >
                    <span>{item.id}</span>
                    <h3>{item.name}</h3>
                    <p>{item.field}</p>
                    <span>{item.year}</span>
                    <ArrowUpRight />
                  </a>
                ))}
              </div>
              <aside className="project-inspector" aria-live="polite">
                <div className="inspector-bar"><span>PREVIEW::{project.id}</span><i /><i /><i /></div>
                <PreviewGraphic type={project.visual} />
                <div className="inspector-copy">
                  <p>{project.note}</p>
                  <span>{project.tech}</span>
                </div>
              </aside>
            </div>
          </section>

          <section className="prototype-method">
            <div className="proto-section-head">
              <p>METHOD_02</p>
              <h2>How I work</h2>
              <span>Three recurring moves</span>
            </div>
            <div className="method-grid">
              <article><span>01</span><h3>Deconstruct</h3><p>Trace the runtime, formats, and assumptions until the real system appears.</p></article>
              <article><span>02</span><h3>Translate</h3><p>Move the essential behavior into a modern, portable browser environment.</p></article>
              <article><span>03</span><h3>Persist</h3><p>Engineer the saves, sync, and delivery details that make it genuinely usable.</p></article>
            </div>
          </section>

          <section className="prototype-contact">
            <p>Open to strange technical problems.</p>
            <h2>MAKE THE<br /><span>UNRUNNABLE</span><br />RUN.</h2>
            <Magnet strength={6} padding={110}>
              <a className="proto-contact-button" href="https://github.com/ParrrotVR" target="_blank" rel="noreferrer">
                <GitHubMark /> Start on GitHub <ArrowUpRight />
              </a>
            </Magnet>
          </section>
        </main>

        <footer className="prototype-footer">
          <span>PARRROTVR © 2026</span>
          <a href="/">Return to original portfolio</a>
          <span>PROTOTYPE 02 / 02</span>
        </footer>
      </div>
    </ClickSpark>
  );
}
