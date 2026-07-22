import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Circle, Copy, Check } from 'lucide-react';
import GodRays from './components/GodRays.jsx';
import Reveal from './components/Reveal.jsx';
import Magnet from './components/Magnet.jsx';
import ClickSpark from './components/ClickSpark.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import SystemsField from './components/SystemsField.jsx';
import DitherField from './components/DitherField.jsx';

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

function DiscordMark() {
  return (
    <svg viewBox="0 0 448 512" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M297.2 243.2c-13.6 0-24.6 11.2-24.6 25s11.3 25 24.6 25c13.6 0 24.6-11.2 24.6-25s-11-25-24.6-25Zm-88.2 0c-13.6 0-24.6 11.2-24.6 25s11.3 25 24.6 25c13.6 0 24.6-11.2 24.6-25s-11-25-24.6-25ZM448 52.8v406.4c0 29.1-23.5 52.8-52.6 52.8H52.6C23.5 512 0 488.3 0 459.2V52.8C0 23.7 23.5 0 52.6 0h342.7C424.5 0 448 23.7 448 52.8Zm-73.1 82.6c-27.8-13.1-57.7-22.7-88.8-28.3-3.8 6.7-8.2 15.8-11.2 23-33.1-5-65.9-5-98.4 0-3-7.2-7.5-16.3-11.4-23-31.2 5.6-61 15.2-88.9 28.3-56.2 83.7-71.4 165.3-63.8 245.8 37.3 27.5 73.4 44.2 109 55.1 8.8-12 16.6-24.8 23.4-38.2-12.8-4.8-25-10.7-36.8-17.8 3-2.2 6.1-4.6 9-7 71 32.9 147.9 32.9 218.1 0 3 2.4 6 4.8 9 7-11.8 7-24.1 13-36.9 17.8 6.7 13.4 14.6 26.2 23.4 38.2 35.7-11 71.8-27.6 109.1-55.1 9-93.4-15.3-174.2-63.7-245.8Z" />
    </svg>
  );
}

function MonoArt({ type }) {
  const artRef = useRef(null);
  const motionRef = useRef({
    currentX: 0,
    currentY: 0,
    currentLightX: 50,
    currentLightY: 50,
    targetX: 0,
    targetY: 0,
    targetLightX: 50,
    targetLightY: 50,
    frame: 0,
  });

  const animateTilt = () => {
    const art = artRef.current;
    const motion = motionRef.current;
    if (!art) {
      motion.frame = 0;
      return;
    }

    const easing = 0.085;
    motion.currentX += (motion.targetX - motion.currentX) * easing;
    motion.currentY += (motion.targetY - motion.currentY) * easing;
    motion.currentLightX += (motion.targetLightX - motion.currentLightX) * easing;
    motion.currentLightY += (motion.targetLightY - motion.currentLightY) * easing;

    art.style.setProperty('--art-rotate-x', `${motion.currentX}deg`);
    art.style.setProperty('--art-rotate-y', `${motion.currentY}deg`);
    art.style.setProperty('--art-light-x', `${motion.currentLightX}%`);
    art.style.setProperty('--art-light-y', `${motion.currentLightY}%`);

    const unsettled = Math.abs(motion.targetX - motion.currentX) > 0.01
      || Math.abs(motion.targetY - motion.currentY) > 0.01
      || Math.abs(motion.targetLightX - motion.currentLightX) > 0.05
      || Math.abs(motion.targetLightY - motion.currentLightY) > 0.05;
    motion.frame = unsettled ? window.requestAnimationFrame(animateTilt) : 0;
  };

  const startTilt = () => {
    const motion = motionRef.current;
    if (!motion.frame) motion.frame = window.requestAnimationFrame(animateTilt);
  };

  useEffect(() => () => window.cancelAnimationFrame(motionRef.current.frame), []);

  const handlePointerMove = (event) => {
    const art = artRef.current;
    if (!art) return;
    const rect = art.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const motion = motionRef.current;
    motion.targetX = y * -12;
    motion.targetY = x * 15;
    motion.targetLightX = (x + 0.5) * 100;
    motion.targetLightY = (y + 0.5) * 100;
    startTilt();
  };

  const resetPointer = () => {
    const motion = motionRef.current;
    motion.targetX = 0;
    motion.targetY = 0;
    motion.targetLightX = 50;
    motion.targetLightY = 50;
    startTilt();
  };

  return (
    <div className={`mono-art visual-${type}`} ref={artRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer} aria-hidden="true">
      <div className="mono-art-space" />
      <div className="mono-art-stage">
        {type === 'signal' && <div className="signal-model"><i className="signal-globe" /><i className="signal-meridian meridian-a" /><i className="signal-meridian meridian-b" /><i className="signal-orbit" /><b>SYNC</b><span className="signal-satellite satellite-a" /><span className="signal-satellite satellite-b" /></div>}
        {type === 'portal' && <div className="slot-model"><div className="slot-machine"><strong>CLOVER</strong><div className="slot-window"><span><i>7</i><i>♣</i><i>★</i></span><span><i>♣</i><i>★</i><i>7</i></span><span><i>★</i><i>7</i><i>♣</i></span></div><div className="slot-payline" /><small>GOOD LUCK</small><span className="slot-tray" /><span className="slot-lever"><i /></span></div><i className="slot-coin coin-a">$</i><i className="slot-coin coin-b">$</i></div>}
        {type === 'blocks' && <div className="raccoon-model"><span className="raccoon-tail" /><div className="raccoon-head"><i className="raccoon-ear ear-left" /><i className="raccoon-ear ear-right" /><span className="raccoon-mask mask-left"><b /></span><span className="raccoon-mask mask-right"><b /></span><span className="raccoon-muzzle"><b /></span></div><span className="raccoon-scanline" /></div>}
        {type === 'spheres' && <div className="pool-model"><div className="pool-table"><i className="pool-rail rail-top" /><i className="pool-rail rail-right" /><i className="pool-rail rail-bottom" /><i className="pool-rail rail-left" /><span className="pool-pocket pocket-a" /><span className="pool-pocket pocket-b" /><span className="pool-pocket pocket-c" /><span className="pool-pocket pocket-d" /><span className="pool-pocket pocket-e" /><span className="pool-pocket pocket-f" /><b className="pool-ball ball-cue" /><b className="pool-ball ball-eight" /><b className="pool-ball ball-target" /><span className="pool-trajectory trajectory-main" /><span className="pool-trajectory trajectory-bank" /></div><span className="pool-depth-line" /></div>}
      </div>
      <span className="mono-art-caption">Pointer reactive / 3D study</span>
    </div>
  );
}

export default function App() {
  const [discordCopied, setDiscordCopied] = useState(false);

  const copyDiscordUsername = async () => {
    try {
      await navigator.clipboard.writeText('habw');
      setDiscordCopied(true);
      window.setTimeout(() => setDiscordCopied(false), 1800);
    } catch {
      window.open('https://discord.com/app', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <ClickSpark colors={['#ffffff', '#777777']} sparkCount={8}>
      <ScrollProgress />
      <div className="monochrome-shell">
        <header className="mono-nav">
          <a className="mono-brand" href="/" aria-label="Mysmic home">
            <span className="mono-brand-mark" aria-hidden="true"><i>M</i></span>
            <span className="mono-brand-name">MYSMIC</span>
          </a>
          <span><Circle size={7} fill="currentColor" /> Available for collaboration</span>
          <nav>
            <a href="#mono-work">Work</a>
            <a href="https://github.com/ParrrotVR" target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </header>

        <main>
          <section className="mono-hero">
            <GodRays />
            <div className="mono-hero-shade" />
            <div className="mono-hero-topline"><span>Portfolio / 2026</span><span>Independent engineer</span><span>Chicago / US</span></div>
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
            <DitherField />
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

          <section className="mono-manifesto">
            <div className="manifesto-orbits" aria-hidden="true"><i /><i /><i /><i /></div>
            <Reveal>
              <span className="mono-label">Principle / 02</span>
              <blockquote>
                <span>“If it doesn’t exist yet,</span>
                <strong>that just means I haven’t finished making it.”</strong>
              </blockquote>
            </Reveal>
          </section>

          <section className="mono-contact" id="mono-contact">
            <GodRays />
            <Reveal>
              <span className="mono-label">Next experiment</span>
              <h2><span>Have something</span><span>difficult in mind?</span></h2>
              <div className="mono-contact-actions">
                <Magnet strength={8} padding={90}>
                  <a className="mono-contact-link" href="https://github.com/ParrrotVR" target="_blank" rel="noreferrer"><GitHubMark /> Find me on GitHub <ArrowUpRight /></a>
                </Magnet>
                <Magnet strength={8} padding={90}>
                  <button className="mono-contact-link is-discord" type="button" onClick={copyDiscordUsername}><DiscordMark /> {discordCopied ? 'Username copied' : 'Copy Discord username'} {discordCopied ? <Check /> : <Copy />}</button>
                </Magnet>
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="mono-footer"><span>Mysmic © 2026</span><a href="#mono-work">Selected work</a><span>Independent engineer</span></footer>
      </div>
    </ClickSpark>
  );
}
