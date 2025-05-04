
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, isFirebaseInitialized } from '@/lib/firebase';
import { Mail, Lock, UserPlus, LogIn, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate as useRouterNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Firebase is initialized
    if (!isFirebaseInitialized()) {
      toast.error("Firebase nu este configurat corect", {
        description: "Veți fi redirecționat către pagina de configurare Firebase.",
        duration: 5000
      });
      
      setTimeout(() => {
        navigate('/firebase-setup');
      }, 2000);
    }
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check Firebase initialization first
    if (!isFirebaseInitialized()) {
      setAuthError("Firebase nu este configurat corect. Mergeți la pagina de configurare Firebase.");
      toast.error("Eroare de configurare Firebase", {
        description: "Firebase nu este configurat corect. Mergeți la pagina de configurare Firebase."
      });
      setTimeout(() => navigate('/firebase-setup'), 2000);
      return;
    }
    
    setAuthError(null);
    setAuthSuccess(null);
    
    if (!email || !password) {
      setAuthError("Vă rugăm să introduceți email și parolă");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(`Încercare de autentificare pentru email: ${email}`);
      
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Autentificare reușită");
      
      setAuthSuccess("Autentificare reușită!");
      toast.success("Autentificare reușită!");
      
      // După autentificare reușită, permite accesul la paginile protejate
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error: any) {
      console.error("Eroare de autentificare:", error);
      
      let errorMessage = "A apărut o eroare la autentificare";
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Email sau parolă greșită";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Credențiale invalide. Verificați emailul și parola.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Problemă de conexiune la rețea. Verificați conexiunea internet.";
      } else if (error.code === "auth/api-key-not-valid") {
        errorMessage = "Configurație Firebase invalidă. Veți fi redirecționat către pagina de configurare.";
        console.error("Eroare configurare Firebase - Cheie API invalidă");
        setTimeout(() => navigate('/firebase-setup'), 2000);
      } else {
        errorMessage = `Eroare: ${error.message || error.code || "Necunoscut"}`;
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check Firebase initialization first
    if (!isFirebaseInitialized()) {
      setAuthError("Firebase nu este configurat corect. Mergeți la pagina de configurare Firebase.");
      toast.error("Eroare de configurare Firebase", {
        description: "Firebase nu este configurat corect. Mergeți la pagina de configurare Firebase."
      });
      setTimeout(() => navigate('/firebase-setup'), 2000);
      return;
    }
    
    setAuthError(null);
    setAuthSuccess(null);
    
    if (!email || !password) {
      setAuthError("Vă rugăm să introduceți email și parolă");
      return;
    }
    
    if (password.length < 6) {
      setAuthError("Parola trebuie să aibă cel puțin 6 caractere");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(`Încercare de creare cont pentru email: ${email}`);
      
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Cont creat cu succes");
      
      setAuthSuccess("Cont creat cu succes! Acum vă puteți autentifica.");
      toast.success("Cont creat cu succes!");
      
    } catch (error: any) {
      console.error("Eroare la crearea contului:", error);
      
      let errorMessage = "A apărut o eroare la crearea contului";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Există deja un cont cu acest email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Adresa de email este invalidă";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Parola este prea slabă";
      } else if (error.code === "auth/api-key-not-valid") {
        errorMessage = "Configurație Firebase invalidă. Veți fi redirecționat către pagina de configurare.";
        console.error("Eroare configurare Firebase - Cheie API invalidă", error);
        setTimeout(() => navigate('/firebase-setup'), 2000);
      } else {
        errorMessage = `Eroare: ${error.message || error.code || "Necunoscut"}`;
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If Firebase is not initialized, show a special error message
  if (!isFirebaseInitialized()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Configurație Firebase necesară
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Firebase nu este configurat corect. Trebuie să configurați Firebase pentru a putea utiliza aplicația.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => navigate('/firebase-setup')} 
              className="w-full mt-4"
            >
              Mergi la pagina de configurare Firebase
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Autentificare / Înregistrare
          </CardTitle>
        </CardHeader>
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          {authSuccess && (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <AlertDescription className="text-green-700">{authSuccess}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Autentificare</TabsTrigger>
              <TabsTrigger value="register">Înregistrare</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
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
                    disabled={isSubmitting}
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
                      <LogIn className="h-4 w-4" />
                      Autentificare
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
