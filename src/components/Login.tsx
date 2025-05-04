
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFirebase } from "@/context/FirebaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Mail, Lock } from "lucide-react";

const Login = () => {
  const { auth } = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage({ type: "success", text: "Logare reușită!" });
      // Opțional: Redirect după logare
      // window.location.href = "/admin";
    } catch (error: any) {
      let errorMessage = "Eroare la autentificare";
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Email sau parolă greșită";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Credențiale invalide";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Problemă de conexiune la rețea";
      }
      
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">Autentificare Admin</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert 
            className={`mb-4 ${message.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required 
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
              disabled={isLoading}
              required 
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
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
      </CardContent>
    </Card>
  );
};

export default Login;
