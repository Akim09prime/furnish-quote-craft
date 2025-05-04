
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Save, KeyRound, Check, AlertTriangle } from 'lucide-react';

const AISettingsTab: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isKeySet, setIsKeySet] = useState<boolean>(false);
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai-api-key');
    if (savedKey) {
      setApiKey("•".repeat(20)); // Show placeholder dots instead of actual key
      setIsKeySet(true);
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (!apiKey || apiKey.trim() === "" || apiKey === "•".repeat(20)) {
      toast.error("Vă rugăm să introduceți o cheie API validă");
      return;
    }
    
    // Verificăm formatul cheii OpenAI (începe cu "sk-")
    if (!apiKey.trim().startsWith('sk-')) {
      toast.warning("Cheia API nu pare să fie în format OpenAI (ar trebui să înceapă cu 'sk-')");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Stocăm cheia în localStorage
      localStorage.setItem('openai-api-key', apiKey.trim());
      
      setTimeout(() => {
        setIsSaving(false);
        setIsKeySet(true);
        setApiKey("•".repeat(20)); // Înlocuim cu puncte pentru securitate
        toast.success("Cheia API a fost salvată cu succes", {
          description: "Acum puteți utiliza funcționalitatea de Asistent AI"
        });
      }, 500);
    } catch (error) {
      console.error("Error saving API key:", error);
      setIsSaving(false);
      toast.error("A apărut o eroare la salvarea cheii API");
    }
  };
  
  const handleClearApiKey = () => {
    localStorage.removeItem('openai-api-key');
    setApiKey("");
    setIsKeySet(false);
    toast.info("Cheia API a fost ștearsă");
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            <KeyRound className="inline-block mr-2 h-5 w-5" />
            Setări API pentru Asistentul AI
          </CardTitle>
          <CardDescription>
            Adăugați cheia dvs. OpenAI API pentru a activa funcționalitatea Asistentului AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <p className="text-blue-700 text-sm flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>
                Pentru a utiliza asistentul AI, aveți nevoie de o cheie API de la OpenAI. Cheia va fi stocată 
                doar în browserul dvs. și nu va fi transmisă către alte servicii în afară de OpenAI.
                <br /><br />
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-700 underline"
                >
                  Obțineți o cheie API de la OpenAI aici
                </a>
              </span>
            </p>
          </div>
          
          <div>
            <Label htmlFor="api-key" className="flex gap-2 items-center mb-2">
              <Lock className="h-4 w-4" /> 
              Cheia API OpenAI
            </Label>
            <div className="flex gap-3">
              <Input
                id="api-key"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              {isKeySet ? (
                <Button 
                  variant="destructive" 
                  onClick={handleClearApiKey}
                >
                  Șterge cheia
                </Button>
              ) : null}
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              onClick={handleSaveApiKey} 
              disabled={isSaving || !apiKey || apiKey.trim() === ""}
              className="flex items-center gap-2"
            >
              {isSaving ? 
                "Se salvează..." : 
                isKeySet ? (
                  <>
                    <Check className="h-4 w-4" />
                    Actualizează cheia API
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvează cheia API
                  </>
                )
              }
            </Button>
          </div>
          
          {isKeySet && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-700 text-sm flex items-center">
                <Check className="h-5 w-5 mr-2" />
                Cheia API este configurată. Puteți accesa Asistentul AI din tab-ul dedicat.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettingsTab;
