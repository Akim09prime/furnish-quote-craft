
import React, { useState } from 'react';
import { Quote, QuoteItem as QuoteItemType } from '@/lib/db';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter 
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface QuoteDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const QuoteDetailsDrawer: React.FC<QuoteDetailsDrawerProps> = ({ 
  isOpen, 
  onClose, 
  quote, 
  onUpdateQuantity, 
  onRemoveItem 
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<number>(1);
  
  const startEditing = (item: QuoteItemType) => {
    setEditingItemId(item.id);
    setEditingQuantity(item.quantity);
  };
  
  const cancelEditing = () => {
    setEditingItemId(null);
  };
  
  const saveQuantity = (itemId: string) => {
    if (editingQuantity > 0) {
      onUpdateQuantity(itemId, editingQuantity);
      setEditingItemId(null);
      toast.success("Cantitatea a fost actualizată");
    } else {
      toast.error("Cantitatea trebuie să fie mai mare decât zero");
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setEditingQuantity(value);
    }
  };
  
  const handleRemoveItem = (itemId: string) => {
    onRemoveItem(itemId);
    toast.success("Produsul a fost eliminat din ofertă");
  };
  
  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl text-center">Ofertă Detaliată</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 overflow-y-auto max-h-[calc(90vh-160px)]">
          {quote.items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cod</TableHead>
                  <TableHead>Descriere</TableHead>
                  <TableHead className="text-right">Preț/buc</TableHead>
                  <TableHead className="text-right">Cantitate</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productDetails.cod}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.categoryName}</div>
                      <div className="text-sm text-gray-500">{item.subcategoryName}</div>
                      {item.productDetails.description && (
                        <div className="text-sm">{item.productDetails.description}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.pricePerUnit.toFixed(2)} RON</TableCell>
                    <TableCell className="text-right">
                      {editingItemId === item.id ? (
                        <Input
                          type="number"
                          min="1"
                          value={editingQuantity}
                          onChange={handleQuantityChange}
                          className="w-16 h-8 text-right"
                        />
                      ) : (
                        item.quantity
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">{item.total.toFixed(2)} RON</TableCell>
                    <TableCell className="text-right">
                      {editingItemId === item.id ? (
                        <div className="flex justify-end space-x-1">
                          <Button size="icon" variant="ghost" onClick={() => saveQuantity(item.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-1">
                          <Button size="icon" variant="ghost" onClick={() => startEditing(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleRemoveItem(item.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Nu există produse în ofertă</p>
            </div>
          )}
          
          <div className="mt-6 space-y-2 border-t pt-4">
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
        
        <DrawerFooter className="flex flex-row justify-between gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Închide
          </Button>
          <Button onClick={handlePrint} className="flex-1">
            Printează
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default QuoteDetailsDrawer;
