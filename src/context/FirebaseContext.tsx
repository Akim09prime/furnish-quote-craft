
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  auth,
  db,
  googleProvider,
  facebookProvider,
} from "@/lib/firebase";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  UserCredential
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Define the context type with all required properties
interface FirebaseContextType {
  auth: typeof auth;
  db: typeof db;
  googleProvider: typeof googleProvider;
  facebookProvider: typeof facebookProvider;
  currentUser: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithFacebook: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
}

// Create context with default values
const FirebaseContext = createContext<FirebaseContextType>({
  auth,
  db,
  googleProvider,
  facebookProvider,
  currentUser: null,
  isLoading: true,
  isAdmin: false,
  login: async () => { throw new Error("Not implemented"); },
  signup: async () => { throw new Error("Not implemented"); },
  logout: async () => { throw new Error("Not implemented"); },
  loginWithGoogle: async () => { throw new Error("Not implemented"); },
  loginWithFacebook: async () => { throw new Error("Not implemented"); },
  resetPassword: async () => { throw new Error("Not implemented"); },
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Handle user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Check if user is admin if they're logged in
      if (user) {
        try {
          // This is a simple admin check - in production, use a more secure approach
          const userRef = doc(db, "admins", user.uid);
          const userSnap = await getDoc(userRef);
          setIsAdmin(userSnap.exists());
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Authentication functions
  const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  const loginWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  const loginWithFacebook = async () => {
    return await signInWithPopup(auth, facebookProvider);
  };

  const resetPassword = async (email: string) => {
    return await sendPasswordResetEmail(auth, email);
  };

  // Provide all values to the context
  const value: FirebaseContextType = {
    auth,
    db,
    googleProvider,
    facebookProvider,
    currentUser,
    isLoading,
    isAdmin,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    resetPassword,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
