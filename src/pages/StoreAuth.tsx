import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import StoreLayout from '../components/StoreLayout';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { AuthUser } from '../store/authStore';

type Session = { token: string; user: AuthUser };
type AuthRequest = { kind: 'login' | 'register'; payload: Record<string, string> };

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

export default function StoreAuth() {
  const navigate = useNavigate();
  const { user, setSession, logout } = useAuthStore();
  const [visiblePassword, setVisiblePassword] = useState<'login' | 'register' | null>(null);
  const [activeRequest, setActiveRequest] = useState<'login' | 'register' | null>(null);
  const [rememberedEmail] = useState(() => localStorage.getItem('mojuri_remembered_email') ?? '');

  const mutation = useMutation({
    mutationFn: ({ kind, payload }: AuthRequest) => api<Session>(`/auth/${kind}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    onSuccess: data => {
      setSession(data.token, data.user);
      navigate('/shop-grid-left', { replace: true });
    },
  });

  function submit(kind: 'login' | 'register', event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveRequest(kind);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    if (kind === 'login') {
      if (form.get('remember')) localStorage.setItem('mojuri_remembered_email', email);
      else localStorage.removeItem('mojuri_remembered_email');
    }
    mutation.mutate({
      kind,
      payload: {
        name: String(form.get('name') ?? '').trim(),
        email,
        password: String(form.get('password') ?? ''),
      },
    });
  }

  function togglePassword(kind: 'login' | 'register') {
    setVisiblePassword(current => current === kind ? null : kind);
  }

  return <StoreLayout>
    <main className="auth-page">
      <section className="auth-hero" aria-labelledby="auth-page-title">
        <div>
          <h1 id="auth-page-title">{user ? 'My Account' : 'Login / Register'}</h1>
          <nav aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><strong>{user ? 'My Account' : 'Login / Register'}</strong></nav>
        </div>
      </section>

      {user ? (
        <section className="auth-account" aria-live="polite">
          <span className="auth-account-mark"><AccountIcon /></span>
          <p className="auth-eyebrow">Welcome to Mojuri</p>
          <h2>Hello, {user.name}</h2>
          <p>You are signed in as <strong>{user.email}</strong>.</p>
          <div className="auth-account-actions">
            <Link className="auth-submit" to="/shop-grid-left">Continue shopping</Link>
            <button className="auth-outline-button" type="button" onClick={logout}>Sign out</button>
          </div>
        </section>
      ) : (
        <section className="auth-forms" aria-label="Customer access">
          <form className="auth-card" onSubmit={event => submit('login', event)}>
            <div className="auth-card-heading"><h2><AccountIcon /> Login</h2></div>
            <div className="auth-field">
              <label htmlFor="login-email">Username or email address <span>*</span></label>
              <input id="login-email" name="email" type="email" autoComplete="email" defaultValue={rememberedEmail} required />
            </div>
            <div className="auth-field">
              <label htmlFor="login-password">Password <span>*</span></label>
              <div className="auth-password">
                <input id="login-password" name="password" type={visiblePassword === 'login' ? 'text' : 'password'} autoComplete="current-password" minLength={6} required />
                <button type="button" onClick={() => togglePassword('login')} aria-label={visiblePassword === 'login' ? 'Hide password' : 'Show password'}><EyeIcon visible={visiblePassword === 'login'} /></button>
              </div>
            </div>
            <div className="auth-options">
              <label className="auth-check"><input name="remember" type="checkbox" defaultChecked={Boolean(rememberedEmail)} /><span />Remember me</label>
              <Link to="/page-forgot-password">Lost your password?</Link>
            </div>
            {activeRequest === 'login' && mutation.error && <p className="auth-message auth-message-error" role="alert">{mutation.error.message}</p>}
            <button className="auth-submit" type="submit" disabled={mutation.isPending}>{activeRequest === 'login' && mutation.isPending ? 'Signing in…' : 'Login'}</button>
          </form>

          <form className="auth-card" onSubmit={event => submit('register', event)}>
            <div className="auth-card-heading"><h2><AccountIcon register /> Register</h2></div>
            <div className="auth-field">
              <label htmlFor="register-name">Full name <span>*</span></label>
              <input id="register-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required />
            </div>
            <div className="auth-field">
              <label htmlFor="register-email">Email address <span>*</span></label>
              <input id="register-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="auth-field">
              <label htmlFor="register-password">Password <span>*</span></label>
              <div className="auth-password">
                <input id="register-password" name="password" type={visiblePassword === 'register' ? 'text' : 'password'} autoComplete="new-password" minLength={8} maxLength={72} required aria-describedby="register-password-hint" />
                <button type="button" onClick={() => togglePassword('register')} aria-label={visiblePassword === 'register' ? 'Hide password' : 'Show password'}><EyeIcon visible={visiblePassword === 'register'} /></button>
              </div>
              <small id="register-password-hint">Use at least 8 characters.</small>
            </div>
            {activeRequest === 'register' && mutation.error && <p className="auth-message auth-message-error" role="alert">{mutation.error.message}</p>}
            <button className="auth-submit" type="submit" disabled={mutation.isPending}>{activeRequest === 'register' && mutation.isPending ? 'Creating account…' : 'Register'}</button>
          </form>
        </section>
      )}
    </main>
  </StoreLayout>;
}
