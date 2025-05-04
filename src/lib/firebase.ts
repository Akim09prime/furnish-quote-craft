
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  User,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqtFRhZ1o3ub5MGkjRx-5mtIrjmTNANKf",
  authDomain: "mail-63f7e.firebaseapp.com",
  projectId: "mail-63f7e",
  storageBucket: "mail-63f7e.appspot.com",
  messagingSenderId: "367987796071",
  appId: "1:367987796071:web:ed2cda80af01f49a9e0cc2",
  measurementId: "G-RZ7BXEF429"
};

// Check if using a placeholder API key (for UI warnings)
export const isUsingPlaceholderKey = firebaseConfig.apiKey === "AIzaSyAqtFRhZ1o3ub5MGkjRx-5mtIrjmTNANKf" || 
  firebaseConfig.apiKey === "your-api-key-here" || 
  firebaseConfig.apiKey.includes("placeholder") || 
  !firebaseConfig.apiKey;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {
  app,
  auth,
  db,
  storage,
  googleProvider,
  facebookProvider,
};
