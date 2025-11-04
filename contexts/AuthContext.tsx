import React, { createContext, useState, ReactNode } from 'react';

export interface User {
  phone: string;
}

export interface AuthContextType {
  user: User | null;
  login: (phone: string, remember?: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      // Prioritize localStorage for "Remember Me"
      let item = window.localStorage.getItem('user');
      if (item) return JSON.parse(item);
      
      item = window.sessionStorage.getItem('user');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to parse user from storage', error);
      return null;
    }
  });

  const login = (phone: string, remember: boolean = false) => {
    const newUser = { phone };
    setUser(newUser);
    if (remember) {
      window.sessionStorage.removeItem('user');
      window.localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      window.localStorage.removeItem('user');
      window.sessionStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    window.sessionStorage.removeItem('user');
    window.localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
