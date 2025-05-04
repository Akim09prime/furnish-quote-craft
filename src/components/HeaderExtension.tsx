
import React from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn, User } from 'lucide-react';
import { toast } from 'sonner';

const HeaderExtension = () => {
  const { currentUser, logout, isAdmin } = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
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
    <div className="flex items-center gap-4">
      {currentUser ? (
        <div className="flex items-center gap-2">
          <div className="text-sm hidden md:block">
            {currentUser.email}
            {isAdmin && <span className="ml-1 text-xs text-green-600 font-bold">(Admin)</span>}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Deconectare</span>
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogin}
          className="flex items-center gap-1"
        >
          <LogIn className="h-4 w-4" />
          <span>Autentificare</span>
        </Button>
      )}
    </div>
  );
};

export default HeaderExtension;
