import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useWork } from '@/contexts/WorkContext';
import { Button } from '@/components/ui/button';

const WeeklySummary: React.FC = () => {
  const { weeklyData, refreshData } = useWork();
  
  const { 
    totalHours, 
    targetHours, 
    isCurrentlyActive, 
    dailyExtraMiles 
  } = weeklyData;

  const progressPercentage = Math.min((totalHours / targetHours) * 100, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Resumen Semanal
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Horas trabajadas</span>
            <span className="text-sm text-gray-600">{totalHours.toFixed(1)}/{targetHours}h</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-gray-500 text-center">
            {progressPercentage.toFixed(1)}% completado
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Estado</span>
          <Badge 
            variant={isCurrentlyActive ? "default" : "secondary"}
            className={`flex items-center gap-1 ${
              isCurrentlyActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isCurrentlyActive ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {isCurrentlyActive ? 'Trabajando' : 'No activo'}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Millas extra hoy</span>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {dailyExtraMiles}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;