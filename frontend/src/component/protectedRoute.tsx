import { Navigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
// loading page while checking auth status
interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div style={{flexGrow:1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;
  }
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
export default ProtectedRoute;