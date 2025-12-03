import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'doctor' | 'admin' | null;

interface User {
  name: string;
  role: UserRole;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (phoneNumber: string, role: UserRole) => {
    // Simulation: In a real app, we would verify OTP and fetch user details from DB
    let name = 'Usuario Simulado';
    if (role === 'doctor') name = 'Dr. Alejandro Vega';
    if (role === 'admin') name = 'Carlos Ruiz';

    setUser({
      name,
      role,
      phoneNumber,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

