
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface QuoteItemEditorProps {
  isOpen: boolean;
  onClose: () => void;
  quoteItem: any; // Using any for simplicity, should be updated to match your schema
  onSave: (itemId: string, updates: any) => void;
}

const QuoteItemEditor: React.FC<QuoteItemEditorProps> = ({ 
  isOpen, 
  onClose, 
  quoteItem, 
  onSave 
}) => {
  const [item, setItem] = useState(() => ({
    ...quoteItem,
    pricePerUnit: quoteItem?.pricePerUnit || 0,
    quantity: quoteItem?.quantity || 1
  }));
  
  if (!quoteItem) {
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: ['pricePerUnit', 'quantity'].includes(name) ? Number(value) : value,
      total: name === 'pricePerUnit' ? Number(value) * item.quantity : 
             name === 'quantity' ? item.pricePerUnit * Number(value) : 
             item.total
    }));
  };
  
  const handleSave = () => {
    onSave(quoteItem.id, {
      pricePerUnit: item.pricePerUnit,
      quantity: item.quantity,
      total: item.pricePerUnit * item.quantity
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editează produs în ofertă</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label className="font-semibold">Produs:</Label>
            <p className="text-sm">{quoteItem.productDetails?.denumire || 'Produs manual'}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-price" className="text-right">
              Preț unitar
            </Label>
            <Input
              id="item-price"
              name="pricePerUnit"
              type="number"
              min="0"
              step="0.01"
              value={item.pricePerUnit}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-quantity" className="text-right">
              Cantitate
            </Label>
            <Input
              id="item-quantity"
              name="quantity"
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Total:</Label>
            <div className="col-span-3 font-semibold">
              {(item.pricePerUnit * item.quantity).toFixed(2)} RON
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={item.pricePerUnit <= 0 || item.quantity < 1}
          >
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteItemEditor;
