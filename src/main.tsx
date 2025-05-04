
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Pentru debugging - afișăm informații despre configurația Firebase
console.log("=============================================");
console.log("LOADING APPLICATION WITH FIREBASE CONFIGURATION");
console.log("=============================================");
console.log("Build timestamp:", new Date().toISOString());
console.log("=============================================");

createRoot(document.getElementById("root")!).render(<App />);
