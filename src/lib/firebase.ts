// src/lib/firebase.ts

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
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import {
  getFirestore
} from "firebase/firestore";

// Fallback config (doar pentru test local dacă nu există .env)
// Poate fi lăsat sau scos, în producție nu se va folosi
const defaultTestConfig = {
  apiKey: "AIzaSyAqtFRhz1O3ub5MGKjRx-5mtIrjmTNANfk",
  authDomain: "test-project.firebaseapp.com",
  projectId: "test-project",
  storageBucket: "test-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// ==== ÎNCEPUT CONFIG DIN VARIABILE DE MEDIU ====
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || defaultTestConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || defaultTestConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || defaultTestConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || defaultTestConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultTestConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || defaultTestConfig.appId
};

console.log(
  "[Firebase Config] Source:",
  env.VITE_FIREBASE_API_KEY ? "env variables" : "defaultTestConfig"
);

// ==== PRELIMINARY CHECK ====
const missingVars: string[] = [];
if (!env.VITE_FIREBASE_API_KEY) {
  missingVars.push("VITE_FIREBASE_API_KEY");
}
if (
  !env.VITE_FIREBASE_AUTH_DOMAIN ||
  !env.VITE_FIREBASE_AUTH_DOMAIN.includes(".firebaseapp.com")
) {
  missingVars.push("VITE_FIREBASE_AUTH_DOMAIN");
}
if (!env.VITE_FIREBASE_PROJECT_ID) {
  missingVars.push("VITE_FIREBASE_PROJECT_ID");
}
const bucket = env.VITE_FIREBASE_STORAGE_BUCKET;
if (!bucket || !bucket.endsWith(".appspot.com")) {
  missingVars.push("VITE_FIREBASE_STORAGE_BUCKET");
}
if (!env.VITE_FIREBASE_MESSAGING_SENDER_ID) {
  missingVars.push("VITE_FIREBASE_MESSAGING_SENDER_ID");
}
if (!env.VITE_FIREBASE_APP_ID) {
  missingVars.push("VITE_FIREBASE_APP_ID");
}

if (missingVars.length > 0) {
  console.error(
    `❌ [Firebase Config] Missing/Invalid environment variables: ${missingVars.join(
      ", "
    )}.  Please update your .env and restart.`
  );
}

// ==== INITIALIZE FIREBASE ====
let app;
let auth;
let storage;
let db;
let googleProvider;

if (missingVars.length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    console.log("✅ [Firebase] Initialized successfully.");
  } catch (err) {
    console.error("❌ [Firebase] Initialization error:", err);
  }
} else {
  console.error("❌ [Firebase] Skipping initialization due to config errors.");
}

// ==== IMAGE UPLOAD & DELETE ====
export const uploadProductImage = async (
  imageFile: File | string,
  imagePath: string,
  onProgress?: (percent: number) => void
): Promise<string> => {
  if (!storage) throw new Error("Firebase Storage is not initialized");
  let blob: Blob;
  if (typeof imageFile === "string" && imageFile.startsWith("data:")) {
    const res = await fetch(imageFile);
    blob = await res.blob();
  } else if (imageFile instanceof File) {
    blob = imageFile;
  } else {
    throw new Error("Invalid image format");
  }

  const ref = storageRef(storage, imagePath);
  const task = uploadBytesResumable(ref, blob);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      snap => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      err => reject(err),
      async () => {
        const url = await getDownloadURL(ref);
        resolve(url);
      }
    );
  });
};

export const deleteProductImage = async (imagePath: string) => {
  if (!storage) throw new Error("Firebase Storage is not initialized");
  const ref = storageRef(storage, imagePath);
  await deleteObject(ref);
};

// ==== AUTH & FIRESTORE EXPORTS ====
export { app, auth, storage, db, googleProvider };
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
};
export type { User };
