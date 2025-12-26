import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, ApiUser } from "@/lib/api";

export interface User {
  id: string;
  phone?: string | null;
  name: string;
  email?: string | null;
  role: "customer" | "admin" | "super_admin" | "vendor_admin";
  avatar?: string | null;
  favorites: string[]; // Added favorites
  createdAt?: string;
  address?: {
    name: string;
    phone: string;
    street: string;
    city: string;
    region: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>; // Added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "lampo_token";
const USER_KEY = "lampo_user";

const mapUser = (u: ApiUser): User => ({
  id: u.id,
  email: u.email || null,
  phone: u.phone || null,
  name: u.name || (u as any).user_metadata?.name || u.email || "User",
  role: (u.role as "customer" | "admin") || (u as any).user_metadata?.role || "customer",
  avatar: (u as any).user_metadata?.avatar_url || u.avatar_url || null,
  favorites: u.favorites || [], // Map favorites
  createdAt: (u as any).created_at,
  address: u.address || null,
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
      // Backend now returns enriched user object with role from user_type
      const mapped = mapUser(res.user);
      setUser(mapped);
      setSessionToken(res.access_token);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(mapped));
      return { success: true, user: mapped };
    } catch (error: any) {
      return { success: false, error: error.message || "Unable to sign in" };
    }
  };

  const signup = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const res = await api.signup(email, password, name, phone);
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
      phone: updates.phone || undefined,
      email: updates.email || undefined,
      address: updates.address !== undefined ? updates.address : undefined,
    });
    const mapped = mapUser(res.user as ApiUser);
    setUser(mapped);
    localStorage.setItem(USER_KEY, JSON.stringify(mapped));
  };

  const toggleFavorite = async (productId: string) => {
    if (!sessionToken || !user) return;

    // Optimistic update
    const isFavorite = user.favorites.includes(productId);
    const newFavorites = isFavorite
      ? user.favorites.filter(id => id !== productId)
      : [...user.favorites, productId];

    const updatedUser = { ...user, favorites: newFavorites };
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser)); // Persist locally for instant feedback

    try {
      // Sync with backend
      const confirmedFavorites = await api.toggleFavorite(sessionToken, productId);
      // Update with source of truth
      const truthUser = { ...user, favorites: confirmedFavorites };
      setUser(truthUser);
      localStorage.setItem(USER_KEY, JSON.stringify(truthUser));
    } catch (error) {
      // Revert on error
      console.error("Failed to toggle favorite", error);
      setUser(user); // Revert to old user state
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, sessionToken, isLoading, login, signup, logout, updateProfile, toggleFavorite }}
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
