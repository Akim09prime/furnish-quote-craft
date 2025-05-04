
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useFirebase } from '@/context/FirebaseContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Facebook, Mail, LogIn, User, Lock, AlertTriangle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const passwordResetSchema = z.object({
  email: z.string().email("Email invalid"),
});

const loginSchema = z.object({
  email: z.string().email("Adresa de email nu este validă"),
  password: z.string().min(6, "Parola trebuie să aibă cel puțin 6 caractere"),
});

// Pentru mod demo/test - utilizator și parolă demo
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
const DEMO_EMAIL = DEMO_MODE ? (import.meta.env.VITE_DEMO_EMAIL || "demo@example.com") : null;
const DEMO_PASSWORD = DEMO_MODE ? (import.meta.env.VITE_DEMO_PASSWORD || "demo123456") : null;

const LoginPage = () => {
  const [email, setEmail] = useState(DEMO_EMAIL || '');
  const [password, setPassword] = useState(DEMO_PASSWORD || '');
  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, signup, loginWithGoogle, loginWithFacebook, resetPassword, currentUser } = useFirebase();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });
  
  useEffect(() => {
    // Show demo mode message if enabled
    if (DEMO_MODE) {
      toast.info(
        "Mod demo activ! Utilizați credențialele pre-completate pentru testare.",
        { duration: 5000 }
      );
    }
  }, []);
  
  // If user is already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setAuthError(null);
    
    if (!email || !password) {
      toast.error("Vă rugăm să introduceți email și parolă");
      setAuthError("Vă rugăm să introduceți email și parolă");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(`Încercare de ${isSignup ? 'înregistrare' : 'autentificare'} pentru email: ${email}`);
      
      if (isSignup) {
        await signup(email, password);
        console.log("Înregistrare reușită");
        toast.success("Cont creat cu succes!");
      } else {
        await login(email, password);
        console.log("Autentificare reușită");
        toast.success("Autentificare reușită!");
      }
      
      navigate("/");
    } catch (error: any) {
      console.error("Eroare de autentificare:", error);
      console.error("Cod eroare:", error.code);
      console.error("Mesaj eroare:", error.message);
      
      let errorMessage = "A apărut o eroare la autentificare";
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Email sau parolă greșită";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Acest email este deja utilizat";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Parola trebuie să aibă cel puțin 6 caractere";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Credențiale invalide. Verificați emailul și parola.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Problemă de conexiune la rețea. Verificați conexiunea internet.";
      } else if (error.code === "auth/internal-error") {
        errorMessage = "Eroare internă Firebase. Verificați configurația Firebase.";
      } else if (error.code?.includes("api-key-not-valid")) {
        errorMessage = "Cheie API Firebase invalidă. Vă rugăm să verificați configurația Firebase.";
      } else {
        errorMessage = `Eroare neașteptată: ${error.message || error.code || "Necunoscut"}`;
      }
      
      toast.error(errorMessage);
      setAuthError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setAuthError(null);
      console.log(`Încercare de autentificare cu ${provider}`);
      
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      
      console.log(`Autentificare cu ${provider} reușită`);
      toast.success("Autentificare reușită!");
      navigate("/");
    } catch (error: any) {
      console.error(`Eroare la autentificarea cu ${provider}:`, error);
      
      let errorMessage = "A apărut o eroare la autentificare";
      
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Autentificarea a fost anulată";
      } else if (error.code === "auth/account-exists-with-different-credential") {
        errorMessage = "Există deja un cont cu acest email, dar folosind altă metodă de autentificare";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Această metodă de autentificare nu este activată. Verificați configurația Firebase.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup-ul a fost blocat de browser. Verificați setările browserului.";
      } else if (error.code?.includes("api-key-not-valid")) {
        errorMessage = "Cheie API Firebase invalidă. Vă rugăm să verificați configurația Firebase.";
      } else {
        errorMessage = `Eroare neașteptată: ${error.message || error.code || "Necunoscut"}`;
      }
      
      toast.error(errorMessage);
      setAuthError(errorMessage);
    }
  };

  const onSubmitResetPassword = async (values: z.infer<typeof passwordResetSchema>) => {
    setIsResetSubmitting(true);
    setAuthError(null);
    
    try {
      console.log("Încercare de resetare parolă pentru email:", values.email);
      await resetPassword(values.email);
      console.log("Email de resetare trimis cu succes");
      toast.success("Email de resetare trimis. Verificați căsuța de email.", {
        duration: 5000,
      });
      form.reset();
    } catch (error: any) {
      console.error("Eroare la resetarea parolei:", error);
      
      let errorMessage = "A apărut o eroare la trimiterea emailului de resetare";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "Nu există niciun cont asociat acestui email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Adresa de email nu este validă";
      } else if (error.code?.includes("api-key-not-valid")) {
        errorMessage = "Cheie API Firebase invalidă. Vă rugăm să verificați configurația Firebase.";
      } else {
        errorMessage = `Eroare neașteptată: ${error.message || error.code || "Necunoscut"}`;
      }
      
      toast.error(errorMessage);
      setAuthError(errorMessage);
    } finally {
      setIsResetSubmitting(false);
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
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Eroare</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          {DEMO_MODE && (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <Info className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Mod Demo Activ</AlertTitle>
              <AlertDescription className="text-sm text-green-700">
                <p>Credențiale pre-completate pentru testare rapidă:</p>
                <p className="mt-1"><strong>Email:</strong> {DEMO_EMAIL}</p>
                <p><strong>Parolă:</strong> {DEMO_PASSWORD}</p>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
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
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Parolă
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            {!isSignup && (
              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    type="button" 
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ai uitat parola?
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Resetare parolă</DialogTitle>
                    <DialogDescription>
                      Introduceți adresa de email pentru a primi un link de resetare a parolei.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitResetPassword)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="exemplu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" type="button">Anulează</Button>
                        </DialogClose>
                        <Button 
                          type="submit" 
                          disabled={isResetSubmitting}
                        >
                          {isResetSubmitting ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Se procesează...
                            </span>
                          ) : "Trimite email de resetare"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
            
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
                  <LogIn className="h-4 w-4" />
                  {isSignup ? "Creează cont" : "Autentificare"}
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Sau autentifică-te cu
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('facebook')}
                className="flex items-center justify-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-2 mx-auto"
              onClick={() => setIsSignup(!isSignup)}
              type="button"
              disabled={isSubmitting}
            >
              <User className="h-4 w-4" />
              {isSignup ? "Ai deja cont? Autentifică-te" : "Nu ai cont? Creează unul"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
