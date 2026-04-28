'use client';

import { useEffect, useState } from 'react';
import { Button, Input, PageHeader, Card, CardHeader, CardBody, EmptyState, MetricTile } from '@next-trace/nexdoz-design-system/react';
import { healthApi, type ActionPlan } from '../../lib/health-api';
import { Icon } from '../components/icons';
import { mapErrorToFriendly } from '../../lib/error-map';

export default function CarePlansPage() {
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [title, setTitle] = useState('10-minute post-dinner walk');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setMessage('');
    setError('');
    try {
      const view = await healthApi.getActionPlansView();
      setPlans(view.items);
      setOpenCount(view.open_count);
      setDoneCount(view.done_count);
    } catch (e) {
      setError(mapErrorToFriendly(e));
    }
  }

  async function addPlan() {
    setMessage('');
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    try {
      await healthApi.createActionPlan({ title: title.trim(), due_date: dueDate });
      setTitle('');
      await load();
      setMessage('Plan added.');
    } catch (e) {
      setError(mapErrorToFriendly(e));
    }
  }

  async function toggle(id: string) {
    setMessage('');
    setError('');
    try {
      await healthApi.toggleActionPlan(id);
      await load();
      setMessage('Plan updated.');
    } catch (e) {
      setError(mapErrorToFriendly(e));
    }
  }

  async function remove(id: string) {
    setMessage('');
    setError('');
    try {
      await healthApi.deleteActionPlan(id);
      await load();
      setMessage('Plan deleted.');
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
        icon={<Icon name="users" />}
        eyebrow={<><Icon name="users" /> Care Workflow</>}
        title="Action Plans"
        subtitle="Track patient-specific action plans and completion status."
        actions={<Button variant="ghost" size="md" onClick={load}>Refresh</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MetricTile label="Open"      value={openCount} />
        <MetricTile label="Completed" value={doneCount} />
      </div>

      <Card>
        <CardHeader title="New Plan" />
        <CardBody>
          <div className="formGrid">
            <label>Plan title<Input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
            <label>Due date<Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
            <Button variant="primary" size="md" onClick={addPlan}>Add Plan</Button>
          </div>
        </CardBody>
      </Card>

      <div style={{ height: '1rem' }} />

      <Card>
        <CardHeader title="All Plans" />
        <CardBody>
          {plans.length ? (
            <div className="stack">
              {plans.map((p) => (
                <div className="rowBetween" key={p.id}>
                  <span>{p.title} ({p.due_date})</span>
                  <div className="ctaRow">
                    <Button variant="secondary" size="sm" onClick={() => toggle(p.id)}>{p.status === 'open' ? 'Mark Done' : 'Reopen'}</Button>
                    <Button variant="danger"    size="sm" onClick={() => remove(p.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Icon name="users" />}
              title="No plans yet"
              hint="Add an action plan above to start tracking. Plans help patients turn recommendations into concrete next steps."
            />
          )}
        </CardBody>
      </Card>

      {message ? <p style={{ color: 'var(--dbui-success)', marginTop: '1rem' }}>{message}</p> : null}
      {error ? <p style={{ color: 'var(--dbui-danger)', marginTop: '1rem' }}>{error}</p> : null}
    </section>
  );
}
