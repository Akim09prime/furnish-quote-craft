
import React from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  LogIn,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.photoURL || ""} alt="Avatar utilizator" />
                <AvatarFallback>{currentUser.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{currentUser.displayName || "Utilizator"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {currentUser.email}
              </p>
              {isAdmin && <span className="text-xs text-green-600 font-bold">(Admin)</span>}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profilul meu</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Deconectare</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
