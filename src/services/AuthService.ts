
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from '@/lib/firebase';

// Custom error messages
const errorMessages = {
  'auth/user-not-found': 'Email sau parolă greșită',
  'auth/wrong-password': 'Email sau parolă greșită',
  'auth/invalid-credential': 'Credențiale invalide. Verificați emailul și parola.',
  'auth/network-request-failed': 'Problemă de conexiune la rețea. Verificați conexiunea internet.',
  'auth/email-already-in-use': 'Există deja un cont cu acest email',
  'auth/invalid-email': 'Adresa de email este invalidă',
  'auth/weak-password': 'Parola este prea slabă',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'Cheie API Firebase invalidă. Contactați administratorul aplicației.',
};

// Login function
export const login = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase Auth nu este inițializat');
  
  try {
    console.log("AuthService: Autentificare în curs...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("AuthService: Autentificare reușită!");
    return userCredential.user;
  } catch (error: any) {
    console.error("Eroare autentificare:", error);
    
    const errorCode = error.code;
    const customMessage = errorMessages[errorCode as keyof typeof errorMessages] || 
                         `Eroare: ${error.message || error.code || "Necunoscut"}`;
    
    throw new Error(customMessage);
  }
};

// Register function
export const register = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase Auth nu este inițializat');
  
  try {
    console.log("AuthService: Înregistrare în curs...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("AuthService: Înregistrare reușită!");
    return userCredential.user;
  } catch (error: any) {
    console.error("Eroare înregistrare:", error);
    
    const errorCode = error.code;
    const customMessage = errorMessages[errorCode as keyof typeof errorMessages] || 
                         `Eroare: ${error.message || error.code || "Necunoscut"}`;
    
    throw new Error(customMessage);
  }
};

// Logout function
export const logout = async () => {
  if (!auth) throw new Error('Firebase Auth nu este inițializat');
  
  try {
    console.log("AuthService: Deconectare în curs...");
    await signOut(auth);
    console.log("AuthService: Deconectare reușită");
  } catch (error: any) {
    console.error("Eroare la deconectare:", error);
    throw error;
  }
};

// Subscribe to auth state
export const subscribeToAuthState = (
  onUserChange: (user: User | null) => void, 
  onError?: (error: Error) => void
) => {
  if (!auth) {
    if (onError) onError(new Error('Firebase Auth nu este inițializat'));
    return () => {};
  }
  
  return onAuthStateChanged(
    auth, 
    onUserChange,
    (error) => {
      if (onError) onError(error);
    }
  );
};

// Get current user
export const getCurrentUser = () => auth?.currentUser;
