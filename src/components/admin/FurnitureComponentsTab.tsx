import React, { useState, useEffect } from 'react';
import { Database } from '@/lib/db';
import { useAppContext } from '@/lib/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/lib/components/common/PageHeader';
import SaveButton from '@/lib/components/common/SaveButton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FurnitureComponentsTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

interface FurnitureComponent {
  id: string;
  name: string;
  type: string;
  description?: string;
  materialId?: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  price: number;
  category: string;
  subcategory?: string;
}

const FurnitureComponentsTab: React.FC<FurnitureComponentsTabProps> = ({ database, onDatabaseUpdate }) => {
  const { createBackup } = useAppContext();
  const [components, setComponents] = useState<FurnitureComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [newComponent, setNewComponent] = useState<FurnitureComponent>({
    id: Date.now().toString(),
    name: '',
    type: 'corp',
    dimensions: { width: 60, height: 85, depth: 60 },
    price: 0,
    category: ''
  });

  // Simulate loading components from localStorage
  useEffect(() => {
    const savedComponents = localStorage.getItem('furniture-components');
    if (savedComponents) {
      try {
        setComponents(JSON.parse(savedComponents));
      } catch (error) {
        console.error('Error loading furniture components:', error);
        setComponents([]);
      }
    }
  }, []);

  // Save components to localStorage when they change
  useEffect(() => {
    if (components.length > 0) {
      localStorage.setItem('furniture-components', JSON.stringify(components));
    }
  }, [components]);

  const handleSaveComponent = () => {
    if (!newComponent.name) {
      toast.error('Numele corpului este obligatoriu');
      return;
    }

    if (!newComponent.category) {
      toast.error('Categoria este obligatorie');
      return;
    }

    // If editing an existing component
    if (selectedComponent) {
      const updatedComponents = components.map(comp => 
        comp.id === selectedComponent ? { ...newComponent, id: selectedComponent } : comp
      );
      setComponents(updatedComponents);
      setSelectedComponent(null);
      toast.success('Corpul a fost actualizat cu succes');
    } else {
      // Adding a new component
      const componentWithId = {
        ...newComponent,
        id: Date.now().toString()
      };
      setComponents([...components, componentWithId]);
      toast.success('Corpul a fost adăugat cu succes');
    }

    // Reset form
    setNewComponent({
      id: Date.now().toString(),
      name: '',
      type: 'corp',
      dimensions: { width: 60, height: 85, depth: 60 },
      price: 0,
      category: ''
    });

    // Create a backup
    createBackup();
  };

  const handleEditComponent = (id: string) => {
    const componentToEdit = components.find(comp => comp.id === id);
    if (componentToEdit) {
      setNewComponent({ ...componentToEdit });
      setSelectedComponent(id);
    }
  };

  const handleDeleteComponent = (id: string) => {
    if (window.confirm('Sigur doriți să ștergeți acest corp?')) {
      const updatedComponents = components.filter(comp => comp.id !== id);
      setComponents(updatedComponents);
      setSelectedComponent(null);
      
      // If we're currently editing this component, reset the form
      if (selectedComponent === id) {
        setNewComponent({
          id: Date.now().toString(),
          name: '',
          type: 'corp',
          dimensions: { width: 60, height: 85, depth: 60 },
          price: 0,
          category: ''
        });
      }
      
      toast.success('Corpul a fost șters cu succes');
      createBackup();
    }
  };

  const handleCancelEdit = () => {
    setSelectedComponent(null);
    setNewComponent({
      id: Date.now().toString(),
      name: '',
      type: 'corp',
      dimensions: { width: 60, height: 85, depth: 60 },
      price: 0,
      category: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., dimensions.width)
      const [parent, child] = name.split('.');
      if (parent === 'dimensions') {
        setNewComponent(prev => ({
          ...prev,
          dimensions: {
            ...prev.dimensions,
            [child]: type === 'number' ? Number(value) : value
          }
        }));
      } else {
        // This else branch prevents the spread type error by handling non-dimensions properties
        setNewComponent(prev => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as object || {}),
            [child]: type === 'number' ? Number(value) : value
          }
        }));
      }
    } else {
      // Handle direct properties
      setNewComponent(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewComponent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Administrare Corpuri Mobilier" 
        description="Adaugă, modifică sau șterge corpuri de mobilier"
      >
        <SaveButton 
          onClick={createBackup} 
          label="Salvează toate modificările"
          tooltip="Creează un backup cu toate modificările" 
        />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle>
              {selectedComponent ? 'Editează corp' : 'Adaugă corp nou'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="component-name">Nume</Label>
                <Input
                  id="component-name"
                  name="name"
                  value={newComponent.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Corp inferior bucătărie"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="component-type">Tip</Label>
                <Select
                  value={newComponent.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tipul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corp">Corp mobilier standard</SelectItem>
                    <SelectItem value="corp_colt">Corp colț</SelectItem>
                    <SelectItem value="corp_suspendat">Corp suspendat</SelectItem>
                    <SelectItem value="corp_sertar">Corp cu sertare</SelectItem>
                    <SelectItem value="masa">Masă</SelectItem>
                    <SelectItem value="dulap">Dulap</SelectItem>
                    <SelectItem value="biblioteca">Bibliotecă</SelectItem>
                    <SelectItem value="canapea">Canapea</SelectItem>
                    <SelectItem value="pat">Pat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="component-category">Categoria</Label>
                <Select
                  value={newComponent.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {database.categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dimensiuni (cm)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="width" className="text-xs">Lățime</Label>
                    <Input
                      id="width"
                      name="dimensions.width"
                      type="number"
                      value={newComponent.dimensions.width}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Înălțime</Label>
                    <Input
                      id="height"
                      name="dimensions.height"
                      type="number"
                      value={newComponent.dimensions.height}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="depth" className="text-xs">Adâncime</Label>
                    <Input
                      id="depth"
                      name="dimensions.depth"
                      type="number"
                      value={newComponent.dimensions.depth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="component-price">Preț (RON)</Label>
                <Input
                  id="component-price"
                  name="price"
                  type="number"
                  value={newComponent.price}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="component-description">Descriere</Label>
                <Input
                  id="component-description"
                  name="description"
                  value={newComponent.description || ''}
                  onChange={handleInputChange}
                  placeholder="Descriere opțională"
                />
              </div>

              <div className="flex justify-between pt-4">
                {selectedComponent ? (
                  <>
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Anulează
                    </Button>
                    <Button type="button" onClick={handleSaveComponent}>
                      Actualizează
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleSaveComponent}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adaugă corp nou
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Corpuri existente</CardTitle>
          </CardHeader>
          <CardContent>
            {components.length > 0 ? (
              <div className="space-y-4">
                {components.map((component) => (
                  <Card key={component.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{component.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            <span>Tip: {component.type}</span> • 
                            <span> Categorie: {component.category}</span> •
                            <span> Preț: {component.price} RON</span>
                          </div>
                          <div className="text-sm mt-1">
                            Dimensiuni: {component.dimensions.width} × {component.dimensions.height} × {component.dimensions.depth} cm
                          </div>
                          {component.description && (
                            <p className="text-sm mt-1 text-gray-500">{component.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditComponent(component.id)}
                          >
                            Editează
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteComponent(component.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Niciun corp definit</AlertTitle>
                <AlertDescription>
                  Nu există corpuri de mobilier adăugate. Folosește formularul din stânga pentru a adăuga corpuri noi.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FurnitureComponentsTab;
