'use client';

import { useEffect, useState } from 'react';
import { Button, Input } from '@next-trace/nexdoz-design-system/react';
import { healthApi, type ActionPlan } from '../../lib/health-api';
import { Icon } from '../components/icons';

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
      setError((e as Error).message);
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
      setError((e as Error).message);
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
      setError((e as Error).message);
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
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="shell">
      <section className="hero">
        <p className="eyebrow eyebrowWithIcon"><Icon name="users" /> CARE WORKFLOW</p>
        <h1>Action Plans</h1>
        <p className="lead">Track patient-specific action plans and completion status.</p>
      </section>

      <section className="card">
        <div className="formGrid">
          <label>Plan title<Input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label>Due date<Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
          <Button className="linkButton compactAction" onClick={addPlan}>Add Plan</Button>
        </div>
      </section>

      <section className="card">
        <p className="muted">Open: {openCount} | Completed: {doneCount}</p>
        <div className="ctaRow"><Button className="linkButton" onClick={load}>Refresh</Button></div>
        <div className="stack">
          {plans.length ? plans.map((p) => (
            <div className="rowBetween" key={p.id}>
              <span>{p.title} ({p.due_date})</span>
              <div className="ctaRow">
                <Button variant="secondary" className="linkButton secondary tiny" onClick={() => toggle(p.id)}>{p.status === 'open' ? 'Mark Done' : 'Reopen'}</Button>
                <Button variant="danger" className="linkButton danger tiny" onClick={() => remove(p.id)}>Delete</Button>
              </div>
            </div>
          )) : <p className="muted">No plans yet.</p>}
        </div>
      </section>

      {message ? <p className="okText">{message}</p> : null}
      {error ? <p className="errorText">{error}</p> : null}
    </section>
  );
}
