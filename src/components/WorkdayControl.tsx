import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Play, Pause, Square, Coffee } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWork } from '@/contexts/WorkContext';

const WorkdayControl: React.FC = () => {
  const { userCedula } = useAuth();
  const { startWork, endWork, isWorking, currentEntry } = useWork();
  const storageKey = userCedula ? `workdayState_${userCedula}` : null;

  // 1. Carga el estado inicial desde localStorage
  const [workday, setWorkday] = useState(() => {
    if (!storageKey) {
      return { startTime: null, lunchStart: null, lunchEnd: null, endTime: null };
    }
    try {
      const savedWorkday = localStorage.getItem(storageKey);
      return savedWorkday
        ? JSON.parse(savedWorkday)
        : { startTime: null, lunchStart: null, lunchEnd: null, endTime: null };
    } catch (error) {
      console.error("Error al leer el estado de la jornada desde localStorage", error);
      return { startTime: null, lunchStart: null, lunchEnd: null, endTime: null };
    }
  });

  // 2. Guarda el estado en localStorage cada vez que cambia
  useEffect(() => {
    if (storageKey) {
      // No guardamos si la jornada ya se cerró y limpió
      if (workday.startTime || workday.lunchStart || workday.lunchEnd) {
        localStorage.setItem(storageKey, JSON.stringify(workday));
      }
    }
  }, [workday, storageKey]);
  const getCurrentTime = () => new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  const handleStartWorkday = () => {
    const time = getCurrentTime();
    setWorkday(prev => ({ ...prev, startTime: time }));
    startWork(); // Iniciar seguimiento en WorkContext
    toast({ title: 'Jornada iniciada', description: `Hora: ${time}` });
  };

  const handleStartLunch = () => {
    const time = getCurrentTime();
    setWorkday(prev => ({ ...prev, lunchStart: time }));
    toast({ title: 'Almuerzo iniciado', description: `Hora: ${time}` });
  };

  const handleEndLunch = () => {
    const time = getCurrentTime();
    setWorkday(prev => ({ ...prev, lunchEnd: time }));
    toast({ title: 'Almuerzo finalizado', description: `Hora: ${time}` });
  };

  const handleEndWorkday = async () => {
    const time = getCurrentTime();
    setWorkday(prev => ({ ...prev, endTime: time }));
    
    // Finalizar seguimiento en WorkContext
    endWork();
    
    // Send to webhook (simplified)
    try {
      await fetch('https://telegram-apps-u38879.vm.elestio.app/webhook/3fcd24f4-e01c-4fd7-80a1-aeaa5ac352ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula: userCedula, ...workday, endTime: time })
      });
      toast({ title: 'Jornada cerrada', description: 'Datos enviados' });
      // 3. Limpia el estado y el localStorage al finalizar
      setWorkday({ startTime: null, lunchStart: null, lunchEnd: null, endTime: null });
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudieron enviar los datos', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Control de Jornada</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleStartWorkday} 
            disabled={!!workday.startTime || isWorking} 
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isWorking ? 'Trabajando...' : 'Iniciar'}
          </Button>
          <Button onClick={handleStartLunch} disabled={!workday.startTime || !!workday.lunchStart} variant="outline" className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />Almuerzo
          </Button>
          <Button onClick={handleEndLunch} disabled={!workday.lunchStart || !!workday.lunchEnd} variant="outline" className="flex items-center gap-2">
            <Pause className="h-4 w-4" />Fin Almuerzo
          </Button>
          <Button onClick={handleEndWorkday} disabled={!workday.startTime} variant="destructive" className="flex items-center gap-2">
            <Square className="h-4 w-4" />Cerrar
          </Button>
        </div>
        <div className="space-y-2">
          {(workday.startTime || currentEntry) && (
            <div className="flex justify-between">
              <span>Inicio:</span>
              <Badge variant="outline">
                {workday.startTime || currentEntry?.startTime}
              </Badge>
            </div>
          )}
          {workday.lunchStart && (
            <div className="flex justify-between">
              <span>Almuerzo:</span>
              <Badge variant="outline">{workday.lunchStart}</Badge>
            </div>
          )}
          {workday.lunchEnd && (
            <div className="flex justify-between">
              <span>Fin Almuerzo:</span>
              <Badge variant="outline">{workday.lunchEnd}</Badge>
            </div>
          )}
          {isWorking && currentEntry && (
            <div className="flex justify-between">
              <span>Horas actuales:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {currentEntry.hoursWorked.toFixed(1)}h
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkdayControl;