
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
    <header className="bg-white/80 backdrop-blur-lg border-b border-furniture-purple-light/20 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 h-18 flex items-center justify-between">
        <div className="flex items-center py-3">
          <Link to="/" className="flex items-center group">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-furniture-purple to-furniture-purple-dark bg-clip-text text-transparent transition-all duration-300">
                FurnishQuote
              </span>
              <span className="font-light text-gray-600 group-hover:text-furniture-purple transition-colors">Craft</span>
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center justify-between gap-3">
          <nav className="flex gap-1 p-1 bg-gray-50/80 backdrop-blur rounded-lg shadow-inner">
            <Button 
              asChild
              variant={location.pathname === "/" ? "purple" : "ghost"}
              className="transition-all duration-300"
            >
              <Link to="/">
                <Home className="mr-1.5 h-4 w-4" />
                Generator Ofertă
              </Link>
            </Button>
            
            <Button 
              asChild
              variant={location.pathname === "/designer" ? "purple" : "ghost"}
              className="transition-all duration-300"
            >
              <Link to="/designer">
                <Armchair className="mr-1.5 h-4 w-4" />
                Proiectare Mobilier
              </Link>
            </Button>
            
            <Button 
              asChild
              variant={location.pathname === "/admin" ? "purple" : "ghost"}
              className="transition-all duration-300"
            >
              <Link to="/admin">
                <Settings className="mr-1.5 h-4 w-4" />
                Administrare
              </Link>
            </Button>
            
            <Button 
              asChild
              variant={location.pathname === "/database" ? "purple" : "ghost"}
              className="transition-all duration-300"
            >
              <Link to="/database">
                <Database className="mr-1.5 h-4 w-4" />
                Baza de date
              </Link>
            </Button>
          </nav>

          {isAuthInitialized && (
            isLoggedIn ? (
              <Button onClick={handleLogout} size="sm" variant="outline" className="ml-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <LogOut className="mr-1.5 h-4 w-4 text-red-500" />
                Deconectare
              </Button>
            ) : (
              <Button onClick={handleLogin} size="sm" variant="purple" className="ml-4">
                <LogIn className="mr-1.5 h-4 w-4" />
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
