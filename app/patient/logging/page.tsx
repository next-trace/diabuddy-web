'use client';

import { useState } from 'react';
import { Button, PageHeader } from '@next-trace/nexdoz-design-system/react';
import { mapErrorToFriendly } from '../../../lib/error-map';
import { healthApi } from '../../../lib/health-api';
import { Icon } from '../../components/icons';

function nowLocalInput(): string {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function LoggingPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [glucoseForm, setGlucoseForm] = useState({ timestamp: nowLocalInput(), value: 118, context: 'pre-meal', note: '' });
  const [mealForm, setMealForm] = useState({ timestamp: nowLocalInput(), title: 'Lunch', carbs: 45, note: '' });
  const [medForm, setMedForm] = useState({ timestamp: nowLocalInput(), name: 'Rapid insulin', dose: '4 units', taken: true, note: '' });
  const [activityForm, setActivityForm] = useState({ timestamp: nowLocalInput(), activityType: 'Walk', durationMin: 30, note: '' });
  const [sleepForm, setSleepForm] = useState({ timestamp: nowLocalInput(), sleepHours: 7.5, note: '' });
  const [symptomForm, setSymptomForm] = useState({ timestamp: nowLocalInput(), symptom: 'None', severity: 'none', note: '' });

  function resetNotice() {
    setMessage('');
    setError('');
  }

  async function submit(payload: Record<string, unknown>, label: string) {
    resetNotice();
    try {
      await healthApi.createEvent(payload as any);
      setMessage(`${label} saved.`);
    } catch (e) {
      setError(mapErrorToFriendly(e));
    }
  }

  return (
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="logging" />}
        eyebrow={<><Icon name="logging" /> Patient Workflow</>}
        title="Event Logging"
        subtitle="Record glucose, meals, medications, activity, sleep, and symptoms."
      />

      <section className="card loggingIntro">
        <p className="muted">
          Use structured inputs for faster, safer capture. Save each event independently so incomplete forms do not block other logs.
        </p>
      </section>

      <section className="cards loggingGrid">
        <article className="card loggingCard">
          <h3><Icon name="insights" /> Glucose</h3>
          <div className="formGrid">
            <label>Time<input type="datetime-local" value={glucoseForm.timestamp} onChange={(e) => setGlucoseForm({ ...glucoseForm, timestamp: e.target.value })} /></label>
            <label>Value (mg/dL)<input type="number" value={glucoseForm.value} onChange={(e) => setGlucoseForm({ ...glucoseForm, value: Number(e.target.value) })} /></label>
            <label>Context
              <select value={glucoseForm.context} onChange={(e) => setGlucoseForm({ ...glucoseForm, context: e.target.value })}>
                <option value="pre-meal">Pre-meal</option>
                <option value="post-meal">Post-meal</option>
                <option value="fasting">Fasting</option>
                <option value="bedtime">Bedtime</option>
              </select>
            </label>
            <label>Note<input value={glucoseForm.note} onChange={(e) => setGlucoseForm({ ...glucoseForm, note: e.target.value })} /></label>
            <Button className="linkButton loggingSaveButton" onClick={() => submit({ kind: 'glucose', timestamp: new Date(glucoseForm.timestamp).toISOString(), value_mg_dl: glucoseForm.value, context: glucoseForm.context, note: glucoseForm.note }, 'Glucose')}>Save</Button>
          </div>
        </article>

        <article className="card loggingCard">
          <h3><Icon name="meal" /> Meal</h3>
          <div className="formGrid">
            <label>Time<input type="datetime-local" value={mealForm.timestamp} onChange={(e) => setMealForm({ ...mealForm, timestamp: e.target.value })} /></label>
            <label>Meal<input value={mealForm.title} onChange={(e) => setMealForm({ ...mealForm, title: e.target.value })} /></label>
            <label>Carbs (g)<input type="number" value={mealForm.carbs} onChange={(e) => setMealForm({ ...mealForm, carbs: Number(e.target.value) })} /></label>
            <label>Note<input value={mealForm.note} onChange={(e) => setMealForm({ ...mealForm, note: e.target.value })} /></label>
            <Button className="linkButton loggingSaveButton" onClick={() => submit({ kind: 'meal', timestamp: new Date(mealForm.timestamp).toISOString(), meal_title: mealForm.title, carbs_g: mealForm.carbs, note: mealForm.note }, 'Meal')}>Save</Button>
          </div>
        </article>

        <article className="card loggingCard">
          <h3><Icon name="stethoscope" /> Medication</h3>
          <div className="formGrid">
            <label>Time<input type="datetime-local" value={medForm.timestamp} onChange={(e) => setMedForm({ ...medForm, timestamp: e.target.value })} /></label>
            <label>Name<input value={medForm.name} onChange={(e) => setMedForm({ ...medForm, name: e.target.value })} /></label>
            <label>Dose<input value={medForm.dose} onChange={(e) => setMedForm({ ...medForm, dose: e.target.value })} /></label>
            <label className="checkRow"><input type="checkbox" checked={medForm.taken} onChange={(e) => setMedForm({ ...medForm, taken: e.target.checked })} />Taken</label>
            <label>Note<input value={medForm.note} onChange={(e) => setMedForm({ ...medForm, note: e.target.value })} /></label>
            <Button className="linkButton loggingSaveButton" onClick={() => submit({ kind: 'medication', timestamp: new Date(medForm.timestamp).toISOString(), medication_name: medForm.name, dose: medForm.dose, taken: medForm.taken, note: medForm.note }, 'Medication')}>Save</Button>
          </div>
        </article>

        <article className="card loggingCard">
          <h3><Icon name="timeline" /> Activity</h3>
          <div className="formGrid">
            <label>Time<input type="datetime-local" value={activityForm.timestamp} onChange={(e) => setActivityForm({ ...activityForm, timestamp: e.target.value })} /></label>
            <label>Activity<input value={activityForm.activityType} onChange={(e) => setActivityForm({ ...activityForm, activityType: e.target.value })} /></label>
            <label>Duration (min)<input type="number" value={activityForm.durationMin} onChange={(e) => setActivityForm({ ...activityForm, durationMin: Number(e.target.value) })} /></label>
            <label>Note<input value={activityForm.note} onChange={(e) => setActivityForm({ ...activityForm, note: e.target.value })} /></label>
            <Button className="linkButton loggingSaveButton" onClick={() => submit({ kind: 'activity', timestamp: new Date(activityForm.timestamp).toISOString(), activity_type: activityForm.activityType, duration_min: activityForm.durationMin, note: activityForm.note }, 'Activity')}>Save</Button>
          </div>
        </article>

        <article className="card loggingCard">
          <h3><Icon name="timeline" /> Sleep</h3>
          <div className="formGrid">
            <label>Wake time<input type="datetime-local" value={sleepForm.timestamp} onChange={(e) => setSleepForm({ ...sleepForm, timestamp: e.target.value })} /></label>
            <label>Hours slept<input type="number" step="0.1" value={sleepForm.sleepHours} onChange={(e) => setSleepForm({ ...sleepForm, sleepHours: Number(e.target.value) })} /></label>
            <label>Note<input value={sleepForm.note} onChange={(e) => setSleepForm({ ...sleepForm, note: e.target.value })} /></label>
            <Button className="linkButton loggingSaveButton" onClick={() => submit({ kind: 'sleep', timestamp: new Date(sleepForm.timestamp).toISOString(), sleep_hours: sleepForm.sleepHours, note: sleepForm.note }, 'Sleep')}>Save</Button>
          </div>
        </article>

        <article className="card loggingCard">
          <h3><Icon name="shield" /> Symptom</h3>
          <div className="formGrid">
            <label>Time<input type="datetime-local" value={symptomForm.timestamp} onChange={(e) => setSymptomForm({ ...symptomForm, timestamp: e.target.value })} /></label>
            <label>Symptom<input value={symptomForm.symptom} onChange={(e) => setSymptomForm({ ...symptomForm, symptom: e.target.value })} /></label>
            <label>Severity
              <select value={symptomForm.severity} onChange={(e) => setSymptomForm({ ...symptomForm, severity: e.target.value })}>
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </label>
            <label>Note<input value={symptomForm.note} onChange={(e) => setSymptomForm({ ...symptomForm, note: e.target.value })} /></label>
            <Button className="linkButton loggingSaveButton" onClick={() => submit({ kind: 'symptom', timestamp: new Date(symptomForm.timestamp).toISOString(), symptom: symptomForm.symptom, severity: symptomForm.severity, note: symptomForm.note }, 'Symptom')}>Save</Button>
          </div>
        </article>
      </section>

      {message ? <section className="card loggingNotice"><p className="okText">{message}</p></section> : null}
      {error ? <section className="card loggingNotice"><p className="errorText">{error}</p></section> : null}
    </section>
  );
}
