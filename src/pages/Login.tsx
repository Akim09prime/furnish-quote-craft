
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subscribeToAuthState } from '@/services/AuthService';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import FirebaseSetupInstructions from '@/components/FirebaseSetupInstructions';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firebaseError, setFirebaseError] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  // Verificăm dacă utilizatorul este deja autentificat
  useEffect(() => {
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
  }, [navigate, from]);

  const handleAuthSuccess = () => {
    toast.success("Autentificare reușită!");
    navigate(from);
  };

  // Show Firebase setup instructions if we detect Firebase initialization errors
  if (firebaseError) {
    return <FirebaseSetupInstructions />;
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
