import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface WeeklySummaryProps {
  weeklyHours: number;
  targetHours: number;
  isActive: boolean;
  dailyExtraMiles: number;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  weeklyHours = 32,
  targetHours = 40,
  isActive = true,
  dailyExtraMiles = 2
}) => {
  const progressPercentage = Math.min((weeklyHours / targetHours) * 100, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Resumen Semanal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Horas trabajadas</span>
            <span className="text-sm text-gray-600">{weeklyHours}/{targetHours}h</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-gray-500 text-center">
            {progressPercentage.toFixed(1)}% completado
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Estado</span>
          <Badge 
            variant={isActive ? "default" : "secondary"}
            className={`flex items-center gap-1 ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isActive ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {isActive ? 'Activo' : 'Inactivo'}
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