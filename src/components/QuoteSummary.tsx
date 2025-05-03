
import React, { useState } from 'react';
import { Quote } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import QuoteDetailsDrawer from './QuoteDetailsDrawer';
import { Eye } from 'lucide-react';

interface QuoteSummaryProps {
  quote: Quote;
  onUpdateLabor: (percentage: number) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ 
  quote, 
  onUpdateLabor,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const [laborPct, setLaborPct] = useState<number>(quote.laborPercentage);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  return (
    <>
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

              <div className="mt-6 print:hidden space-y-2">
                <Button 
                  onClick={() => setIsDetailsOpen(true)}
                  className="w-full mb-2"
                  variant="outline"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Vezi Oferta Finală
                </Button>
                <Button onClick={handlePrint} className="w-full">
                  Printează Oferta
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <QuoteDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        quote={quote}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
      />
    </>
  );
};

export default QuoteSummary;
