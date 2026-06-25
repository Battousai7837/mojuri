import bcrypt from 'bcryptjs';

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

type PublicUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
};

class SupabaseSeedError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'SupabaseSeedError';
  }
}

const name = process.env.ADMIN_NAME ?? 'Mojuri Admin';
const email = (process.env.ADMIN_EMAIL ?? 'admin@mojuri.local').toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? 'Admin@123';

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('SUPABASE_URL is not configured');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  return { url, key };
}

async function authRequest<T>(path: string, options: RequestInit): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/auth/v1${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    throw new SupabaseSeedError(String(data.message || data.msg || data.error_description || data.error || 'Supabase Auth request failed'), response.status);
  }
  return data as T;
}

async function tableRequest<T>(table: string, query: string, options: RequestInit): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${table}${query}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    throw new SupabaseSeedError(String(data.message || data.details || 'Supabase table request failed'), response.status);
  }
  return data as T;
}

function unwrapUser(data: SupabaseUser | { user: SupabaseUser }) {
  return 'user' in data ? data.user : data;
}

async function findAuthUserByEmail() {
  const data = await authRequest<{ users?: SupabaseUser[] }>('/admin/users?page=1&per_page=1000', { method: 'GET' });
  return data.users?.find(user => user.email?.toLowerCase() === email) ?? null;
}

async function createOrUpdateAuthUser() {
  const body = {
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
    app_metadata: { role: 'admin' },
  };

  try {
    const created = await authRequest<SupabaseUser | { user: SupabaseUser }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return unwrapUser(created);
  } catch (error) {
    if (!(error instanceof SupabaseSeedError) || error.status !== 422) throw error;
    const existing = await findAuthUserByEmail();
    if (!existing) throw error;
    const updated = await authRequest<SupabaseUser | { user: SupabaseUser }>(`/admin/users/${encodeURIComponent(existing.id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return unwrapUser(updated);
  }
}

async function upsertPublicUser(user: SupabaseUser) {
  const rows = await tableRequest<PublicUser[]>('users', '?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      id: user.id,
      name,
      email,
      password_hash: await bcrypt.hash(password, 12),
      role: 'admin',
    }),
  });
  return rows[0];
}

async function seed() {
  const user = await createOrUpdateAuthUser();
  await upsertPublicUser(user);
  console.log(`Supabase admin ready: ${email}`);
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});
