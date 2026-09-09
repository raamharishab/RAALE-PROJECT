import { Project, RubricScore } from '../types';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('projectproof_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async register(data: { email: string; password: string; full_name: string; role: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  // Projects
  async getProjects(statusFilter?: string): Promise<Project[]> {
    const query = statusFilter && statusFilter !== 'All' ? `?status=${encodeURIComponent(statusFilter)}` : '';
    const res = await fetch(`${API_BASE}/projects${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(id: number): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch project details');
    return res.json();
  },

  async createProject(data: any): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async submitProject(id: number): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}/submit`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to submit project');
    return res.json();
  },

  // Evidence Creation
  async addLog(projectId: number, data: any) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/logs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add project log');
    return res.json();
  },

  async addDesignDecision(projectId: number, data: any) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/design-decisions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add design decision');
    return res.json();
  },

  async addPrototype(projectId: number, data: any) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/prototypes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add prototype');
    return res.json();
  },

  async addReflection(projectId: number, data: any) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/reflections`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save reflection');
    return res.json();
  },

  async addPresentation(projectId: number, data: any) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/presentation`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save presentation');
    return res.json();
  },

  // Evaluations & Mentor
  async getEvaluation(projectId: number): Promise<RubricScore> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/evaluation`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch rubric evaluation');
    return res.json();
  },

  async getMentorQueue(filterStatus: string = 'All'): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/mentor/queue?filter_status=${encodeURIComponent(filterStatus)}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch mentor queue');
    return res.json();
  },

  async submitMentorReview(projectId: number, data: { comments: string; status_change?: string }) {
    const res = await fetch(`${API_BASE}/mentor/projects/${projectId}/review`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit mentor review');
    return res.json();
  },

  async overrideRubricScore(projectId: number, data: any): Promise<RubricScore> {
    const res = await fetch(`${API_BASE}/mentor/projects/${projectId}/override`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to override rubric score');
    }
    return res.json();
  }
};
