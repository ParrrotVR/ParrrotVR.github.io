import { ArrowDown, ArrowUpRight, MoveRight } from 'lucide-react';
import Threads from './components/Threads.jsx';
import GlareCard from './components/GlareCard.jsx';
import Reveal from './components/Reveal.jsx';
import TargetCursor from './components/TargetCursor.jsx';
import ClickSpark from './components/ClickSpark.jsx';
import Magnet from './components/Magnet.jsx';

const projects = [
  {
    number: '01',
    title: 'WorldBox Multiplayer',
    kicker: 'Real-time systems',
    description: 'A multiplayer mod release system built around state synchronization, versioned .NET assemblies, and SHA-256 verified updates.',
    stack: ['C#', '.NET', 'Unity'],
    href: 'https://github.com/ParrrotVR/WorldBoxMultiplayer-Releases',
    art: 'sync'
  },
  {
    number: '02',
    title: 'CloverPit, in browser',
    kicker: 'Game preservation',
    description: 'A zero-install web port with durable client-side saves—the whole game experience, made portable and persistent.',
    stack: ['HTML5', 'JavaScript', 'Local saves'],
    href: 'https://github.com/ParrrotVR/cloverpit',
    art: 'clover'
  },
  {
    number: '03',
    title: 'Funi Raccoon Web Port',
    kicker: 'Build engineering',
    description: 'A large Godot web export engineered around GitHub’s file limits with deterministic split-and-merge tooling.',
    stack: ['Godot', 'WebAssembly', 'Shell'],
    href: 'https://github.com/ParrrotVR/funiracoondemowebport',
    art: 'raccoon'
  },
  {
    number: '04',
    title: 'Ultrapool Web Port',
    kicker: 'Browser runtime',
    description: 'A complete desktop-to-web adaptation packaged as a lightweight, static JavaScript experience.',
    stack: ['JavaScript', 'HTML5', 'Static hosting'],
    href: 'https://github.com/ParrrotVR/ultrapoolwebport',
    art: 'pool'
  }
];

const capabilities = [
  ['Browser engineering', 'Service workers, WebAssembly, persistent client state'],
  ['Game systems', 'Ports, multiplayer sync, modding, release pipelines'],
  ['Security research', 'Traffic flow, request rewriting, sandboxed runtimes'],
  ['Reverse engineering', 'Legacy formats, binaries, protocols, preservation']
];

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M12 .7C5.7.7.6 5.8.6 12.1c0 5 3.3 9.2 7.8 10.7.6.1.8-.2.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6a11.5 11.5 0 0 0 7.8-10.7C23.4 5.8 18.3.7 12 .7Z" />
    </svg>
  );
}

function ProjectArt({ type, number }) {
  return (
    <div className={`project-art art-${type}`} aria-hidden="true">
      <div className="art-grid" />
      <span className="art-number">{number}</span>
      {type === 'sync' && <><i className="orbit orbit-a" /><i className="orbit orbit-b" /><i className="core" /></>}
      {type === 'clover' && <><i className="leaf leaf-a" /><i className="leaf leaf-b" /><i className="leaf leaf-c" /><i className="leaf leaf-d" /></>}
      {type === 'raccoon' && <div className="chunk-stack"><i /><i /><i /><i /><i /></div>}
      {type === 'pool' && <><i className="pool-ball ball-a">8</i><i className="pool-ball ball-b">3</i><i className="pool-ball ball-c">12</i></>}
      <span className="art-caption">PARRROTVR / {type.toUpperCase()}</span>
    </div>
  );
}

function App() {
  return (
    <ClickSpark>
      <TargetCursor />
      <div className="site-shell">
      <a className="skip-link" href="#work">Skip to selected work</a>
      <header className="nav-wrap">
        <a className="wordmark cursor-target" data-cursor-label="TOP" href="#top" aria-label="ParrrotVR home">P<span>///</span>VR</a>
        <nav aria-label="Main navigation">
          <a className="cursor-target" data-cursor-label="GO" href="#work">Work</a>
          <a className="cursor-target" data-cursor-label="GO" href="#about">About</a>
          <a className="cursor-target" data-cursor-label="OPEN" href="https://github.com/ParrrotVR" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
        </nav>
        <span className="availability"><i /> Open to collaborations</span>
      </header>

      <main>
        <section className="hero" id="top">
          <Threads />
          <div className="hero-noise" />
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span>Independent engineer</span><span>Based on the internet</span></p>
            <h1 aria-label="I make systems play anywhere">
              <span className="hero-line"><span>I make systems</span></span>
              <span className="hero-line accent-line"><span>play anywhere.</span></span>
            </h1>
            <div className="hero-foot">
              <p>Browser engineering, game preservation, and security research—built to be fast, resilient, and zero-install.</p>
              <Magnet>
                <a className="round-link cursor-target" data-cursor-label="VIEW" href="#work" aria-label="View selected work"><ArrowDown /></a>
              </Magnet>
            </div>
          </div>
          <p className="hero-index">PORTFOLIO / 26</p>
        </section>

        <section className="work section-pad" id="work">
          <Reveal className="section-intro">
            <p className="eyebrow">Selected work <span>(04)</span></p>
            <h2>Things I’ve made<br />move, sync, and survive.</h2>
          </Reveal>

          <div className="project-list">
            {projects.map((project, index) => (
              <Reveal key={project.title} delay={index * 70}>
                <a className="project-link cursor-target" data-cursor-label="VIEW" href={project.href} target="_blank" rel="noreferrer">
                  <GlareCard className="project-card">
                    <ProjectArt type={project.art} number={project.number} />
                    <div className="project-copy">
                      <div className="project-meta"><span>{project.number}</span><span>{project.kicker}</span></div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-bottom">
                        <ul aria-label="Technologies">{project.stack.map(item => <li key={item}>{item}</li>)}</ul>
                        <span className="project-arrow"><ArrowUpRight /></span>
                      </div>
                    </div>
                  </GlareCard>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="statement" aria-label="Working philosophy">
          <div className="ticker" aria-hidden="true">
            <div>SHIP IT FAST <i>✦</i> MAKE IT PERSIST <i>✦</i> RUN IT ANYWHERE <i>✦</i> SHIP IT FAST <i>✦</i> MAKE IT PERSIST <i>✦</i> RUN IT ANYWHERE <i>✦</i></div>
          </div>
        </section>

        <section className="about section-pad" id="about">
          <Reveal className="about-lead">
            <p className="eyebrow">Profile / 02</p>
            <h2>Curious by default.<br /><em>Persistent</em> by design.</h2>
          </Reveal>
          <div className="about-grid">
            <Reveal className="about-copy">
              <p>I’m a self-taught engineer working where the browser meets game systems and security research.</p>
              <p>I like awkward constraints: old runtimes, oversized builds, state that refuses to sync, and software that was never supposed to run there.</p>
              <a className="text-link cursor-target" data-cursor-label="OPEN" href="https://github.com/ParrrotVR?tab=repositories" target="_blank" rel="noreferrer">Explore all repositories <MoveRight /></a>
            </Reveal>
            <div className="capabilities">
              {capabilities.map(([title, detail], index) => (
                <Reveal key={title} delay={index * 60} className="capability">
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="contact section-pad">
          <Threads color={[0.72, 0.34, 1]} amplitude={0.8} distance={0.5} />
          <Reveal className="contact-inner">
            <p className="eyebrow">Have a difficult idea?</p>
            <h2>Let’s make it<br /><em>work.</em></h2>
            <Magnet strength={5} padding={100}>
              <a className="contact-button cursor-target" data-cursor-label="OPEN" href="https://github.com/ParrrotVR" target="_blank" rel="noreferrer">
                <GitHubMark /> Find me on GitHub <ArrowUpRight />
              </a>
            </Magnet>
          </Reveal>
        </section>
      </main>

      <footer>
        <a className="wordmark cursor-target" data-cursor-label="TOP" href="#top">P<span>///</span>VR</a>
        <p>Independent engineer / © 2026</p>
        <a className="cursor-target" data-cursor-label="TOP" href="#top">Back to top ↑</a>
      </footer>
      </div>
    </ClickSpark>
  );
}

export default App;
