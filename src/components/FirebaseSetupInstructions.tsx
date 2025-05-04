
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, Copy, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FirebaseSetupInstructions = () => {
  const copyEnvTemplate = () => {
    const template = `VITE_API_KEY=your-api-key-here
VITE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_PROJECT_ID=your-project-id
VITE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_MESSAGING_SENDER_ID=your-sender-id
VITE_APP_ID=your-app-id
VITE_MEASUREMENT_ID=your-measurement-id`;
    navigator.clipboard.writeText(template)
      .then(() => toast.success("Șablon .env.local copiat în clipboard"))
      .catch(() => toast.error("Nu s-a putut copia în clipboard"));
  };
  
  const forceRefresh = () => {
    // Force a full page reload to ensure environment variables are reloaded
    window.location.reload();
    toast.info("Aplicația se reîncarcă pentru a actualiza configurația...");
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
              <h4 className="font-medium">4. Adăugați cheile API în fișierul .env.local</h4>
              <p className="text-gray-700">
                Creați un fișier <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> în rădăcina proiectului 
                și adăugați cheile API:
              </p>
              <div className="flex items-center space-x-2">
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto flex-1">
{`VITE_API_KEY=your-api-key-here
VITE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_PROJECT_ID=your-project-id
VITE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_MESSAGING_SENDER_ID=your-sender-id
VITE_APP_ID=your-app-id
VITE_MEASUREMENT_ID=your-measurement-id`}
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

            <div className="space-y-2">
              <h4 className="font-medium">6. Restart aplicația</h4>
              <p className="text-gray-700">
                După crearea fișierului <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code>, 
                trebuie să restartați aplicația pentru a încărca variabilele de mediu.
              </p>
              <Button 
                variant="secondary" 
                onClick={forceRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCcw className="h-4 w-4" />
                <span>Reîncarcă aplicația</span>
              </Button>
            </div>
          </div>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 font-medium">Notă importantă pentru dezvoltatori</AlertTitle>
          <AlertDescription className="text-blue-700">
            <p>Dacă după reîncărcarea paginii tot vedeți eroarea legată de cheia API:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Verificați dacă fișierul <code className="bg-blue-100 px-1 py-0.5 rounded">.env.local</code> există în directorul rădăcină al proiectului</li>
              <li>Asigurați-vă că numele variabilelor din fișier corespund exact cu cele folosite în cod</li>
              <li>Încercați un restart complet al serverului de dezvoltare</li>
              <li>Ștergeți cache-ul browserului (Ctrl+F5 sau Cmd+Shift+R)</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default FirebaseSetupInstructions;
