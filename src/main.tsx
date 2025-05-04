
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// For debugging - display Firebase config is being used
console.log("=============================================");
console.log("LOADING APPLICATION WITH HARDCODED FIREBASE CONFIG");
console.log("=============================================");
console.log("Build timestamp:", new Date().toISOString());
console.log("=============================================");

createRoot(document.getElementById("root")!).render(<App />);
