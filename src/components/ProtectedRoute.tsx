
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, onAuthStateChanged, User } from '@/lib/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  adminOnly = true
}) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("Setting up auth state listener in ProtectedRoute");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? `User ${user.email}` : "No user");
      setCurrentUser(user);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-furniture-purple mb-4"></div>
        <p className="text-lg">Se încarcă...</p>
      </div>
    );
  }
  
  // Verificare dacă utilizatorul este autentificat
  if (!currentUser) {
    console.log("Utilizator neautentificat, redirecționare către pagina de login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("Utilizator autentificat:", currentUser.email);
  
  // In this simplified version we don't check for admin role
  // All authenticated users have access
  
  return <>{children}</>;
};

export default ProtectedRoute;
