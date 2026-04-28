'use client';

import { useEffect, useState } from 'react';
import { healthApi, type HealthMetrics, type Recommendation } from '../../lib/health-api';
import { Icon } from '../components/icons';
import { PageHeader, MetricTile, Card, CardHeader, CardBody, EmptyState, Button } from '@next-trace/nexdoz-design-system/react';
import { mapErrorToFriendly } from '../../lib/error-map';

export default function InsightsPage() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      const view = await healthApi.getInsightsView();
      setMetrics(view.metrics);
      setRecs(view.recommendations);
    } catch (e) {
      setError(mapErrorToFriendly(e));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="insights" />}
        eyebrow={<><Icon name="insights" /> Analytics</>}
        title="Insights"
        subtitle="Outcome trends, adherence, and explainable recommendation feed."
        actions={<Button variant="ghost" size="md" onClick={load}>Refresh</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MetricTile label="24h Avg Glucose" value={`${metrics?.avg_glucose_24h || 'n/a'} mg/dL`} />
        <MetricTile label="Time In Range"   value={`${metrics?.in_range_pct_24h ?? 0}%`} />
        <MetricTile label="7d Adherence"    value={`${metrics?.adherence_pct_7d ?? 0}%`} />
        <MetricTile label="Escalations"     value={metrics?.escalation_count_now ?? 0} />
      </div>

      <Card>
        <CardHeader title="Recommendations" />
        <CardBody>
          {recs.length ? (
            <div className="stack">
              {recs.map((r) => (
                <div key={r.id} className={`rec ${r.escalate ? 'escalate' : ''}`}>
                  <p><strong>{r.title}</strong> <span className="chip">{r.confidence}</span></p>
                  <p className="dbui-muted">{r.why}</p>
                  <p className="safety"><strong>Safety:</strong> {r.safety}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Icon name="spark" />}
              title="No recommendations yet"
              hint="Recommendations appear once enough events have been logged for the analytics engine to compute trends and safety checks."
            />
          )}
        </CardBody>
      </Card>

      {error ? <p style={{ color: 'var(--dbui-danger)', marginTop: '1rem' }}>{error}</p> : null}
    </section>
  );
}
