
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Plus, Trash, Save, Edit } from "lucide-react";
import { toast } from "sonner";
import FurnitureThumbnail from "./FurnitureThumbnail";

export interface FurnitureDesign {
  id: string;
  presetId?: string;
  type: string;
  color: string;
  material: string;
  room: string;
  width: number;
  height: number;
  depth: number;
  name: string;
  accessories?: {
    name: string;
    price: number;
    quantity: number;
  }[];
  hasDrawers?: boolean;
  hasDoors?: boolean;
  doorMaterial?: string;
  doorColor?: string;
  setId?: string;
}

export interface FurnitureSet {
  id: string;
  name: string;
  type: string;
  room: string;
  designs: string[]; // Array of furniture design IDs
  createdAt: number;
  updatedAt: number;
}

interface FurnitureSetManagerProps {
  savedDesigns: FurnitureDesign[];
  onLoadDesign: (design: FurnitureDesign) => void;
  onDesignsUpdated: (designs: FurnitureDesign[]) => void;
}

const FurnitureSetManager: React.FC<FurnitureSetManagerProps> = ({
  savedDesigns,
  onLoadDesign,
  onDesignsUpdated
}) => {
  const [sets, setSets] = useState<FurnitureSet[]>(() => {
    const savedSets = localStorage.getItem('furnitureSets');
    return savedSets ? JSON.parse(savedSets) : [];
  });
  
  const [currentSet, setCurrentSet] = useState<FurnitureSet | null>(null);
  const [setName, setSetName] = useState<string>("");
  const [setType, setSetType] = useState<string>("bucatarie");
  
  // Save sets to localStorage
  const saveSets = (updatedSets: FurnitureSet[]) => {
    localStorage.setItem('furnitureSets', JSON.stringify(updatedSets));
    setSets(updatedSets);
  };
  
  // Create a new set
  const createSet = () => {
    if (!setName) {
      toast.error("Introduceți un nume pentru set");
      return;
    }
    
    const newSet: FurnitureSet = {
      id: Date.now().toString(),
      name: setName,
      type: setType,
      room: "living", // Default room
      designs: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const updatedSets = [...sets, newSet];
    saveSets(updatedSets);
    setCurrentSet(newSet);
    toast.success(`Set nou creat: ${setName}`);
    setSetName("");
  };
  
  // Add a design to the current set
  const addDesignToSet = (design: FurnitureDesign) => {
    if (!currentSet) {
      toast.error("Selectați sau creați un set mai întâi");
      return;
    }
    
    // Create a copy of the design with the setId
    const designWithSetId = {
      ...design,
      setId: currentSet.id
    };
    
    // Update the designs list
    const updatedDesigns = savedDesigns.map(d => 
      d.id === design.id ? designWithSetId : d
    );
    
    // Update the current set
    const updatedSet = {
      ...currentSet,
      designs: [...currentSet.designs, design.id],
      updatedAt: Date.now()
    };
    
    // Update sets in state and localStorage
    const updatedSets = sets.map(s => 
      s.id === currentSet.id ? updatedSet : s
    );
    
    saveSets(updatedSets);
    setCurrentSet(updatedSet);
    onDesignsUpdated(updatedDesigns);
    
    toast.success(`${design.name} adăugat în setul ${currentSet.name}`);
  };
  
  // Remove a design from the current set
  const removeDesignFromSet = (designId: string) => {
    if (!currentSet) return;
    
    // Update the current set
    const updatedSet = {
      ...currentSet,
      designs: currentSet.designs.filter(id => id !== designId),
      updatedAt: Date.now()
    };
    
    // Update the design to remove setId
    const updatedDesigns = savedDesigns.map(d => 
      d.id === designId ? { ...d, setId: undefined } : d
    );
    
    // Update sets in state and localStorage
    const updatedSets = sets.map(s => 
      s.id === currentSet.id ? updatedSet : s
    );
    
    saveSets(updatedSets);
    setCurrentSet(updatedSet);
    onDesignsUpdated(updatedDesigns);
    
    toast.success("Corp eliminat din set");
  };
  
  // Delete a set
  const deleteSet = (setId: string) => {
    // Remove setId from all designs in the set
    const setToDelete = sets.find(s => s.id === setId);
    if (!setToDelete) return;
    
    const updatedDesigns = savedDesigns.map(d => 
      setToDelete.designs.includes(d.id) ? { ...d, setId: undefined } : d
    );
    
    // Delete the set
    const updatedSets = sets.filter(s => s.id !== setId);
    saveSets(updatedSets);
    
    // If current set is deleted, clear it
    if (currentSet && currentSet.id === setId) {
      setCurrentSet(null);
    }
    
    onDesignsUpdated(updatedDesigns);
    toast.success("Set șters cu succes");
  };
  
  // Get designs in the current set
  const getDesignsInSet = () => {
    if (!currentSet) return [];
    return savedDesigns.filter(d => currentSet.designs.includes(d.id));
  };
  
  // Get designs not in any set
  const getDesignsNotInSets = () => {
    return savedDesigns.filter(d => !d.setId);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Seturi de Corpuri</h3>
      
      <div className="flex gap-2">
        <Input
          placeholder="Nume set nou"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
        />
        <Button onClick={createSet}>
          <Plus className="h-4 w-4 mr-1" />
          Creare
        </Button>
      </div>
      
      {/* List of sets */}
      <div className="mt-4 space-y-2">
        <Label>Seturi salvate</Label>
        {sets.length === 0 ? (
          <p className="text-sm text-gray-500">Nu există seturi salvate</p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {sets.map((set) => (
              <Card 
                key={set.id} 
                className={`cursor-pointer ${currentSet?.id === set.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setCurrentSet(set)}
              >
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{set.name}</p>
                    <p className="text-xs text-gray-500">{set.designs.length} corpuri</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSet(set.id);
                    }}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Current set details */}
      {currentSet && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{currentSet.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-medium">Corpuri în set</h4>
            {getDesignsInSet().length === 0 ? (
              <p className="text-sm text-gray-500">Nu există corpuri în acest set</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {getDesignsInSet().map((design) => (
                  <Card key={design.id}>
                    <CardContent className="p-3 flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <div className="h-8 w-8">
                          <FurnitureThumbnail 
                            type={design.type} 
                            color={design.color || "#D4B48C"} 
                            size={18} 
                          />
                        </div>
                        <div>
                          <p className="font-medium">{design.name}</p>
                          <p className="text-xs text-gray-500">
                            {design.width}x{design.height}x{design.depth} cm
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onLoadDesign(design)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeDesignFromSet(design.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Add designs to set */}
            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Adaugă corp în set
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adaugă corp în set</DialogTitle>
                    <DialogDescription>
                      Selectează corpul pe care dorești să-l adaugi în setul {currentSet.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[400px] overflow-y-auto">
                    {getDesignsNotInSets().length === 0 ? (
                      <p className="text-center py-4 text-gray-500">
                        Nu există corpuri disponibile
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {getDesignsNotInSets().map((design) => (
                          <Card key={design.id} className="cursor-pointer hover:bg-gray-50">
                            <CardContent className="p-3 flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <div className="h-8 w-8">
                                  <FurnitureThumbnail 
                                    type={design.type} 
                                    color={design.color || "#D4B48C"} 
                                    size={18} 
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{design.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {design.width}x{design.height}x{design.depth} cm
                                  </p>
                                </div>
                              </div>
                              <DialogClose asChild>
                                <Button 
                                  onClick={() => addDesignToSet(design)}
                                >
                                  Adaugă
                                </Button>
                              </DialogClose>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FurnitureSetManager;
