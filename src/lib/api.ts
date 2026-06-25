export const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('mojuri_admin_token');
  const userSession = localStorage.getItem('mojuri_auth');
  let userToken: string | undefined;
  try {
    userToken = userSession
      ? (JSON.parse(userSession) as { state?: { token?: string } }).state?.token
      : undefined;
  } catch {
    localStorage.removeItem('mojuri_auth');
  }

  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token || userToken ? { Authorization: `Bearer ${token ?? userToken}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({ message: 'Phản hồi API không hợp lệ' }));
  if (!response.ok) throw new Error(data.message ?? `API error ${response.status}`);
  return data as T;
}
