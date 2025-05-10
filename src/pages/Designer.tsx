
import React, { useState, useEffect } from 'react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Armchair, Ruler, Table, BookOpen, Save, Bed, ArrowRight } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "sonner";

interface FurnitureDesign {
  type: string;
  color: string;
  material: string;
  room: string;
  width: number;
  height: number;
  depth: number;
  name: string;
}

const Designer: React.FC = () => {
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("stejar");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("pal");
  const [room, setRoom] = useState<string>("living");
  const [dimensions, setDimensions] = useState({
    width: 120,
    height: 80,
    depth: 60
  });
  const [designName, setDesignName] = useState<string>("");
  const [savedDesigns, setSavedDesigns] = useState<FurnitureDesign[]>([]);
  const [gridVisible, setGridVisible] = useState<boolean>(true);
  
  // Load saved designs from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('furnitureDesigns');
    if (savedItems) {
      try {
        setSavedDesigns(JSON.parse(savedItems));
      } catch (e) {
        console.error('Failed to parse saved designs:', e);
      }
    }
  }, []);

  const colors = [
    { id: "stejar", name: "Stejar", hex: "#D4B48C" },
    { id: "nuc", name: "Nuc", hex: "#5C4033" },
    { id: "alb", name: "Alb", hex: "#FFFFFF" },
    { id: "negru", name: "Negru", hex: "#000000" },
    { id: "gri", name: "Gri", hex: "#808080" },
    { id: "cires", name: "Cireș", hex: "#C4572E" },
    { id: "wenge", name: "Wenge", hex: "#4C3327" },
    { id: "sonoma", name: "Sonoma", hex: "#E4D4C2" },
  ];

  const materials = [
    { id: "pal", name: "PAL", thickness: "18mm" },
    { id: "pal_hdf", name: "PAL HDF", thickness: "22mm" },
    { id: "mdf", name: "MDF", thickness: "16mm" },
    { id: "mdf_lucios", name: "MDF Lucios", thickness: "18mm" },
    { id: "lemn_masiv", name: "Lemn Masiv", thickness: "25mm" },
  ];

  const furnitureTypes = [
    { id: "canapea", name: "Canapea", icon: <Armchair className="h-5 w-5" /> },
    { id: "scaun", name: "Scaun", icon: <Armchair className="h-5 w-5" rotate={45} /> },
    { id: "biblioteca", name: "Bibliotecă", icon: <BookOpen className="h-5 w-5" /> },
    { id: "dulap", name: "Dulap", icon: <BookOpen className="h-5 w-5" rotate={90} /> },
    { id: "masa", name: "Masă", icon: <Table className="h-5 w-5" /> },
    { id: "pat", name: "Pat", icon: <Bed className="h-5 w-5" /> },
  ];

  const handleFurnitureSelect = (id: string) => {
    setSelectedFurniture(id);
    
    // Set default dimensions based on furniture type
    switch(id) {
      case "canapea":
        setDimensions({ width: 200, height: 85, depth: 90 });
        break;
      case "scaun":
        setDimensions({ width: 45, height: 90, depth: 45 });
        break;
      case "biblioteca":
        setDimensions({ width: 100, height: 200, depth: 35 });
        break;
      case "dulap":
        setDimensions({ width: 150, height: 220, depth: 60 });
        break;
      case "masa":
        setDimensions({ width: 120, height: 75, depth: 80 });
        break;
      case "pat":
        setDimensions({ width: 160, height: 45, depth: 200 });
        break;
      default:
        setDimensions({ width: 120, height: 80, depth: 60 });
    }
  };

  const roomOptions = [
    { id: "living", name: "Living" },
    { id: "dormitor", name: "Dormitor" },
    { id: "birou", name: "Birou" },
    { id: "bucatarie", name: "Bucătărie" },
    { id: "baie", name: "Baie" },
    { id: "hol", name: "Hol" },
    { id: "dressing", name: "Dressing" },
  ];

  const handleDimensionChange = (dimension: keyof typeof dimensions, value: string) => {
    const numValue = parseInt(value) || 0;
    setDimensions(prev => ({ ...prev, [dimension]: numValue }));
  };

  const saveDesign = () => {
    if (!selectedFurniture) {
      toast.error("Selectați un tip de mobilier pentru a salva designul");
      return;
    }

    if (!designName.trim()) {
      toast.error("Introduceți un nume pentru design");
      return;
    }

    const newDesign: FurnitureDesign = {
      type: selectedFurniture,
      color: selectedColor,
      material: selectedMaterial,
      room,
      width: dimensions.width,
      height: dimensions.height,
      depth: dimensions.depth,
      name: designName,
    };

    const updatedDesigns = [...savedDesigns, newDesign];
    setSavedDesigns(updatedDesigns);
    
    // Save to localStorage
    localStorage.setItem('furnitureDesigns', JSON.stringify(updatedDesigns));
    
    toast.success("Design salvat cu succes!");
    setDesignName("");
  };

  const loadDesign = (design: FurnitureDesign) => {
    setSelectedFurniture(design.type);
    setSelectedColor(design.color);
    setSelectedMaterial(design.material);
    setRoom(design.room);
    setDimensions({
      width: design.width,
      height: design.height,
      depth: design.depth
    });
    toast.info(`Design "${design.name}" încărcat`);
  };

  const generatePrice = () => {
    if (!selectedFurniture || !selectedMaterial) return 0;
    
    // Base price by furniture type
    const basePrice: Record<string, number> = {
      canapea: 1200,
      scaun: 250,
      biblioteca: 800,
      dulap: 1500,
      masa: 700,
      pat: 1000
    };
    
    // Material multiplier
    const materialMultiplier: Record<string, number> = {
      pal: 1,
      pal_hdf: 1.2,
      mdf: 1.5,
      mdf_lucios: 1.8,
      lemn_masiv: 2.5
    };
    
    // Calculate size factor (larger = more expensive)
    const volumeFactor = dimensions.width * dimensions.height * dimensions.depth / 100000;
    
    // Calculate price
    const price = basePrice[selectedFurniture] * materialMultiplier[selectedMaterial] * volumeFactor;
    
    return Math.round(price);
  };

  const getTotalWeight = () => {
    if (!selectedFurniture || !selectedMaterial) return 0;
    
    // Density in kg/m³
    const density: Record<string, number> = {
      pal: 650,
      pal_hdf: 720,
      mdf: 700,
      mdf_lucios: 720,
      lemn_masiv: 800
    };
    
    // Calculate volume in cubic meters
    const volume = (dimensions.width * dimensions.height * dimensions.depth) / 1000000;
    
    // Calculate weight in kg
    return Math.round(density[selectedMaterial] * volume);
  };

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
                  <label className="text-sm font-medium mb-2 block">Material</label>
                  <Select 
                    value={selectedMaterial} 
                    onValueChange={setSelectedMaterial}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selectați materialul" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.thickness})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Culoare</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <Button 
                        key={color.id}
                        variant="outline"
                        className={`w-full p-0 h-10 border-2 ${selectedColor === color.id ? 'ring-2 ring-primary' : ''}`}
                        style={{ backgroundColor: color.hex, borderColor: color.hex === '#FFFFFF' ? '#e2e8f0' : color.hex }}
                        onClick={() => setSelectedColor(color.id)}
                        title={color.name}
                      >
                        <span className="sr-only">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Dimensiuni (cm)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="width">Lățime</Label>
                      <div className="flex items-center">
                        <Input 
                          id="width" 
                          type="number" 
                          value={dimensions.width} 
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          min="10"
                          max="300"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="height">Înălțime</Label>
                      <div className="flex items-center">
                        <Input 
                          id="height" 
                          type="number" 
                          value={dimensions.height} 
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          min="10"
                          max="300"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="depth">Adâncime</Label>
                      <div className="flex items-center">
                        <Input 
                          id="depth" 
                          type="number" 
                          value={dimensions.depth} 
                          onChange={(e) => handleDimensionChange('depth', e.target.value)}
                          min="10"
                          max="300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <Input 
                    placeholder="Nume design" 
                    value={designName} 
                    onChange={(e) => setDesignName(e.target.value)}
                  />
                  <Button 
                    onClick={saveDesign} 
                    className="whitespace-nowrap"
                    title="Salvează design"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Salvează
                  </Button>
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Designuri salvate
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Designuri salvate</SheetTitle>
                      <SheetDescription>
                        Încarcă un design salvat anterior
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {savedDesigns.length > 0 ? (
                        savedDesigns.map((design, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">{design.name}</h3>
                                  <p className="text-sm text-gray-500">
                                    {furnitureTypes.find(f => f.id === design.type)?.name || design.type}, 
                                    {materials.find(m => m.id === design.material)?.name || design.material}
                                  </p>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={() => loadDesign(design)}
                                  variant="outline"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">Nu există designuri salvate</p>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Previzualizare 3D</TabsTrigger>
                <TabsTrigger value="dimensions">Dimensiuni și Specificații</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="border rounded-lg p-4 min-h-[500px] bg-white relative">
                {selectedFurniture ? (
                  <div className="h-full">
                    {/* Grid visualization */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setGridVisible(!gridVisible)}
                        className="flex gap-1"
                      >
                        <Ruler className="h-4 w-4" />
                        {gridVisible ? 'Ascunde grila' : 'Arată grila'}
                      </Button>
                    </div>
                    
                    <div className="h-full flex items-center justify-center relative">
                      {/* Room background */}
                      <div className="absolute inset-0 bg-gray-100 opacity-20"></div>
                      
                      {/* Grid lines */}
                      {gridVisible && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="grid grid-cols-10 h-full w-full">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div key={`col-${i}`} className="border-r border-gray-200"></div>
                            ))}
                          </div>
                          <div className="grid grid-rows-10 h-full w-full">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div key={`row-${i}`} className="border-b border-gray-200"></div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Furniture visualization */}
                      <div 
                        className="relative border-2 shadow-lg transition-all duration-300"
                        style={{ 
                          backgroundColor: colors.find(c => c.id === selectedColor)?.hex || '#D4B48C',
                          width: `${Math.min(dimensions.width / 2, 300)}px`, 
                          height: `${Math.min(dimensions.height / 2, 150)}px`,
                          transform: selectedFurniture === 'pat' ? 'rotateX(45deg)' : selectedFurniture === 'masa' ? 'rotateX(30deg)' : 'rotateX(10deg) rotateY(10deg)'
                        }}
                      >
                        {/* Furniture details/texture */}
                        {selectedFurniture === 'biblioteca' && (
                          <div className="absolute inset-0 flex">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="flex-1 border-r border-gray-700 opacity-20"></div>
                            ))}
                          </div>
                        )}
                        {selectedFurniture === 'dulap' && (
                          <div className="absolute inset-0 flex gap-1 p-1">
                            <div className="flex-1 bg-gray-700 opacity-5"></div>
                            <div className="flex-1 bg-gray-700 opacity-5"></div>
                          </div>
                        )}
                        {selectedFurniture === 'canapea' && (
                          <div className="absolute bottom-0 h-2/3 w-full bg-gray-700 opacity-10"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center h-full flex flex-col items-center justify-center">
                    <Armchair className="h-32 w-32 mx-auto text-gray-400" strokeWidth={1} />
                    <p className="mt-4 text-gray-500">
                      Selectați un tip de mobilier pentru previzualizare
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="dimensions" className="border rounded-lg p-6 min-h-[500px] bg-white">
                {selectedFurniture ? (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Specificații {furnitureTypes.find(f => f.id === selectedFurniture)?.name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Lățime</p>
                        <p className="text-base">{dimensions.width} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Înălțime</p>
                        <p className="text-base">{dimensions.height} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Adâncime</p>
                        <p className="text-base">{dimensions.depth} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Material</p>
                        <p className="text-base">
                          {materials.find(m => m.id === selectedMaterial)?.name || 'MDF și lemn masiv'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h4 className="text-md font-medium mb-4">Informații suplimentare</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Greutate estimată</p>
                          <p className="text-base">{getTotalWeight()} kg</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Preț estimat</p>
                          <p className="text-base font-medium text-[#1A73E8]">{generatePrice()} Lei</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Timp de producție</p>
                          <p className="text-base">3-5 zile</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Garanție</p>
                          <p className="text-base">2 ani</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <h4 className="text-md font-medium mb-4">Exemple de modele similare</h4>
                      <Carousel className="w-full">
                        <CarouselContent>
                          {[1, 2, 3].map((item) => (
                            <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
                              <div className="p-1">
                                <Card>
                                  <CardContent className="flex aspect-square items-center justify-center p-6 bg-gray-100">
                                    <span className="text-3xl font-semibold">
                                      {selectedFurniture === 'canapea' && <Armchair className="h-12 w-12" />}
                                      {selectedFurniture === 'scaun' && <Armchair className="h-12 w-12" rotate={45} />}
                                      {selectedFurniture === 'biblioteca' && <BookOpen className="h-12 w-12" />}
                                      {selectedFurniture === 'dulap' && <BookOpen className="h-12 w-12" rotate={90} />}
                                      {selectedFurniture === 'masa' && <Table className="h-12 w-12" />}
                                      {selectedFurniture === 'pat' && <Bed className="h-12 w-12" />}
                                    </span>
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-0" />
                        <CarouselNext className="right-0" />
                      </Carousel>
                    </div>
                    
                    <div className="pt-6 mt-6 flex justify-end">
                      <Button>
                        Solicită ofertă personalizată
                      </Button>
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
