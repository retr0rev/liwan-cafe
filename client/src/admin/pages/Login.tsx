import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../../i18n/I18nContext';

export function Login() {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate({ to: '/admin/dashboard' });
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-1 text-2xl font-bold text-emerald">{t('admin.loginTitle')}</h1>
        <p className="mb-4 text-sm text-ink/60">{t('admin.loginSub')}</p>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('admin.username')} className="mb-3 w-full rounded-lg border border-gold/20 bg-white px-3 py-2 text-sm outline-none focus:border-emerald" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('admin.password')} className="mb-3 w-full rounded-lg border border-gold/20 bg-white px-3 py-2 text-sm outline-none focus:border-emerald" />
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-lg bg-emerald py-2 font-semibold text-cream transition active:scale-95">{t('admin.signIn')}</button>
      </form>
    </div>
  );
}
