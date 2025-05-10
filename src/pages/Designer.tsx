
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Armchair } from 'lucide-react';

const Designer: React.FC = () => {
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("stejar");
  const [room, setRoom] = useState<string>("living");

  const colors = [
    { id: "stejar", name: "Stejar", hex: "#D4B48C" },
    { id: "nuc", name: "Nuc", hex: "#5C4033" },
    { id: "alb", name: "Alb", hex: "#FFFFFF" },
    { id: "negru", name: "Negru", hex: "#000000" },
    { id: "gri", name: "Gri", hex: "#808080" },
  ];

  const furnitureTypes = [
    { id: "canapea", name: "Canapea", icon: <Armchair className="h-5 w-5" /> },
    { id: "scaun", name: "Scaun", icon: <Car className="h-5 w-5" /> },
    { id: "biblioteca", name: "Bibliotecă", icon: <Armchair className="h-5 w-5" rotate={90} /> },
    { id: "dulap", name: "Dulap", icon: <Armchair className="h-5 w-5" /> },
    { id: "pat", name: "Pat", icon: <Car className="h-5 w-5" /> },
  ];

  const handleFurnitureSelect = (id: string) => {
    setSelectedFurniture(id);
  };

  const roomOptions = [
    { id: "living", name: "Living" },
    { id: "dormitor", name: "Dormitor" },
    { id: "birou", name: "Birou" },
    { id: "bucatarie", name: "Bucătărie" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Proiectare Mobilier</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Opțiuni</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Cameră</label>
                  <Select 
                    value={room} 
                    onValueChange={setRoom}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selectați camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomOptions.map((roomOption) => (
                        <SelectItem key={roomOption.id} value={roomOption.id}>
                          {roomOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Tip de mobilier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {furnitureTypes.map((furniture) => (
                      <Button 
                        key={furniture.id}
                        variant={selectedFurniture === furniture.id ? "default" : "outline"}
                        className="flex flex-col items-center py-3 h-auto"
                        onClick={() => handleFurnitureSelect(furniture.id)}
                      >
                        {furniture.icon}
                        <span className="text-xs mt-1">{furniture.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Culoare</label>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <Button 
                        key={color.id}
                        variant="outline"
                        className={`w-full p-0 h-10 border-2 ${selectedColor === color.id ? 'ring-2 ring-primary' : ''}`}
                        style={{ backgroundColor: color.hex, borderColor: color.hex === '#FFFFFF' ? '#e2e8f0' : color.hex }}
                        onClick={() => setSelectedColor(color.id)}
                      >
                        <span className="sr-only">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">
                    Generează vizualizare
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Previzualizare 3D</TabsTrigger>
                <TabsTrigger value="dimensions">Dimensiuni și Specificații</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center bg-white">
                <div className="text-center">
                  <Armchair className="h-32 w-32 mx-auto text-gray-400" strokeWidth={1} />
                  <p className="mt-4 text-gray-500">
                    {selectedFurniture ? 
                      `Vizualizare ${furnitureTypes.find(f => f.id === selectedFurniture)?.name || ''} în culoarea ${colors.find(c => c.id === selectedColor)?.name || ''}` : 
                      'Selectați un tip de mobilier pentru previzualizare'}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="dimensions" className="border rounded-lg p-6 min-h-[400px] bg-white">
                {selectedFurniture ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Specificații {furnitureTypes.find(f => f.id === selectedFurniture)?.name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Lățime</p>
                        <p className="text-base">120 cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Înălțime</p>
                        <p className="text-base">80 cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Adâncime</p>
                        <p className="text-base">60 cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Material</p>
                        <p className="text-base">MDF și lemn masiv</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Selectați un tip de mobilier pentru a vedea specificațiile</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Designer;
