
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
// NOTĂ: Această configurație ar trebui să corespundă proiectului dvs. Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBqqK6ajS6FWM6uBwDl2nWI_ZoGEokhSZQ",
  authDomain: "mail-63f7e.firebaseapp.com",
  projectId: "mail-63f7e",
  storageBucket: "mail-63f7e.appspot.com",
  messagingSenderId: "367987796071",
  appId: "1:367987796071:web:ed2cda80af01f49a9e0cc2",
  measurementId: "G-RZ7BXEF429"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {
  app,
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  facebookProvider
};
