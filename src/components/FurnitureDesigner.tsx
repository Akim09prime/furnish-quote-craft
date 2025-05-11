
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FurnitureDesign } from './FurnitureSetManager';
import AccessorySelector, { Accessory } from './AccessorySelector';

interface FurnitureDesignerProps {
  isOpen: boolean;
  onClose: () => void;
  design?: FurnitureDesign | null;
  onSave: (design: FurnitureDesign) => void;
}

const DEFAULT_DESIGN: FurnitureDesign = {
  id: '',
  name: '',
  type: 'corp', // Default type
  width: 60,
  height: 70,
  depth: 50,
  material: 'PAL',
  hasDoors: false,
  hasDrawers: false,
  doorMaterial: '',
  doorColor: '',
  accessories: [],
};

const FURNITURE_TYPES = [
  { value: 'corp', label: 'Corp mobilier' },
  { value: 'corp_colt', label: 'Corp colț' },
  { value: 'corp_suspendat', label: 'Corp suspendat' },
  { value: 'corp_sertar', label: 'Corp cu sertare' },
  { value: 'masa', label: 'Masă' },
  { value: 'dulap', label: 'Dulap' },
  { value: 'biblioteca', label: 'Bibliotecă' },
  { value: 'canapea', label: 'Canapea' },
  { value: 'scaun', label: 'Scaun' },
  { value: 'bucatarie', label: 'Mobilier bucătărie' },
  { value: 'pat', label: 'Pat' }
];

const MATERIAL_TYPES = [
  { value: 'PAL', label: 'PAL melaminat' },
  { value: 'MDF', label: 'MDF' },
  { value: 'Lemn', label: 'Lemn masiv' },
  { value: 'OSB', label: 'OSB' },
  { value: 'HPL', label: 'HPL (High Pressure Laminate)' },
  { value: 'Sticlă', label: 'Sticlă' }
];

const FurnitureDesigner: React.FC<FurnitureDesignerProps> = ({
  isOpen,
  onClose,
  design,
  onSave
}) => {
  const [currentDesign, setCurrentDesign] = useState<FurnitureDesign>({
    ...DEFAULT_DESIGN,
    id: Date.now().toString()
  });
  
  // Initialize design state when props change
  useEffect(() => {
    if (design) {
      setCurrentDesign({
        ...design
      });
    } else {
      // Create a new design with default values
      setCurrentDesign({
        ...DEFAULT_DESIGN,
        id: Date.now().toString()
      });
    }
  }, [design]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCurrentDesign(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              ['width', 'height', 'depth'].includes(name) ? Number(value) : 
              value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setCurrentDesign(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle accessory changes
  const handleAccessoriesChange = (accessories: Accessory[]) => {
    setCurrentDesign(prev => ({
      ...prev,
      accessories
    }));
  };

  // Handle save
  const handleSave = () => {
    // Validate design
    if (!currentDesign.name.trim()) {
      toast.error('Numele mobilierului este obligatoriu');
      return;
    }

    if (currentDesign.width <= 0 || currentDesign.height <= 0 || currentDesign.depth <= 0) {
      toast.error('Dimensiunile trebuie să fie mai mari decât 0');
      return;
    }

    onSave(currentDesign);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {design ? 'Editează' : 'Creează'} design mobilier
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Basic information */}
          <div className="space-y-2">
            <h3 className="font-medium">Informații de bază</h3>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="design-name" className="text-right">
                Nume
              </Label>
              <Input
                id="design-name"
                name="name"
                value={currentDesign.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: Dulap haine 2 uși"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Tip
              </Label>
              <div className="col-span-3">
                <Select 
                  value={currentDesign.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selectează tipul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipuri mobilier</SelectLabel>
                      {FURNITURE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Dimensions */}
          <div className="space-y-2">
            <h3 className="font-medium">Dimensiuni (cm)</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="design-width">
                  Lățime
                </Label>
                <Input
                  id="design-width"
                  name="width"
                  type="number"
                  min="0"
                  value={currentDesign.width}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="design-height">
                  Înălțime
                </Label>
                <Input
                  id="design-height"
                  name="height"
                  type="number"
                  min="0"
                  value={currentDesign.height}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="design-depth">
                  Adâncime
                </Label>
                <Input
                  id="design-depth"
                  name="depth"
                  type="number"
                  min="0"
                  value={currentDesign.depth}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Material */}
          <div className="space-y-2">
            <h3 className="font-medium">Material</h3>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Material
              </Label>
              <div className="col-span-3">
                <Select 
                  value={currentDesign.material} 
                  onValueChange={(value) => handleSelectChange('material', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selectează materialul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipuri materiale</SelectLabel>
                      {MATERIAL_TYPES.map(material => (
                        <SelectItem key={material.value} value={material.value}>
                          {material.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="design-color" className="text-right">
                Culoare
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="design-color"
                  name="color"
                  type="color"
                  value={currentDesign.color || '#D4B48C'}
                  onChange={handleChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  name="color"
                  value={currentDesign.color || ''}
                  onChange={handleChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Features */}
          <div className="space-y-2">
            <h3 className="font-medium">Caracteristici</h3>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="has-doors" 
                name="hasDoors"
                checked={currentDesign.hasDoors}
                onCheckedChange={(checked) => {
                  setCurrentDesign(prev => ({
                    ...prev,
                    hasDoors: checked === true
                  }));
                }}
              />
              <Label htmlFor="has-doors">Uși</Label>
            </div>
            
            {currentDesign.hasDoors && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="door-material" className="text-right">
                    Material uși
                  </Label>
                  <Input
                    id="door-material"
                    name="doorMaterial"
                    value={currentDesign.doorMaterial || ''}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="Ex: MDF"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="door-color" className="text-right">
                    Culoare uși
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="door-color"
                      name="doorColor"
                      type="color"
                      value={currentDesign.doorColor || '#D4B48C'}
                      onChange={handleChange}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      name="doorColor"
                      value={currentDesign.doorColor || ''}
                      onChange={handleChange}
                      className="flex-1"
                      placeholder="Ex: Alb lucios"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="flex items-center gap-2 pt-2">
              <Checkbox 
                id="has-drawers" 
                name="hasDrawers"
                checked={currentDesign.hasDrawers}
                onCheckedChange={(checked) => {
                  setCurrentDesign(prev => ({
                    ...prev,
                    hasDrawers: checked === true
                  }));
                }}
              />
              <Label htmlFor="has-drawers">Sertare</Label>
            </div>
          </div>
          
          <Separator />
          
          {/* Accessories */}
          <div className="space-y-2">
            <h3 className="font-medium">Accesorii</h3>
            <AccessorySelector
              accessories={currentDesign.accessories || []}
              onAccessoriesChange={handleAccessoriesChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FurnitureDesigner;
