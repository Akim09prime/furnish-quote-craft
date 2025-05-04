
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FirebaseSetupInstructions = () => {
  const copyEnvTemplate = () => {
    const template = `VITE_FIREBASE_API_KEY=your-api-key-here`;
    navigator.clipboard.writeText(template)
      .then(() => toast.success("Șablon .env.local copiat în clipboard"))
      .catch(() => toast.error("Nu s-a putut copia în clipboard"));
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Instrucțiuni de configurare Firebase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-amber-500 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 font-medium">Configurație Firebase necesară</AlertTitle>
          <AlertDescription className="text-amber-700">
            Aplicația folosește în prezent o cheie API Firebase temporară sau de tip placeholder. 
            Pentru funcționalitate completă și securizată, trebuie să configurați propria cheie API Firebase.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pași pentru configurare:</h3>
          
          <div className="ml-4 space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium">1. Creați un proiect Firebase nou</h4>
              <p className="text-gray-700">
                Accesați <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 underline">consola Firebase</a> și creați un proiect nou.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Adăugați o aplicație web în proiect</h4>
              <p className="text-gray-700">În consola Firebase, faceți clic pe pictograma web ({"</>"}), apoi înregistrați aplicația web.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">3. Copiați configurația Firebase</h4>
              <p className="text-gray-700">După înregistrarea aplicației, veți primi un obiect de configurare ca acesta:</p>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
{`const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};`}
              </pre>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">4. Adăugați cheia API în variabila de mediu</h4>
              <p className="text-gray-700">
                Creați un fișier <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> în rădăcina proiectului 
                și adăugați cheia API:
              </p>
              <div className="flex items-center space-x-2">
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto flex-1">
                  VITE_FIREBASE_API_KEY=your-api-key-here
                </pre>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyEnvTemplate}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copiază</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">5. Activați metodele de autentificare</h4>
              <p className="text-gray-700">
                În consola Firebase, accesați <strong>Authentication {">"} Sign-in method</strong> și activați 
                Email/Password. Opțional, activați și metodele de autentificare socială (Google, Facebook).
              </p>
            </div>
          </div>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 font-medium">Notă importantă</AlertTitle>
          <AlertDescription className="text-blue-700">
            Pentru funcționalitate completă, va trebui să restartați aplicația după configurarea Firebase. 
            Asigurați-vă că fișierul <code className="bg-blue-100 px-1 py-0.5 rounded">.env.local</code> este 
            creat corect și conține cheia API validă.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default FirebaseSetupInstructions;
