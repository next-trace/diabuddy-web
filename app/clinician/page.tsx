'use client';

import { useEffect, useState } from 'react';
import { healthApi, type Recommendation } from '../../lib/health-api';
import { Icon } from '../components/icons';
import { Button, PageHeader, Card, CardHeader, CardBody, EmptyState } from '@next-trace/nexdoz-design-system/react';
import { mapErrorToFriendly } from '../../lib/error-map';

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
      setError(mapErrorToFriendly(e));
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
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="stethoscope" />}
        eyebrow={<><Icon name="stethoscope" /> Clinician Workflow</>}
        title="Clinician Summary"
        subtitle="Visit-ready summary and escalation signals."
        actions={
          <>
            <Button variant="ghost"     size="md" onClick={load}>Refresh</Button>
            <Button variant="secondary" size="md" onClick={copySummary}>Copy</Button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
        <Card>
          <CardHeader title="Visit summary" />
          <CardBody>
            <textarea className="summaryBox" value={summary} readOnly />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Safety Escalations" />
          <CardBody>
            {recs.length ? (
              <div className="stack">
                {recs.map((r) => (
                  <div key={r.id} className="rec escalate">
                    <p><strong>{r.title}</strong></p>
                    <p className="dbui-muted">{r.why}</p>
                    <p className="safety"><strong>Action:</strong> {r.safety}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Icon name="shield" />}
                title="No active escalations"
                hint="When a patient triggers a safety threshold, escalations show up here for clinician review."
              />
            )}
          </CardBody>
        </Card>
      </div>

      {message ? <p style={{ color: 'var(--dbui-success)', marginTop: '1rem' }}>{message}</p> : null}
      {error ? <p style={{ color: 'var(--dbui-danger)', marginTop: '1rem' }}>{error}</p> : null}
    </section>
  );
}
