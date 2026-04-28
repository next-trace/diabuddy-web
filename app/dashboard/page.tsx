'use client';

import { ApiClientError, type CreateUserRequest, type UpdateUserRequest, type UserResponse } from '@/api-client';
import { useEffect, useMemo, useState } from 'react';
import { userApi } from '../../lib/api';
import { healthApi, type ActionPlan, type CreateHealthEventPayload, type DashboardView, type EventKind, type HealthEventView, type Recommendation } from '../../lib/health-api';
import { csrfHeaders } from '../../lib/csrf';
import { Icon } from '../components/icons';
import {
  PageHeader,
  MetricTile,
  Tabs,
  EmptyState,
  Button,
} from '@next-trace/nexdoz-design-system/react';
import '@next-trace/nexdoz-design-system/styles.css';

type TabId = 'cockpit' | 'logging' | 'timeline' | 'clinician' | 'users';
type PeriodKey = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

function nowLocalInput(): string {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function todayMinusYears(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function periodRange(period: PeriodKey): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === 'daily') return { start, end };
  if (period === 'weekly') {
    const s = new Date(start);
    s.setDate(s.getDate() - 6);
    return { start: s, end };
  }
  if (period === 'monthly') {
    const s = new Date(start);
    s.setDate(s.getDate() - 29);
    return { start: s, end };
  }
  if (period === 'quarterly') {
    const s = new Date(start);
    s.setDate(s.getDate() - 89);
    return { start: s, end };
  }
  const s = new Date(start);
  s.setDate(s.getDate() - 364);
  return { start: s, end };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('cockpit');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<PeriodKey>('weekly');
  const [customFrom, setCustomFrom] = useState(isoDate(periodRange('weekly').start));
  const [customTo, setCustomTo] = useState(isoDate(periodRange('weekly').end));

  const [dashboardView, setDashboardView] = useState<DashboardView | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [clinicianSummary, setClinicianSummary] = useState('');
  const [plans, setPlans] = useState<ActionPlan[]>([]);

  const [glucoseForm, setGlucoseForm] = useState({ timestamp: nowLocalInput(), value: 115, context: 'pre-meal', note: '' });
  const [mealForm, setMealForm] = useState({ timestamp: nowLocalInput(), title: 'Lunch', carbs: 45, note: '' });
  const [medForm, setMedForm] = useState({ timestamp: nowLocalInput(), name: 'Rapid insulin', dose: '4 units', taken: true, note: '' });
  const [activityForm, setActivityForm] = useState({ timestamp: nowLocalInput(), activityType: 'Walk', durationMin: 30, note: '' });
  const [sleepForm, setSleepForm] = useState({ timestamp: nowLocalInput(), sleepHours: 7.5, note: '' });
  const [symptomForm, setSymptomForm] = useState({ timestamp: nowLocalInput(), symptom: 'None', severity: 'none', note: '' });
  const [planDraft, setPlanDraft] = useState({ title: '10-minute post-dinner walk', dueDate: new Date().toISOString().slice(0, 10) });

  const [idInput, setIdInput] = useState('');
  const [emailLookup, setEmailLookup] = useState('');
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  const [createForm, setCreateForm] = useState({
    email: '',
    password: 'Password123!',
    phone_number: '+491778902806',
    first_name: 'John',
    last_name: 'Doe',
    gender: 'male',
    relationship_status: 'single',
    birth_date: todayMinusYears(30)
  });

  const [updateForm, setUpdateForm] = useState({
    email: '',
    password: 'NewPassword123!',
    phone_number: '+491778902806',
    status: 'active'
  });

  useEffect(() => {
    void refreshHealthData();
  }, []);

  const createdAtText = useMemo(() => {
    if (!currentUser) return '';
    return new Date(currentUser.created_at).toLocaleString();
  }, [currentUser]);

  function resetNotice() {
    setMessage('');
    setError('');
  }

  function setErr(e: unknown) {
    if (e instanceof ApiClientError) {
      setError(e.payload?.details || e.message);
      return;
    }
    setError((e as Error).message);
  }

  useEffect(() => {
    if (period === 'custom') return;
    const next = periodRange(period);
    setCustomFrom(isoDate(next.start));
    setCustomTo(isoDate(next.end));
  }, [period]);

  useEffect(() => {
    void refreshHealthData();
  }, [period, customFrom, customTo]);

  async function refreshHealthData() {
    setLoading(true);
    try {
      const dashboardQuery = period === 'custom'
        ? { period, from: customFrom, to: customTo }
        : { period };
      const nextView = await healthApi.getCockpitView(dashboardQuery);
      setDashboardView(nextView.dashboard);
      setRecommendations(nextView.recommendations);
      setClinicianSummary(nextView.clinician_summary);
      setPlans(nextView.action_plans);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  async function createHealthEvent(payload: CreateHealthEventPayload, kindLabel: string) {
    resetNotice();
    try {
      await healthApi.createEvent(payload);
      await refreshHealthData();
      setMessage(`${kindLabel} event logged.`);
    } catch (e) {
      setErr(e);
    }
  }

  async function removeEvent(id: string) {
    resetNotice();
    try {
      await healthApi.deleteEvent(id);
      await refreshHealthData();
      setMessage('Event removed.');
    } catch (e) {
      setErr(e);
    }
  }

  async function clearHealthData() {
    resetNotice();
    try {
      await healthApi.clearEvents();
      await refreshHealthData();
      setMessage('All health events cleared.');
    } catch (e) {
      setErr(e);
    }
  }

  async function addPlan() {
    resetNotice();
    if (!planDraft.title.trim()) {
      setError('Action plan title is required.');
      return;
    }
    try {
      await healthApi.createActionPlan({
        title: planDraft.title.trim(),
        due_date: planDraft.dueDate
      });
      setPlanDraft({ title: '', dueDate: new Date().toISOString().slice(0, 10) });
      await refreshHealthData();
      setMessage('Action plan added.');
    } catch (e) {
      setErr(e);
    }
  }

  async function togglePlanStatus(id: string) {
    resetNotice();
    const target = plans.find((p) => p.id === id);
    if (!target) return;
    try {
      await healthApi.updateActionPlan(id, {
        status: target.status === 'open' ? 'done' : 'open'
      });
      await refreshHealthData();
      setMessage('Action plan updated.');
    } catch (e) {
      setErr(e);
    }
  }

  async function deletePlan(id: string) {
    resetNotice();
    try {
      await healthApi.deleteActionPlan(id);
      await refreshHealthData();
      setMessage('Action plan deleted.');
    } catch (e) {
      setErr(e);
    }
  }

  async function copySummary() {
    resetNotice();
    try {
      await navigator.clipboard.writeText(clinicianSummary);
      setMessage('Clinician summary copied to clipboard.');
    } catch {
      setError('Clipboard write failed in this browser context.');
    }
  }

  async function createUser() {
    resetNotice();
    try {
      const payload: CreateUserRequest = {
        ...createForm,
        birth_date: new Date(`${createForm.birth_date}T00:00:00.000Z`).toISOString()
      };
      const created = await userApi.createUser(payload, undefined, csrfHeaders());
      setIdInput(created.id);
      setCurrentUser({
        id: created.id,
        email: created.email,
        phone_number: created.phone_number,
        status: created.status,
        created_at: created.created_at,
        updated_at: created.created_at,
        deleted_at: null
      });
      setUpdateForm((prev) => ({ ...prev, email: created.email, phone_number: created.phone_number }));
      setMessage(`User created: ${created.id}`);
    } catch (e) {
      setErr(e);
    }
  }

  async function getById() {
    resetNotice();
    try {
      const user = await userApi.getUserById(idInput.trim());
      setCurrentUser(user);
      setUpdateForm((prev) => ({ ...prev, email: user.email, phone_number: user.phone_number, status: user.status }));
      setMessage('Loaded user by id.');
    } catch (e) {
      setErr(e);
    }
  }

  async function getByEmail() {
    resetNotice();
    try {
      const user = await userApi.getUserByEmail(emailLookup.trim());
      setCurrentUser(user);
      setIdInput(user.id);
      setUpdateForm((prev) => ({ ...prev, email: user.email, phone_number: user.phone_number, status: user.status }));
      setMessage('Loaded user by email.');
    } catch (e) {
      setErr(e);
    }
  }

  async function updateUser() {
    resetNotice();
    try {
      const payload: UpdateUserRequest = { ...updateForm };
      const user = await userApi.updateUser(idInput.trim(), payload, undefined, csrfHeaders());
      setCurrentUser(user);
      setMessage('User updated.');
    } catch (e) {
      setErr(e);
    }
  }

  async function softDelete() {
    resetNotice();
    try {
      await userApi.softDeleteUser(idInput.trim(), undefined, csrfHeaders());
      setMessage('User soft-deleted.');
      await getById();
    } catch (e) {
      setErr(e);
    }
  }

  async function hardDelete() {
    resetNotice();
    try {
      await userApi.hardDeleteUser(idInput.trim(), undefined, csrfHeaders());
      setCurrentUser(null);
      setMessage('User hard-deleted.');
    } catch (e) {
      setErr(e);
    }
  }

  const filteredEvents: HealthEventView[] = dashboardView?.filtered_events ?? [];
  const eventMix: Record<EventKind, number> = dashboardView?.event_mix ?? {
    glucose: 0,
    meal: 0,
    medication: 0,
    activity: 0,
    sleep: 0,
    symptom: 0
  };
  const rangeStartText = dashboardView?.range_start ?? customFrom;
  const rangeEndText = dashboardView?.range_end ?? customTo;
  const outcomes = dashboardView?.outcomes;

  return (
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="dashboard" />}
        eyebrow={<><Icon name="dashboard" /> Dashboard</>}
        title="Diabetes Decision Cockpit"
        subtitle="Real-time event analytics, safety checks, clinician summary, and user operations connected to live stored health data."
        actions={
          <>
            <Button variant="secondary" size="md" onClick={() => setActiveTab('logging')}>Log Event</Button>
            <Button variant="secondary" size="md" onClick={() => setActiveTab('clinician')}>Clinician View</Button>
            <Button variant="ghost"     size="md" onClick={refreshHealthData}>Refresh</Button>
            <Button variant="danger"    size="md" onClick={clearHealthData}>Clear Events</Button>
          </>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <MetricTile label="Events"               value={outcomes?.event_count ?? 0} />
        <MetricTile label="Avg Glucose"          value={`${outcomes?.avg_glucose || 'n/a'} mg/dL`} />
        <MetricTile label="Time In Range"        value={`${outcomes?.in_range_pct ?? 0}%`} />
        <MetricTile label="Medication Adherence" value={`${outcomes?.adherence_pct ?? 0}%`} />
        <MetricTile label="Escalations"          value={outcomes?.escalation_count ?? 0} />
      </div>

      <p className="dbui-muted" style={{ marginBottom: '1rem' }}>
        Showing <strong>{rangeStartText}</strong> to <strong>{rangeEndText}</strong>
      </p>

      <div style={{ marginBottom: '1.25rem' }}>
        <Tabs
          ariaLabel="Dashboard sections"
          value={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
          items={[
            { id: 'cockpit',   label: 'Cockpit' },
            { id: 'logging',   label: 'Logging' },
            { id: 'timeline',  label: 'Timeline' },
            { id: 'clinician', label: 'Clinician' },
            { id: 'users',     label: 'User Ops' },
          ]}
        />
      </div>

      {activeTab === 'cockpit' ? (
        <section className="cards twoCol">
          <article className="card">
            <h3>Period Filter</h3>
            <div className="periodGrid">
              <label>Range
                <select value={period} onChange={(e) => setPeriod(e.target.value as PeriodKey)}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              <label>From
                <input type="date" value={customFrom} onChange={(e) => {
                  setCustomFrom(e.target.value);
                  setPeriod('custom');
                }} />
              </label>
              <label>To
                <input type="date" value={customTo} onChange={(e) => {
                  setCustomTo(e.target.value);
                  setPeriod('custom');
                }} />
              </label>
              <button className="linkButton secondary" onClick={() => setActiveTab('timeline')}>Open Filtered Timeline</button>
            </div>
          </article>

          <article className="card">
            <h3>Outcomes</h3>
            <p><strong>Hypo:</strong> {outcomes?.hypo_count ?? 0} | <strong>Hyper:</strong> {outcomes?.hyper_count ?? 0}</p>
            <p><strong>Avg glucose trend:</strong> {outcomes?.avg_direction ?? 'flat'} ({outcomes?.avg_glucose || 'n/a'} vs {outcomes?.previous_avg_glucose || 'n/a'} mg/dL)</p>
            <p><strong>Event mix:</strong> glucose {eventMix.glucose}, meals {eventMix.meal}, meds {eventMix.medication}, activity {eventMix.activity}</p>
            <p className="muted">Metrics shown here are calculated from filtered timeline events.</p>
          </article>

          <article className="card">
            <h3>Glucose Trend</h3>
            <GlucoseTrendChart points={dashboardView?.glucose_points ?? []} />
            <p className="muted">Target range band: 70-180 mg/dL.</p>
          </article>

          <article className="card">
            <h3>Event Distribution</h3>
            <EventMixChart mix={eventMix} />
          </article>

          <article className="card">
            <h3>AI Recommendations</h3>
            {recommendations.length ? (
              <div className="stack">
                {recommendations.map((r) => (
                  <div key={r.id} className={`rec ${r.escalate ? 'escalate' : ''}`}>
                    <p><strong>{r.title}</strong> <span className="chip">{r.confidence}</span></p>
                    <p className="muted">{r.why}</p>
                    <p className="safety"><strong>Safety:</strong> {r.safety}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Icon name="spark" />}
                title="No recommendations yet"
                hint="Once events are logged for the selected period, the AI will surface explainable suggestions and safety checks here."
              />
            )}
          </article>

          <article className="card">
            <h3>Action Plans</h3>
            <div className="formGrid">
              <label>Plan title<input value={planDraft.title} onChange={(e) => setPlanDraft({ ...planDraft, title: e.target.value })} /></label>
              <label>Due date<input type="date" value={planDraft.dueDate} onChange={(e) => setPlanDraft({ ...planDraft, dueDate: e.target.value })} /></label>
              <button className="linkButton" onClick={addPlan}>Add Plan</button>
            </div>
            <div className="stack">
              {plans.length ? plans.map((p) => (
                <div key={p.id} className="rowBetween">
                  <span>{p.title} ({p.due_date})</span>
                  <div className="ctaRow">
                    <button className="linkButton secondary tiny" onClick={() => togglePlanStatus(p.id)}>{p.status === 'open' ? 'Mark Done' : 'Reopen'}</button>
                    <button className="linkButton danger tiny" onClick={() => deletePlan(p.id)}>Delete</button>
                  </div>
                </div>
              )) : <p className="muted">No action plans yet.</p>}
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'logging' ? (
        <section className="cards twoCol">
          <LogCard title="Log Glucose" onSave={() => createHealthEvent({ kind: 'glucose', timestamp: new Date(glucoseForm.timestamp).toISOString(), value_mg_dl: glucoseForm.value, context: glucoseForm.context, note: glucoseForm.note }, 'glucose')}>
            <label>Time<input type="datetime-local" value={glucoseForm.timestamp} onChange={(e) => setGlucoseForm({ ...glucoseForm, timestamp: e.target.value })} /></label>
            <label>Value (mg/dL)<input type="number" value={glucoseForm.value} onChange={(e) => setGlucoseForm({ ...glucoseForm, value: Number(e.target.value) })} /></label>
            <label>Context<input value={glucoseForm.context} onChange={(e) => setGlucoseForm({ ...glucoseForm, context: e.target.value })} /></label>
            <label>Note<input value={glucoseForm.note} onChange={(e) => setGlucoseForm({ ...glucoseForm, note: e.target.value })} /></label>
          </LogCard>

          <LogCard title="Log Meal" onSave={() => createHealthEvent({ kind: 'meal', timestamp: new Date(mealForm.timestamp).toISOString(), meal_title: mealForm.title, carbs_g: mealForm.carbs, note: mealForm.note }, 'meal')}>
            <label>Time<input type="datetime-local" value={mealForm.timestamp} onChange={(e) => setMealForm({ ...mealForm, timestamp: e.target.value })} /></label>
            <label>Meal<input value={mealForm.title} onChange={(e) => setMealForm({ ...mealForm, title: e.target.value })} /></label>
            <label>Carbs (g)<input type="number" value={mealForm.carbs} onChange={(e) => setMealForm({ ...mealForm, carbs: Number(e.target.value) })} /></label>
            <label>Note<input value={mealForm.note} onChange={(e) => setMealForm({ ...mealForm, note: e.target.value })} /></label>
          </LogCard>

          <LogCard title="Log Medication" onSave={() => createHealthEvent({ kind: 'medication', timestamp: new Date(medForm.timestamp).toISOString(), medication_name: medForm.name, dose: medForm.dose, taken: medForm.taken, note: medForm.note }, 'medication')}>
            <label>Time<input type="datetime-local" value={medForm.timestamp} onChange={(e) => setMedForm({ ...medForm, timestamp: e.target.value })} /></label>
            <label>Medication<input value={medForm.name} onChange={(e) => setMedForm({ ...medForm, name: e.target.value })} /></label>
            <label>Dose<input value={medForm.dose} onChange={(e) => setMedForm({ ...medForm, dose: e.target.value })} /></label>
            <label className="checkRow"><input type="checkbox" checked={medForm.taken} onChange={(e) => setMedForm({ ...medForm, taken: e.target.checked })} />Taken as planned</label>
            <label>Note<input value={medForm.note} onChange={(e) => setMedForm({ ...medForm, note: e.target.value })} /></label>
          </LogCard>

          <LogCard title="Log Activity" onSave={() => createHealthEvent({ kind: 'activity', timestamp: new Date(activityForm.timestamp).toISOString(), activity_type: activityForm.activityType, duration_min: activityForm.durationMin, note: activityForm.note }, 'activity')}>
            <label>Time<input type="datetime-local" value={activityForm.timestamp} onChange={(e) => setActivityForm({ ...activityForm, timestamp: e.target.value })} /></label>
            <label>Activity<input value={activityForm.activityType} onChange={(e) => setActivityForm({ ...activityForm, activityType: e.target.value })} /></label>
            <label>Duration (min)<input type="number" value={activityForm.durationMin} onChange={(e) => setActivityForm({ ...activityForm, durationMin: Number(e.target.value) })} /></label>
            <label>Note<input value={activityForm.note} onChange={(e) => setActivityForm({ ...activityForm, note: e.target.value })} /></label>
          </LogCard>

          <LogCard title="Log Sleep" onSave={() => createHealthEvent({ kind: 'sleep', timestamp: new Date(sleepForm.timestamp).toISOString(), sleep_hours: sleepForm.sleepHours, note: sleepForm.note }, 'sleep')}>
            <label>Wake time<input type="datetime-local" value={sleepForm.timestamp} onChange={(e) => setSleepForm({ ...sleepForm, timestamp: e.target.value })} /></label>
            <label>Hours slept<input type="number" step="0.1" value={sleepForm.sleepHours} onChange={(e) => setSleepForm({ ...sleepForm, sleepHours: Number(e.target.value) })} /></label>
            <label>Note<input value={sleepForm.note} onChange={(e) => setSleepForm({ ...sleepForm, note: e.target.value })} /></label>
          </LogCard>

          <LogCard title="Log Symptom" onSave={() => createHealthEvent({ kind: 'symptom', timestamp: new Date(symptomForm.timestamp).toISOString(), symptom: symptomForm.symptom, severity: symptomForm.severity, note: symptomForm.note }, 'symptom')}>
            <label>Time<input type="datetime-local" value={symptomForm.timestamp} onChange={(e) => setSymptomForm({ ...symptomForm, timestamp: e.target.value })} /></label>
            <label>Symptom<input value={symptomForm.symptom} onChange={(e) => setSymptomForm({ ...symptomForm, symptom: e.target.value })} /></label>
            <label>Severity<input value={symptomForm.severity} onChange={(e) => setSymptomForm({ ...symptomForm, severity: e.target.value })} /></label>
            <label>Note<input value={symptomForm.note} onChange={(e) => setSymptomForm({ ...symptomForm, note: e.target.value })} /></label>
          </LogCard>
        </section>
      ) : null}

      {activeTab === 'timeline' ? (
        <section className="card">
          <h3>Unified Patient Timeline</h3>
          <p className="muted">Filtered event stream from {rangeStartText} to {rangeEndText}, newest to oldest.</p>
          <div className="stack">
            {filteredEvents.length ? filteredEvents.map((e) => (
              <div key={e.id} className="timelineItem">
                <div>
                  <p><strong>{(e.kind as string).toUpperCase()}</strong> | {new Date(e.timestamp).toLocaleString()}</p>
                  <p>{e.primary_text}</p>
                  {e.note ? <p className="muted">{e.note}</p> : null}
                </div>
                <button className="linkButton secondary tiny" onClick={() => removeEvent(e.id)}>Delete</button>
              </div>
            )) : <p className="muted">No health events found in this time window.</p>}
          </div>
        </section>
      ) : null}

      {activeTab === 'clinician' ? (
        <section className="cards twoCol">
          <article className="card">
            <h3>Clinician Co-Pilot Summary</h3>
            <p className="muted">Generated from backend metrics and recommendation engine.</p>
            <textarea className="summaryBox" value={clinicianSummary} readOnly />
            <div className="ctaRow">
              <button className="linkButton" onClick={copySummary}>Copy Summary</button>
            </div>
          </article>

          <article className="card">
            <h3>Safety Gate</h3>
            <div className="stack">
              {recommendations.filter((r) => r.escalate).length ? recommendations.filter((r) => r.escalate).map((r) => (
                <div key={r.id} className="rec escalate">
                  <p><strong>{r.title}</strong></p>
                  <p className="muted">{r.why}</p>
                  <p className="safety"><strong>Escalation:</strong> {r.safety}</p>
                </div>
              )) : <p className="okText">No active escalations detected.</p>}
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'users' ? (
        <section className="cards twoCol">
          <article className="card">
            <h3>Create User</h3>
            <div className="formGrid">
              <label>Email<input value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} /></label>
              <label>Password<input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} /></label>
              <label>Phone<input value={createForm.phone_number} onChange={(e) => setCreateForm({ ...createForm, phone_number: e.target.value })} /></label>
              <label>First name<input value={createForm.first_name} onChange={(e) => setCreateForm({ ...createForm, first_name: e.target.value })} /></label>
              <label>Last name<input value={createForm.last_name} onChange={(e) => setCreateForm({ ...createForm, last_name: e.target.value })} /></label>
              <label>Gender<input value={createForm.gender} onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })} /></label>
              <label>Relationship<input value={createForm.relationship_status} onChange={(e) => setCreateForm({ ...createForm, relationship_status: e.target.value })} /></label>
              <label>Birth date<input type="date" value={createForm.birth_date} onChange={(e) => setCreateForm({ ...createForm, birth_date: e.target.value })} /></label>
              <button className="linkButton" onClick={createUser}>Create</button>
            </div>
          </article>

          <article className="card">
            <h3>Lookup + Update + Delete</h3>
            <div className="formGrid">
              <label>User ID<input value={idInput} onChange={(e) => setIdInput(e.target.value)} /></label>
              <button className="linkButton secondary" onClick={getById}>Get by ID</button>
              <label>Email<input value={emailLookup} onChange={(e) => setEmailLookup(e.target.value)} /></label>
              <button className="linkButton secondary" onClick={getByEmail}>Get by Email</button>
              <hr />
              <label>New email<input value={updateForm.email} onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })} /></label>
              <label>New password<input type="password" value={updateForm.password} onChange={(e) => setUpdateForm({ ...updateForm, password: e.target.value })} /></label>
              <label>Phone<input value={updateForm.phone_number} onChange={(e) => setUpdateForm({ ...updateForm, phone_number: e.target.value })} /></label>
              <label>Status<input value={updateForm.status} onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })} /></label>
              <button className="linkButton" onClick={updateUser}>Update</button>
              <button className="linkButton secondary" onClick={softDelete}>Soft Delete</button>
              <button className="linkButton danger" onClick={hardDelete}>Hard Delete</button>
            </div>
          </article>

          {currentUser ? (
            <article className="card">
              <h3>Current User</h3>
              <p><strong>ID:</strong> {currentUser.id}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Status:</strong> {currentUser.status}</p>
              <p><strong>Created:</strong> {createdAtText}</p>
              <p><strong>Deleted At:</strong> {currentUser.deleted_at || 'null'}</p>
            </article>
          ) : null}
        </section>
      ) : null}

      {loading ? <p className="muted">Refreshing health data...</p> : null}
      {message ? <p className="okText">{message}</p> : null}
      {error ? <p className="errorText">{error}</p> : null}
    </section>
  );
}

function LogCard({ title, onSave, children }: { title: string; onSave: () => void; children: React.ReactNode }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <div className="formGrid">
        {children}
        <button className="linkButton" onClick={onSave}>Save</button>
      </div>
    </article>
  );
}

function GlucoseTrendChart({ points }: { points: Array<{ timestamp: string; value: number }> }) {
  if (!points.length) {
    return <p className="muted">No glucose points in selected period.</p>;
  }

  const chartPoints = points
    .map((point) => ({ at: new Date(point.timestamp), value: point.value }))
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  const width = 620;
  const height = 210;
  const padX = 30;
  const padY = 18;
  const minT = chartPoints[0].at.getTime();
  const maxT = chartPoints[chartPoints.length - 1].at.getTime();
  const span = Math.max(maxT - minT, 1);

  const allValues = chartPoints.map((p) => p.value);
  const minV = Math.max(Math.min(...allValues, 55) - 10, 40);
  const maxV = Math.max(...allValues, 190) + 10;
  const vSpan = Math.max(maxV - minV, 1);

  const x = (t: number) => padX + ((t - minT) / span) * (width - padX * 2);
  const y = (v: number) => height - padY - ((v - minV) / vSpan) * (height - padY * 2);
  const line = chartPoints.map((p) => `${x(p.at.getTime()).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const y70 = y(70);
  const y180 = y(180);

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Glucose trend chart">
      <rect x={padX} y={Math.min(y70, y180)} width={width - padX * 2} height={Math.abs(y180 - y70)} fill="var(--range-band)" />
      <line x1={padX} y1={y70} x2={width - padX} y2={y70} stroke="var(--brand-accent)" strokeDasharray="4 4" />
      <line x1={padX} y1={y180} x2={width - padX} y2={y180} stroke="var(--brand-accent)" strokeDasharray="4 4" />
      <polyline points={line} fill="none" stroke="var(--brand-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {chartPoints.map((p) => (
        <circle key={`${p.at.toISOString()}-${p.value}`} cx={x(p.at.getTime())} cy={y(p.value)} r="3" fill="var(--brand-gold)" />
      ))}
    </svg>
  );
}

function EventMixChart({ mix }: { mix: Record<EventKind, number> }) {
  const order: EventKind[] = ['glucose', 'meal', 'medication', 'activity', 'sleep', 'symptom'];
  const width = 620;
  const height = 210;
  const pad = 26;
  const max = Math.max(...order.map((k) => mix[k]), 1);
  const barW = 68;
  const gap = 22;

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Event distribution chart">
      {order.map((k, i) => {
        const value = mix[k];
        const x = pad + i * (barW + gap);
        const h = (value / max) * (height - pad * 2 - 28);
        const y = height - pad - h - 20;
        return (
          <g key={k}>
            <rect x={x} y={y} width={barW} height={h} rx="8" fill="var(--brand-primary)" opacity={0.86} />
            <text x={x + barW / 2} y={height - 10} textAnchor="middle" className="chartLabel">{k}</text>
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="chartValue">{value}</text>
          </g>
        );
      })}
    </svg>
  );
}
