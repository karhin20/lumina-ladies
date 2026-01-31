import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, ApiUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

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

const TOKEN_KEY = "kelsmall_token";
const USER_KEY = "kelsmall_user";

const mapUser = (u: ApiUser): User => ({
  id: u.id,
  email: u.email || null,
  phone: u.phone || null,
  name: u.name || (u as any).user_metadata?.name || u.email || "User",
  role: (u.role as User['role']) || (u as any).user_metadata?.role || "customer",
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
    // Check for OAuth callback parameters
    if (typeof window !== "undefined") {
      // First, check for PKCE code parameter (newer flow)
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get("code");

      if (authCode) {
        // PKCE flow: Exchange code for tokens
        setIsLoading(true);
        api.googleCodeExchange(authCode)
          .then((res) => {
            const mapped = mapUser(res.user);
            setUser(mapped);
            setSessionToken(res.access_token);
            localStorage.setItem(TOKEN_KEY, res.access_token);
            localStorage.setItem(USER_KEY, JSON.stringify(mapped));

            // Clear code from URL
            window.history.replaceState(null, "", window.location.pathname);

            toast({
              title: "Welcome!",
              description: "You have successfully signed in with Google.",
            });
          })
          .catch((err) => {
            console.error("Failed to exchange OAuth code:", err);
            toast({
              title: "Login Failed",
              description: "Could not complete Google sign-in.",
              variant: "destructive"
            });
          })
          .finally(() => setIsLoading(false));
        return; // Skip normal load
      }

      // Fallback to implicit flow (hash parameters)
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1)); // remove #

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
          setSessionToken(accessToken);
          localStorage.setItem(TOKEN_KEY, accessToken);
          if (refreshToken) {
            localStorage.setItem("kelsmall_refresh_token", refreshToken);
          }

          // Fetch user data immediately
          api.me(accessToken)
            .then((remoteUser) => {
              const mapped = mapUser(remoteUser);
              setUser(mapped);
              localStorage.setItem(USER_KEY, JSON.stringify(mapped));
              // Clear hash from URL
              window.history.replaceState(null, "", window.location.pathname);
            })
            .catch((err) => {
              console.error("Failed to fetch user after OAuth:", err);
              toast({
                title: "Login Failed",
                description: "Could not verify Google session.",
                variant: "destructive"
              });
            })
            .finally(() => setIsLoading(false));
          return; // Skip normal load
        }
      }

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
          .catch(async () => {
            // If me fails (401), try to refresh if we have a refresh token
            const refreshToken = localStorage.getItem("kelsmall_refresh_token");
            if (refreshToken) {
              try {
                const res = await api.refreshSession(refreshToken);
                const mapped = mapUser(res.user);
                setUser(mapped);
                setSessionToken(res.access_token);
                localStorage.setItem(TOKEN_KEY, res.access_token);
                localStorage.setItem(USER_KEY, JSON.stringify(mapped));
                // Note: We normally get a new refresh token too, but our current backend endpoint 
                // doesn't explicitly return it in the main body unless we adjust it.
                // Assuming supabase returns the same or rotated one, we might need to update it.
              } catch (refreshErr) {
                // Refresh failed, logout
                console.error("Refresh failed", refreshErr);
                // Let the global unauthorized handler take care or manual logout
                setUser(null);
                setSessionToken(null);
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                localStorage.removeItem("kelsmall_refresh_token");
              }
            } else {
              setIsLoading(false);
            }
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      // Logic handled in global interceptor or main useEffect catch, 
      // but explicitly clearing here ensures UI sync
      if (user || sessionToken) {
        // Attempt refresh? Or just logout. For simplicity, just logout on explicit 401 event
        // if not handled by the refresh logic above.
        // Actually, api.ts emits this event. We could try refresh here too?
        // For now, let's keep it simple: 401 = Logout.
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
      }
      setUser(null);
      setSessionToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("kelsmall_refresh_token");
    };

    window.addEventListener("kelsmall_unauthorized", handleUnauthorized);
    return () => window.removeEventListener("kelsmall_unauthorized", handleUnauthorized);
  }, [user, sessionToken]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      // Backend now returns enriched user object with role from user_type
      const mapped = mapUser(res.user);
      setUser(mapped);
      setSessionToken(res.access_token);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(mapped));
      // Store refresh token if available from response (api currently returns access_token & user)
      // Supabase python client returns session which has refresh_token, we should update backend to return it if possible
      // For standard email login, backend might need adjustment if we want persistent refresh logic here too.
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

    // Use current favorites from the most up-to-date state
    const currentFavorites = user.favorites || [];
    const isFavorite = currentFavorites.includes(productId);
    const newFavorites = isFavorite
      ? currentFavorites.filter(id => id !== productId)
      : [...currentFavorites, productId];

    // Optimistic update using functional form to be safer
    setUser(prev => prev ? { ...prev, favorites: newFavorites } : null);

    try {
      // Sync with backend
      const confirmedFavorites = await api.toggleFavorite(sessionToken, productId);
      // Update with source of truth from backend
      setUser(prev => prev ? { ...prev, favorites: confirmedFavorites } : null);

      // Update localStorage with updated favorites
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.favorites = confirmedFavorites;
        localStorage.setItem(USER_KEY, JSON.stringify(parsed));
      }
    } catch (error) {
      // Revert on error
      console.error("Failed to toggle favorite", error);
      setUser(user); // Revert to captured user state
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

