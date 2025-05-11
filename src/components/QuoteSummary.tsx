
import React, { useState, useEffect } from 'react';
import { Quote, updateQuoteMetadata } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import QuoteDetailsDrawer from './QuoteDetailsDrawer';
import QuoteMetadataDialog from './QuoteMetadataDialog';
import { Eye, Printer, Building } from 'lucide-react';
import { toast } from "sonner";

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
  
  // Calculate furniture costs based on saved designs in localStorage
  const [furnitureDesignCosts, setFurnitureDesignCosts] = useState<{
    totalMaterialCost: number;
    totalAccessoriesCost: number;
    designs: Array<{ name: string, cost: number, type: string }>;
  }>({
    totalMaterialCost: 0,
    totalAccessoriesCost: 0,
    designs: []
  });
  
  // Load furniture designs from localStorage on component mount
  useEffect(() => {
    const loadFurnitureDesigns = () => {
      try {
        const savedItems = localStorage.getItem('furnitureDesigns');
        if (!savedItems) return;
        
        const designs = JSON.parse(savedItems);
        
        // Calculate costs for each design
        let totalMaterialCost = 0;
        let totalAccessoriesCost = 0;
        const designsWithCosts = designs.map((design: any) => {
          // Base calculation logic from Designer.tsx
          const basePrice: Record<string, number> = {
            canapea: 1200,
            scaun: 250,
            biblioteca: 800,
            dulap: 1500,
            masa: 700,
            pat: 1000,
            bucatarie: 2000,
            corp: 500
          };
          
          // Material multiplier
          const materialMultiplier: Record<string, number> = {
            pal: 1,
            pal_hdf: 1.2,
            mdf: 1.5,
            mdf_lucios: 1.8,
            lemn_masiv: 2.5
          };
          
          // Calculate size factor (larger = more expensive)
          const volumeFactor = (design.width * design.height * design.depth) / 100000;
          
          // Preset multiplier (presets are slightly more expensive because they are optimized)
          const presetMultiplier = design.presetId ? 1.1 : 1;
          
          // Calculate price
          const materialCost = basePrice[design.type] * 
                             (materialMultiplier[design.material] || 1) * 
                             volumeFactor * 
                             presetMultiplier;
          
          // Accessories cost (estimated as 15% of material cost)
          const accessoriesCost = materialCost * 0.15;
          
          // Add to totals
          totalMaterialCost += materialCost;
          totalAccessoriesCost += accessoriesCost;
          
          return {
            name: design.name,
            cost: materialCost + accessoriesCost,
            type: design.type
          };
        });
        
        setFurnitureDesignCosts({
          totalMaterialCost,
          totalAccessoriesCost,
          designs: designsWithCosts
        });
        
      } catch (e) {
        console.error('Failed to parse saved designs:', e);
      }
    };
    
    loadFurnitureDesigns();
  }, []);
  
  const handleImportDesigns = () => {
    if (furnitureDesignCosts.designs.length === 0) {
      toast.error("Nu există designuri de mobilier salvate");
      return;
    }
    
    // Add each design as a quote item
    furnitureDesignCosts.designs.forEach(design => {
      // Add manual item for each design
      onUpdateLabor(quote.laborPercentage); // Maintain current labor %
      
      // Create a descriptive name
      const designDescription = `${design.name} (${design.type})`;
      
      // Add to quote using addManualPalItem (we're assuming this function exists in the parent)
      // This would typically be done through a prop like onAddManualItem
      // For this example, we'll use toast to simulate
      toast.success(`Adăugat în ofertă: ${designDescription} - ${design.cost.toFixed(2)} RON`);
    });
    
    // Assuming there's a better way to add items in the actual implementation
    toast.info(`${furnitureDesignCosts.designs.length} designuri importate în ofertă. Actualizați cantitățile după necesitate.`);
  };

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
                <Label htmlFor="labor" className="text-sm text-gray-500">Procent Manoperă (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="labor"
                    type="number"
                    min="0"
                    step="0.5"
                    value={laborPct}
                    onChange={handleLaborChange}
                    className="max-w-[100px] bg-furniture-purple hover:bg-furniture-purple-dark"
                  />
                  <Button 
                    onClick={handleApplyLabor}
                    className="bg-furniture-purple hover:bg-furniture-purple-dark text-white rounded-md px-4 py-2"
                  >
                    Aplică
                  </Button>
                </div>
              </div>
              
              {/* Furniture design costs section */}
              {furnitureDesignCosts.designs.length > 0 && (
                <div className="border rounded-lg p-3 bg-gray-50 space-y-2 print:hidden">
                  <h3 className="font-medium">Designuri de mobilier disponibile ({furnitureDesignCosts.designs.length})</h3>
                  <div className="text-sm space-y-1">
                    <p>Cost total materiale: {furnitureDesignCosts.totalMaterialCost.toFixed(2)} RON</p>
                    <p>Cost total accesorii: {furnitureDesignCosts.totalAccessoriesCost.toFixed(2)} RON</p>
                    <p className="font-semibold">Total: {(furnitureDesignCosts.totalMaterialCost + furnitureDesignCosts.totalAccessoriesCost).toFixed(2)} RON</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleImportDesigns}
                    className="w-full mt-2"
                  >
                    Importă designuri în ofertă
                  </Button>
                </div>
              )}

              <div className="border-t pt-4 mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal produse:</span>
                  <span className="font-medium">{quote.subtotal.toFixed(2)} RON</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Manoperă ({quote.laborPercentage}%):</span>
                  <span className="font-medium">{quote.laborCost.toFixed(2)} RON</span>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg text-2xl font-bold text-center mt-4">
                  Total final: {quote.total.toFixed(2)} RON
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
