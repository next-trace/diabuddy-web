'use client';

import { useEffect, useState } from 'react';
import { healthApi, type HealthEventView } from '../../../lib/health-api';
import { Icon } from '../../components/icons';
import { Button, PageHeader, Card, CardHeader, CardBody, EmptyState } from '@next-trace/nexdoz-design-system/react';
import { mapErrorToFriendly } from '../../../lib/error-map';

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
      setError(mapErrorToFriendly(e));
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
      setError(mapErrorToFriendly(e));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="timeline" />}
        eyebrow={<><Icon name="timeline" /> Patient Workflow</>}
        title="Timeline"
        subtitle="Unified timeline of all health events."
        actions={<Button variant="ghost" size="md" onClick={load}>Refresh</Button>}
      />

      <Card>
        <CardHeader title="Events" />
        <CardBody>
          {events.length ? (
            <div className="stack">
              {events.map((e) => (
                <div key={e.id} className="timelineItem">
                  <div>
                    <p><strong>{String(e.kind).toUpperCase()}</strong> | {new Date(e.timestamp).toLocaleString()}</p>
                    <p>{e.primary_text}</p>
                    {e.note ? <p className="dbui-muted">{e.note}</p> : null}
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeEvent(e.id)}>Delete</Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Icon name="timeline" />}
              title="No events logged yet"
              hint="Start logging glucose, meals, medications, or activity from the Logging page to see a unified timeline here."
            />
          )}
        </CardBody>
      </Card>

      {message ? <p style={{ color: 'var(--dbui-success)', marginTop: '1rem' }}>{message}</p> : null}
      {error ? <p style={{ color: 'var(--dbui-danger)', marginTop: '1rem' }}>{error}</p> : null}
    </section>
  );
}
