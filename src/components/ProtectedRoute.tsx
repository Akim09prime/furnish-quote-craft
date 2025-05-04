
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  adminOnly = true
}) => {
  const currentUser = auth.currentUser;
  
  // Simple loading state
  const isLoading = false; // We're not tracking loading state in this simplified version
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-furniture-purple mb-4"></div>
        <p className="text-lg">Se încarcă...</p>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // In this simplified version we don't check for admin role
  // All authenticated users have access
  
  return <>{children}</>;
};

export default ProtectedRoute;
