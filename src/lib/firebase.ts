
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1fNubvZz8lV9QyPnPvCQZhTsYR8A5WsQ",
  authDomain: "mail-63f7e.firebaseapp.com",
  projectId: "mail-63f7e",
  storageBucket: "mail-63f7e.appspot.com",
  messagingSenderId: "367987796071",
  appId: "1:367987796071:web:ed2cda80af01f49a9e0cc2",
  measurementId: "G-RZ7BXEF429"
};

// Prevent multiple Firebase app initializations
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  // If Firebase app already exists, use the existing one
  if (error.code === 'app/duplicate-app') {
    console.log("Firebase app already exists, using existing app");
    app = initializeApp();
  } else {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services and auth methods
export { app, auth, db, storage, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut };
export type { User };
