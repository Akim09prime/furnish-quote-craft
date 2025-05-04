
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const location = useLocation();

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
      </div>
    </header>
  );
};

export default Header;
