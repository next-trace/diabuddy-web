import Link from 'next/link';
import { Icon } from './components/icons';
import { PageHeader, MetricTile, Card, CardHeader, CardBody, Button } from '@next-trace/nexdoz-design-system/react';

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
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="dashboard" />}
        eyebrow={<><Icon name="dashboard" /> Nexdoz Operations Layer</>}
        title="Nexdoz Control Surface"
        subtitle="High-trust diabetes operations with clear action paths, live signals, and clinician-ready summaries."
        actions={
          <>
            <Link href="/dashboard"><Button variant="primary"   size="md"><Icon name="dashboard" /> Open Dashboard</Button></Link>
            <Link href="/patient/meal-ai"><Button variant="secondary" size="md"><Icon name="meal" /> Try Meal AI</Button></Link>
            <Link href="/market"><Button variant="ghost"     size="md"><Icon name="market" /> Market View</Button></Link>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        <MetricTile label="Data Integrity"          value="99.2%" />
        <MetricTile label="Alert Response Target"   value="< 2 min" />
        <MetricTile label="Decision Visibility"     value="24/7" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {homeCards.map((card) => (
          <Card key={card.title}>
            <CardHeader title={<><Icon name={card.icon} /> {card.title}</>} />
            <CardBody>
              <p className="dbui-muted">{card.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
