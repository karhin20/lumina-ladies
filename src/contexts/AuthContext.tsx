import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, ApiUser } from "@/lib/api";

export interface User {
  id: string;
  phone?: string | null;
  name: string;
  email?: string | null;
  role: "customer" | "admin";
  avatar?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "lampo_token";
const USER_KEY = "lampo_user";

const mapUser = (u: ApiUser): User => ({
  id: u.id,
  email: u.email || null,
  phone: u.phone || null,
  name: (u as any).user_metadata?.name || u.name || u.email || "User",
  role: (u as any).user_metadata?.role || (u.role as "customer" | "admin") || "customer",
  avatar: (u as any).user_metadata?.avatar_url || u.avatar_url || null,
  createdAt: (u as any).created_at,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken) {
      setSessionToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      api.me(storedToken)
        .then((remoteUser) => {
          const mapped = mapUser(remoteUser);
          setUser(mapped);
          localStorage.setItem(USER_KEY, JSON.stringify(mapped));
        })
        .catch(() => {
          setUser(null);
          setSessionToken(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      const mapped = mapUser(res.user);
      setUser(mapped);
      setSessionToken(res.access_token);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(mapped));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Unable to sign in" };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const res = await api.signup(email, password, name);
      const mapped = mapUser(res.user);
      setUser(mapped);
      setSessionToken(res.access_token);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(mapped));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Unable to sign up" };
    }
  };

  const logout = async () => {
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!sessionToken) return;
    const res = await api.updateMe(sessionToken, {
      name: updates.name,
      avatar_url: updates.avatar || undefined,
    });
    const mapped = mapUser(res.user as ApiUser);
    setUser(mapped);
    localStorage.setItem(USER_KEY, JSON.stringify(mapped));
  };

  return (
    <AuthContext.Provider
      value={{ user, sessionToken, isLoading, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
