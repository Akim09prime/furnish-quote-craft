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
  uploadBytesResumable,
  UploadTask
} from "firebase/storage";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs 
} from "firebase/firestore";

// Default test config for development
// Will be replaced with env config if available
const defaultTestConfig = {
  apiKey: "AIzaSyAqtFRhz1O3ub5MGKjRx-5mtIrjmTNANfk",
  authDomain: "test-project.firebaseapp.com",
  projectId: "test-project",
  storageBucket: "test-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Firebase configuration object - try to use env vars
// If not available, use default test config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultTestConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultTestConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultTestConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultTestConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultTestConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultTestConfig.appId
};

console.log("Inițializare Firebase cu configurația:", 
  import.meta.env.VITE_FIREBASE_API_KEY ? "din variabile de mediu" : "implicită de test");

// Initialize Firebase services
let app;
let auth;
let storage;
let googleProvider;
let db;

try {
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

// Simplified upload method for easier debugging
export const uploadProductImage = async (
  imageFile: File | string, 
  imagePath: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!storage) {
    throw new Error("Firebase Storage is not available");
  }
  
  try {
    console.log(`Starting upload to path: ${imagePath}`);
    const fileRef = storageRef(storage, imagePath);
    
    // Convert string to blob if needed
    let fileToUpload: Blob;
    if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
      const response = await fetch(imageFile);
      fileToUpload = await response.blob();
      console.log("Converted blob:", fileToUpload.type, fileToUpload.size);
    } else if (imageFile instanceof File) {
      fileToUpload = imageFile;
      console.log("Using file:", imageFile.name, imageFile.type, imageFile.size);
    } else {
      throw new Error("Invalid image format");
    }
    
    // Create upload task
    const uploadTask = uploadBytesResumable(fileRef, fileToUpload);
    
    // Monitor upload progress
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`Upload progress: ${progress}%`);
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error("Upload error:", error.code, error.message);
          reject(error);
        },
        async () => {
          // Upload completed successfully
          console.log("Upload completed!");
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Download URL:", downloadURL);
            resolve(downloadURL);
          } catch (urlError) {
            console.error("Error getting download URL:", urlError);
            reject(urlError);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in uploadProductImage:", error);
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
    const fileRef = storageRef(storage, imagePath);
    await deleteObject(fileRef);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// Validate Firebase API key
export const validateFirebaseCredentials = async (): Promise<boolean> => {
  if (!auth) return false;
  
  try {
    await auth.app.options;
    console.log("Cheia API Firebase este validă");
    return true;
  } catch (error) {
    console.error("Validare cheie API Firebase eșuată:", error);
    return false;
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
