
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Database from "./pages/Database";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import FirebaseSetup from "./pages/FirebaseSetup";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useState, useEffect } from "react";

// Create a new QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Simple component to protect routes
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) return <div>Încărcare...</div>;
    
    if (!currentUser) {
      return <LoginPage />;
    }
    
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="font-inter text-[#111827] bg-[#F9FAFB]">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/firebase-setup" element={<FirebaseSetup />} />
              <Route path="/" element={<Index />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/database" 
                element={
                  <ProtectedRoute>
                    <Database />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
