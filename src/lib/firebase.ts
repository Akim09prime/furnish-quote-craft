
// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import {
  getFirestore
} from "firebase/firestore";

// Fallback config (doar pentru test local dacă nu există .env)
// Poate fi lăsat sau scos, în producție nu se va folosi
const defaultTestConfig = {
  apiKey: "AIzaSyAqtFRhz1O3ub5MGKjRx-5mtIrjmTNANfk",
  authDomain: "test-project.firebaseapp.com",
  projectId: "test-project",
  storageBucket: "test-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// ==== ÎNCEPUT CONFIG DIN VARIABILE DE MEDIU ====
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const missingVars: string[] = [];
if (!env.VITE_FIREBASE_API_KEY) missingVars.push("VITE_FIREBASE_API_KEY");
if (!env.VITE_FIREBASE_AUTH_DOMAIN?.includes(".firebaseapp.com"))
  missingVars.push("VITE_FIREBASE_AUTH_DOMAIN");
if (!env.VITE_FIREBASE_PROJECT_ID) missingVars.push("VITE_FIREBASE_PROJECT_ID");
if (!env.VITE_FIREBASE_STORAGE_BUCKET?.endsWith(".appspot.com"))
  missingVars.push("VITE_FIREBASE_STORAGE_BUCKET");
if (!env.VITE_FIREBASE_MESSAGING_SENDER_ID)
  missingVars.push("VITE_FIREBASE_MESSAGING_SENDER_ID");
if (!env.VITE_FIREBASE_APP_ID) missingVars.push("VITE_FIREBASE_APP_ID");

// Define these variables in the module scope
let app: any;
let auth: any;
let storage: any;
let db: any;
let googleProvider: any;

if (missingVars.length) {
  console.error(
    `❌ [Firebase Config] Missing/Invalid: ${missingVars.join(", ")}`
  );
} else {
  // Initialize Firebase only if all vars present
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  console.log("✅ [Firebase] Initialized successfully.");
}

/**
 * Validates Firebase API key and credentials by making a test request
 * @returns {Promise<boolean>} True if credentials are valid, false otherwise
 */
export const validateFirebaseCredentials = async (): Promise<boolean> => {
  try {
    // Check if Firebase is initialized
    if (!auth) {
      console.error("Firebase Auth nu a fost inițializat");
      return false;
    }

    // Test the Firebase API key by making a simple request
    // This is a method that doesn't require authentication but will fail with an invalid API key
    const apiKeyTest = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          continueUri: window.location.origin,
          identifier: 'test@example.com',
        }),
      }
    );

    // If the request returns 400, it means the API key is valid but the request is malformed
    // If it returns 403, the API key is invalid
    if (apiKeyTest.status === 403) {
      console.error("Firebase API key is invalid");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating Firebase credentials:", error);
    return false;
  }
};

// ==== AUTH & FIRESTORE EXPORTS ====

export { app, auth, storage, db, googleProvider };
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
};
export type { User };

