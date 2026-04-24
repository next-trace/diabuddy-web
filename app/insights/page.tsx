'use client';

import { useEffect, useState } from 'react';
import { healthApi, type HealthMetrics, type Recommendation } from '../../lib/health-api';
import { Icon } from '../components/icons';

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
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="shell">
      <section className="hero">
        <p className="eyebrow eyebrowWithIcon"><Icon name="insights" /> ANALYTICS</p>
        <h1>Insights</h1>
        <p className="lead">Outcome trends, adherence, and explainable recommendation feed.</p>
      </section>

      <section className="cards">
        <article className="card"><h3>24h Avg Glucose</h3><p>{metrics?.avg_glucose_24h || 'n/a'} mg/dL</p></article>
        <article className="card"><h3>Time In Range</h3><p>{metrics?.in_range_pct_24h ?? 0}%</p></article>
        <article className="card"><h3>7d Adherence</h3><p>{metrics?.adherence_pct_7d ?? 0}%</p></article>
        <article className="card"><h3>Escalations</h3><p>{metrics?.escalation_count_now ?? 0}</p></article>
      </section>

      <section className="card">
        <div className="ctaRow"><button className="linkButton" onClick={load}>Refresh</button></div>
        <h3>Recommendations</h3>
        <div className="stack">
          {recs.length ? recs.map((r) => (
            <div key={r.id} className={`rec ${r.escalate ? 'escalate' : ''}`}>
              <p><strong>{r.title}</strong> <span className="chip">{r.confidence}</span></p>
              <p className="muted">{r.why}</p>
              <p className="safety"><strong>Safety:</strong> {r.safety}</p>
            </div>
          )) : <p className="muted">No recommendations yet.</p>}
        </div>
      </section>

      {error ? <p className="errorText">{error}</p> : null}
    </section>
  );
}
