import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
interface User {
  id: number;
  nome: string;
  email: string;
  funcao: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isGerente: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  function login(userData: User, tokenData: string) {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user',  JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  const isGerente = user?.funcao?.toLowerCase().includes('gerente') ?? false;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isGerente }}>
      {children}
    </AuthContext.Provider>
  );
}
