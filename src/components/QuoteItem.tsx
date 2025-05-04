
import React, { useState } from 'react';
import { QuoteItem as QuoteItemType } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface QuoteItemProps {
  item: QuoteItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const QuoteItem: React.FC<QuoteItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const [editing, setEditing] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleSaveQuantity = () => {
    onUpdateQuantity(item.id, quantity);
    setEditing(false);
    toast.success("Cantitatea a fost actualizată", {
      description: `Produsul ${item.productDetails.cod} actualizat`,
    });
  };

  const handleCancelEdit = () => {
    setQuantity(item.quantity);
    setEditing(false);
  };

  const handleRemove = () => {
    onRemove(item.id);
    toast.success("Produsul a fost eliminat din ofertă", {
      description: `${item.productDetails.cod} eliminat`,
    });
  };

  // Placeholder image for the thumbnail
  const placeholderImage = "/placeholder.svg";

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex w-full">
          {/* Left column: Thumbnail */}
          <div className="w-1/6 mr-4">
            <img 
              src={placeholderImage} 
              alt={item.productDetails.cod} 
              className="object-cover rounded-md w-full h-16" 
            />
          </div>
          
          {/* Right column: Item details */}
          <div className="w-5/6">
            <h4 className="text-lg font-semibold">{item.productDetails.cod}</h4>
            <div className="text-sm text-gray-600">
              {item.categoryName} &gt; {item.subcategoryName}
            </div>
            
            {!editing && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  {item.quantity} x {item.pricePerUnit.toFixed(2)} RON
                </span>
                <span className="text-xl font-bold text-furniture-purple">
                  {item.total.toFixed(2)} RON
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 ml-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditing(!editing)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm space-y-1 mb-3">
        {Object.entries(item.productDetails)
          .filter(([key]) => !['id', 'cod', 'pret'].includes(key))
          .map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-500">{key}:</span>
              <span>{String(value)}</span>
            </div>
          ))}
      </div>

      {editing && (
        <div className="flex flex-wrap gap-2 items-end mt-3">
          <div className="space-y-1">
            <div className="text-sm text-gray-500">Cantitate</div>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 h-8"
            />
          </div>
          <Button 
            size="sm" 
            onClick={handleSaveQuantity}
            className="bg-furniture-purple hover:bg-furniture-purple-dark"
          >
            Salvează
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCancelEdit}
          >
            Anulează
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuoteItem;
