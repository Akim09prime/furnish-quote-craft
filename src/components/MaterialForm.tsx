
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
    length: 0,
    width: 0,
    pricePerSheet: 0,
    pricePerSquareMeter: 0,
    updatedAt: new Date().toISOString()
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaterial(prev => ({
      ...prev,
      [name]: ['thickness', 'pricePerSheet', 'pricePerSquareMeter', 'length', 'width'].includes(name) ? Number(value) : value
    }));
  };
  
  const handleSave = () => {
    if (material.name.trim() && material.pricePerSquareMeter > 0) {
      onSave({
        ...material,
        id: Date.now().toString(),
        updatedAt: new Date().toISOString()
      });
      setMaterial({
        id: Date.now().toString(),
        name: '',
        type: 'pal',
        thickness: 18,
        length: 0,
        width: 0,
        pricePerSheet: 0,
        pricePerSquareMeter: 0,
        updatedAt: new Date().toISOString()
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
            <Label htmlFor="material-length" className="text-right">
              Lungime (mm)
            </Label>
            <Input
              id="material-length"
              name="length"
              type="number"
              min="0"
              value={material.length}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material-width" className="text-right">
              Lățime (mm)
            </Label>
            <Input
              id="material-width"
              name="width"
              type="number"
              min="0"
              value={material.width}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material-price-sheet" className="text-right">
              Preț/coală (RON)
            </Label>
            <Input
              id="material-price-sheet"
              name="pricePerSheet"
              type="number"
              min="0"
              step="0.01"
              value={material.pricePerSheet}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material-price-sqm" className="text-right">
              Preț/m² (RON)
            </Label>
            <Input
              id="material-price-sqm"
              name="pricePerSquareMeter"
              type="number"
              min="0"
              step="0.01"
              value={material.pricePerSquareMeter}
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
            disabled={!material.name.trim() || material.pricePerSquareMeter <= 0}
          >
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialForm;
