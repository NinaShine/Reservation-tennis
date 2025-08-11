// Base API: en prod vient de Vercel (VITE_API_URL), en dev tu as le proxy Vite
const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json();
}

// Exemples prêts à l'emploi
export const health = () => api<{ ok: boolean }>('/api/health');
export const listBookings = () => api('/api/bookings');
export const createBooking = (body: any) =>
  api('/api/bookings', { method: 'POST', body: JSON.stringify(body) });
