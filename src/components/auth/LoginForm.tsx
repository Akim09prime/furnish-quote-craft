
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, LogIn, KeyRound } from 'lucide-react';
import { login, sendPasswordResetEmail } from '@/services/AuthService';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  email, 
  setEmail, 
  password, 
  setPassword,
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Load saved email from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const rememberMeSetting = localStorage.getItem('rememberMe') === 'true';
    
    if (savedEmail && rememberMeSetting) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [setEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      setAuthError("Vă rugăm să introduceți email și parolă");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Încercare de autentificare cu:", email);
    
    try {
      await login(email, password);
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
      }
      
      onSuccess();
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError("Vă rugăm să introduceți adresa de email pentru resetarea parolei");
      return;
    }

    setIsResettingPassword(true);
    
    try {
      await sendPasswordResetEmail(email);
      toast.success("Email de resetare trimis", {
        description: "Verificați căsuța de email pentru instrucțiuni",
      });
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {authError && (
        <Alert variant="destructive">
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="login-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input 
          id="login-email" 
          type="email" 
          placeholder="exemplu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting || isResettingPassword}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="login-password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Parolă
        </Label>
        <Input 
          id="login-password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting || isResettingPassword}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember-me" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <label
            htmlFor="remember-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ține-mă minte
          </label>
        </div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={handleForgotPassword}
          disabled={isSubmitting || isResettingPassword}
        >
          {isResettingPassword ? 'Se trimite...' : 'Am uitat parola'}
        </Button>
      </div>
      
      <Button 
        type="submit" 
        className="w-full flex items-center justify-center gap-2" 
        disabled={isSubmitting || isResettingPassword}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Se procesează...
          </span>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Autentificare
          </>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
