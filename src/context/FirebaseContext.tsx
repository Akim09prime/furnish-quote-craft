
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
import { auth, db, googleProvider, facebookProvider } from "@/lib/firebase";

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Check if user is an admin by checking the 'admins' collection
          const adminRef = doc(db, "admins", user.uid);
          const adminDoc = await getDoc(adminRef);
          setIsAdmin(adminDoc.exists());
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Authentication functions
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user);
  };

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user);
  };

  const logout = () => {
    return signOut(auth);
  };

  const loginWithProvider = (provider: AuthProvider) => {
    return signInWithPopup(auth, provider)
      .then((result) => result.user);
  };

  const loginWithGoogle = () => {
    return loginWithProvider(googleProvider);
  };

  const loginWithFacebook = () => {
    return loginWithProvider(facebookProvider);
  };

  const resetPassword = (email: string) => {
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
