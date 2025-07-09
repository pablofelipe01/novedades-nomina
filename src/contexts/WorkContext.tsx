import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WorkEntry {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  hoursWorked: number;
  extraMiles: number;
  isActive: boolean;
}

interface WeeklyData {
  totalHours: number;
  targetHours: number;
  dailyExtraMiles: number;
  weeklyExtraMiles: number;
  isCurrentlyActive: boolean;
  currentWeekEntries: WorkEntry[];
}

interface WorkContextType {
  weeklyData: WeeklyData;
  startWork: () => void;
  endWork: () => void;
  addExtraMile: () => void;
  isWorking: boolean;
  currentEntry: WorkEntry | null;
  refreshData: () => void;
}

const WorkContext = createContext<WorkContextType | undefined>(undefined);

export const useWork = () => {
  const context = useContext(WorkContext);
  if (!context) {
    throw new Error('useWork must be used within a WorkProvider');
  }
  return context;
};

const getWeekStart = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
};

const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const WorkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userInfo } = useAuth();
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({
    totalHours: 0,
    targetHours: 40,
    dailyExtraMiles: 0,
    weeklyExtraMiles: 0,
    isCurrentlyActive: false,
    currentWeekEntries: []
  });
  const [isWorking, setIsWorking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<WorkEntry | null>(null);

  const getStorageKey = (suffix: string) => {
    return userInfo ? `work_${userInfo.cedula}_${suffix}` : `work_guest_${suffix}`;
  };

  const loadData = () => {
    if (!userInfo) return;

    const today = getToday();
    const weekStart = getWeekStart(new Date());
    
    // Cargar entradas de la semana actual
    const weeklyEntries: WorkEntry[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayDataStr = localStorage.getItem(getStorageKey(`entry_${dateStr}`));
      if (dayDataStr) {
        const dayData = JSON.parse(dayDataStr);
        weeklyEntries.push(dayData);
      }
    }

    // Calcular totales
    const totalHours = weeklyEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
    const weeklyExtraMiles = weeklyEntries.reduce((sum, entry) => sum + entry.extraMiles, 0);
    const todayEntry = weeklyEntries.find(entry => entry.date === today);
    const dailyExtraMiles = todayEntry ? todayEntry.extraMiles : 0;

    // Verificar si hay una sesión activa
    const activeSessionStr = localStorage.getItem(getStorageKey('active_session'));
    let isCurrentlyActive = false;
    let currentActiveEntry = null;

    if (activeSessionStr) {
      const activeSession = JSON.parse(activeSessionStr);
      if (activeSession.date === today) {
        isCurrentlyActive = true;
        currentActiveEntry = activeSession;
        setIsWorking(true);
        setCurrentEntry(activeSession);
      } else {
        // Limpiar sesión antigua
        localStorage.removeItem(getStorageKey('active_session'));
      }
    }

    setWeeklyData({
      totalHours,
      targetHours: 40,
      dailyExtraMiles,
      weeklyExtraMiles,
      isCurrentlyActive,
      currentWeekEntries: weeklyEntries
    });
  };

  const saveEntry = (entry: WorkEntry) => {
    localStorage.setItem(getStorageKey(`entry_${entry.date}`), JSON.stringify(entry));
  };

  const startWork = () => {
    if (!userInfo || isWorking) return;

    const today = getToday();
    const now = new Date();
    const startTime = now.toTimeString().split(' ')[0];

    const newEntry: WorkEntry = {
      id: `${today}_${Date.now()}`,
      date: today,
      startTime,
      endTime: null,
      hoursWorked: 0,
      extraMiles: weeklyData.dailyExtraMiles, // Mantener las millas extra del día
      isActive: true
    };

    setCurrentEntry(newEntry);
    setIsWorking(true);
    
    // Guardar sesión activa
    localStorage.setItem(getStorageKey('active_session'), JSON.stringify(newEntry));
    
    setWeeklyData(prev => ({
      ...prev,
      isCurrentlyActive: true
    }));
  };

  const endWork = () => {
    if (!userInfo || !isWorking || !currentEntry) return;

    const now = new Date();
    const endTime = now.toTimeString().split(' ')[0];
    
    // Calcular horas trabajadas
    const startDate = new Date(`${currentEntry.date}T${currentEntry.startTime}`);
    const endDate = new Date(`${currentEntry.date}T${endTime}`);
    const hoursWorked = Math.round(((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)) * 100) / 100;

    const updatedEntry: WorkEntry = {
      ...currentEntry,
      endTime,
      hoursWorked: Math.max(hoursWorked, 0),
      isActive: false
    };

    // Guardar entrada del día
    saveEntry(updatedEntry);
    
    // Limpiar sesión activa
    localStorage.removeItem(getStorageKey('active_session'));
    
    setCurrentEntry(null);
    setIsWorking(false);
    
    // Recargar datos
    setTimeout(loadData, 100);
  };

  const addExtraMile = () => {
    if (!userInfo) return;

    const today = getToday();
    let todayEntry = weeklyData.currentWeekEntries.find(entry => entry.date === today);
    
    if (!todayEntry) {
      // Crear entrada para hoy si no existe
      todayEntry = {
        id: `${today}_${Date.now()}`,
        date: today,
        startTime: null,
        endTime: null,
        hoursWorked: 0,
        extraMiles: 0,
        isActive: false
      };
    }

    const updatedEntry: WorkEntry = {
      ...todayEntry,
      extraMiles: todayEntry.extraMiles + 1
    };

    // Si hay una sesión activa, actualizar también el currentEntry
    if (currentEntry && currentEntry.date === today) {
      const updatedCurrentEntry = {
        ...currentEntry,
        extraMiles: currentEntry.extraMiles + 1
      };
      setCurrentEntry(updatedCurrentEntry);
      localStorage.setItem(getStorageKey('active_session'), JSON.stringify(updatedCurrentEntry));
    }

    saveEntry(updatedEntry);
    
    // Recargar datos
    setTimeout(loadData, 100);
  };

  const refreshData = () => {
    loadData();
  };

  useEffect(() => {
    loadData();
  }, [userInfo]);

  // Actualizar horas en tiempo real si está trabajando
  useEffect(() => {
    if (!isWorking || !currentEntry) return;

    const interval = setInterval(() => {
      const now = new Date();
      const startDate = new Date(`${currentEntry.date}T${currentEntry.startTime}`);
      const hoursWorked = Math.round(((now.getTime() - startDate.getTime()) / (1000 * 60 * 60)) * 100) / 100;

      setWeeklyData(prev => {
        const updatedEntries = prev.currentWeekEntries.map(entry => 
          entry.date === currentEntry.date 
            ? { ...entry, hoursWorked: Math.max(hoursWorked, 0), isActive: true }
            : entry
        );

        const totalHours = updatedEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0) + Math.max(hoursWorked, 0);

        return {
          ...prev,
          totalHours,
          currentWeekEntries: updatedEntries
        };
      });
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [isWorking, currentEntry]);

  return (
    <WorkContext.Provider value={{
      weeklyData,
      startWork,
      endWork,
      addExtraMile,
      isWorking,
      currentEntry,
      refreshData
    }}>
      {children}
    </WorkContext.Provider>
  );
};
