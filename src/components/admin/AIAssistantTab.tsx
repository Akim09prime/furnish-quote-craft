
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AIAssistantProps {
  apiKey?: string;
}

const AIAssistantTab: React.FC<AIAssistantProps> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.warning("Introduceți o întrebare pentru asistentul AI");
      return;
    }
    
    if (!apiKey) {
      toast.error("Este necesară o cheie API pentru OpenAI. Adăugați-o în setări.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This is a placeholder for the actual OpenAI API call
      // In a real implementation, you'd make an API call to OpenAI
      setResponse("Aceasta este o implementare viitoare. Răspunsul AI va apărea aici după configurarea cheii API.");
      
      toast.info("Funcționalitatea AI este în dezvoltare");
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error("A apărut o eroare la generarea răspunsului");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClear = () => {
    setPrompt("");
    setResponse("");
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            🧠 Asistent AI
          </CardTitle>
          <CardDescription>
            Folosește asistentul AI pentru a primi ajutor cu baza de date, calcule, formule sau alte întrebări.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!apiKey && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700 text-sm">
                Acest feature necesită o cheie API pentru OpenAI. Adăugați o cheie API în setările aplicației.
                <br />
                Când cheia API va fi adăugată, veți putea folosi asistentul AI.
              </p>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-gray-700">Întrebarea ta:</label>
            <Textarea
              placeholder="Introduceți întrebarea sau cererea pentru asistentul AI..."
              className="min-h-[120px]"
              value={prompt}
              onChange={handlePromptChange}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !prompt.trim() || !apiKey}
              className="flex-1"
            >
              {isLoading ? "Se procesează..." : "Generează răspuns"}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleClear}
              disabled={isLoading || (!prompt && !response)}
            >
              Șterge
            </Button>
          </div>
          
          {response && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700">Răspunsul asistentului:</label>
              <div className="bg-gray-50 p-4 rounded-lg border mt-2">
                <p className="whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantTab;
