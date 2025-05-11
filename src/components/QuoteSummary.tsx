import React, { useState, useEffect } from 'react';
import { Quote, updateQuoteMetadata, addFurnitureDesignToQuote, calculateDesignCost, addFurnitureSetToQuote } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import QuoteDetailsDrawer from './QuoteDetailsDrawer';
import QuoteMetadataDialog from './QuoteMetadataDialog';
import { Eye, Printer, Building, BookOpen, ChefHat, Home, Plus, Check } from 'lucide-react';
import { toast } from "sonner";
import FurnitureThumbnail from './FurnitureThumbnail';
import { FurnitureDesign } from './FurnitureSetManager';
import AccessorySelector, { Accessory } from './AccessorySelector';

interface QuoteSummaryProps {
  quote: Quote;
  quoteType: 'client' | 'internal';
  onUpdateLabor: (percentage: number) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateMetadata: (metadata: { beneficiary: string; title: string }) => void;
  onImportFurnitureDesign?: (design: FurnitureDesign, cost: number) => void;
  onImportFurnitureSet?: (setName: string, designs: FurnitureDesign[], costs: Map<string, number>) => void;
}

interface FurnitureSet {
  id: string;
  name: string;
  type: string;
  room: string;
  designs: string[]; // Array of furniture design IDs
  createdAt: number;
  updatedAt: number;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ 
  quote, 
  quoteType,
  onUpdateLabor,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateMetadata,
  onImportFurnitureDesign,
  onImportFurnitureSet
}) => {
  const [laborPct, setLaborPct] = useState<number>(quote.laborPercentage);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [showDesignDetails, setShowDesignDetails] = useState<boolean>(false);
  
  // Calculate furniture costs based on saved designs in localStorage
  const [furnitureDesignCosts, setFurnitureDesignCosts] = useState<{
    totalMaterialCost: number;
    totalAccessoriesCost: number;
    designs: Array<{ 
      name: string; 
      cost: number; 
      type: string; 
      id: string; 
      description?: string;
      design: FurnitureDesign;
      accessories?: Accessory[];
    }>;
    sets: Array<{
      id: string; 
      name: string; 
      designs: Array<{ 
        name: string; 
        cost: number; 
        type: string; 
        id: string;
        description?: string;
        design: FurnitureDesign;
      }>; 
      totalCost: number
    }>;
  }>({
    totalMaterialCost: 0,
    totalAccessoriesCost: 0,
    designs: [],
    sets: []
  });
  
  // Selected design for details view
  const [selectedDesign, setSelectedDesign] = useState<FurnitureDesign | null>(null);
  
  // Load furniture designs from localStorage on component mount
  useEffect(() => {
    const loadFurnitureDesigns = () => {
      try {
        // Load designs
        const savedItems = localStorage.getItem('furnitureDesigns');
        if (!savedItems) return;
        
        const designs: FurnitureDesign[] = JSON.parse(savedItems);
        
        // Load sets
        const savedSets = localStorage.getItem('furnitureSets');
        const sets: FurnitureSet[] = savedSets ? JSON.parse(savedSets) : [];
        
        // Calculate costs for each design
        let totalMaterialCost = 0;
        let totalAccessoriesCost = 0;
        const designsWithCosts: {
          name: string;
          cost: number;
          type: string;
          id: string;
          description?: string;
          design: FurnitureDesign;
          accessories?: Accessory[];
        }[] = [];
        
        const designCostsMap = new Map<string, number>();
        
        const processCost = (design: FurnitureDesign) => {
          // Calculează costul folosind funcția din db.ts
          const cost = calculateDesignCost(design);
          
          // Calcul separat pentru cost materiale și accesorii
          let materialCost = cost;
          let accessoriesCost = 0;
          
          if (design.accessories && design.accessories.length > 0) {
            accessoriesCost = design.accessories.reduce((sum, acc) => sum + acc.price * acc.quantity, 0);
            materialCost = cost - accessoriesCost;
          }
          
          // Add to totals
          totalMaterialCost += materialCost;
          totalAccessoriesCost += accessoriesCost;
          
          // Create description
          const description = generateDescription(design);
          
          // Store cost in map for later use
          designCostsMap.set(design.id, cost);
          
          return {
            name: design.name,
            cost: cost,
            type: design.type,
            id: design.id,
            description,
            design: design,
            accessories: design.accessories
          };
        };
        
        // Process individual designs (not in sets)
        const designsNotInSets = designs.filter(d => !d.setId);
        designsNotInSets.forEach(design => {
          designsWithCosts.push(processCost(design));
        });
        
        // Process sets
        const setsWithCosts = sets.map(set => {
          const setDesigns = designs.filter(d => set.designs.includes(d.id));
          const designsInSet = setDesigns.map(processCost);
          const setTotalCost = designsInSet.reduce((sum, d) => sum + d.cost, 0);
          
          return {
            id: set.id,
            name: set.name,
            designs: designsInSet,
            totalCost: setTotalCost
          };
        });
        
        setFurnitureDesignCosts({
          totalMaterialCost,
          totalAccessoriesCost,
          designs: designsWithCosts,
          sets: setsWithCosts
        });
        
      } catch (e) {
        console.error('Failed to parse saved designs:', e);
      }
    };
    
    loadFurnitureDesigns();
  }, []);
  
  const generateDescription = (design: FurnitureDesign) => {
    const parts = [];
    
    parts.push(`${design.width}x${design.height}x${design.depth}cm`);
    
    if (design.material) {
      parts.push(design.material.toUpperCase());
    }
    
    if (design.hasDoors) {
      parts.push('cu uși');
    }
    
    if (design.hasDrawers) {
      parts.push('cu sertare');
    }
    
    return parts.join(', ');
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
  
  const handleImportDesign = (design: FurnitureDesign, cost: number) => {
    console.log('Importing design to quote:', design, 'with cost:', cost);
    if (onImportFurnitureDesign) {
      onImportFurnitureDesign(design, cost);
      toast.success(`Design "${design.name}" adăugat în ofertă`);
    } else {
      console.error('onImportFurnitureDesign callback is not provided to QuoteSummary');
      toast.error('Eroare la adăugarea designului în ofertă');
    }
  };
  
  const handleImportSet = (setId: string) => {
    const set = furnitureDesignCosts.sets.find(s => s.id === setId);
    if (!set || !onImportFurnitureSet) {
      toast.error("Set negăsit sau funcția de import lipsește");
      return;
    }
    
    // Create a cost map for the designs in the set
    const costsMap = new Map<string, number>();
    set.designs.forEach(d => {
      costsMap.set(d.id, d.cost);
    });
    
    // Get the actual design objects
    const designObjects = set.designs.map(d => d.design);
    
    // Import the set
    onImportFurnitureSet(set.name, designObjects, costsMap);
    toast.success(`Set "${set.name}" adăugat în ofertă`);
  };
  
  const handleShowDesignDetails = (design: FurnitureDesign) => {
    setSelectedDesign(design);
    setShowDesignDetails(true);
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
              
              {/* Furniture designs section */}
              {furnitureDesignCosts.designs.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50 space-y-3 print:hidden">
                  <h3 className="font-medium">Designuri de mobilier</h3>
                  
                  {/* Individual designs */}
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {furnitureDesignCosts.designs.map((design) => (
                      <Card 
                        key={design.id} 
                        className={`bg-white ${selectedDesignId === design.id ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setSelectedDesignId(design.id)}
                      >
                        <CardContent className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8">
                              <FurnitureThumbnail 
                                type={design.type} 
                                color={design.design.color || "#D4B48C"} 
                                size={18}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{design.name}</p>
                              <p className="text-xs text-gray-500">{design.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{design.cost.toFixed(2)} RON</p>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2"
                              onClick={() => handleShowDesignDetails(design.design)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImportDesign(design.design, design.cost);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Sets */}
                  {furnitureDesignCosts.sets.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <h4 className="text-sm font-medium">Seturi</h4>
                      {furnitureDesignCosts.sets.map((set) => (
                        <Card key={set.id} className="bg-white">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8">
                                  <FurnitureThumbnail 
                                    type={set.designs[0]?.type || "corp"} 
                                    color={set.designs[0]?.design.color || "#D4B48C"} 
                                    size={18}
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{set.name}</p>
                                  <p className="text-xs text-gray-500">{set.designs.length} componente</p>
                                </div>
                              </div>
                              <p className="font-medium">{set.totalCost.toFixed(2)} RON</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2"
                              onClick={() => handleImportSet(set.id)}
                            >
                              Importă în ofertă
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-sm space-y-1">
                    <p>Cost total materiale: {furnitureDesignCosts.totalMaterialCost.toFixed(2)} RON</p>
                    <p>Cost total accesorii: {furnitureDesignCosts.totalAccessoriesCost.toFixed(2)} RON</p>
                    <p className="font-semibold">Total: {(furnitureDesignCosts.totalMaterialCost + furnitureDesignCosts.totalAccessoriesCost).toFixed(2)} RON</p>
                  </div>
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
          
          {/* Design Details Dialog */}
          {selectedDesign && showDesignDetails && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
              <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Detalii Design: {selectedDesign.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setShowDesignDetails(false)}
                    >
                      <span className="sr-only">Close</span>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16">
                      <FurnitureThumbnail 
                        type={selectedDesign.type} 
                        color={selectedDesign.color || "#D4B48C"} 
                        size={32}
                        className="h-16 w-16" 
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedDesign.name}</h3>
                      <p className="text-sm text-gray-500">{selectedDesign.type}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Dimensiuni</p>
                      <p className="font-medium">{selectedDesign.width} × {selectedDesign.height} × {selectedDesign.depth} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Material</p>
                      <p className="font-medium">{selectedDesign.material}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Uși</p>
                      <p className="font-medium">{selectedDesign.hasDoors ? 'Da' : 'Nu'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sertare</p>
                      <p className="font-medium">{selectedDesign.hasDrawers ? 'Da' : 'Nu'}</p>
                    </div>
                    {selectedDesign.hasDoors && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Material Uși</p>
                          <p className="font-medium">{selectedDesign.doorMaterial || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Culoare Uși</p>
                          <p className="font-medium">{selectedDesign.doorColor || 'N/A'}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {selectedDesign.accessories && selectedDesign.accessories.length > 0 && (
                    <div>
                      <AccessorySelector 
                        accessories={selectedDesign.accessories || []}
                        onAccessoriesChange={() => {}}
                        readOnly={true}
                      />
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={() => {
                      const designCost = calculateDesignCost(selectedDesign);
                      handleImportDesign(selectedDesign, designCost);
                      setShowDesignDetails(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adaugă în ofertă
                  </Button>
                </CardContent>
              </Card>
            </div>
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
              <p>www.furnishquotecraft.ro | office@furnishquote.com | +40 722 123 456</p>
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
