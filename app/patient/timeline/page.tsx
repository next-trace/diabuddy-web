'use client';

import { useEffect, useState } from 'react';
import { healthApi, type HealthEventView } from '../../../lib/health-api';
import { Icon } from '../../components/icons';

export default function TimelinePage() {
  const [events, setEvents] = useState<HealthEventView[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setMessage('');
    setError('');
    try {
      setEvents(await healthApi.listEventsView({ limit: 200 }));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function removeEvent(id: string) {
    setMessage('');
    setError('');
    try {
      await healthApi.deleteEvent(id);
      await load();
      setMessage('Event deleted.');
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
        <p className="eyebrow eyebrowWithIcon"><Icon name="timeline" /> PATIENT WORKFLOW</p>
        <h1>Timeline</h1>
        <p className="lead">Unified timeline of all health events.</p>
      </section>

      <section className="card">
        <div className="ctaRow">
          <button className="linkButton" onClick={load}>Refresh</button>
        </div>
        <div className="stack">
          {events.length ? events.map((e) => (
            <div key={e.id} className="timelineItem">
              <div>
                <p><strong>{String(e.kind).toUpperCase()}</strong> | {new Date(e.timestamp).toLocaleString()}</p>
                <p>{e.primary_text}</p>
                {e.note ? <p className="muted">{e.note}</p> : null}
              </div>
              <button className="linkButton danger tiny" onClick={() => removeEvent(e.id)}>Delete</button>
            </div>
          )) : <p className="muted">No events logged yet.</p>}
        </div>
      </section>

      {message ? <p className="okText">{message}</p> : null}
      {error ? <p className="errorText">{error}</p> : null}
    </section>
  );
}
