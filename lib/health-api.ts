import { csrfHeaders } from './csrf';

export type EventKind = 'glucose' | 'meal' | 'medication' | 'activity' | 'sleep' | 'symptom';

export interface HealthEvent {
  id: string;
  kind: EventKind;
  timestamp: string;
  note?: string;
  value_mg_dl?: number;
  context?: string;
  meal_title?: string;
  carbs_g?: number;
  medication_name?: string;
  dose?: string;
  taken?: boolean;
  activity_type?: string;
  duration_min?: number;
  sleep_hours?: number;
  symptom?: string;
  severity?: string;
}

export interface HealthEventView extends HealthEvent {
  primary_text: string;
}

export interface GlucosePoint {
  timestamp: string;
  value: number;
}

export interface DashboardOutcomes {
  event_count: number;
  avg_glucose: number;
  in_range_pct: number;
  adherence_pct: number;
  hypo_count: number;
  hyper_count: number;
  previous_avg_glucose: number;
  avg_direction: 'up' | 'down' | 'flat';
  escalation_count: number;
}

export interface DashboardView {
  range_start: string;
  range_end: string;
  filtered_events: HealthEventView[];
  glucose_points: GlucosePoint[];
  event_mix: Record<EventKind, number>;
  outcomes: DashboardOutcomes;
}

export interface CockpitView {
  dashboard: DashboardView;
  recommendations: Recommendation[];
  clinician_summary: string;
  action_plans: ActionPlan[];
}

export interface HealthMetrics {
  event_count_24h: number;
  avg_glucose_24h: number;
  in_range_pct_24h: number;
  hypo_24h: number;
  hyper_24h: number;
  adherence_pct_7d: number;
  adherence_taken_7d: number;
  adherence_total_7d: number;
  current_avg_7d: number;
  previous_avg_7d: number;
  avg_direction: string;
  current_range_7d: number;
  previous_range_7d: number;
  range_direction: string;
  escalation_count_now: number;
}

export interface InsightsView {
  metrics: HealthMetrics;
  recommendations: Recommendation[];
}

export interface ClinicianView {
  summary: string;
  escalations: Recommendation[];
}

export interface ActionPlansView {
  items: ActionPlan[];
  open_count: number;
  done_count: number;
}

export interface Recommendation {
  id: string;
  title: string;
  why: string;
  confidence: 'low' | 'medium' | 'high';
  safety: string;
  escalate: boolean;
}

export interface ActionPlan {
  id: string;
  title: string;
  due_date: string;
  status: 'open' | 'done';
  created_at: string;
  updated_at: string;
}

export interface CreateHealthEventPayload {
  kind: EventKind;
  timestamp: string;
  note?: string;
  value_mg_dl?: number;
  context?: string;
  meal_title?: string;
  carbs_g?: number;
  medication_name?: string;
  dose?: string;
  taken?: boolean;
  activity_type?: string;
  duration_min?: number;
  sleep_hours?: number;
  symptom?: string;
  severity?: string;
}

export interface CreateActionPlanPayload {
  title: string;
  due_date: string;
}

export interface UpdateActionPlanPayload {
  title?: string;
  due_date?: string;
  status?: 'open' | 'done';
}

export interface DashboardViewQuery {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  from?: string;
  to?: string;
}

async function parseOrThrow(res: Response): Promise<any> {
  if (res.ok) {
    if (res.status === 204) return null;
    return res.json();
  }

  let message = `request failed: ${res.status}`;
  try {
    const body = await res.json();
    message = body.details || body.error || message;
  } catch {
    // no-op
  }
  throw new Error(message);
}

export const healthApi = {
  async getInsightsView(): Promise<InsightsView> {
    const res = await fetch('/api/health/insights-view', { method: 'GET' });
    return (await parseOrThrow(res)) as InsightsView;
  },

  async getClinicianView(): Promise<ClinicianView> {
    const res = await fetch('/api/health/clinician-view', { method: 'GET' });
    return (await parseOrThrow(res)) as ClinicianView;
  },

  async getCockpitView(query: DashboardViewQuery): Promise<CockpitView> {
    const params = new URLSearchParams({ period: query.period });
    if (query.period === 'custom') {
      if (query.from) params.set('from', query.from);
      if (query.to) params.set('to', query.to);
    }
    const res = await fetch(`/api/health/cockpit-view?${params.toString()}`, { method: 'GET' });
    return (await parseOrThrow(res)) as CockpitView;
  },

  async getDashboardView(query: DashboardViewQuery): Promise<DashboardView> {
    const params = new URLSearchParams({ period: query.period });
    if (query.period === 'custom') {
      if (query.from) params.set('from', query.from);
      if (query.to) params.set('to', query.to);
    }
    const res = await fetch(`/api/health/dashboard-view?${params.toString()}`, { method: 'GET' });
    return (await parseOrThrow(res)) as DashboardView;
  },

  async listEvents(): Promise<HealthEvent[]> {
    const res = await fetch('/api/health/events', { method: 'GET' });
    const data = await parseOrThrow(res);
    return data.items as HealthEvent[];
  },

  async createEvent(payload: CreateHealthEventPayload): Promise<HealthEvent> {
    const res = await fetch('/api/health/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
      body: JSON.stringify(payload)
    });
    return (await parseOrThrow(res)) as HealthEvent;
  },

  async deleteEvent(id: string): Promise<void> {
    const res = await fetch(`/api/health/events/${id}`, {
      method: 'DELETE',
      headers: csrfHeaders()
    });
    await parseOrThrow(res);
  },

  async listEventsView(params?: { from?: string; to?: string; limit?: number }): Promise<HealthEventView[]> {
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    if (params?.limit) query.set('limit', String(params.limit));
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`/api/health/events-view${suffix}`, { method: 'GET' });
    const data = await parseOrThrow(res);
    return data.items as HealthEventView[];
  },

  async clearEvents(): Promise<void> {
    const res = await fetch('/api/health/events', {
      method: 'DELETE',
      headers: csrfHeaders()
    });
    await parseOrThrow(res);
  },

  async getMetrics(): Promise<HealthMetrics> {
    const res = await fetch('/api/health/metrics', { method: 'GET' });
    return (await parseOrThrow(res)) as HealthMetrics;
  },

  async getRecommendations(): Promise<Recommendation[]> {
    const res = await fetch('/api/health/recommendations', { method: 'GET' });
    const data = await parseOrThrow(res);
    return data.items as Recommendation[];
  },

  async getClinicianSummary(): Promise<string> {
    const res = await fetch('/api/health/clinician-summary', { method: 'GET' });
    const data = await parseOrThrow(res);
    return data.summary as string;
  },

  async listActionPlans(): Promise<ActionPlan[]> {
    const res = await fetch('/api/health/action-plans', { method: 'GET' });
    const data = await parseOrThrow(res);
    return data.items as ActionPlan[];
  },

  async getActionPlansView(): Promise<ActionPlansView> {
    const res = await fetch('/api/health/action-plans-view', { method: 'GET' });
    return (await parseOrThrow(res)) as ActionPlansView;
  },

  async createActionPlan(payload: CreateActionPlanPayload): Promise<ActionPlan> {
    const res = await fetch('/api/health/action-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
      body: JSON.stringify(payload)
    });
    return (await parseOrThrow(res)) as ActionPlan;
  },

  async updateActionPlan(id: string, payload: UpdateActionPlanPayload): Promise<ActionPlan> {
    const res = await fetch(`/api/health/action-plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
      body: JSON.stringify(payload)
    });
    return (await parseOrThrow(res)) as ActionPlan;
  },

  async deleteActionPlan(id: string): Promise<void> {
    const res = await fetch(`/api/health/action-plans/${id}`, {
      method: 'DELETE',
      headers: csrfHeaders()
    });
    await parseOrThrow(res);
  },

  async toggleActionPlan(id: string): Promise<ActionPlan> {
    const res = await fetch(`/api/health/action-plans/${id}/toggle`, {
      method: 'POST',
      headers: csrfHeaders()
    });
    return (await parseOrThrow(res)) as ActionPlan;
  }
};
