
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Armchair, Ruler, Table, BookOpen, Save, Bed, ArrowRight, Sofa, Plus, ChefHat } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "sonner";
import { roomPresets, FurniturePreset, getPresetsByRoom } from '../data/furniturePresets';
import FurnitureThumbnail from '@/components/FurnitureThumbnail';
import FurnitureSetManager, { FurnitureDesign } from '@/components/FurnitureSetManager';
import AccessorySelector from '@/components/AccessorySelector';
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
import { Switch } from "@/components/ui/switch";

const Designer: React.FC = () => {
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
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
  const [availablePresets, setAvailablePresets] = useState<FurniturePreset[]>([]);
  const [hasDrawers, setHasDrawers] = useState<boolean>(false);
  const [hasDoors, setHasDoors] = useState<boolean>(false);
  const [doorMaterial, setDoorMaterial] = useState<string>("pal");
  const [doorColor, setDoorColor] = useState<string>("stejar");
  const [accessories, setAccessories] = useState<{name: string; price: number; quantity: number}[]>([]);
  const [isImportToQuoteDialogOpen, setIsImportToQuoteDialogOpen] = useState<boolean>(false);
  
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

  // Actualizează preseturile disponibile în funcție de camera selectată
  useEffect(() => {
    const presets = getPresetsByRoom(room);
    setAvailablePresets(presets);
    
    // Resetați presetul selectat când se schimbă camera
    setSelectedPreset(null);
  }, [room]);

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
    { id: "canapea", name: "Canapea", icon: <Sofa className="h-5 w-5" /> },
    { id: "scaun", name: "Scaun", icon: <Armchair className="h-5 w-5" /> },
    { id: "biblioteca", name: "Bibliotecă", icon: <BookOpen className="h-5 w-5" /> },
    { id: "dulap", name: "Dulap", icon: <BookOpen className="h-5 w-5" /> },
    { id: "masa", name: "Masă", icon: <Table className="h-5 w-5" /> },
    { id: "pat", name: "Pat", icon: <Bed className="h-5 w-5" /> },
    { id: "bucatarie", name: "Bucătărie", icon: <ChefHat className="h-5 w-5" /> },
    { id: "corp", name: "Corp", icon: <Plus className="h-5 w-5" /> },
  ];

  const handlePresetSelect = (presetId: string) => {
    const preset = availablePresets.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedPreset(presetId);
    setSelectedFurniture(preset.type);
    
    setDimensions({
      width: preset.dimensions.width,
      height: preset.dimensions.height,
      depth: preset.dimensions.depth
    });
    
    // Sugerează un nume pentru acest design bazat pe preset
    if (!designName) {
      setDesignName(preset.name);
    }
    
    // Set doors and drawers properties based on preset
    setHasDrawers(preset.hasDrawers || false);
    setHasDoors(preset.hasDoors || false);
  };

  const handleFurnitureSelect = (id: string) => {
    setSelectedFurniture(id);
    // Resetăm presetul selectat când se schimbă manual tipul mobilierului
    setSelectedPreset(null);
    
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
      case "bucatarie":
        setDimensions({ width: 240, height: 85, depth: 60 });
        break;
      case "corp":
        setDimensions({ width: 60, height: 85, depth: 60 });
        break;
      default:
        setDimensions({ width: 120, height: 80, depth: 60 });
    }
  };

  const roomOptions = [
    { id: "kitchen", name: "Bucătărie" },
    { id: "living", name: "Living" },
    { id: "dormitor", name: "Dormitor" },
    { id: "birou", name: "Birou" },
    { id: "baie", name: "Baie" },
    { id: "hol", name: "Hol" },
    { id: "dressing", name: "Dressing" },
  ];

  const handleDimensionChange = (dimension: keyof typeof dimensions, value: string) => {
    const numValue = parseInt(value) || 0;
    
    // Aplică restricții de dimensiune dacă este selectat un preset
    if (selectedPreset) {
      const preset = availablePresets.find(p => p.id === selectedPreset);
      if (preset) {
        // Verifică dimensiunile minime și maxime pentru preset
        if (dimension === 'width' && preset.minWidth && preset.maxWidth) {
          if (numValue < preset.minWidth) return;
          if (numValue > preset.maxWidth) return;
        }
        if (dimension === 'height' && preset.minHeight && preset.maxHeight) {
          if (numValue < preset.minHeight) return;
          if (numValue > preset.maxHeight) return;
        }
      }
    }
    
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
      id: Date.now().toString(),
      presetId: selectedPreset || undefined,
      type: selectedFurniture,
      color: selectedColor,
      material: selectedMaterial,
      room,
      width: dimensions.width,
      height: dimensions.height,
      depth: dimensions.depth,
      name: designName,
      hasDrawers,
      hasDoors,
      doorMaterial: hasDoors ? doorMaterial : undefined,
      doorColor: hasDoors ? doorColor : undefined,
      accessories: accessories.length > 0 ? [...accessories] : undefined
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
    setSelectedPreset(design.presetId || null);
    setDesignName(design.name);
    setHasDrawers(design.hasDrawers || false);
    setHasDoors(design.hasDoors || false);
    setDoorMaterial(design.doorMaterial || "pal");
    setDoorColor(design.doorColor || "stejar");
    setAccessories(design.accessories || []);
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
      pat: 1000,
      bucatarie: 2000,
      corp: 500
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
    
    // Preset multiplier (preseturile sunt puțin mai scumpe deoarece sunt optimizate)
    const presetMultiplier = selectedPreset ? 1.1 : 1;
    
    // Door multiplier
    const doorMultiplier = hasDoors ? 
      (doorMaterial === 'mdf_lucios' ? 1.3 : doorMaterial === 'lemn_masiv' ? 1.5 : 1.1) : 1;
    
    // Drawer multiplier
    const drawerMultiplier = hasDrawers ? 1.2 : 1;
    
    // Calculate price
    let price = basePrice[selectedFurniture] * 
              materialMultiplier[selectedMaterial] * 
              volumeFactor * 
              presetMultiplier * 
              doorMultiplier *
              drawerMultiplier;
    
    // Add accessories price
    const accessoriesPrice = accessories.reduce((sum, acc) => sum + acc.price * acc.quantity, 0);
    price += accessoriesPrice;
    
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

  const handleUpdateDesigns = (updatedDesigns: FurnitureDesign[]) => {
    setSavedDesigns(updatedDesigns);
    localStorage.setItem('furnitureDesigns', JSON.stringify(updatedDesigns));
  };
  
  const getSetsList = () => {
    const setsString = localStorage.getItem('furnitureSets');
    if (!setsString) return [];
    
    try {
      return JSON.parse(setsString);
    } catch (e) {
      console.error('Failed to parse furniture sets:', e);
      return [];
    }
  };
  
  const getDesignsInSet = (setId: string) => {
    return savedDesigns.filter(d => d.setId === setId);
  };
  
  const redirectToQuoteGenerator = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Proiectare Mobilier</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="design">
                  <TabsList className="w-full">
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="sets">Seturi</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="design" className="space-y-6">
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
                    
                    {/* Componente predefinite pe categorii */}
                    {availablePresets.length > 0 && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Componente predefinite</label>
                        <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto p-1">
                          {availablePresets.map((preset) => (
                            <Card 
                              key={preset.id}
                              className={`cursor-pointer transition-all hover:shadow-md ${selectedPreset === preset.id ? 'ring-2 ring-primary' : ''}`}
                              onClick={() => handlePresetSelect(preset.id)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
                                    <FurnitureThumbnail 
                                      type={preset.type} 
                                      color={colors.find(c => c.id === selectedColor)?.hex || '#D4B48C'}
                                      size={18} 
                                    />
                                  </div>
                                  <div className="text-xs">
                                    <p className="font-medium">{preset.name}</p>
                                    <p className="text-muted-foreground">{preset.dimensions.width}x{preset.dimensions.height}cm</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tip de mobilier</label>
                      <div className="grid grid-cols-4 gap-2">
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
                    
                    {/* Opțiuni suplimentare pentru uși și sertare */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="has-doors">Uși</Label>
                        <Switch 
                          id="has-doors" 
                          checked={hasDoors}
                          onCheckedChange={setHasDoors}
                        />
                      </div>
                      
                      {hasDoors && (
                        <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                          <div>
                            <Label>Material uși</Label>
                            <Select
                              value={doorMaterial}
                              onValueChange={setDoorMaterial}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Material uși" />
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
                            <Label>Culoare uși</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {colors.map((color) => (
                                <Button 
                                  key={color.id}
                                  variant="outline"
                                  className={`w-full p-0 h-8 border ${doorColor === color.id ? 'ring-2 ring-primary' : ''}`}
                                  style={{ backgroundColor: color.hex, borderColor: color.hex === '#FFFFFF' ? '#e2e8f0' : color.hex }}
                                  onClick={() => setDoorColor(color.id)}
                                  title={color.name}
                                >
                                  <span className="sr-only">{color.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="has-drawers">Sertare</Label>
                        <Switch 
                          id="has-drawers" 
                          checked={hasDrawers}
                          onCheckedChange={setHasDrawers}
                        />
                      </div>
                    </div>
                    
                    {/* Accesorii */}
                    <AccessorySelector 
                      accessories={accessories}
                      onAccessoriesChange={setAccessories}
                    />

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
                            savedDesigns.map((design) => (
                              <Card key={design.id} className="overflow-hidden">
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
                    
                    <Dialog open={isImportToQuoteDialogOpen} onOpenChange={setIsImportToQuoteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-2" variant="default">
                          Generează ofertă
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Generează ofertă</DialogTitle>
                          <DialogDescription>
                            Cum doriți să includeți articolele în ofertă?
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <Button className="w-full" onClick={redirectToQuoteGenerator}>
                            Vezi calculul de preț în generator ofertă
                          </Button>
                          
                          <p className="text-center text-sm text-gray-500">
                            Toate designurile salvate vor fi disponibile pentru a fi adăugate în ofertă.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>
                  
                  <TabsContent value="sets">
                    <FurnitureSetManager 
                      savedDesigns={savedDesigns}
                      onLoadDesign={loadDesign}
                      onDesignsUpdated={handleUpdateDesigns}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Previzualizare 3D</TabsTrigger>
                <TabsTrigger value="dimensions">Dimensiuni și Specificații</TabsTrigger>
                <TabsTrigger value="details">Detalii Constructive</TabsTrigger>
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
                        
                        {/* Doors visualization */}
                        {hasDoors && (
                          <div 
                            className="absolute inset-0 flex gap-1 p-1"
                            style={{ backgroundColor: colors.find(c => c.id === doorColor)?.hex || '#D4B48C' }}
                          >
                            <div className="flex-1 border border-gray-700 opacity-10"></div>
                            <div className="flex-1 border border-gray-700 opacity-10"></div>
                          </div>
                        )}
                        
                        {/* Drawers visualization */}
                        {hasDrawers && (
                          <div className="absolute bottom-0 left-0 right-0 h-1/3 flex flex-col gap-1 p-1">
                            <div className="flex-1 border border-gray-700 opacity-10"></div>
                            <div className="flex-1 border border-gray-700 opacity-10"></div>
                          </div>
                        )}
                        
                        {/* Afișăm informații despre presetul selectat */}
                        {selectedPreset && (
                          <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-500">
                            {availablePresets.find(p => p.id === selectedPreset)?.name || 'Preset'}
                          </div>
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
                    <h3 className="text-lg font-medium">
                      {selectedPreset ? 
                        `${availablePresets.find(p => p.id === selectedPreset)?.name}` : 
                        `Specificații ${furnitureTypes.find(f => f.id === selectedFurniture)?.name}`}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Lățime</p>
                        <p className="text-lg">{dimensions.width} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Înălțime</p>
                        <p className="text-lg">{dimensions.height} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Adâncime</p>
                        <p className="text-lg">{dimensions.depth} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Material</p>
                        <p className="text-lg">{materials.find(m => m.id === selectedMaterial)?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Culoare</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border" 
                            style={{ backgroundColor: colors.find(c => c.id === selectedColor)?.hex }}
                          ></div>
                          <span>{colors.find(c => c.id === selectedColor)?.name}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Greutate estimată</p>
                        <p className="text-lg">{getTotalWeight()} kg</p>
                      </div>
                    </div>
                    
                    {hasDoors && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Specificații uși</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Material uși</p>
                            <p className="text-lg">{materials.find(m => m.id === doorMaterial)?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Culoare uși</p>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded-full border" 
                                style={{ backgroundColor: colors.find(c => c.id === doorColor)?.hex }}
                              ></div>
                              <span>{colors.find(c => c.id === doorColor)?.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {accessories.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Accesorii ({accessories.length})</h4>
                        <div className="space-y-2">
                          {accessories.map((acc, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div>
                                <p>{acc.name}</p>
                                <p className="text-xs text-gray-500">{acc.price} RON/buc</p>
                              </div>
                              <p className="font-medium">{acc.quantity} buc</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-4 rounded-lg mt-6">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Preț estimat</h4>
                        <p className="text-2xl font-bold">{generatePrice()} RON</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        *Prețurile sunt estimative și pot varia în funcție de disponibilitatea materialelor și opțiunile suplimentare.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Selectați un tip de mobilier pentru a vedea specificațiile</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details" className="border rounded-lg p-6 min-h-[500px] bg-white">
                {selectedFurniture ? (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Detalii constructive</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Materiale necesare</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              <span className="font-medium">Plăci principale:</span> {materials.find(m => m.id === selectedMaterial)?.name}, 
                              grosime {materials.find(m => m.id === selectedMaterial)?.thickness}
                            </li>
                            {hasDoors && (
                              <li>
                                <span className="font-medium">Uși:</span> {materials.find(m => m.id === doorMaterial)?.name}, 
                                grosime {materials.find(m => m.id === doorMaterial)?.thickness}
                              </li>
                            )}
                            {hasDrawers && (
                              <li>
                                <span className="font-medium">Sertare:</span> PAL, grosime 16mm, cantitate: 2-3 buc
                              </li>
                            )}
                            <li>
                              <span className="font-medium">Cant ABS:</span> pentru toate marginile vizibile
                            </li>
                            <li>
                              <span className="font-medium">Șuruburi:</span> pentru asamblare și fixare
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Accesorii recomandate</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          {accessories.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                              {accessories.map((acc, index) => (
                                <li key={index}>
                                  <span className="font-medium">{acc.name}:</span> {acc.quantity} buc
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div>
                              {hasDoors && (
                                <ul className="list-disc pl-5 space-y-2">
                                  <li>Balamale aplicare simplă: 2-4 buc</li>
                                  <li>Mânere de ușă: 2-4 buc</li>
                                </ul>
                              )}
                              {hasDrawers && (
                                <ul className="list-disc pl-5 space-y-2">
                                  <li>Glisiere sertar cu amortizare: 2 perechi</li>
                                  <li>Mânere sertar: 2 buc</li>
                                </ul>
                              )}
                              {!hasDoors && !hasDrawers && (
                                <p className="text-gray-500">Adăugați uși sau sertare pentru a vedea accesoriile recomandate</p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Dimensiuni plăci de debitat</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              <span className="font-medium">Laterale:</span> {dimensions.depth}x{dimensions.height} cm, 2 buc
                            </li>
                            <li>
                              <span className="font-medium">Bază și top:</span> {dimensions.width}x{dimensions.depth} cm, 2 buc
                            </li>
                            {dimensions.height > 100 && (
                              <li>
                                <span className="font-medium">Poliță intermediară:</span> {dimensions.width - 3}x{dimensions.depth - 1} cm, 1-2 buc
                              </li>
                            )}
                            {hasDoors && (
                              <li>
                                <span className="font-medium">Ușă{dimensions.width > 60 ? " (2 buc)" : ""}:</span> {dimensions.width > 60 ? 
                                  Math.floor(dimensions.width / 2) : dimensions.width}x{dimensions.height - 6} cm
                              </li>
                            )}
                            {hasDrawers && (
                              <li>
                                <span className="font-medium">Front sertar:</span> {dimensions.width - 1}x{Math.min(30, dimensions.height / 3)} cm, 1-3 buc
                              </li>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Instrucțiuni de montaj</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ol className="list-decimal pl-5 space-y-2">
                            <li>Asamblați lateralele cu baza și topul folosind șuruburi și dibluri.</li>
                            <li>Fixați spatele (dacă există) pentru a asigura rigiditatea corpului.</li>
                            {dimensions.height > 100 && (
                              <li>Montați polițele folosind suporți pentru poliță sau excentric+știft.</li>
                            )}
                            {hasDoors && (
                              <li>Aplicați balamalele pe uși și apoi montați-le pe corpul de mobilier.</li>
                            )}
                            {hasDrawers && (
                              <li>Montați glisierele sertarelor și apoi asamblați sertarele.</li>
                            )}
                            <li>Verificați stabilitatea și echilibrarea mobilierului.</li>
                            <li>Aplicați ajustările finale și verificați funcționalitatea ușilor și sertarelor.</li>
                          </ol>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Selectați un tip de mobilier pentru a vedea detaliile constructive</p>
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
