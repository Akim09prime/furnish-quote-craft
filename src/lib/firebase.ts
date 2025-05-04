import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  connectAuthEmulator 
} from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator 
} from "firebase/firestore";
import { 
  getStorage, 
  connectStorageEmulator 
} from "firebase/storage";
import { toast } from "sonner";

// ✅ Configurație Firebase scrisă direct, fără import.meta.env
const firebaseConfig = {
  apiKey: "AIzaSyAqtFRhZ1o3ub5MGkjRx-5mtIrjmTNANKf",
  authDomain: "mail-63f7e.firebaseapp.com",
  projectId: "mail-63f7e",
  storageBucket: "mail-63f7e.appspot.com",
  messagingSenderId: "367987796071",
  appId: "1:367987796071:web:ed2cda80af01f49a9e0cc2",
  measurementId: "G-RZ7BXEF429"
};

// 🔄 Inițializare Firebase și servicii
let app;
let auth;
let db;
let storage;
let googleProvider;
let facebookProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  facebookProvider = new FacebookAuthProvider();

  // 🔧 Emulatoare (doar în dezvoltare locală, opțional)
  // Dacă vrei să le activezi pe localhost, decomentează mai jos:
  /*
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
  */

  console.log("✅ Firebase a fost inițializat corect.");
} catch (error) {
  console.error("❌ Eroare la inițializarea Firebase:", error);
  toast.error("Eroare la conectarea cu Firebase.");
  
  // fallback ca să nu crape aplicația
  if (!app) app = {} as any;
  if (!auth) auth = {} as any;
  if (!db) db = {} as any;
  if (!storage) storage = {} as any;
  if (!googleProvider) googleProvider = {} as any;
  if (!facebookProvider) facebookProvider = {} as any;
}

// 🔁 Exportăm instanțele
export { 
  app as default,
  auth,
  db,
  storage,
  googleProvider,
  facebookProvider
};
