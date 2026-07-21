import { ArrowDown, ArrowUpRight, Circle } from 'lucide-react';
import GodRays from './components/GodRays.jsx';
import Reveal from './components/Reveal.jsx';
import Magnet from './components/Magnet.jsx';
import ClickSpark from './components/ClickSpark.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import SystemsField from './components/SystemsField.jsx';

const projects = [
  {
    number: '01',
    title: 'WorldBox Multiplayer',
    category: 'Realtime systems',
    description: 'A release and synchronization layer for bringing multiplayer behavior into a world that began as single-player.',
    tech: ['C#', '.NET', 'State sync'],
    href: 'https://github.com/ParrrotVR/WorldBoxMultiplayer-Releases',
    art: 'signal'
  },
  {
    number: '02',
    title: 'CloverPit Web Port',
    category: 'Game preservation',
    description: 'The complete game experience translated to a zero-install browser runtime with durable local saves.',
    tech: ['HTML5', 'JavaScript', 'Persistence'],
    href: 'https://github.com/ParrrotVR/cloverpit',
    art: 'portal'
  },
  {
    number: '03',
    title: 'Funi Raccoon Port',
    category: 'Build engineering',
    description: 'A heavyweight Godot export redesigned for GitHub-native delivery through deterministic chunking.',
    tech: ['Godot', 'WASM', 'Tooling'],
    href: 'https://github.com/ParrrotVR/funiracoondemowebport',
    art: 'blocks'
  },
  {
    number: '04',
    title: 'Ultrapool Web Port',
    category: 'Browser runtime',
    description: 'A desktop title stripped to its essential systems and repackaged as a fast, static web experience.',
    tech: ['JavaScript', 'HTML5', 'Static'],
    href: 'https://github.com/ParrrotVR/ultrapoolwebport',
    art: 'spheres'
  }
];

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 .7C5.7.7.6 5.8.6 12.1c0 5 3.3 9.2 7.8 10.7.6.1.8-.2.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6a11.5 11.5 0 0 0 7.8-10.7C23.4 5.8 18.3.7 12 .7Z" />
    </svg>
  );
}

function MonoArt({ type }) {
  return (
    <div className={`mono-art visual-${type}`} aria-hidden="true">
      <div className="mono-art-grid" />
      {type === 'signal' && <><i className="signal-wave wave-one" /><i className="signal-wave wave-two" /><b>LIVE</b></>}
      {type === 'portal' && <><i className="portal-ring" /><i className="portal-ring ring-inner" /><span /></>}
      {type === 'blocks' && <div className="mono-blocks"><i /><i /><i /><i /></div>}
      {type === 'spheres' && <div className="mono-spheres"><i /><i /><i /></div>}
    </div>
  );
}

export default function Monochrome() {
  return (
    <ClickSpark colors={['#ffffff', '#777777']} sparkCount={8}>
      <ScrollProgress />
      <div className="monochrome-shell">
        <header className="mono-nav">
          <a className="mono-brand" href="/">P///VR</a>
          <span><Circle size={7} fill="currentColor" /> Available for collaboration</span>
          <nav>
            <a href="/">Original</a>
            <a href="/prototype/">Prototype 02</a>
          </nav>
        </header>

        <main>
          <section className="mono-hero">
            <GodRays />
            <div className="mono-hero-shade" />
            <div className="mono-hero-topline"><span>Prototype 03</span><span>Monochrome study</span><span>2026</span></div>
            <h1 aria-label="Engineering without edges">
              <span><i>Engineering</i></span>
              <span><i>without edges.</i></span>
            </h1>
            <div className="mono-hero-bottom">
              <p>Building portable systems at the intersection of browsers, games, and security research.</p>
              <a href="#mono-work" aria-label="Scroll to work"><ArrowDown /></a>
            </div>
          </section>

          <section className="mono-quote">
            <Reveal>
              <span className="mono-label">Principle / 01</span>
              <blockquote>
                <span>“If it wasn’t meant to run there,</span>
                <strong>I’ll make it.”</strong>
              </blockquote>
            </Reveal>
          </section>

          <section className="mono-work" id="mono-work">
            <SystemsField />
            <Reveal className="mono-work-head">
              <span className="mono-label">Selected work / 04</span>
              <h2>Systems in motion.</h2>
              <p>Scroll to move through the archive.</p>
            </Reveal>
            <div className="mono-stack">
              {projects.map((project, index) => (
                <article className={`mono-card card-tone-${index}`} style={{ '--card-index': index }} key={project.title}>
                  <div className="mono-card-copy">
                    <div className="mono-card-meta"><span>{project.number} / 04</span><span>{project.category}</span></div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="mono-card-foot">
                      <ul>{project.tech.map(item => <li key={item}>{item}</li>)}</ul>
                      <Magnet strength={6} padding={80}>
                        <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`}><ArrowUpRight /></a>
                      </Magnet>
                    </div>
                  </div>
                  <MonoArt type={project.art} />
                </article>
              ))}
            </div>
          </section>

          <section className="mono-about">
            <Reveal className="mono-about-grid">
              <span className="mono-label">Profile / 02</span>
              <h2>Built for the constraint.</h2>
              <div>
                <p>I’m a self-taught engineer drawn to systems with awkward edges: old runtimes, oversized builds, fragile state, and software that was never designed to travel.</p>
                <p>The goal is simple—understand it deeply, rebuild only what matters, and make the result feel effortless.</p>
              </div>
            </Reveal>
          </section>

          <section className="mono-contact">
            <GodRays />
            <Reveal>
              <span className="mono-label">Next experiment</span>
              <h2>Have something<br />difficult in mind?</h2>
              <Magnet strength={6} padding={100}>
                <a className="mono-contact-link" href="https://github.com/ParrrotVR" target="_blank" rel="noreferrer"><GitHubMark /> Find me on GitHub <ArrowUpRight /></a>
              </Magnet>
            </Reveal>
          </section>
        </main>

        <footer className="mono-footer"><span>ParrrotVR © 2026</span><a href="/">Back to original</a><span>Prototype 03 / 03</span></footer>
      </div>
    </ClickSpark>
  );
}
