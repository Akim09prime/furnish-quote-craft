
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configurația Firebase
// Trebuie să înlocuiți aceste valori cu configurația reală a proiectului dvs. Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey-ThisIsAPlaceholder",
  authDomain: "furniture-quote.firebaseapp.com",
  projectId: "furniture-quote",
  storageBucket: "furniture-quote.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Verificăm și afișăm un avertisment dacă se folosește cheia API de placeholder
if (firebaseConfig.apiKey === "AIzaSyDummyKey-ThisIsAPlaceholder") {
  console.warn("🔥 ATENȚIE: Folosiți o cheie API Firebase de test! Autentificarea nu va funcționa corect. " +
               "Vă rugăm să înlocuiți cheia API din firebase.ts cu cea reală din consola Firebase.");
}

// Inițializarea Firebase
const app = initializeApp(firebaseConfig);

// Inițializarea serviciilor Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Inițializarea furnizorilor pentru autentificare socială
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const facebookProvider = new FacebookAuthProvider();

// Activarea jurnalelor de consolă pentru Firebase Auth în modul de dezvoltare
if (import.meta.env.DEV) {
  console.log("Firebase debugging enabled");
}

export default app;
