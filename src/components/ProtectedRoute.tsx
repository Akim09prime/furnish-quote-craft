
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged, type User } from '@/lib/firebase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("ProtectedRoute: Verificare stare autentificare...");
    
    // Ascultător pentru schimbări de stare autentificare
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("ProtectedRoute: Stare autentificare schimbată:", user ? "Autentificat" : "Neautentificat");
      setCurrentUser(user);
      setIsLoading(false);
      
      if (!user) {
        console.log("ProtectedRoute: Redirecționare către /login");
        toast.error("Trebuie să fiți autentificat pentru a accesa această pagină");
        navigate('/login', { replace: true });
      }
    });
    
    // Curățare ascultător la demontare
    return () => {
      console.log("ProtectedRoute: Curățare ascultător");
      unsubscribe();
    };
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p>Verificare autentificare...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
