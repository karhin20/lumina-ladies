import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (phone: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database in localStorage
const USERS_KEY = 'luxe_users';
const CURRENT_USER_KEY = 'luxe_current_user';

// Demo admin account
const DEMO_ADMIN: User = {
  id: 'admin-1',
  phone: '0201234567',
  name: 'Admin User',
  email: 'admin@luxe.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

const getStoredUsers = (): Record<string, { user: User; password: string }> => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    // Initialize with demo admin
    const initial = {
      '0201234567': { user: DEMO_ADMIN, password: 'admin123' }
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const saveUsers = (users: Record<string, { user: User; password: string }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const userData = users[phone];

    if (!userData) {
      return { success: false, error: 'Phone number not registered' };
    }

    if (userData.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    setUser(userData.user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData.user));
    return { success: true };
  };

  const signup = async (phone: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();

    if (users[phone]) {
      return { success: false, error: 'Phone number already registered' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      phone,
      name,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    users[phone] = { user: newUser, password };
    saveUsers(users);

    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Update in users database
    const users = getStoredUsers();
    if (users[user.phone]) {
      users[user.phone].user = updatedUser;
      saveUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
