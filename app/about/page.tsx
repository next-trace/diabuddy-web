import { Icon } from '../components/icons';

export default function AboutPage() {
  return (
    <section className="shell">
      <section className="hero">
        <p className="eyebrow eyebrowWithIcon"><Icon name="spark" /> ABOUT</p>
        <h1>Nexdoz Brand and Design Direction</h1>
        <p className="lead">
          Nexdoz combines clinical clarity with emotionally calm interaction patterns. The visual system is grounded in
          deep blue trust tones, turquoise guidance accents, and measured gold highlights.
        </p>
      </section>

      <section className="cards twoCol" id="brand-principles">
        <article className="card">
          <h3><Icon name="spark" /> Brand Principles</h3>
          <p className="muted">
            Keep form simple, message clear, and hierarchy obvious. Each element must communicate purpose quickly.
          </p>
          <p className="muted">
            We apply Paul Rand-inspired principles in practice: strong geometry, limited palette discipline, and memorable
            symbol-first identity.
          </p>
        </article>
        <article className="card" id="design-strategy">
          <h3><Icon name="timeline" /> Design Strategy</h3>
          <p className="muted">
            Light mode favors clarity and readability for daytime workflows. Dark mode emphasizes focus and confidence
            with higher signal contrast for navigation icons and active states.
          </p>
          <p className="muted">
            Motion is purposeful and lightweight. It can be disabled in settings to keep performance deterministic on
            lower-powered devices.
          </p>
        </article>
      </section>
    </section>
  );
}
