
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

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryName: string) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ isOpen, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('');
  
  const handleSave = () => {
    if (categoryName.trim()) {
      onSave(categoryName);
      setCategoryName('');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă categorie</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-name" className="text-right">
              Nume
            </Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button type="button" onClick={handleSave} disabled={!categoryName.trim()}>
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
