import { createContext, useContext } from "react";
import {
  auth,
  db,
  googleProvider,
  facebookProvider,
} from "@/lib/firebase";

const FirebaseContext = createContext({
  auth,
  db,
  googleProvider,
  facebookProvider,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => (
  <FirebaseContext.Provider value={{ auth, db, googleProvider, facebookProvider }}>
    {children}
  </FirebaseContext.Provider>
);
