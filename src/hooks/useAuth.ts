import { useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (initialized) return;
    
    // Add a small delay to prevent rapid state changes
    const timeoutId = setTimeout(() => {
      // Check if user is logged in on component mount
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Validate that parsed user has required fields
          if (parsedUser && parsedUser.id && parsedUser.email) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Invalid user structure
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch {
          // Invalid stored data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
      setInitialized(true);
    }, 50); // 50ms delay to prevent racing

    return () => clearTimeout(timeoutId);
  }, [initialized]);

  const login = (userData: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
};
