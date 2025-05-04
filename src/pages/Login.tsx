
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useFirebase } from '@/context/FirebaseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, currentUser } = useFirebase();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vă rugăm să introduceți email și parolă");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isSignup) {
        await signup(email, password);
        toast.success("Cont creat cu succes!");
      } else {
        await login(email, password);
        toast.success("Autentificare reușită!");
      }
      
      navigate("/");
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      let errorMessage = "A apărut o eroare la autentificare";
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Email sau parolă greșită";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Acest email este deja utilizat";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Parola trebuie să aibă cel puțin 6 caractere";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {isSignup ? "Creează cont" : "Autentificare"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="exemplu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parolă</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
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
                isSignup ? "Creează cont" : "Autentificare"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setIsSignup(!isSignup)}
              type="button"
              disabled={isSubmitting}
            >
              {isSignup ? "Ai deja cont? Autentifică-te" : "Nu ai cont? Creează unul"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
