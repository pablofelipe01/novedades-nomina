import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserInfo {
  cedula: string;
  nombre: string;
  cargo: string;
  area: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  userCedula: string | null; // Mantenemos para compatibilidad
  login: (cedula: string, nombre?: string, cargo?: string, area?: string) => void;
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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userCedula, setUserCedula] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUserInfo = localStorage.getItem('userInfo');
    const savedCedula = localStorage.getItem('userCedula');
    
    if (savedUserInfo) {
      const parsedUserInfo = JSON.parse(savedUserInfo);
      setIsAuthenticated(true);
      setUserInfo(parsedUserInfo);
      setUserCedula(parsedUserInfo.cedula);
    } else if (savedCedula) {
      // Compatibilidad con datos existentes
      setIsAuthenticated(true);
      setUserCedula(savedCedula);
      setUserInfo({
        cedula: savedCedula,
        nombre: 'Usuario',
        cargo: 'No especificado',
        area: 'No especificada'
      });
    }
  }, []);

  const login = (cedula: string, nombre: string = 'Usuario', cargo: string = 'No especificado', area: string = 'No especificada') => {
    const newUserInfo: UserInfo = { cedula, nombre, cargo, area };
    
    setIsAuthenticated(true);
    setUserInfo(newUserInfo);
    setUserCedula(cedula);
    
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    localStorage.setItem('userCedula', cedula); // Mantenemos para compatibilidad
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    setUserCedula(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userCedula');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, userCedula, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};