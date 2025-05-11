
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Database from "./pages/Database";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import FirebaseSetup from "./pages/FirebaseSetup";
import Designer from "./pages/Designer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Save, Palette, Brush } from "lucide-react";

// Create a new QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Component to determine page class based on route
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [pageClass, setPageClass] = useState("");
  
  useEffect(() => {
    const path = location.pathname;
    
    if (path === "/") {
      setPageClass("index-page");
    } else if (path === "/admin") {
      setPageClass("admin-page");
    } else if (path === "/designer") {
      setPageClass("designer-page");
    } else if (path === "/database") {
      setPageClass("database-page");
    } else if (path === "/login") {
      setPageClass("login-page");
    } else {
      setPageClass("other-page");
    }
  }, [location]);
  
  return (
    <div className={pageClass}>
      <div className="page-background" />
      {children}
    </div>
  );
};

// Live Edit Mode Provider
const LiveEditModeProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    const adminPaths = ['/admin', '/database'];
    setIsAdmin(adminPaths.includes(location.pathname));
    
    // Reset edit mode when navigating away from admin pages
    if (!adminPaths.includes(location.pathname)) {
      setEditMode(false);
    }
  }, [location]);
  
  if (!isAdmin) return <>{children}</>;
  
  return (
    <>
      {editMode && (
        <div className="edit-mode-overlay">
          <div>
            <span className="font-bold">Mod editare activat</span>
            <span className="ml-2 text-sm opacity-75">Faceți clic pe elementele pe care doriți să le editați</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setEditMode(false)}
            className="bg-white text-black"
          >
            Ieșire mod editare
          </Button>
        </div>
      )}
      
      <div className={editMode ? 'edit-mode-container' : ''}>
        {children}
      </div>
      
      {isAdmin && !editMode && (
        <div className="edit-controls">
          <Button size="sm" onClick={() => setEditMode(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Mod editare
          </Button>
          <Button size="sm" variant="outline">
            <Palette className="h-4 w-4 mr-2" />
            Personalizare
          </Button>
        </div>
      )}
      
      {isAdmin && editMode && (
        <div className="edit-controls">
          <Button size="sm" variant="destructive" onClick={() => setEditMode(false)}>
            <EyeOff className="h-4 w-4 mr-2" />
            Ieșire
          </Button>
          <Button size="sm" variant="default">
            <Save className="h-4 w-4 mr-2" />
            Salvare modificări
          </Button>
          <Button size="sm" variant="outline">
            <Brush className="h-4 w-4 mr-2" />
            Resetare
          </Button>
        </div>
      )}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="font-inter text-[#111827] bg-[#F9FAFB]">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageWrapper>
              <LiveEditModeProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/firebase-setup" element={<FirebaseSetup />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/designer" element={<Designer />} />
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
              </LiveEditModeProvider>
            </PageWrapper>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
