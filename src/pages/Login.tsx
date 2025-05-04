
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/lib/firebase';
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      setAuthError("Vă rugăm să introduceți email și parolă");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Încercare de autentificare cu:", email);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Autentificare reușită!");
      navigate("/admin");
    } catch (error: any) {
      console.error("Eroare autentificare:", error);
      let errorMessage = "Eroare la autentificare";
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Email sau parolă greșită";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Credențiale invalide. Verificați emailul și parola.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Problemă de conexiune la rețea. Verificați conexiunea internet.";
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
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Cont creat cu succes!");
      navigate("/admin");
    } catch (error: any) {
      console.error("Eroare înregistrare:", error);
      let errorMessage = "Eroare la crearea contului";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Există deja un cont cu acest email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Adresa de email este invalidă";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Parola este prea slabă";
      } else {
        errorMessage = `Eroare: ${error.message || error.code || "Necunoscut"}`;
      }
      
      setAuthError(errorMessage);
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
            Autentificare / Înregistrare
          </CardTitle>
        </CardHeader>
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
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
