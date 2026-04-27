import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect ke dashboard masing-masing jika role tidak cocok
    if (user.role === 'direktur') return <Navigate to="/accounting" replace />;
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
}