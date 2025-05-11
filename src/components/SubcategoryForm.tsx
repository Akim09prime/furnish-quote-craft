
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

interface SubcategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subcategory: { name: string; adaos: number }) => void;
  categoryName: string | null;
}

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({ isOpen, onClose, onSave, categoryName }) => {
  const [subcategoryName, setSubcategoryName] = useState('');
  const [adaos, setAdaos] = useState(0);
  
  const handleSave = () => {
    if (subcategoryName.trim()) {
      onSave({
        name: subcategoryName,
        adaos: adaos
      });
      setSubcategoryName('');
      setAdaos(0);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă subcategorie {categoryName ? `în ${categoryName}` : ''}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subcategory-name" className="text-right">
              Nume
            </Label>
            <Input
              id="subcategory-name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subcategory-adaos" className="text-right">
              Adaos (%)
            </Label>
            <Input
              id="subcategory-adaos"
              type="number"
              min="0"
              value={adaos}
              onChange={(e) => setAdaos(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button type="button" onClick={handleSave} disabled={!subcategoryName.trim()}>
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryForm;
