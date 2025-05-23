
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, UserPlus } from 'lucide-react';
import { register } from '@/services/AuthService';

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  email, 
  setEmail, 
  password, 
  setPassword,
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      setAuthError("Vă rugăm să introduceți email și parolă");
      return;
    }
    
    if (password.length < 6) {
      setAuthError("Parola trebuie să aibă cel puțin 6 caractere");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Încercare de înregistrare cu:", email);
    
    try {
      await register(email, password);
      onSuccess();
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsSubmitting(false);
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
        <Label htmlFor="register-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input 
          id="register-email" 
          type="email" 
          placeholder="exemplu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Parolă (minim 6 caractere)
        </Label>
        <Input 
          id="register-password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full flex items-center justify-center gap-2" 
        disabled={isSubmitting}
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
            <UserPlus className="h-4 w-4" />
            Înregistrare
          </>
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
