
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BrainCircuit, Send, Trash, Loader2 } from "lucide-react";

const AIAssistantTab: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai-api-key');
    setApiKey(savedKey);
  }, []);
  
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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Using a cost-effective model
          messages: [
            {
              role: "system",
              content: "Ești un asistent specializat în administrarea și calcularea ofertelor pentru mobilier. " +
                "Poți oferi sugestii legate de baza de date, calcule și formule pentru dimensiuni, materiale și prețuri. " +
                "Răspunde în limba română, într-un mod clar și concis."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setResponse(data.choices[0].message.content);
      } else {
        throw new Error('Format de răspuns neașteptat de la OpenAI');
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      toast.error("A apărut o eroare la generarea răspunsului: " + (error instanceof Error ? error.message : String(error)));
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
          <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-[#1A73E8]" />
            Asistent AI
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
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Se procesează...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generează răspuns
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleClear}
              disabled={isLoading || (!prompt && !response)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Șterge
            </Button>
          </div>
          
          {response && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700">Răspunsul asistentului:</label>
              <div className="bg-gray-50 p-4 rounded-lg border mt-2">
                <p className="whitespace-pre-wrap text-gray-700">{response}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantTab;
