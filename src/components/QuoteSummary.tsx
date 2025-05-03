
import React, { useState } from 'react';
import { Quote, setLaborPercentage } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FileText } from "lucide-react";

interface QuoteSummaryProps {
  quote: Quote;
  onUpdateLabor: (percentage: number) => void;
  onAddManualPal?: (description: string, quantity: number, price: number) => void;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quote, onUpdateLabor, onAddManualPal }) => {
  const [laborPct, setLaborPct] = useState<number>(quote.laborPercentage);

  const handleLaborChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setLaborPct(value);
    }
  };

  const handleApplyLabor = () => {
    onUpdateLabor(laborPct);
  };

  const handlePrint = () => {
    window.print();
  };

  // Form for manual PAL entry
  const palForm = useForm({
    defaultValues: {
      description: "",
      quantity: 1,
      price: 0
    }
  });

  const submitPalForm = (data: { description: string; quantity: number; price: number }) => {
    if (onAddManualPal) {
      onAddManualPal(data.description, data.quantity, data.price);
      palForm.reset({
        description: "",
        quantity: 1,
        price: 0
      });
    }
  };

  return (
    <Card className="bg-white print:shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Sumar Ofertă</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quote.items.length === 0 ? (
          <p className="text-center py-4 text-gray-500">
            Nu există produse în ofertă
          </p>
        ) : (
          <>
            <div className="space-y-2 print:hidden">
              <Label htmlFor="labor">Procent Manoperă (%)</Label>
              <div className="flex gap-2">
                <Input
                  id="labor"
                  type="number"
                  min="0"
                  step="0.5"
                  value={laborPct}
                  onChange={handleLaborChange}
                  className="max-w-[100px]"
                />
                <Button onClick={handleApplyLabor}>Aplică</Button>
              </div>
            </div>

            <div className="border-t pt-4 mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal produse:</span>
                <span className="font-medium">{quote.subtotal.toFixed(2)} RON</span>
              </div>
              
              <div className="flex justify-between">
                <span>Manoperă ({quote.laborPercentage}%):</span>
                <span className="font-medium">{quote.laborCost.toFixed(2)} RON</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>{quote.total.toFixed(2)} RON</span>
              </div>
            </div>

            <div className="mt-6 print:hidden">
              <Button onClick={handlePrint} className="w-full">
                Printează Oferta
              </Button>
            </div>
          </>
        )}
        
        {/* Manual PAL entry form */}
        <div className="mt-6 pt-4 border-t print:hidden">
          <h3 className="text-lg font-medium mb-4">Adaugă PAL manual</h3>
          <Tabs defaultValue="direct">
            <TabsList className="mb-4">
              <TabsTrigger value="direct">PAL după model și cantitate</TabsTrigger>
              <TabsTrigger value="price">PAL după sumă totală</TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct">
              <Form {...palForm}>
                <form onSubmit={palForm.handleSubmit(submitPalForm)} className="space-y-4">
                  <FormField
                    control={palForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descriere / Model PAL</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: PAL Alb" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={palForm.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Număr foi</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              step="1" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={palForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preț / foaie (RON)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Adaugă la ofertă
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="price">
              <Form {...palForm}>
                <form onSubmit={palForm.handleSubmit((data) => {
                  // For total price, we set quantity to 1 and price to the total price
                  submitPalForm({...data, quantity: 1, price: parseFloat(data.price.toString())});
                })} className="space-y-4">
                  <FormField
                    control={palForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descriere PAL</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: PAL furnir" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={palForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suma totală (RON)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Adaugă sumă la ofertă
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteSummary;
