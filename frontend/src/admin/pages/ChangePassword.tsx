import { useState } from 'react';
import { api } from '../../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      setMsg({ ok: false, text: 'Passwords do not match' });
      return;
    }
    try {
      await api.changePassword(current, next);
      setMsg({ ok: true, text: 'Password updated' });
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setMsg({ ok: false, text: String(err) });
    }
  };

  return (
    <div className="max-w-sm">
      <h1 className="mb-6 text-2xl font-bold text-green">Change Password</h1>
      <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        <Input
          type="password"
          placeholder="Current password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
        <Input
          type="password"
          placeholder="New password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {msg && (
          <p className={`text-sm ${msg.ok ? 'text-green' : 'text-red-600'}`}>{msg.text}</p>
        )}
        <Button type="submit">Update Password</Button>
      </form>
    </div>
  );
}
