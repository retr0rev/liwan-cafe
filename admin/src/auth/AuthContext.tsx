import { createContext, useContext, useState, type ReactNode } from 'react';
import { api, setToken, getToken } from '../api/client';

interface AuthValue {
  user: { id: number; username: string } | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  isAuthed: () => boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);

  const login = async (u: string, p: string) => {
    const res = await api.login(u, p);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthed = () => !!getToken();

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthed }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
