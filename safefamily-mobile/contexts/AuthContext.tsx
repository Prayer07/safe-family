import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { saveToken, getToken, removeToken } from "../utils/secureStore";
import { apiFetch } from "../utils/apiClient";

// User type
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

// Responses
interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const token = await getToken();
        if (token) {
          const u = await apiFetch<AuthUser>("/auth/me");
          setUser(u);
        }
      } catch {
        await removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await saveToken(res.token);
    setUser(res.user);
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    const res = await apiFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });
    await saveToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}