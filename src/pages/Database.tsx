
import React, { useState, useEffect } from 'react';
import { type Database as DBType, loadDatabase } from '@/lib/db';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Database = () => {
  const [database, setDatabase] = useState<DBType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const db = loadDatabase();
    setDatabase(db);
    setIsLoading(false);
  }, []);

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
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>{category.name}</CardTitle>
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
