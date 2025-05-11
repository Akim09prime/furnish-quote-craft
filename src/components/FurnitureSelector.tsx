
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FolderOpen, PenLine } from 'lucide-react';
import { Database } from "@/lib/db";
import { toast } from 'sonner';
import FurnitureThumbnail from './FurnitureThumbnail';
import ManualFurnitureForm, { ManualFurniture } from './ManualFurnitureForm';

export interface FurnitureTemplate {
  id: string;
  name: string;
  category: string;
  type: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  materials: string[];
  price: number;
  color: string;
}

interface FurnitureSelectorProps {
  onSelectTemplate: (template: FurnitureTemplate) => void;
  db: Database;
}

const FurnitureSelector: React.FC<FurnitureSelectorProps> = ({ onSelectTemplate, db }) => {
  const [templates, setTemplates] = useState<FurnitureTemplate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('templates');

  // Dummy templates for demonstration
  useEffect(() => {
    // In a real implementation, these would come from the database
    const dummyTemplates: FurnitureTemplate[] = [
      {
        id: '1',
        name: 'Corp inferior bucătărie',
        category: 'Bucătărie',
        type: 'corp',
        dimensions: { width: 60, height: 85, depth: 60 },
        materials: ['PAL melaminat', 'MDF'],
        price: 450,
        color: '#9b87f5'
      },
      {
        id: '2',
        name: 'Corp superior bucătărie',
        category: 'Bucătărie',
        type: 'corp_suspendat',
        dimensions: { width: 60, height: 72, depth: 32 },
        materials: ['PAL melaminat'],
        price: 350,
        color: '#7E69AB'
      },
      {
        id: '3',
        name: 'Coloană frigider',
        category: 'Bucătărie',
        type: 'corp_frigider',
        dimensions: { width: 60, height: 200, depth: 60 },
        materials: ['PAL melaminat'],
        price: 650,
        color: '#6E59A5'
      },
      {
        id: '4',
        name: 'Dulap dormitor',
        category: 'Dormitor',
        type: 'dulap',
        dimensions: { width: 100, height: 210, depth: 60 },
        materials: ['PAL melaminat'],
        price: 900,
        color: '#9b87f5'
      },
      {
        id: '5',
        name: 'Noptieră',
        category: 'Dormitor',
        type: 'corp_sertar',
        dimensions: { width: 45, height: 50, depth: 45 },
        materials: ['PAL melaminat'],
        price: 250,
        color: '#7E69AB'
      },
      {
        id: '6',
        name: 'Bibliotecă living',
        category: 'Living',
        type: 'biblioteca',
        dimensions: { width: 120, height: 200, depth: 40 },
        materials: ['PAL melaminat', 'MDF vopsit'],
        price: 1200,
        color: '#6E59A5'
      },
      {
        id: '7',
        name: 'Comoda TV',
        category: 'Living',
        type: 'corp',
        dimensions: { width: 180, height: 50, depth: 45 },
        materials: ['PAL melaminat', 'MDF vopsit'],
        price: 850,
        color: '#9b87f5'
      },
      {
        id: '8',
        name: 'Mobilier baie',
        category: 'Baie',
        type: 'corp',
        dimensions: { width: 80, height: 60, depth: 46 },
        materials: ['PAL hidrofugat', 'MDF lucios'],
        price: 550,
        color: '#7E69AB'
      }
    ];

    setTemplates(dummyTemplates);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(dummyTemplates.map(t => t.category)));
    setCategories(uniqueCategories);
  }, []);

  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  const handleSelectTemplate = (template: FurnitureTemplate) => {
    onSelectTemplate(template);
    toast.success(`${template.name} selectat`, {
      description: "Corpul a fost adăugat în proiectul curent."
    });
  };

  const handleSaveManualFurniture = (furniture: ManualFurniture) => {
    // Convert manual furniture to template format
    const template: FurnitureTemplate = {
      id: furniture.id,
      name: furniture.name,
      category: furniture.category.charAt(0).toUpperCase() + furniture.category.slice(1), // Capitalize first letter
      type: furniture.type,
      dimensions: {
        width: furniture.width,
        height: furniture.height,
        depth: furniture.depth
      },
      materials: [furniture.material],
      price: furniture.totalPrice,
      color: furniture.color
    };

    // Add to available templates
    setTemplates([...templates, template]);

    // Select it directly
    onSelectTemplate(template);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-furniture-purple-light to-furniture-purple-dark pb-2">
        <CardTitle className="text-white">Corpuri de Mobilier</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-3">
            <TabsTrigger value="templates">
              <FolderOpen className="h-4 w-4 mr-1" />
              Corpuri Standard
            </TabsTrigger>
            <TabsTrigger value="manual">
              <PenLine className="h-4 w-4 mr-1" />
              Creare Manuală
            </TabsTrigger>
            <TabsTrigger value="new">
              <Plus className="h-4 w-4 mr-1" />
              Corp Nou
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="p-4 bg-gray-50 rounded-md">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Creează Corp Nou</h3>
              <p className="text-gray-500 mb-4">Adaugă un nou corp standard în biblioteca de corpuri</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Corp Nou
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="manual">
            <ManualFurnitureForm db={db} onSave={handleSaveManualFurniture} />
          </TabsContent>

          <TabsContent value="templates" className="space-y-2">
            <div className="mb-4">
              <TabsList className="mb-2 grid grid-cols-4 sm:grid-cols-5">
                <TabsTrigger value="all" onClick={() => setActiveCategory('all')}>
                  Toate
                </TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category}
                    value={category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTemplates.map(template => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover-scale"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-4 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <FurnitureThumbnail 
                          type={template.type} 
                          color={template.color} 
                          size={32}
                          className="h-12 w-12 mb-2" 
                        />
                        <span className="text-lg font-bold text-furniture-purple">
                          {template.price} RON
                        </span>
                      </div>
                      <h3 className="font-medium mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.category}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {template.dimensions.width} × {template.dimensions.height} × {template.dimensions.depth} cm
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.materials.map(material => (
                          <span 
                            key={material} 
                            className="text-xs bg-gray-100 px-2 py-0.5 rounded-full"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-2">
              <ScrollArea className="h-[500px] pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {templates
                    .filter(t => t.category === category)
                    .map(template => (
                      <Card 
                        key={template.id}
                        className="cursor-pointer hover-scale"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <CardContent className="p-4 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <FurnitureThumbnail 
                              type={template.type} 
                              color={template.color} 
                              size={32}
                              className="h-12 w-12 mb-2" 
                            />
                            <span className="text-lg font-bold text-furniture-purple">
                              {template.price} RON
                            </span>
                          </div>
                          <h3 className="font-medium mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-500">{template.category}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {template.dimensions.width} × {template.dimensions.height} × {template.dimensions.depth} cm
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.materials.map(material => (
                              <span 
                                key={material} 
                                className="text-xs bg-gray-100 px-2 py-0.5 rounded-full"
                              >
                                {material}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FurnitureSelector;
