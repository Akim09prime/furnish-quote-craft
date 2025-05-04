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
  apiKey: "AIzaSyAqtFRhz1O3ub5MGKjRx-5mtIrjmTNANfk",
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
    console.log(`Uploading image to path: ${imagePath}`, typeof imageFile, imageFile instanceof File ? imageFile.type : 'string');
    const storageReference = storageRef(storage, imagePath);
    
    let uploadTask;
    
    if (typeof imageFile === 'string') {
      // Handle data URL
      if (imageFile.startsWith('data:')) {
        const mimeType = imageFile.split(';')[0].split(':')[1];
        console.log("Data URL MIME type:", mimeType);
        
        const response = await fetch(imageFile);
        const blob = await response.blob();
        console.log("Converted blob:", blob.type, blob.size);
        uploadTask = uploadBytesResumable(storageReference, blob);
      } else {
        throw new Error("Invalid image format: String is not a data URL");
      }
    } else if (imageFile instanceof File) {
      // Handle File object
      console.log("File type:", imageFile.type);
      
      // Verificăm dacă tipul fișierului este permis
      if (!imageFile.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        throw new Error(`Tip de fișier nepermis: ${imageFile.type}. Sunt acceptate doar imagini (jpg, png, gif, webp).`);
      }
      
      // Crearea unui nou obiect File pentru a preveni probleme cu unele browsere
      const newFile = new File([imageFile], imageFile.name, {
        type: imageFile.type,
        lastModified: imageFile.lastModified,
      });
      
      console.log("Prepared file for upload:", newFile.name, newFile.type, newFile.size);
      uploadTask = uploadBytesResumable(storageReference, newFile);
    } else {
      throw new Error("Invalid image format: Must be a File object or data URL");
    }
    
    // Return a promise that resolves with the download URL
    return new Promise((resolve, reject) => {
      // Listen for upload progress
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`Upload progress: ${progress}%`);
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          try {
            // Get download URL after upload is complete
            console.log("Upload completed successfully");
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`Image uploaded successfully. URL: ${downloadURL}`);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });
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

// Validează cheia API Firebase
export const validateFirebaseCredentials = async (): Promise<boolean> => {
  if (!auth) return false;
  
  try {
    // Încercăm o operație simplă pentru a verifica dacă cheia API este validă
    // Folosim getAuth() care va arunca o eroare dacă cheia API este invalidă
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
