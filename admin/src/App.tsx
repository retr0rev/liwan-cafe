import { useEffect, useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { Login } from './pages/Login';
import { Router } from './router';

export default function App() {
  const { isAuthed, logout } = useAuth();
  const [authed, setAuthed] = useState(isAuthed());

  useEffect(() => {
    const onHash = () => setAuthed(isAuthed());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [isAuthed]);

  if (!authed) return <Login />;
  return <Router />;
}
