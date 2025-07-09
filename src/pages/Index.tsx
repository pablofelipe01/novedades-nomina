import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { WorkProvider } from '@/contexts/WorkContext';
import LoginForm from '@/components/LoginForm';
import AppLayout from '@/components/AppLayout';

const IndexContent: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return <AppLayout />;
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <WorkProvider>
          <IndexContent />
        </WorkProvider>
      </AppProvider>
    </AuthProvider>
  );
};

export default Index;