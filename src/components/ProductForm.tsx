
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

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: { 
    cod: string;
    denumire: string;
    um: string;
    pret: number;
    cantitate?: number;
  }) => void;
  categoryName: string | null;
  subcategoryName: string | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categoryName, 
  subcategoryName 
}) => {
  const [product, setProduct] = useState({
    cod: '',
    denumire: '',
    um: 'buc',
    pret: 0,
    cantitate: 1
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'pret' || name === 'cantitate' ? Number(value) : value
    }));
  };
  
  const handleSave = () => {
    if (product.cod.trim() && product.denumire.trim() && product.pret > 0) {
      onSave(product);
      setProduct({
        cod: '',
        denumire: '',
        um: 'buc',
        pret: 0,
        cantitate: 1
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Adaugă produs în {subcategoryName} ({categoryName})
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-cod" className="text-right">
              Cod
            </Label>
            <Input
              id="product-cod"
              name="cod"
              value={product.cod}
              onChange={handleChange}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-denumire" className="text-right">
              Denumire
            </Label>
            <Input
              id="product-denumire"
              name="denumire"
              value={product.denumire}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-um" className="text-right">
              UM
            </Label>
            <Input
              id="product-um"
              name="um"
              value={product.um}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-pret" className="text-right">
              Preț (RON)
            </Label>
            <Input
              id="product-pret"
              name="pret"
              type="number"
              min="0"
              step="0.01"
              value={product.pret}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={!product.cod.trim() || !product.denumire.trim() || product.pret <= 0}
          >
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
