'use client';

import { useEffect, useState } from 'react';
import { healthApi, type Recommendation } from '../../lib/health-api';
import { Icon } from '../components/icons';

export default function ClinicianPage() {
  const [summary, setSummary] = useState('');
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setMessage('');
    setError('');
    try {
      const view = await healthApi.getClinicianView();
      setSummary(view.summary);
      setRecs(view.escalations);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function copySummary() {
    setMessage('');
    setError('');
    try {
      await navigator.clipboard.writeText(summary);
      setMessage('Summary copied.');
    } catch {
      setError('Clipboard not available.');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="shell">
      <section className="hero">
        <p className="eyebrow eyebrowWithIcon"><Icon name="stethoscope" /> CLINICIAN WORKFLOW</p>
        <h1>Clinician Summary</h1>
        <p className="lead">Visit-ready summary and escalation signals.</p>
      </section>

      <section className="cards twoCol">
        <article className="card">
          <div className="ctaRow">
            <button className="linkButton" onClick={load}>Refresh</button>
            <button className="linkButton secondary" onClick={copySummary}>Copy</button>
          </div>
          <textarea className="summaryBox" value={summary} readOnly />
        </article>

        <article className="card">
          <h3>Safety Escalations</h3>
          <div className="stack">
            {recs.length ? recs.map((r) => (
              <div key={r.id} className="rec escalate">
                <p><strong>{r.title}</strong></p>
                <p className="muted">{r.why}</p>
                <p className="safety"><strong>Action:</strong> {r.safety}</p>
              </div>
            )) : <p className="okText">No active escalations.</p>}
          </div>
        </article>
      </section>

      {message ? <p className="okText">{message}</p> : null}
      {error ? <p className="errorText">{error}</p> : null}
    </section>
  );
}
