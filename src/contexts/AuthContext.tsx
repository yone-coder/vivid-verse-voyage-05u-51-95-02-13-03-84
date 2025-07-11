
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://supabase-y8ak.onrender.com/api';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking authentication status...');
      const token = localStorage.getItem('authToken');
      const userInfo = localStorage.getItem('userInfo');

      if (token && userInfo) {
        console.log('Found stored token and user info');
        // Verify token with backend
        const response = await fetch(`${API_BASE_URL}/verify-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('Token verification successful');
          const userData = JSON.parse(userInfo);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log('Token verification failed, clearing stored data');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No stored token found');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User, token: string) => {
    console.log('Logging in user:', userData.email);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
