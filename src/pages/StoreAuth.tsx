import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import StoreLayout from '../components/StoreLayout';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { AuthUser } from '../store/authStore';

type Session = { token: string; user: AuthUser };
type AuthRequest = { kind: 'login' | 'register'; payload: Record<string, string> };
type CustomerRow = {
  id: string;
  name: string;
  email: string;
  role: 'user';
  createdAt?: string;
  updatedAt?: string;
};

function AccountIcon({ register = false }: { register?: boolean }) {
  return register ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h5v16h-5M10 8l4 4-4 4M14 12H3" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" /></svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" />{visible && <path d="m4 4 16 16" />}</svg>;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'KH';
}

export default function StoreAuth() {
  const navigate = useNavigate();
  const { token: authToken, user, setSession, logout } = useAuthStore();
  const [visiblePassword, setVisiblePassword] = useState<'login' | 'register' | 'admin' | null>(null);
  const [activeRequest, setActiveRequest] = useState<'login' | 'register' | null>(null);
  const [rememberedEmail] = useState(() => localStorage.getItem('mojuri_remembered_email') ?? '');
  const [customerMessage, setCustomerMessage] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminError, setAdminError] = useState('');

  const customersQuery = useQuery({
    queryKey: ['auth-customers'],
    queryFn: () => api<{ items: CustomerRow[] }>('/auth/customers'),
  });

  const customerMutation = useMutation({
    mutationFn: ({ kind, payload }: AuthRequest) => api<Session>(`/auth/${kind}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    onSuccess: data => {
      if (data.user.role === 'admin') {
        setCustomerMessage('Tai khoan admin vui long dang nhap bang nut Trang quan tri admin.');
        logout();
        return;
      }
      setCustomerMessage('');
      setSession(data.token, data.user);
      void customersQuery.refetch();
      navigate('/shop-grid-left', { replace: true });
    },
  });

  const adminMutation = useMutation({
    mutationFn: (payload: Record<string, string>) => api<Session>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    onSuccess: data => {
      if (data.user.role !== 'admin') {
        setAdminError('Tai khoan nay khong co quyen quan tri.');
        return;
      }
      localStorage.setItem('mojuri_admin_token', data.token);
      setAdminError('');
      setAdminOpen(false);
      logout();
      navigate('/admin', { replace: true });
    },
    onError: error => {
      setAdminError(error instanceof Error ? error.message : 'Dang nhap admin khong thanh cong.');
    },
  });

  useEffect(() => {
    if (user?.role === 'admin' && authToken) {
      localStorage.setItem('mojuri_admin_token', authToken);
      logout();
      navigate('/admin', { replace: true });
    }
  }, [authToken, user, logout, navigate]);

  function submit(kind: 'login' | 'register', event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveRequest(kind);
    setCustomerMessage('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    if (kind === 'login') {
      if (form.get('remember')) localStorage.setItem('mojuri_remembered_email', email);
      else localStorage.removeItem('mojuri_remembered_email');
    }
    customerMutation.mutate({
      kind,
      payload: {
        name: String(form.get('name') ?? '').trim(),
        email,
        password: String(form.get('password') ?? ''),
      },
    });
  }

  function submitAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdminError('');
    const form = new FormData(event.currentTarget);
    adminMutation.mutate({
      email: String(form.get('email') ?? '').trim(),
      password: String(form.get('password') ?? ''),
    });
  }

  function togglePassword(kind: 'login' | 'register' | 'admin') {
    setVisiblePassword(current => current === kind ? null : kind);
  }

  function signOut() {
    logout();
    void customersQuery.refetch();
  }

  const customers = customersQuery.data?.items ?? [];

  return <StoreLayout>
    <main className="auth-page">
      <section className="auth-hero" aria-labelledby="auth-page-title">
        <div>
          <h1 id="auth-page-title">{user ? 'My Account' : 'Login / Register'}</h1>
          <nav aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><strong>{user ? 'My Account' : 'Login / Register'}</strong></nav>
        </div>
      </section>

      <section className="auth-admin-access" aria-label="Admin access">
        <button type="button" onClick={() => setAdminOpen(true)}>Trang quản trị admin</button>
      </section>

      {user ? (
        <section className="auth-account" aria-live="polite">
          <span className="auth-account-mark"><AccountIcon /></span>
          <p className="auth-eyebrow">Welcome to Mojuri</p>
          <h2>Hello, {user.name}</h2>
          <p>You are signed in as <strong>{user.email}</strong>.</p>
          <div className="auth-account-actions">
            <Link className="auth-submit" to="/shop-grid-left">Continue shopping</Link>
            <button className="auth-outline-button" type="button" onClick={signOut}>Sign out</button>
          </div>
        </section>
      ) : (
        <section className="auth-forms" aria-label="Customer access">
          <form className="auth-card" onSubmit={event => submit('login', event)}>
            <div className="auth-card-heading"><h2><AccountIcon /> Đăng nhập</h2></div>
            <div className="auth-field">
              <label htmlFor="login-email">Địa chỉ email <span>*</span></label>
              <input id="login-email" name="email" type="email" autoComplete="email" defaultValue={rememberedEmail} required />
            </div>
            <div className="auth-field">
              <label htmlFor="login-password">Mật khẩu <span>*</span></label>
              <div className="auth-password">
                <input id="login-password" name="password" type={visiblePassword === 'login' ? 'text' : 'password'} autoComplete="current-password" minLength={6} required />
                <button type="button" onClick={() => togglePassword('login')} aria-label={visiblePassword === 'login' ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}><EyeIcon visible={visiblePassword === 'login'} /></button>
              </div>
            </div>
            <div className="auth-options">
              <label className="auth-check"><input name="remember" type="checkbox" defaultChecked={Boolean(rememberedEmail)} /><span />Nhớ tôi</label>
              <Link to="/page-forgot-password">Mất mật khẩu?</Link>
            </div>
            {customerMessage && <p className="auth-message auth-message-error" role="alert">{customerMessage}</p>}
            {activeRequest === 'login' && customerMutation.error && <p className="auth-message auth-message-error" role="alert">{customerMutation.error.message}</p>}
            <button className="auth-submit" type="submit" disabled={customerMutation.isPending}>{activeRequest === 'login' && customerMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
          </form>

          <form className="auth-card" onSubmit={event => submit('register', event)}>
            <div className="auth-card-heading"><h2><AccountIcon register /> Đăng ký</h2></div>
            <div className="auth-field">
              <label htmlFor="register-name">Họ và tên <span>*</span></label>
              <input id="register-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required />
            </div>
            <div className="auth-field">
              <label htmlFor="register-email">Địa chỉ email <span>*</span></label>
              <input id="register-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="auth-field">
              <label htmlFor="register-password">Mật khẩu <span>*</span></label>
              <div className="auth-password">
                <input id="register-password" name="password" type={visiblePassword === 'register' ? 'text' : 'password'} autoComplete="new-password" minLength={8} maxLength={72} required aria-describedby="register-password-hint" />
                <button type="button" onClick={() => togglePassword('register')} aria-label={visiblePassword === 'register' ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}><EyeIcon visible={visiblePassword === 'register'} /></button>
              </div>
              <small id="register-password-hint">Tối thiểu 8 ký tự.</small>
            </div>
            {activeRequest === 'register' && customerMutation.error && <p className="auth-message auth-message-error" role="alert">{customerMutation.error.message}</p>}
            <button className="auth-submit" type="submit" disabled={customerMutation.isPending}>{activeRequest === 'register' && customerMutation.isPending ? 'Đang tạo tài khoản...' : 'Đăng ký'}</button>
          </form>
        </section>
      )}

      <section className="customer-status-panel" aria-label="Customer account status">
        <table>
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Thông tin liên lạc</th>
              <th>Vai trò / Công ty</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {customersQuery.isLoading && <tr><td colSpan={4}>Đang tải tài khoản khách hàng...</td></tr>}
            {customersQuery.error && <tr><td colSpan={4}>Không tải được danh sách khách hàng.</td></tr>}
            {!customersQuery.isLoading && !customersQuery.error && customers.length === 0 && <tr><td colSpan={4}>Chưa có tài khoản khách hàng.</td></tr>}
            {customers.map(customer => {
              const active = user?.id === customer.id;
              return <tr key={customer.id}>
                <td>
                  <div className="customer-cell">
                    <span className="customer-avatar">{initials(customer.name)}</span>
                    <div>
                      <strong>{customer.name}</strong>
                      <small>ID: u-{customer.id.slice(0, 12)}</small>
                    </div>
                  </div>
                </td>
                <td><strong>{customer.email}</strong><small>Chưa cập nhật</small></td>
                <td><strong>Khách hàng</strong><small>Mojuri Store</small></td>
                <td><span className={`customer-status ${active ? 'active' : 'inactive'}`}>{active ? 'Đang hoạt động' : 'Dừng hoạt động'}</span></td>
              </tr>;
            })}
          </tbody>
        </table>
      </section>

      {adminOpen && (
        <div className="admin-auth-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
          <form onSubmit={submitAdmin}>
            <button className="admin-auth-close" type="button" onClick={() => setAdminOpen(false)} aria-label="Đóng">×</button>
            <h2 id="admin-login-title">Đăng nhập quản trị</h2>
            <p>Luồng này chỉ dùng cho tài khoản admin riêng.</p>
            <label>
              Email admin
              <input name="email" type="email" defaultValue="admin@mojuri.local" autoComplete="username" required />
            </label>
            <label>
              Mật khẩu admin
              <span className="admin-auth-password">
                <input name="password" type={visiblePassword === 'admin' ? 'text' : 'password'} autoComplete="current-password" required />
                <button type="button" onClick={() => togglePassword('admin')} aria-label={visiblePassword === 'admin' ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}><EyeIcon visible={visiblePassword === 'admin'} /></button>
              </span>
            </label>
            {adminError && <p className="auth-message auth-message-error" role="alert">{adminError}</p>}
            <button className="auth-submit" type="submit" disabled={adminMutation.isPending}>{adminMutation.isPending ? 'Đang vào admin...' : 'Vào trang admin'}</button>
          </form>
        </div>
      )}
    </main>
  </StoreLayout>;
}
