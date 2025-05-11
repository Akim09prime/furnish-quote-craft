
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Database from "./pages/Database";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import FirebaseSetup from "./pages/FirebaseSetup";
import Designer from "./pages/Designer";
import Catalog from "./pages/Catalog";
import ProtectedRoute from "./components/ProtectedRoute";

// Context providers
import { AppProvider } from "./lib/contexts/AppContext";

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
  useEffect(() => {
    // Pentru debugging - afișăm informații despre încărcarea aplicației
    console.log("=============================================");
    console.log("ÎNCĂRCARE APLICAȚIE RESTRUCTURATĂ");
    console.log("Timestamp:", new Date().toISOString());
    console.log("=============================================");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <div className="font-inter text-[#111827] min-h-screen">
            <Toaster />
            <Sonner position="top-right" expand={true} closeButton={true} />
            
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/designer" element={<Designer />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/firebase-setup" element={<FirebaseSetup />} />
                
                {/* Protected Routes */}
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
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
