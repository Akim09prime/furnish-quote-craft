
import React, { useState } from 'react';
import { Quote, updateQuoteMetadata } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import QuoteDetailsDrawer from './QuoteDetailsDrawer';
import QuoteMetadataDialog from './QuoteMetadataDialog';
import { Eye, Printer, Building } from 'lucide-react';

interface QuoteSummaryProps {
  quote: Quote;
  quoteType: 'client' | 'internal';
  onUpdateLabor: (percentage: number) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateMetadata: (metadata: { beneficiary: string; title: string }) => void;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ 
  quote, 
  quoteType,
  onUpdateLabor,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateMetadata
}) => {
  const [laborPct, setLaborPct] = useState<number>(quote.laborPercentage);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);

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
    // First check if metadata is filled in
    if (!quote.beneficiary || !quote.title) {
      setIsMetadataOpen(true);
      return;
    }
    window.print();
  };

  const handleViewDetails = () => {
    // First check if metadata is filled in
    if (!quote.beneficiary || !quote.title) {
      setIsMetadataOpen(true);
      return;
    }
    setIsDetailsOpen(true);
  };

  return (
    <>
      <Card className="bg-white shadow-md rounded-xl animate-fade-in print:shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Sumar Ofertă {quoteType === 'internal' ? '(Intern)' : '(Client)'}
          </CardTitle>
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
                  onClick={handleViewDetails}
                  className="w-full mb-2 transition-all duration-200 hover:scale-[1.02]"
                  variant="outline"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Vezi Oferta Finală
                </Button>
                <Button 
                  onClick={handlePrint} 
                  className="w-full transition-all duration-200 hover:scale-[1.02]"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Printează Oferta
                </Button>
              </div>
            </>
          )}
          
          {/* Print page styling for the quote - visible only in print mode */}
          <div className="hidden print:block">
            <div className="quote-print-header">
              <div className="logo-placeholder">
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <Building size={32} className="text-gray-400" />
                </div>
              </div>
              <div className="business-info text-right">
                <h3 className="font-bold text-lg">FurnishQuoteCraft SRL</h3>
                <p>office@furnishquote.com</p>
                <p>+40 722 123 456</p>
              </div>
            </div>
            
            <div className="quote-print-title">
              {quote.title || "Ofertă Mobilier"}
            </div>
            
            <div className="quote-client-info">
              <p><strong>Client:</strong> {quote.beneficiary || "Client"}</p>
              <p><strong>Data:</strong> {new Date().toLocaleDateString('ro-RO')}</p>
              <p><strong>Nr. Ofertă:</strong> {Math.floor(Math.random() * 10000)}</p>
            </div>
            
            <table className="quote-print-table">
              <thead>
                <tr>
                  <th>Nr.</th>
                  <th>Produs</th>
                  <th>Descriere</th>
                  <th>Cantitate</th>
                  {quoteType === 'internal' && <th>Preț/buc</th>}
                  {quoteType === 'internal' && <th>Total</th>}
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.categoryName}</td>
                    <td>
                      {Object.entries(item.productDetails)
                        .filter(([key]) => !['id', 'cod', 'pret'].includes(key) && typeof item.productDetails[key] !== 'object')
                        .map(([key, value]) => (
                          <div key={key}>
                            {quoteType === 'internal' ? (
                              <><span className="font-medium">{key}:</span> {String(value)}</>
                            ) : (
                              <>{String(value)}</>
                            )}
                          </div>
                        ))}
                    </td>
                    <td>{item.quantity}</td>
                    {quoteType === 'internal' && <td>{item.pricePerUnit.toFixed(2)} RON</td>}
                    {quoteType === 'internal' && <td>{item.total.toFixed(2)} RON</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="quote-print-summary">
              <table className="quote-print-summary-table">
                <tbody>
                  <tr>
                    <td className="font-medium">Subtotal:</td>
                    <td>{quote.subtotal.toFixed(2)} RON</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Manoperă ({quote.laborPercentage}%):</td>
                    <td>{quote.laborCost.toFixed(2)} RON</td>
                  </tr>
                  <tr className="font-bold">
                    <td>Total:</td>
                    <td>{quote.total.toFixed(2)} RON</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="quote-print-footer">
              <p>Vă mulțumim pentru încrederea acordată!</p>
              <p>www.furnishquotecraft.ro | office@furnishquotecraft.ro | +40 722 123 456</p>
              <p>Oferta este valabilă 30 de zile de la data emiterii.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <QuoteDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        quote={quote}
        quoteType={quoteType}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
      />

      <QuoteMetadataDialog
        isOpen={isMetadataOpen}
        onClose={() => setIsMetadataOpen(false)}
        onSave={onUpdateMetadata}
        defaultValues={{
          beneficiary: quote.beneficiary || "",
          title: quote.title || ""
        }}
      />
    </>
  );
};

export default QuoteSummary;
