
import React, { useState, useEffect } from 'react';
import { Database, Accessory } from '@/lib/db';
import { useAppContext } from '@/lib/contexts/AppContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Save, Edit } from 'lucide-react';
import PageHeader from '@/lib/components/common/PageHeader';
import SaveButton from '@/lib/components/common/SaveButton';
import { Label } from '@/components/ui/label';

interface AccessoriesTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

interface AccessoryFormValues {
  id: string;
  name: string;
  type: string;
  price: number;
  unit: string;
  description: string;
}

const defaultAccessory: AccessoryFormValues = {
  id: '',
  name: '',
  type: 'default',
  price: 0,
  unit: 'buc',
  description: ''
};

const AccessoriesTab: React.FC<AccessoriesTabProps> = ({ database, onDatabaseUpdate }) => {
  const { createBackup } = useAppContext();
  const [accessories, setAccessories] = useState<AccessoryFormValues[]>([]);
  const [newAccessory, setNewAccessory] = useState<AccessoryFormValues>({...defaultAccessory});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // Load accessories from database
    if (database.accessories) {
      setAccessories(database.accessories);
    } else {
      setAccessories([]);
    }
  }, [database]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewAccessory(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleAddAccessory = () => {
    if (!newAccessory.name) {
      toast.error("Introduceți numele accesoriului");
      return;
    }

    const accessoryToAdd: AccessoryFormValues = {
      ...newAccessory,
      id: editingId || `acc-${Date.now()}`
    };

    let updatedAccessories: AccessoryFormValues[];

    if (editingId) {
      // Update existing accessory
      updatedAccessories = accessories.map(acc => 
        acc.id === editingId ? accessoryToAdd : acc
      );
      toast.success(`Accesoriul "${accessoryToAdd.name}" a fost actualizat`);
    } else {
      // Add new accessory
      updatedAccessories = [...accessories, accessoryToAdd];
      toast.success(`Accesoriul "${accessoryToAdd.name}" a fost adăugat`);
    }

    setAccessories(updatedAccessories);
    setNewAccessory({...defaultAccessory});
    setEditingId(null);
  };

  const handleEdit = (accessory: AccessoryFormValues) => {
    setNewAccessory(accessory);
    setEditingId(accessory.id);
  };

  const handleDelete = (id: string) => {
    const updatedAccessories = accessories.filter(acc => acc.id !== id);
    setAccessories(updatedAccessories);
    
    if (editingId === id) {
      setNewAccessory({...defaultAccessory});
      setEditingId(null);
    }
    
    toast.success("Accesoriul a fost șters");
  };

  const handleSave = () => {
    // Create updated database object with new accessories
    const updatedDatabase = {
      ...database,
      accessories: accessories
    };

    // Update database
    onDatabaseUpdate(updatedDatabase);
    createBackup();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrare Accesorii"
        description="Adăugați și gestionați accesorii pentru mobilier (balamale, mânere, glisiere etc.)"
      >
        <SaveButton 
          onClick={handleSave} 
          tooltip="Salvează toate modificările făcute la accesorii"
          label="Salvează modificările"
        />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add/Edit Accessory Form */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Editare Accesoriu" : "Adăugare Accesoriu Nou"}
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nume Accesoriu</Label>
              <Input
                id="name"
                name="name"
                value={newAccessory.name}
                onChange={handleInputChange}
                placeholder="Ex: Balama hidraulică"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Tip Accesoriu</Label>
              <Input
                id="type"
                name="type"
                value={newAccessory.type}
                onChange={handleInputChange}
                placeholder="Ex: balama, mâner, glisieră"
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preț</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newAccessory.price}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="unit">Unitate</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={newAccessory.unit}
                  onChange={handleInputChange}
                  placeholder="buc, set, m, etc"
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Descriere</Label>
              <Input
                id="description"
                name="description"
                value={newAccessory.description}
                onChange={handleInputChange}
                placeholder="Descriere scurtă a accesoriului"
                className="w-full"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              {editingId && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewAccessory({...defaultAccessory});
                    setEditingId(null);
                  }}
                >
                  Anulează
                </Button>
              )}
              
              <Button 
                onClick={handleAddAccessory}
                className="flex items-center gap-2"
              >
                {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? "Actualizează" : "Adaugă Accesoriu"}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Accessories List */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Accesorii Existente</h3>
          
          {accessories.length === 0 ? (
            <p className="text-muted-foreground italic">Nu există accesorii definite</p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {accessories.map((accessory) => (
                <Card key={accessory.id} className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{accessory.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Tip: {accessory.type}</p>
                        <p>Preț: {accessory.price} RON / {accessory.unit}</p>
                        {accessory.description && <p>{accessory.description}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleEdit(accessory)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => handleDelete(accessory.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AccessoriesTab;
