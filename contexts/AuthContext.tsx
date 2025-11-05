import React, { createContext, useState, ReactNode, useEffect } from 'react';

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
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize user from localStorage on client side
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      try {
        // Prioritize localStorage for "Remember Me"
        let item = window.localStorage.getItem('user');
        if (item) {
          setUser(JSON.parse(item));
        } else {
          item = window.sessionStorage.getItem('user');
          if (item) {
            setUser(JSON.parse(item));
          }
        }
      } catch (error) {
        console.error('Failed to parse user from storage', error);
      } finally {
        setInitialized(true);
      }
    }
  }, []);

  const login = (phone: string, remember: boolean = false) => {
    if (typeof window === 'undefined') return; // Guard for server-side
    
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
    if (typeof window === 'undefined') return; // Guard for server-side
    
    setUser(null);
    window.sessionStorage.removeItem('user');
    window.localStorage.removeItem('user');
  };

  // Don't render children until initialization is complete (to prevent hydration errors)
  if (!initialized) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
