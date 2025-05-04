
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { subscribeToAuthState } from '@/services/AuthService';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { auth, validateFirebaseCredentials } from '@/lib/firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firebaseError, setFirebaseError] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  // Verificăm dacă Firebase este inițializat corect și cheia API este validă
  useEffect(() => {
    const checkFirebaseSetup = async () => {
      if (!auth) {
        console.error("LoginPage: Firebase Auth nu a fost inițializat corect");
        setFirebaseError(true);
        return;
      }
      
      // Verifică validitatea cheii API
      const isValid = await validateFirebaseCredentials();
      if (!isValid) {
        console.error("LoginPage: Cheia API Firebase este invalidă");
        setFirebaseError(true);
      }
    };
    
    checkFirebaseSetup();
  }, []);

  // Verificăm dacă utilizatorul este deja autentificat
  useEffect(() => {
    if (firebaseError) return;
    
    console.log("LoginPage: Verificare stare autentificare...");
    
    try {
      const unsubscribe = subscribeToAuthState(
        (user) => {
          console.log("LoginPage: Stare autentificare:", user ? "Autentificat" : "Neautentificat");
          if (user) {
            console.log("LoginPage: Utilizator deja autentificat, redirecționare către", from);
            toast.success("Sunteți autentificat");
            navigate(from, { replace: true });
          }
        },
        (error) => {
          console.error("LoginPage: Eroare la verificarea autentificării:", error);
          setFirebaseError(true);
        }
      );
      
      return () => {
        console.log("LoginPage: Curățare ascultător");
        unsubscribe();
      };
    } catch (error) {
      console.error("LoginPage: Eroare la inițializarea verificării autentificării:", error);
      setFirebaseError(true);
      return () => {};
    }
  }, [navigate, from, firebaseError]);

  const handleAuthSuccess = () => {
    toast.success("Autentificare reușită!");
    navigate(from);
  };

  // Show Firebase setup instructions if we detect Firebase initialization errors
  if (firebaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Eroare de configurare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Firebase nu este configurat corect. Pentru a continua, este necesară configurarea Firebase.</p>
            <div className="flex justify-center">
              <Link to="/firebase-setup">
                <Button>Vezi instrucțiuni de configurare</Button>
              </Link>
            </div>
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
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Autentificare</TabsTrigger>
              <TabsTrigger value="register">Înregistrare</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSuccess={handleAuthSuccess}
              />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSuccess={handleAuthSuccess}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
