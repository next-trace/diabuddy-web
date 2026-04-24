import type { paths, components } from './gen/types';

export type ApiPaths = paths;
export type ApiComponents = components;
export type UserResponse = components['schemas']['UserResponse'];
export type CreateUserRequest = components['schemas']['CreateUserRequest'];
export type CreateUserResponse = components['schemas']['CreateUserResponse'];
export type UpdateUserRequest = components['schemas']['UpdateUserRequest'];
export type LoginRequest = components['schemas']['LoginRequest'];
export type RefreshRequest = components['schemas']['RefreshRequest'];
export type AuthResponse = components['schemas']['AuthResponse'];
export type MeResponse = components['schemas']['MeResponse'];
export type CreateHealthEventRequest = components['schemas']['CreateHealthEventRequest'];
export type HealthEvent = components['schemas']['HealthEvent'];
export type HealthMetrics = components['schemas']['HealthMetrics'];
export type Recommendation = components['schemas']['Recommendation'];
export type CreateActionPlanRequest = components['schemas']['CreateActionPlanRequest'];
export type UpdateActionPlanRequest = components['schemas']['UpdateActionPlanRequest'];
export type ActionPlan = components['schemas']['ActionPlan'];

type ErrorResponse = components['schemas']['ErrorResponse'];

export class ApiClientError extends Error {
  constructor(public readonly status: number, public readonly payload?: ErrorResponse) {
    super(payload?.details || `request failed: ${status}`);
  }
}

async function parseError(res: Response): Promise<ApiClientError> {
  try {
    const payload = (await res.json()) as ErrorResponse;
    return new ApiClientError(res.status, payload);
  } catch {
    return new ApiClientError(res.status);
  }
}

export class UserApiClient {
  constructor(private readonly baseUrl: string) {}

  private withAuth(headers: Record<string, string>, accessToken?: string, extraHeaders?: Record<string, string>): Record<string, string> {
    const nextHeaders = {
      ...headers,
      ...(extraHeaders || {})
    };

    if (!accessToken) {
      return nextHeaders;
    }
    return {
      ...nextHeaders,
      Authorization: `Bearer ${accessToken}`
    };
  }

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as AuthResponse;
  }

  async refresh(payload: RefreshRequest): Promise<AuthResponse> {
    const res = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as AuthResponse;
  }

  async me(accessToken: string): Promise<MeResponse> {
    const res = await fetch(`${this.baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as MeResponse;
  }

  async createUser(payload: CreateUserRequest, accessToken?: string, extraHeaders?: Record<string, string>): Promise<CreateUserResponse> {
    const res = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: this.withAuth({ 'Content-Type': 'application/json' }, accessToken, extraHeaders),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as CreateUserResponse;
  }

  async getUserById(id: string, accessToken?: string): Promise<UserResponse> {
    const res = await fetch(`${this.baseUrl}/users/${id}`, {
      headers: this.withAuth({}, accessToken)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as UserResponse;
  }

  async getUserByEmail(email: string, accessToken?: string): Promise<UserResponse> {
    const res = await fetch(`${this.baseUrl}/users/email/${encodeURIComponent(email)}`, {
      headers: this.withAuth({}, accessToken)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as UserResponse;
  }

  async updateUser(id: string, payload: UpdateUserRequest, accessToken?: string, extraHeaders?: Record<string, string>): Promise<UserResponse> {
    const res = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'PUT',
      headers: this.withAuth({ 'Content-Type': 'application/json' }, accessToken, extraHeaders),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as UserResponse;
  }

  async softDeleteUser(id: string, accessToken?: string, extraHeaders?: Record<string, string>): Promise<void> {
    const res = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'DELETE',
      headers: this.withAuth({}, accessToken, extraHeaders)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
  }

  async hardDeleteUser(id: string, accessToken?: string, extraHeaders?: Record<string, string>): Promise<void> {
    const res = await fetch(`${this.baseUrl}/users/${id}/hard`, {
      method: 'DELETE',
      headers: this.withAuth({}, accessToken, extraHeaders)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
  }

  async listHealthEvents(accessToken?: string): Promise<HealthEvent[]> {
    const res = await fetch(`${this.baseUrl}/health/events`, {
      headers: this.withAuth({}, accessToken)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    const body = (await res.json()) as { items: HealthEvent[] };
    return body.items;
  }

  async createHealthEvent(payload: CreateHealthEventRequest, accessToken?: string, extraHeaders?: Record<string, string>): Promise<HealthEvent> {
    const res = await fetch(`${this.baseUrl}/health/events`, {
      method: 'POST',
      headers: this.withAuth({ 'Content-Type': 'application/json' }, accessToken, extraHeaders),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as HealthEvent;
  }

  async deleteHealthEvent(id: string, accessToken?: string, extraHeaders?: Record<string, string>): Promise<void> {
    const res = await fetch(`${this.baseUrl}/health/events/${id}`, {
      method: 'DELETE',
      headers: this.withAuth({}, accessToken, extraHeaders)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
  }

  async clearHealthEvents(accessToken?: string, extraHeaders?: Record<string, string>): Promise<void> {
    const res = await fetch(`${this.baseUrl}/health/events`, {
      method: 'DELETE',
      headers: this.withAuth({}, accessToken, extraHeaders)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
  }

  async getHealthMetrics(accessToken?: string): Promise<HealthMetrics> {
    const res = await fetch(`${this.baseUrl}/health/metrics`, {
      headers: this.withAuth({}, accessToken)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as HealthMetrics;
  }

  async listHealthRecommendations(accessToken?: string): Promise<Recommendation[]> {
    const res = await fetch(`${this.baseUrl}/health/recommendations`, {
      headers: this.withAuth({}, accessToken)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    const body = (await res.json()) as { items: Recommendation[] };
    return body.items;
  }

  async getClinicianSummary(accessToken?: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/health/clinician-summary`, {
      headers: this.withAuth({}, accessToken)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    const body = (await res.json()) as { summary: string };
    return body.summary;
  }

  async listActionPlans(accessToken?: string): Promise<ActionPlan[]> {
    const res = await fetch(`${this.baseUrl}/health/action-plans`, {
      headers: this.withAuth({}, accessToken)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    const body = (await res.json()) as { items: ActionPlan[] };
    return body.items;
  }

  async createActionPlan(payload: CreateActionPlanRequest, accessToken?: string, extraHeaders?: Record<string, string>): Promise<ActionPlan> {
    const res = await fetch(`${this.baseUrl}/health/action-plans`, {
      method: 'POST',
      headers: this.withAuth({ 'Content-Type': 'application/json' }, accessToken, extraHeaders),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as ActionPlan;
  }

  async updateActionPlan(id: string, payload: UpdateActionPlanRequest, accessToken?: string, extraHeaders?: Record<string, string>): Promise<ActionPlan> {
    const res = await fetch(`${this.baseUrl}/health/action-plans/${id}`, {
      method: 'PUT',
      headers: this.withAuth({ 'Content-Type': 'application/json' }, accessToken, extraHeaders),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
    return (await res.json()) as ActionPlan;
  }

  async deleteActionPlan(id: string, accessToken?: string, extraHeaders?: Record<string, string>): Promise<void> {
    const res = await fetch(`${this.baseUrl}/health/action-plans/${id}`, {
      method: 'DELETE',
      headers: this.withAuth({}, accessToken, extraHeaders)
    });
    if (!res.ok) {
      throw await parseError(res);
    }
  }
}
