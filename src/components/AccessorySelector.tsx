
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Plus, Trash, Save } from "lucide-react";
import { toast } from "sonner";

export interface Accessory {
  name: string;
  price: number;
  quantity: number;
}

interface AccessorySelectorProps {
  accessories: Accessory[];
  onAccessoriesChange: (accessories: Accessory[]) => void;
  readOnly?: boolean;
}

const AccessorySelector: React.FC<AccessorySelectorProps> = ({
  accessories,
  onAccessoriesChange,
  readOnly = false
}) => {
  const [newAccessory, setNewAccessory] = useState<Accessory>({
    name: '',
    price: 0,
    quantity: 1
  });
  
  const handleAddAccessory = () => {
    if (!newAccessory.name || newAccessory.price <= 0) {
      return;
    }
    
    const updatedAccessories = [...accessories, { ...newAccessory }];
    onAccessoriesChange(updatedAccessories);
    
    // Reset form
    setNewAccessory({
      name: '',
      price: 0,
      quantity: 1
    });
    
    toast.success(`Accesoriu "${newAccessory.name}" adăugat`);
  };
  
  const handleRemoveAccessory = (index: number) => {
    const updatedAccessories = accessories.filter((_, i) => i !== index);
    onAccessoriesChange(updatedAccessories);
    toast.success("Accesoriu eliminat");
  };
  
  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedAccessories = [...accessories];
    updatedAccessories[index] = {
      ...updatedAccessories[index],
      quantity
    };
    onAccessoriesChange(updatedAccessories);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Accesorii</h4>
      
      {accessories.length > 0 ? (
        <div className="space-y-2">
          {accessories.map((accessory, index) => (
            <Card key={index}>
              <CardContent className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{accessory.name}</p>
                  <p className="text-xs text-gray-500">{accessory.price} RON/buc</p>
                </div>
                {!readOnly && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleUpdateQuantity(index, accessory.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-6 text-center">{accessory.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleUpdateQuantity(index, accessory.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveAccessory(index)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
                
                {readOnly && (
                  <div className="flex items-center gap-1">
                    <span>{accessory.quantity} buc</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          <div className="pt-2">
            <p className="text-sm font-medium">
              Total accesorii: {accessories.reduce((sum, acc) => sum + acc.price * acc.quantity, 0).toFixed(2)} RON
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Nu există accesorii adăugate</p>
      )}
      
      {!readOnly && (
        <div className="pt-4 space-y-3">
          <div>
            <Label htmlFor="accessory-name">Nume accesoriu</Label>
            <Input
              id="accessory-name"
              value={newAccessory.name}
              onChange={(e) => setNewAccessory({...newAccessory, name: e.target.value})}
              placeholder="ex. Balama aplicare"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="accessory-price">Preț (RON)</Label>
              <Input
                id="accessory-price"
                type="number"
                min="0"
                step="0.01"
                value={newAccessory.price}
                onChange={(e) => setNewAccessory({...newAccessory, price: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div>
              <Label htmlFor="accessory-quantity">Cantitate</Label>
              <Input
                id="accessory-quantity"
                type="number"
                min="1"
                value={newAccessory.quantity}
                onChange={(e) => setNewAccessory({...newAccessory, quantity: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAddAccessory}
            disabled={!newAccessory.name || newAccessory.price <= 0}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adaugă accesoriu
          </Button>
        </div>
      )}
    </div>
  );
};

// Export both as default and named export for compatibility
export { AccessorySelector };
export default AccessorySelector;
