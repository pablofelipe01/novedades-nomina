import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import WeeklySummary from './WeeklySummary';
import WorkdayControl from './WorkdayControl';
import ExtraMileForm from './ExtraMileForm';
import UserInfoCard from './UserInfoCard';

const AppLayout: React.FC = () => {
  const { userCedula, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Control Laboral</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Cédula: {userCedula}</span>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* User Information */}
          <UserInfoCard />

          {/* Weekly Summary */}
          <WeeklySummary />

          {/* Workday Control */}
          <WorkdayControl />

          {/* Extra Mile Form */}
          <ExtraMileForm />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;