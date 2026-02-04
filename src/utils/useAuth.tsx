import { createContext, useContext } from 'react';
import type { AuthSession } from 'aws-amplify/auth';  // Amplify v6 types

export interface AuthContextType {
  user: AuthSession | null;  // Full session with tokens + user
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
