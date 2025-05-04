
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// For debugging - display Firebase config is being used
console.log("=============================================");
console.log("LOADING APPLICATION WITH ENVIRONMENT VARIABLES");
console.log("=============================================");
console.log("Firebase API Key loaded:", import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Yes" : "❌ No");
console.log("Firebase API Key value:", import.meta.env.VITE_FIREBASE_API_KEY); // Added verification log
console.log("Build timestamp:", new Date().toISOString());
console.log("=============================================");

createRoot(document.getElementById("root")!).render(<App />);
