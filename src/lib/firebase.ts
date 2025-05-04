
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if Firebase is already initialized to prevent duplicate initializations
let app;
let auth;
let db;
let storage;

try {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAqtFRhz1O3ub5MGKjRx-5mtIrjmTNANfk", // Updated API key
    authDomain: "mail-63f7e.firebaseapp.com",
    projectId: "mail-63f7e",
    storageBucket: "mail-63f7e.appspot.com",
    messagingSenderId: "367987796071",
    appId: "1:367987796071:web:ed2cda80af01f49a9e0cc2",
    measurementId: "G-RZ7BXEF429"
  };

  console.log("Inițializare Firebase cu configurația:", {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    apiKey: "Valid API Key present" // Don't log the actual key
  });

  // Initialize Firebase services
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log("Firebase inițializat cu succes:", auth ? "Auth disponibil" : "Auth nedisponibil");
} catch (error) {
  console.error("Eroare la inițializarea Firebase:", error);
}

// Export Firebase services and auth methods
export { app, auth, db, storage, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail };
export type { User };
