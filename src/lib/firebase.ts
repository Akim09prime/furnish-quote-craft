
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
  apiKey: "AIzaSyAqtfFRzJo36uMSGKjrp-5mtIjrjTNANKf", // Folosim cheia API corectă
  authDomain: "mail-63f7e.firebaseapp.com",
  projectId: "mail-63f7e",
  storageBucket: "mail-63f7e.appspot.com",
  messagingSenderId: "367987796071",
  appId: "1:367987796071:web:ed2cda80af01f49a9e0cc2",
  measurementId: "G-RZ7BXEF429"
};

console.log("Inițializare Firebase cu configurația:", {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Inițializare Firebase simplificată
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Adăugăm un listener pentru debugging
auth.onAuthStateChanged((user) => {
  console.log("Stare autentificare globală schimbată:", user ? `Utilizator autentificat: ${user.email}` : "Niciun utilizator");
});

// Export Firebase services and auth methods
export { app, auth, db, storage, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut };
export type { User };
