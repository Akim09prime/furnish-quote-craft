
import React, { useState, useEffect, useRef } from 'react';
import { type Database as DBType, loadDatabase, saveDatabase, importDatabaseJSON } from '@/lib/db';
import Header from '@/components/Header';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Database = () => {
  const [database, setDatabase] = useState<DBType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const db = loadDatabase();
    setDatabase(db);
    setIsLoading(false);
  }, []);

  const handleFileUpload = (categoryName: string) => {
    const fileInput = fileInputRefs.current[categoryName];
    if (fileInput) {
      fileInput.click();
    }
  };

  const processFile = (categoryName: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const products = JSON.parse(content);
        
        if (!Array.isArray(products)) {
          toast.error("Formatul fișierului nu este valid. Trebuie să fie un array de produse.");
          return;
        }

        const updatedDb = { ...loadDatabase() };
        const categoryIndex = updatedDb.categories.findIndex(c => c.name === categoryName);
        
        if (categoryIndex === -1) {
          toast.error(`Categoria ${categoryName} nu există.`);
          return;
        }

        // Here you would process the products and add them to the appropriate subcategories
        // This is a simplified example
        let productsAdded = 0;
        
        products.forEach(product => {
          if (product.subcategory && product.cod && product.pret !== undefined) {
            const subcategoryIndex = updatedDb.categories[categoryIndex].subcategories.findIndex(
              s => s.name === product.subcategory
            );
            
            if (subcategoryIndex !== -1) {
              // Add product to subcategory
              const newProduct = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                cod: product.cod,
                pret: product.pret,
                ...product
              };
              
              delete newProduct.subcategory; // Remove subcategory field as it's not part of product model
              
              updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products.push(newProduct);
              productsAdded++;
            }
          }
        });
        
        if (productsAdded > 0) {
          saveDatabase(updatedDb);
          setDatabase(updatedDb);
          toast.success(`${productsAdded} produse adăugate în categoria ${categoryName}.`);
        } else {
          toast.warning("Niciun produs nu a fost adăugat. Verificați formatul fișierului.");
        }
      } catch (error) {
        toast.error(`Eroare la procesarea fișierului: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
      }
    };
    
    reader.readAsText(file);
  };

  const handleFileChange = (categoryName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(categoryName, file);
      // Reset file input
      event.target.value = '';
    }
  };

  if (isLoading || !database) {
    return <div className="h-screen flex items-center justify-center">Încărcare...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Baza de date</h1>
        
        <div className="space-y-8">
          {database.categories.map((category) => (
            <Card key={category.name} className="shadow-sm">
              <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                <div>
                  <input
                    type="file"
                    ref={(el) => fileInputRefs.current[category.name] = el}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={(e) => handleFileChange(category.name, e)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFileUpload(category.name)}
                  >
                    <Upload className="mr-2 h-4 w-4" /> 
                    Încarcă produse
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="multiple" className="w-full">
                  {category.subcategories.map((subcategory) => (
                    <AccordionItem value={`${category.name}-${subcategory.name}`} key={subcategory.name}>
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex justify-between w-full">
                          <span>{subcategory.name}</span>
                          <span className="text-gray-500 font-normal">
                            {subcategory.products.length} produse
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cod</TableHead>
                                <TableHead>Preț</TableHead>
                                {subcategory.fields.map(field => (
                                  <TableHead key={field.name}>{field.name}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {subcategory.products.map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell className="font-medium">{product.cod}</TableCell>
                                  <TableCell>{product.pret} RON</TableCell>
                                  {subcategory.fields.map(field => (
                                    <TableCell key={field.name}>
                                      {product[field.name] !== undefined ? 
                                        String(product[field.name]) : 
                                        '-'}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Database;
