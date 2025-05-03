
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Quote, QuoteItem as QuoteItemType } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface QuoteDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  quoteType: 'client' | 'internal';
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const QuoteDetailsDrawer: React.FC<QuoteDetailsDrawerProps> = ({
  isOpen,
  onClose,
  quote,
  quoteType,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  // Group items by category for the client view
  const groupedItems = React.useMemo(() => {
    if (quoteType === 'internal') return null;
    
    const grouped: Record<string, { count: number, items: QuoteItemType[] }> = {};
    
    quote.items.forEach(item => {
      const key = item.categoryName;
      if (!grouped[key]) {
        grouped[key] = { count: 0, items: [] };
      }
      
      grouped[key].count += item.quantity;
      grouped[key].items.push(item);
    });
    
    return grouped;
  }, [quote.items, quoteType]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {quoteType === 'internal' ? 'Detalii Ofertă (Intern)' : 'Ofertă pentru Client'}
          </SheetTitle>
          <SheetDescription>
            {quote.title} - {quote.beneficiary}
            <div className="text-right text-sm">
              Data: {new Date().toLocaleDateString('ro-RO')}
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          {quoteType === 'internal' ? (
            // Internal view with detailed prices and codes
            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Cod</th>
                    <th className="text-left py-2">Descriere</th>
                    <th className="text-right py-2">Preț/buc</th>
                    <th className="text-right py-2">Cant.</th>
                    <th className="text-right py-2">Total</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.productDetails.cod}</td>
                      <td className="py-2">
                        <div>{item.categoryName}</div>
                        <div className="text-xs text-gray-500">
                          {Object.entries(item.productDetails)
                            .filter(([key]) => !['id', 'cod', 'pret'].includes(key) && typeof item.productDetails[key] !== 'object')
                            .map(([key, value]) => (
                              <span key={key}>
                                {key}: {String(value)}{' '}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="py-2 text-right">{item.pricePerUnit.toFixed(2)} RON</td>
                      <td className="py-2 text-right">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-right inline-block"
                        />
                      </td>
                      <td className="py-2 text-right font-medium">{item.total.toFixed(2)} RON</td>
                      <td>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="border-t pt-4 space-y-2">
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
            </div>
          ) : (
            // Client view with grouped items by category without prices
            <div className="space-y-6">
              {groupedItems && Object.entries(groupedItems).map(([category, data]) => (
                <div key={category} className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-2">{category}</h3>
                  <ul className="space-y-2">
                    {data.items.map(item => {
                      // Create a description without price or code
                      const description = Object.entries(item.productDetails)
                        .filter(([key]) => !['id', 'cod', 'pret'].includes(key) && typeof item.productDetails[key] !== 'object' && item.productDetails[key])
                        .map(([key, value]) => `${String(value)}`)
                        .join(', ');

                      return (
                        <li key={item.id} className="flex justify-between">
                          <div>
                            {description || 'Produs'} {item.quantity > 1 ? `(${item.quantity} buc)` : ''}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{quote.total.toFixed(2)} RON</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button onClick={onClose} className="w-full">
            Închide
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default QuoteDetailsDrawer;
