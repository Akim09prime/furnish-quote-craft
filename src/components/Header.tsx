
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogIn, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = auth.currentUser !== null;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("V-ați deconectat cu succes!");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Eroare la deconectare");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-semibold text-[#1A73E8]">
              FurnishQuote<span className="font-light text-gray-500">Craft</span>
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
              <Link to="/">Generator Ofertă</Link>
            </Button>
            
            <Button 
              asChild
              variant={location.pathname === "/admin" ? "default" : "ghost"}
              className="transition-all duration-200"
            >
              <Link to="/admin">Administrare</Link>
            </Button>
            
            <Button 
              asChild
              variant={location.pathname === "/database" ? "default" : "ghost"}
              className="transition-all duration-200"
            >
              <Link to="/database">Baza de date</Link>
            </Button>
          </nav>

          {isLoggedIn ? (
            <Button onClick={handleLogout} size="sm" variant="outline" className="ml-4">
              <LogOut className="mr-2 h-4 w-4" />
              Deconectare
            </Button>
          ) : (
            <Button onClick={handleLogin} size="sm" variant="outline" className="ml-4">
              <LogIn className="mr-2 h-4 w-4" />
              Autentificare
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
