import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, setToken, getToken } from '../../api/client';

interface AuthValue {
  user: { id: number; username: string } | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);

  useEffect(() => {
    if (getToken() && !user) {
      // Derive a minimal user from the token presence; the backend
      // re-validates on every request.
      setUser({ id: 0, username: 'admin' });
    }
  }, [user]);

  const login = async (u: string, p: string) => {
    const res = await api.login(u, p);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
