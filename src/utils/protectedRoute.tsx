// ProtectedRoute.tsx
import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@utils/useAuth';

interface Props { children: ReactNode; }

export const ProtectedRoute: FC<Props> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div>Loading...</div>; // Or spinner
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" state={{ from: location }} replace />;
};
