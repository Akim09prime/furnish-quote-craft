
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { toast } from "sonner";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Log environment variables for debugging (will be stripped in production)
if (import.meta.env.DEV) {
  console.log("Firebase environment variables:");
  console.log("VITE_API_KEY present:", !!import.meta.env.VITE_API_KEY);
  console.log("VITE_AUTH_DOMAIN present:", !!import.meta.env.VITE_AUTH_DOMAIN);
  console.log("VITE_PROJECT_ID present:", !!import.meta.env.VITE_PROJECT_ID);
  // Mask API key for security but show first and last few characters
  const apiKey = import.meta.env.VITE_API_KEY || "";
  const maskedKey = apiKey ? 
    `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 
    "not set";
  console.log("VITE_API_KEY (masked):", maskedKey);
}

// Check if we're using valid API keys (more robust check)
const isUsingPlaceholderKey = !import.meta.env.VITE_API_KEY || 
                             import.meta.env.VITE_API_KEY.includes("dummy") ||
                             import.meta.env.VITE_API_KEY.includes("placeholder") ||
                             import.meta.env.VITE_API_KEY === "";

// Initialize Firebase with error handling
let app;
let auth;
let db;
let storage;
let googleProvider;
let facebookProvider;

try {
  if (isUsingPlaceholderKey) {
    console.error("Firebase initialization skipped: Invalid or missing API key");
    throw new Error("Firebase API key is not valid or is missing");
  }

  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Initialize authentication providers
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  
  facebookProvider = new FacebookAuthProvider();
  
  // Enable emulators in development if needed
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true") {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("Firebase emulators connected");
  }
  
  // Display placeholder key warning
  if (isUsingPlaceholderKey) {
    console.warn("🔥 ATENȚIE: Folosiți o cheie API Firebase de test! Autentificarea nu va funcționa corect. " +
                "Vă rugăm să configurați cheia API reală în variabilele de mediu.");
  } else {
    console.log("Firebase initialized successfully with valid API key");
  }
  
} catch (error) {
  console.error("Firebase initialization error:", error);
  toast.error("Eroare la inițializarea Firebase. Vă rugăm să verificați configurația.");
  
  // Provide fallback instances to prevent undefined errors
  if (!app) app = {} as any;
  if (!auth) auth = {} as any;
  if (!db) db = {} as any;
  if (!storage) storage = {} as any;
  if (!googleProvider) googleProvider = {} as any;
  if (!facebookProvider) facebookProvider = {} as any;
}

export { 
  app as default, 
  auth, 
  db, 
  storage, 
  googleProvider, 
  facebookProvider,
  isUsingPlaceholderKey
};
