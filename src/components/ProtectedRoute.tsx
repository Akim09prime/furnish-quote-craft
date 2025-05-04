
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '@/context/FirebaseContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  adminOnly = true
}) => {
  const { currentUser, isAdmin, isLoading } = useFirebase();
  
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
  
  if (adminOnly && !isAdmin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
          <h2 className="text-red-600 font-medium text-lg">Acces interzis</h2>
          <p className="mt-2 text-sm text-red-600">
            Nu aveți drepturi de administrator pentru a accesa această pagină.
          </p>
          <button 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={() => window.location.href = '/'}
          >
            Înapoi la pagina principală
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
