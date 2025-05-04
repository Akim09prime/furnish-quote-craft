
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
  uploadString,
  deleteObject
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqtFRhz1O3ub5MGKjRx-5mtIrjmTNANfk",
  authDomain: "mail-63f7e.firebaseapp.com",
  projectId: "mail-63f7e",
  storageBucket: "mail-63f7e.appspot.com",
  messagingSenderId: "367987796071",
  appId: "1:367987796071:web:ed2cda80af01f49a9e0cc2",
  measurementId: "G-RZ7BXEF429"
};

// Initialize Firebase - create single instances
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("Firebase inițializat:", {
  auth: auth ? "Auth disponibil" : "Auth nedisponibil",
  storage: storage ? "Storage disponibil" : "Storage nedisponibil"
});

// Firebase Storage functions for image uploads
export const uploadProductImage = async (imageFile, productId) => {
  if (!storage) throw new Error('Firebase Storage nu este inițializat');
  
  try {
    const storageRef = ref(storage, `product-images/${productId}`);
    
    // If it's a File object
    if (imageFile instanceof File) {
      console.log("Încărcare fișier imagine:", imageFile.name, imageFile.type);
      const snapshot = await uploadBytes(storageRef, imageFile);
      console.log("Imagine încărcată cu succes:", snapshot.ref.fullPath);
      return await getDownloadURL(snapshot.ref);
    } 
    // If it's a data URL (base64)
    else if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
      console.log("Încărcare imagine în format data URL");
      const snapshot = await uploadString(storageRef, imageFile, 'data_url');
      console.log("Imagine încărcată cu succes:", snapshot.ref.fullPath);
      return await getDownloadURL(snapshot.ref);
    }
    
    throw new Error('Format de imagine invalid');
  } catch (error) {
    console.error("Eroare la încărcarea imaginii:", error);
    throw error;
  }
};

// Function to delete product image
export const deleteProductImage = async (productId) => {
  if (!storage) throw new Error('Firebase Storage nu este inițializat');
  
  try {
    const storageRef = ref(storage, `product-images/${productId}`);
    await deleteObject(storageRef);
    console.log("Imagine ștearsă cu succes:", productId);
    return true;
  } catch (error) {
    console.error("Eroare la ștergerea imaginii:", error);
    return false;
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
  uploadBytes,
  uploadString,
  deleteObject,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  sendPasswordResetEmail 
};
export type { User };
