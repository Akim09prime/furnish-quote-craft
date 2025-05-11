
import React from 'react';
import Header from '@/components/Header';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Determine page class based on route
  const getPageClass = () => {
    const path = location.pathname;
    
    if (path === "/") {
      return "index-page";
    } else if (path === "/admin") {
      return "admin-page";
    } else if (path === "/designer") {
      return "designer-page";
    } else if (path === "/database") {
      return "database-page";
    } else if (path === "/login") {
      return "login-page";
    } else if (path === "/catalog") {
      return "catalog-page";
    } else {
      return "other-page";
    }
  };
  
  return (
    <div className={`${getPageClass()} min-h-screen bg-gray-50 flex flex-col`}>
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          FurnishQuoteCraft &copy; {new Date().getFullYear()} | Designer de mobilier și generator de oferte
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
