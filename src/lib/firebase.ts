
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
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  uploadString 
} from "firebase/storage";

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

// Firebase Storage functions for image uploads
export const uploadProductImage = async (imageFile, productId) => {
  if (!storage) throw new Error('Firebase Storage nu este inițializat');
  
  try {
    const storageRef = ref(storage, `product-images/${productId}`);
    
    // If it's a File object
    if (imageFile instanceof File) {
      const snapshot = await uploadBytes(storageRef, imageFile);
      return await getDownloadURL(snapshot.ref);
    } 
    // If it's a data URL (base64)
    else if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
      const snapshot = await uploadString(storageRef, imageFile, 'data_url');
      return await getDownloadURL(snapshot.ref);
    }
    
    throw new Error('Format de imagine invalid');
  } catch (error) {
    console.error("Eroare la încărcarea imaginii:", error);
    throw error;
  }
};

// Export Firebase services and auth methods
export { 
  app, 
  auth, 
  db, 
  storage, 
  ref, 
  getDownloadURL,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  sendPasswordResetEmail 
};
export type { User };
