
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-furniture-purple-dark">
            FurnishQuote<span className="font-light text-gray-500">Craft</span>
          </h1>
        </div>
        
        <nav className="flex space-x-2">
          <Button 
            asChild
            variant={location.pathname === "/" ? "default" : "ghost"}
          >
            <Link to="/">Generator Ofertă</Link>
          </Button>
          
          <Button 
            asChild
            variant={location.pathname === "/accesorii" ? "default" : "ghost"}
          >
            <Link to="/accesorii">Accesorii</Link>
          </Button>
          
          <Button 
            asChild
            variant={location.pathname === "/admin" ? "default" : "ghost"}
          >
            <Link to="/admin">Administrare</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
