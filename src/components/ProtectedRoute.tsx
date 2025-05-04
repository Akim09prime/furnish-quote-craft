
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth, onAuthStateChanged, type User } from '@/lib/firebase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import FirebaseSetupInstructions from './FirebaseSetupInstructions';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    console.log("ProtectedRoute: Verificare stare autentificare...");
    
    // Check if Firebase auth is initialized
    if (!auth) {
      console.error("ProtectedRoute: Firebase Auth nu a fost inițializat corect");
      setFirebaseError("Firebase Auth nu a fost inițializat corect");
      setIsLoading(false);
      return () => {};
    }
    
    // Ascultător pentru schimbări de stare autentificare
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log("ProtectedRoute: Stare autentificare schimbată:", user ? "Autentificat" : "Neautentificat");
        setCurrentUser(user);
        setIsLoading(false);
        
        if (!user) {
          console.log("ProtectedRoute: Utilizator neautentificat");
          toast.error("Trebuie să fiți autentificat pentru a accesa această pagină");
        }
      },
      (error) => {
        console.error("ProtectedRoute: Eroare la verificarea autentificării:", error);
        setFirebaseError(error.message);
        setIsLoading(false);
      }
    );
    
    // Curățare ascultător la demontare
    return () => {
      console.log("ProtectedRoute: Curățare ascultător");
      unsubscribe();
    };
  }, []);
  
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
  
  if (firebaseError) {
    return <Navigate to="/firebase-setup" />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
