
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
import { Material } from "@/lib/db";

interface MaterialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: Material) => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ isOpen, onClose, onSave }) => {
  const [material, setMaterial] = useState<Material>({
    id: Date.now().toString(),
    name: '',
    type: 'pal',
    thickness: 18,
    price: 0,
    color: '#D4B48C'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaterial(prev => ({
      ...prev,
      [name]: ['thickness', 'price'].includes(name) ? Number(value) : value
    }));
  };
  
  const handleSave = () => {
    if (material.name.trim() && material.price > 0) {
      onSave({
        ...material,
        id: Date.now().toString()
      });
      setMaterial({
        id: Date.now().toString(),
        name: '',
        type: 'pal',
        thickness: 18,
        price: 0,
        color: '#D4B48C'
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă material</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material-name" className="text-right">
              Nume
            </Label>
            <Input
              id="material-name"
              name="name"
              value={material.name}
              onChange={handleChange}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material-type" className="text-right">
              Tip
            </Label>
            <Input
              id="material-type"
              name="type"
              value={material.type}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material-thickness" className="text-right">
              Grosime (mm)
            </Label>
            <Input
              id="material-thickness"
              name="thickness"
              type="number"
              min="0"
              value={material.thickness}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material-price" className="text-right">
              Preț (RON/m²)
            </Label>
            <Input
              id="material-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={material.price}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material-color" className="text-right">
              Culoare
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="material-color"
                name="color"
                type="color"
                value={material.color}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <Input
                name="color"
                value={material.color}
                onChange={handleChange}
                className="flex-1"
              />
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
            disabled={!material.name.trim() || material.price <= 0}
          >
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialForm;
