import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  if (user.role === 'doctor') {
    return <DoctorDashboard />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return <div>Rol desconocido</div>;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
