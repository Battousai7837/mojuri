type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

type PasswordSession = { user: SupabaseUser; access_token: string };

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
};

export type PublicContact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export class SupabaseApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'SupabaseApiError';
  }
}

function config(useClientKey = false) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = useClientKey ? (process.env.SUPABASE_ANON_KEY || serviceKey) : serviceKey;
  if (!url) throw new Error('SUPABASE_URL is not configured');
  if (!key) throw new Error(useClientKey
    ? 'SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY is not configured'
    : 'SUPABASE_SERVICE_ROLE_KEY is not configured');
  return { url, key };
}

async function request<T>(path: string, options: RequestInit, useClientKey = false): Promise<T> {
  const { url, key } = config(useClientKey);
  const response = await fetch(`${url}/auth/v1${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    const message = String(data.message || data.msg || data.error_description || data.error || 'Supabase request failed');
    throw new SupabaseApiError(message, response.status);
  }
  return data as T;
}

async function tableRequest<T>(table: string, query: string, options: RequestInit = {}): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${table}${query}`, {
    ...options,
    cache: 'no-store',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null) as T | Record<string, unknown> | null;
  if (!response.ok) {
    const details = data as Record<string, unknown> | null;
    throw new SupabaseApiError(String(details?.message || details?.details || 'Supabase database request failed'), response.status);
  }
  return data as T;
}

function unwrapUser(data: SupabaseUser | { user: SupabaseUser }): SupabaseUser {
  return 'user' in data ? data.user : data;
}

export async function createSupabaseUser(name: string, email: string, password: string) {
  const data = await request<SupabaseUser | { user: SupabaseUser }>('/admin/users', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
      app_metadata: { role: 'user' },
    }),
  });
  return unwrapUser(data);
}

export async function authenticateSupabaseUser(email: string, password: string) {
  const session = await request<PasswordSession>('/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, true);
  return session.user;
}

export async function getSupabaseUser(id: string) {
  const data = await request<SupabaseUser | { user: SupabaseUser }>(`/admin/users/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
  return unwrapUser(data);
}

export async function deleteSupabaseUser(id: string) {
  await request(`/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function upsertPublicUser(input: Pick<PublicUser, 'id' | 'name' | 'email' | 'password_hash' | 'role'>) {
  const rows = await tableRequest<PublicUser[]>('users', '?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(input),
  });
  return rows[0];
}

export async function getPublicUser(id: string) {
  const rows = await tableRequest<PublicUser[]>('users', `?id=eq.${encodeURIComponent(id)}&select=*`, { method: 'GET' });
  return rows[0] ?? null;
}

export async function createPublicContact(input: Pick<PublicContact, 'name' | 'email' | 'subject' | 'message'>) {
  const rows = await tableRequest<PublicContact[]>('contacts', '', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ ...input, is_read: false }),
  });
  return rows[0];
}

export async function listPublicContacts() {
  return tableRequest<PublicContact[]>('contacts', '?select=*&order=created_at.desc', { method: 'GET' });
}

export async function updatePublicContact(id: string, isRead: boolean) {
  const rows = await tableRequest<PublicContact[]>('contacts', `?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ is_read: isRead }),
  });
  return rows[0] ?? null;
}

export function toAuthUser(user: SupabaseUser) {
  const name = typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : 'Mojuri Customer';
  const role = user.app_metadata?.role === 'admin' ? 'admin' as const : 'user' as const;
  return { id: user.id, name, email: user.email ?? '', role };
}

export function publicUserToAuthUser(user: PublicUser) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function publicContactJson(contact: PublicContact) {
  return { _id: contact.id, name: contact.name, email: contact.email, subject: contact.subject, message: contact.message, status: contact.is_read ? 'read' as const : 'unread' as const, createdAt: contact.created_at };
}
