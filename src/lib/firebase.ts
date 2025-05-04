
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
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable
} from "firebase/storage";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs 
} from "firebase/firestore";

// Configurație Firebase implicită de test pentru dezvoltare
// Va fi înlocuită cu configrația din env dacă este disponibilă
const defaultTestConfig = {
  apiKey: "AIzaSyBxOQ8IlbIWm1T22XPQ_cBop6Z3PxuHoOQ",
  authDomain: "test-project.firebaseapp.com",
  projectId: "test-project",
  storageBucket: "test-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Firebase configuration object - se va încerca folosirea variabilelor de mediu
// Dacă nu sunt disponibile, se folosește configurația implicită de test
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultTestConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultTestConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultTestConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultTestConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultTestConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultTestConfig.appId
};

// Inițializare Firebase
console.log("Inițializare Firebase cu configurația:", 
  import.meta.env.VITE_FIREBASE_API_KEY ? "din variabile de mediu" : "implicită de test");

// Initialize Firebase
let app;
let auth;
let storage;
let googleProvider;
let db;

try {
  // Inițializare Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  console.log("Firebase inițializat cu succes!");
} catch (error) {
  console.error("Eroare la inițializarea Firebase:", error);
  // Keep variables undefined if initialization fails
}

// Helper function to upload product images
export const uploadProductImage = async (
  imageFile: File | string, 
  imagePath: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!storage) {
    throw new Error("Firebase Storage is not available");
  }
  
  try {
    console.log(`Uploading image to path: ${imagePath}`);
    const storageReference = storageRef(storage, imagePath);
    
    let uploadTask;
    
    if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
      // Handle data URL
      const response = await fetch(imageFile);
      const blob = await response.blob();
      uploadTask = uploadBytesResumable(storageReference, blob);
    } else if (imageFile instanceof File) {
      // Handle File object
      uploadTask = uploadBytesResumable(storageReference, imageFile);
    } else {
      throw new Error("Invalid image format");
    }
    
    // Listen for upload progress
    if (onProgress) {
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          throw error;
        }
      );
    }
    
    // Wait for upload to complete
    await uploadTask;
    
    // Get download URL after upload is complete
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    console.log(`Image uploaded successfully. URL: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Helper function to delete product images
export const deleteProductImage = async (imagePath: string): Promise<void> => {
  if (!storage) {
    throw new Error("Firebase Storage is not available");
  }
  
  try {
    console.log(`Deleting image at path: ${imagePath}`);
    const storageReference = storageRef(storage, imagePath);
    await deleteObject(storageReference);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// Export Firebase modules and auth functions
export { 
  app, 
  auth, 
  storage, 
  db, 
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
};

// Re-export User type from firebase/auth
export type { User };
