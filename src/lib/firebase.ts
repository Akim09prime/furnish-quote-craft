
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey-ThisIsAPlaceholder",
  authDomain: "furniture-quote.firebaseapp.com",
  projectId: "furniture-quote",
  storageBucket: "furniture-quote.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize providers for social login
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const facebookProvider = new FacebookAuthProvider();

// Enable console logs for Firebase Auth in development mode
if (process.env.NODE_ENV === 'development') {
  console.log("Firebase debugging enabled");
}

export default app;
