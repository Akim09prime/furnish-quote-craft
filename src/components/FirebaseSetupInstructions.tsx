
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

const FirebaseSetupInstructions = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Instrucțiuni de configurare Firebase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="warning" className="border-amber-500 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 font-medium">Configurație Firebase necesară</AlertTitle>
          <AlertDescription className="text-amber-700">
            Aplicația folosește în prezent o cheie API Firebase de tip placeholder. 
            Autentificarea și alte funcționalități Firebase nu vor funcționa până când nu configurați corect Firebase.
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
              <h4 className="font-medium">4. Înlocuiți configurația în proiect</h4>
              <p className="text-gray-700">
                Deschideți fișierul <code className="bg-gray-100 px-1 py-0.5 rounded">src/lib/firebase.ts</code> și 
                înlocuiți obiectul <code className="bg-gray-100 px-1 py-0.5 rounded">firebaseConfig</code> cu cel obținut 
                din consola Firebase.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">5. Activați metodele de autentificare</h4>
              <p className="text-gray-700">
                În consola Firebase, accesați <strong>Authentication {">"} Sign-in method</strong> și activați 
                Email/Password. Opțional, activați și metodele de autentificare socială (Google, Facebook).
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">6. Configurați baza de date și regulile de securitate</h4>
              <p className="text-gray-700">
                Accesați <strong>Firestore Database</strong> și <strong>Storage</strong> pentru a le configura 
                conform nevoilor aplicației. Folosiți regulile de securitate din fișierele <code>firestore.rules</code> 
                și <code>storage.rules</code>.
              </p>
            </div>
          </div>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 font-medium">Notă importantă</AlertTitle>
          <AlertDescription className="text-blue-700">
            Pentru instrucțiuni detaliate, consultați fișierul <code className="bg-blue-100 px-1 py-0.5 rounded">FIREBASE_README.md</code> din 
            rădăcina proiectului. Pentru suport suplimentar, consultați <a href="https://firebase.google.com/docs" 
            target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">documentația oficială Firebase</a>.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default FirebaseSetupInstructions;
