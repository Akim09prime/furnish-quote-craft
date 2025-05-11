
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogIn, LogOut, Armchair, Home, Database, Settings, LayoutGrid } from 'lucide-react';
import { subscribeToAuthState, logout } from '@/services/AuthService';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // Monitorizare stare autentificare
  useEffect(() => {
    console.log("Header: Verificare stare autentificare...");
    
    try {
      const unsubscribe = subscribeToAuthState(
        (user) => {
          console.log("Header: Stare autentificare:", user ? "Autentificat" : "Neautentificat");
          setIsLoggedIn(!!user);
          setIsAuthInitialized(true);
        },
        (error) => {
          console.error("Header: Eroare la verificarea autentificării:", error);
          setIsAuthInitialized(true);
        }
      );
      
      return () => {
        console.log("Header: Curățare ascultător");
        unsubscribe();
      };
    } catch (error) {
      console.error("Header: Eroare la inițializarea verificării autentificării:", error);
      setIsAuthInitialized(true);
      return () => {};
    }
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Header: Deconectare în curs...");
      await logout();
      console.log("Header: Deconectare reușită");
      toast.success("V-ați deconectat cu succes!");
      navigate("/");
    } catch (error) {
      console.error("Eroare la deconectare:", error);
      toast.error("Eroare la deconectare");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md backdrop-blur-sm bg-white/90">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <h1 className="text-xl font-semibold">
              <span className="bg-gradient-to-r from-[#1A73E8] to-[#3b82f6] bg-clip-text text-transparent">
                FurnishQuote
              </span>
              <span className="font-light text-gray-500 group-hover:text-gray-700 transition-colors">Craft</span>
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <nav className="flex space-x-2">
            <Button 
              asChild
              variant={location.pathname === "/" ? "default" : "ghost"}
              className="transition-all duration-200"
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Generator Ofertă
              </Link>
            </Button>
            
            <Button 
              asChild
              variant={location.pathname === "/designer" ? "default" : "ghost"}
              className="transition-all duration-200"
            >
              <Link to="/designer">
                <Armchair className="mr-2 h-4 w-4" />
                Proiectare Mobilier
              </Link>
            </Button>
            
            <Button 
              asChild
              variant={location.pathname === "/admin" ? "default" : "ghost"}
              className="transition-all duration-200"
            >
              <Link to="/admin">
                <Settings className="mr-2 h-4 w-4" />
                Administrare
              </Link>
            </Button>
            
            <Button 
              asChild
              variant={location.pathname === "/database" ? "default" : "ghost"}
              className="transition-all duration-200"
            >
              <Link to="/database">
                <Database className="mr-2 h-4 w-4" />
                Baza de date
              </Link>
            </Button>
          </nav>

          {isAuthInitialized && (
            isLoggedIn ? (
              <Button onClick={handleLogout} size="sm" variant="outline" className="ml-4 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                Deconectare
              </Button>
            ) : (
              <Button onClick={handleLogin} size="sm" variant="default" className="ml-4">
                <LogIn className="mr-2 h-4 w-4" />
                Autentificare
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
