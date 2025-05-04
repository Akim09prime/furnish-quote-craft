
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

// Firebase configuration - hardcoded, no fallbacks or environment variables
const firebaseConfig = {
  apiKey: "AIzaSyAqtFRhZ1o3ub5MGkjRx-5mtIrjmTNANKf",
  authDomain: "mail-63f7e.firebaseapp.com",
  projectId: "mail-63f7e",
  storageBucket: "mail-63f7e.appspot.com",
  messagingSenderId: "367987796071",
  appId: "1:367987796071:web:ed2cda80af01f49a9e0cc2",
  measurementId: "G-RZ7BXEF429"
};

// Log the API key (will appear in the console when the app initializes)
console.log("Firebase API Key being used:", firebaseConfig.apiKey?.substring(0, 5) + "..." + firebaseConfig.apiKey?.substring(firebaseConfig.apiKey.length - 5));

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services and auth methods
export { app, auth, db, storage, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut };
export type { User };
