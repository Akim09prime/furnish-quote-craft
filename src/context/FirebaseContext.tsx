
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  AuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider, facebookProvider, isUsingPlaceholderKey } from "@/lib/firebase";
import { toast } from "sonner";

type FirebaseContextType = {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<User>;
  loginWithFacebook: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Show warning if using placeholder API key
    if (isUsingPlaceholderKey) {
      console.warn("Firebase using placeholder API key - authentication will not work");
    }
    
    let unsubscribe = () => {};
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth state changed:", user ? `User: ${user.email}` : "No user");
        setCurrentUser(user);
        
        if (user) {
          try {
            // Check if user is an admin by checking the 'admins' collection
            console.log(`Checking admin status for user: ${user.uid}`);
            const adminRef = doc(db, "admins", user.uid);
            const adminDoc = await getDoc(adminRef);
            const isUserAdmin = adminDoc.exists();
            console.log(`Admin status for ${user.email}: ${isUserAdmin ? "Admin" : "Not admin"}`);
            setIsAdmin(isUserAdmin);
          } catch (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error setting up auth state observer:", error);
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Authentication functions
  const login = (email: string, password: string) => {
    console.log(`Attempting login for: ${email}`);
    
    if (isUsingPlaceholderKey) {
      toast.error("Configurația Firebase nu este validă. Vă rugăm să configurați Firebase corect.");
      return Promise.reject(new Error("Firebase API key is not valid"));
    }
    
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(`Login successful for: ${email}`);
        return userCredential.user;
      });
  };

  const signup = (email: string, password: string) => {
    console.log(`Attempting signup for: ${email}`);
    
    if (isUsingPlaceholderKey) {
      toast.error("Configurația Firebase nu este validă. Vă rugăm să configurați Firebase corect.");
      return Promise.reject(new Error("Firebase API key is not valid"));
    }
    
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(`Signup successful for: ${email}`);
        return userCredential.user;
      });
  };

  const logout = () => {
    console.log("Logging out current user");
    return signOut(auth);
  };

  const loginWithProvider = (provider: AuthProvider) => {
    console.log(`Attempting login with provider: ${provider.providerId}`);
    
    if (isUsingPlaceholderKey) {
      toast.error("Configurația Firebase nu este validă. Vă rugăm să configurați Firebase corect.");
      return Promise.reject(new Error("Firebase API key is not valid"));
    }
    
    return signInWithPopup(auth, provider)
      .then((result) => {
        console.log(`Provider login successful for: ${result.user.email}`);
        return result.user;
      });
  };

  const loginWithGoogle = () => {
    console.log("Attempting Google login");
    return loginWithProvider(googleProvider);
  };

  const loginWithFacebook = () => {
    console.log("Attempting Facebook login");
    return loginWithProvider(facebookProvider);
  };

  const resetPassword = (email: string) => {
    console.log(`Attempting password reset for: ${email}`);
    
    if (isUsingPlaceholderKey) {
      toast.error("Configurația Firebase nu este validă. Vă rugăm să configurați Firebase corect.");
      return Promise.reject(new Error("Firebase API key is not valid"));
    }
    
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    currentUser,
    isAdmin,
    isLoading,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    resetPassword
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
