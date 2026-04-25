import Link from 'next/link';
import { Icon } from './components/icons';

const homeCards = [
  {
    title: 'Analytics',
    description: 'Real-time glucose trends, pattern detection, and explainable AI guidance.',
    icon: 'insights' as const
  },
  {
    title: 'Care Logging',
    description: 'Structured logging for meals, medication, activity, sleep, and symptoms.',
    icon: 'logging' as const
  },
  {
    title: 'Clinician Ready',
    description: 'Timeline summaries and action plans designed for provider collaboration.',
    icon: 'stethoscope' as const
  }
];

export default function HomePage() {
  return (
    <section className="shell">
      <section className="hero">
        <p className="eyebrow eyebrowWithIcon"><Icon name="dashboard" /> NEXTTRACE OPERATIONS LAYER</p>
        <h1>Nexdoz Control Surface</h1>
        <p className="lead">
          High-trust diabetes operations with clear action paths, live signals, and clinician-ready summaries.
        </p>
        <div className="ctaRow">
          <Link className="linkButton" href="/dashboard">
            <Icon name="dashboard" /> Open Dashboard
          </Link>
          <Link className="linkButton secondary" href="/patient/meal-ai">
            <Icon name="meal" /> Try Meal AI
          </Link>
          <Link className="linkButton secondary" href="/market">
            <Icon name="market" /> Market View
          </Link>
        </div>
        <div className="heroStats">
          <article>
            <strong>99.2%</strong>
            <span>Data Integrity</span>
          </article>
          <article>
            <strong>&lt; 2 min</strong>
            <span>Alert Response Target</span>
          </article>
          <article>
            <strong>24/7</strong>
            <span>Decision Visibility</span>
          </article>
        </div>
      </section>

      <section className="cards">
        {homeCards.map((card) => (
          <article className="card" key={card.title}>
            <h3>
              <Icon name={card.icon} /> {card.title}
            </h3>
            <p className="muted">{card.description}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
