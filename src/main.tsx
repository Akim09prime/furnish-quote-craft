
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log environment variables (only in development)
if (import.meta.env.DEV) {
  console.log("=============================================");
  console.log("LOADING APPLICATION WITH ENVIRONMENT VARIABLES");
  console.log("=============================================");
  // Check if we have Firebase API keys
  const hasApiKey = !!import.meta.env.VITE_API_KEY;
  console.log("Firebase API Key loaded:", hasApiKey ? "✅ Yes" : "❌ No");
  console.log("Build timestamp:", new Date().toISOString());
  console.log("=============================================");
}

createRoot(document.getElementById("root")!).render(<App />);
