import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
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
        <IndexContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default Index;