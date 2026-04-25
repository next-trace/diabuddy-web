'use client';

import { useRef, useState } from 'react';
import { Button, Input, Select, TextArea, PageHeader } from '@next-trace/nexdoz-design-system/react';
import { healthApi } from '../../../lib/health-api';
import { csrfHeaders } from '../../../lib/csrf';
import { Icon } from '../../components/icons';

type Candidate = {
  name: string;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  confidence: number;
};

type ScanResponse = {
  source: string;
  ai_provider?: string;
  ai_model?: string;
  ai_status?: 'live' | 'fallback_no_response' | 'fallback_invalid_json' | 'fallback_error';
  ai_error?: string;
  needs_clarification: boolean;
  clarification_questions: string[];
  candidates: Candidate[];
  selected: Candidate;
  guidance: string;
};

type PlanDay = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  note: string;
};

type ClarificationQA = {
  question: string;
  answer: string;
};

export default function MealAiPage() {
  const [menuText, setMenuText] = useState('');
  const [hints, setHints] = useState('');
  const [imageName, setImageName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileKind, setFileKind] = useState<'restaurant_menu' | 'food_photo' | 'nutrition_label'>('restaurant_menu');
  const [orderNumber, setOrderNumber] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [scan, setScan] = useState<ScanResponse | null>(null);
  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({});
  const [clarificationHistory, setClarificationHistory] = useState<ClarificationQA[]>([]);
  const [chosen, setChosen] = useState('');
  const [style, setStyle] = useState('balanced');
  const [plan, setPlan] = useState<PlanDay[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function resetNotice() {
    setMessage('');
    setError('');
  }

  async function runScan(extraHints?: string, historyOverride?: ClarificationQA[]) {
    resetNotice();
    try {
      const mergedHints = [hints.trim(), (extraHints || '').trim()].filter(Boolean).join(' | ');
      const historyPayload = historyOverride || clarificationHistory;
      let res: Response;
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        fd.append('menu_text', menuText);
        fd.append('hints', mergedHints);
        fd.append('image_name', imageName || imageFile.name);
        fd.append('file_kind', fileKind);
        fd.append('order_number', orderNumber);
        fd.append('clarification_history', JSON.stringify(historyPayload));
        res = await fetch('/api/ai/meal-scan', { method: 'POST', headers: csrfHeaders(), body: fd });
      } else {
        res = await fetch('/api/ai/meal-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
          body: JSON.stringify({
            menu_text: menuText,
            hints: mergedHints,
            image_name: imageName,
            file_kind: fileKind,
            order_number: orderNumber,
            clarification_history: historyPayload
          })
        });
      }
      const data = (await res.json()) as ScanResponse;
      setScan(data);
      setChosen(data.selected.name);
      setClarificationAnswers(
        Object.fromEntries((data.clarification_questions || []).map((q) => [q, '']))
      );
      setMessage('Meal scan complete. Review and confirm before saving.');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function rerunWithClarifications() {
    if (!scan?.clarification_questions?.length) return;
    const answeredPairs = scan.clarification_questions
      .map((q) => {
        const answer = (clarificationAnswers[q] || '').trim();
        return answer ? { question: q, answer } : null;
      })
      .filter(Boolean) as ClarificationQA[];
    if (!answeredPairs.length) {
      setError('Please answer at least one clarification question first.');
      return;
    }
    const mergedHistory = [...clarificationHistory, ...answeredPairs];
    setClarificationHistory(mergedHistory);
    const answerLines = answeredPairs.map((item) => `${item.question} Answer: ${item.answer}`);
    await runScan(`Clarifications: ${answerLines.join(' | ')}`, mergedHistory);
  }

  async function saveMeal() {
    resetNotice();
    if (!scan) {
      setError('Run meal scan first.');
      return;
    }
    const item = scan.candidates.find((c) => c.name === chosen) || scan.selected;
    try {
      await healthApi.createEvent({
        kind: 'meal',
        timestamp: new Date().toISOString(),
        meal_title: item.name,
        carbs_g: item.carbs_g,
        note: `AI meal scan | protein ${item.protein_g}g | fat ${item.fat_g}g | confidence ${Math.round(item.confidence * 100)}%`
      });
      setMessage('Meal saved to timeline successfully.');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function generatePlan() {
    resetNotice();
    try {
      const res = await fetch('/api/ai/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ style })
      });
      const data = (await res.json()) as { plan: PlanDay[] };
      setPlan(data.plan || []);
      setMessage('Weekly AI meal plan generated.');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="meal" />}
        eyebrow={<><Icon name="meal" /> AI Meal Workflow</>}
        title="Meal Scan + Clarification"
        subtitle="Scan meal/menu, resolve low-confidence guesses, and save structured meal events directly to timeline."
      />

      <section className="cards twoCol">
        <article className="card">
          <h3>Meal Scan Input</h3>
          <div className="formGrid">
            <label>Upload file (image or PDF menu)
              <input
                ref={fileInputRef}
                className="fileInputHidden"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  setImageName(file?.name || '');
                }}
              />
              <div className="uploadRow">
                <Button
                  type="button"
                  variant="secondary"
                  className="linkButton secondary filePickerButton"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="meal" /> Choose File
                </Button>
                <span className="fileNameChip">{imageName || 'No file selected'}</span>
              </div>
            </label>
            <label>File type
              <Select value={fileKind} onChange={(e) => setFileKind(e.target.value as 'restaurant_menu' | 'food_photo' | 'nutrition_label')}>
                <option value="restaurant_menu">Restaurant menu</option>
                <option value="food_photo">Food photo</option>
                <option value="nutrition_label">Nutrition label</option>
              </Select>
            </label>
            <label>Order number (for menu files)
              <Input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. 35" />
            </label>
            <label>Menu text
              <TextArea value={menuText} onChange={(e) => setMenuText(e.target.value)} rows={4} />
            </label>
            <label>User hints (optional)
              <Input value={hints} onChange={(e) => setHints(e.target.value)} placeholder="e.g. medium portion, no sauce" />
            </label>
            <Button className="linkButton compactAction" onClick={() => runScan()}>Analyze Meal</Button>
          </div>
        </article>

        <article className="card">
          <h3>Scan Result</h3>
          {scan ? (
            <div className="stack">
              <p><strong>AI source:</strong> {scan.source}</p>
              <p><strong>AI engine:</strong> {scan.ai_provider || 'unknown'}{scan.ai_model ? ` (${scan.ai_model})` : ''} | status: {scan.ai_status || 'unknown'}</p>
              {scan.ai_error ? <p className="muted"><strong>AI error:</strong> {scan.ai_error}</p> : null}
              <p><strong>Guidance:</strong> {scan.guidance}</p>
              {scan.needs_clarification ? (
                <div className="rec escalate">
                  <p><strong>Clarification needed</strong></p>
                  {scan.clarification_questions.map((q) => (
                    <label key={q}>
                      <span className="muted">{q}</span>
                      <Input
                        value={clarificationAnswers[q] || ''}
                        onChange={(e) =>
                          setClarificationAnswers((prev) => ({ ...prev, [q]: e.target.value }))
                        }
                        placeholder="Your answer"
                      />
                    </label>
                  ))}
                  <Button className="linkButton compactAction secondary" onClick={rerunWithClarifications}>
                    Re-analyze with answers
                  </Button>
                </div>
              ) : null}
              <label>Choose meal
                <Select value={chosen} onChange={(e) => setChosen(e.target.value)}>
                  {scan.candidates.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} | carbs {c.carbs_g}g | confidence {Math.round(c.confidence * 100)}%
                    </option>
                  ))}
                </Select>
              </label>
              <Button className="linkButton compactAction" onClick={saveMeal}>Confirm + Save to Timeline</Button>
            </div>
          ) : <p className="muted">No analysis yet.</p>}
        </article>
      </section>

      <section className="card">
        <h3>AI Weekly Meal Plan</h3>
        <div className="ctaRow">
          <Select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="balanced">Balanced</option>
            <option value="low-carb">Low Carb</option>
          </Select>
          <Button className="linkButton compactAction" onClick={generatePlan}>Generate Plan</Button>
        </div>
        <div className="cards">
          {plan.map((d) => (
            <article className="card" key={d.day}>
              <h3>{d.day}</h3>
              <p><strong>Breakfast:</strong> {d.breakfast}</p>
              <p><strong>Lunch:</strong> {d.lunch}</p>
              <p><strong>Dinner:</strong> {d.dinner}</p>
              <p><strong>Snack:</strong> {d.snack}</p>
              <p className="muted">{d.note}</p>
            </article>
          ))}
        </div>
      </section>

      {message ? <p className="okText">{message}</p> : null}
      {error ? <p className="errorText">{error}</p> : null}
    </section>
  );
}
