
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Pentru debugging - afișăm informații despre încărcarea aplicației
console.log("=============================================");
console.log("ÎNCĂRCARE APLICAȚIE");
console.log("Timestamp:", new Date().toISOString());
console.log("=============================================");

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Elementul cu ID 'root' nu a fost găsit!");

createRoot(rootElement).render(<App />);
