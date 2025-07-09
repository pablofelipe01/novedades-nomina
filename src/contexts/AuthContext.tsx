import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userCedula: string | null;
  login: (cedula: string) => void;
  logout: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userCedula, setUserCedula] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedCedula = localStorage.getItem('userCedula');
    if (savedCedula) {
      setIsAuthenticated(true);
      setUserCedula(savedCedula);
    }
  }, []);

  const login = (cedula: string) => {
    setIsAuthenticated(true);
    setUserCedula(cedula);
    localStorage.setItem('userCedula', cedula);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserCedula(null);
    localStorage.removeItem('userCedula');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userCedula, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};