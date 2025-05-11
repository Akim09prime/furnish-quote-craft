import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, X } from "lucide-react";
import { toast } from 'sonner';
import { Database, Material } from '@/lib/db';
import { Accessory } from '@/components/AccessorySelector';
import FurnitureThumbnail from './FurnitureThumbnail';

// Fixing the extension by making quantity required in AccessoryWithId to match Accessory
interface AccessoryWithId extends Omit<Accessory, 'quantity'> {
  id: string;
  description?: string; 
  imageUrl?: string;
  quantity: number;  // Changed from optional to required to match the Accessory interface
}

export interface ManualFurniture {
  id: string;
  name: string;
  type: string;
  category: string;
  width: number;
  height: number;
  depth: number;
  material: string;
  color: string;
  hasDoors: boolean;
  doorMaterial?: string;
  hasDrawers: boolean;
  drawerCount?: number;
  accessories: AccessoryWithId[];
  totalPrice: number;
}

interface ManualFurnitureFormProps {
  db: Database;
  onSave: (furniture: ManualFurniture) => void;
}

const FURNITURE_TYPES = [
  { id: 'corp', name: 'Corp Standard' },
  { id: 'corp_suspendat', name: 'Corp Suspendat' },
  { id: 'corp_colt', name: 'Corp Colț' },
  { id: 'corp_sertar', name: 'Corp cu Sertare' },
  { id: 'corp_frigider', name: 'Corp pentru Frigider' },
  { id: 'corp_chiuveta', name: 'Corp pentru Chiuvetă' },
  { id: 'dulap', name: 'Dulap' },
  { id: 'biblioteca', name: 'Bibliotecă' }
];

const MATERIAL_TYPES = [
  { id: 'pal', name: 'PAL Melaminat' },
  { id: 'mdf', name: 'MDF' },
  { id: 'mdf_lucios', name: 'MDF Lucios' },
  { id: 'pal_hdf', name: 'PAL cu HDF' },
  { id: 'lemn_masiv', name: 'Lemn Masiv' }
];

const COLOR_OPTIONS = [
  { id: '#9b87f5', name: 'Violet' },
  { id: '#7E69AB', name: 'Mov Închis' },
  { id: '#6E59A5', name: 'Indigo' },
  { id: '#f5af87', name: 'Portocaliu' },
  { id: '#87f59b', name: 'Verde Deschis' },
  { id: '#f587e8', name: 'Roz' },
  { id: '#FFFFFF', name: 'Alb' },
  { id: '#F5F5DC', name: 'Bej' },
  { id: '#D2B48C', name: 'Tan' },
  { id: '#8B4513', name: 'Maro' },
  { id: '#808080', name: 'Gri' },
  { id: '#000000', name: 'Negru' }
];

const CATEGORIES = [
  { id: 'bucatarie', name: 'Bucătărie' },
  { id: 'living', name: 'Living' },
  { id: 'dormitor', name: 'Dormitor' },
  { id: 'baie', name: 'Baie' },
  { id: 'birou', name: 'Birou' },
  { id: 'hol', name: 'Hol' },
  { id: 'dressing', name: 'Dressing' }
];

// Material price map (RON per m²)
const MATERIAL_PRICES = {
  'pal': 150,
  'mdf': 280,
  'mdf_lucios': 350,
  'pal_hdf': 180,
  'lemn_masiv': 450
};

const ManualFurnitureForm: React.FC<ManualFurnitureFormProps> = ({ db, onSave }) => {
  const [accessories, setAccessories] = useState<AccessoryWithId[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<{id: string, quantity: number}[]>([]);
  const [materialPrice, setMaterialPrice] = useState(0);
  const [accessoriesPrice, setAccessoriesPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [previewColor, setPreviewColor] = useState('#9b87f5');

  const form = useForm({
    defaultValues: {
      name: '',
      type: 'corp',
      category: 'bucatarie',
      width: 60,
      height: 70,
      depth: 60,
      material: 'pal',
      color: '#9b87f5',
      hasDoors: true,
      doorMaterial: 'pal',
      hasDrawers: false,
      drawerCount: 0,
    }
  });

  const { watch, setValue } = form;
  
  // Watch for changes to calculate price
  const width = watch('width');
  const height = watch('height');
  const depth = watch('depth');
  const material = watch('material');
  const hasDoors = watch('hasDoors');
  const doorMaterial = watch('doorMaterial');
  const hasDrawers = watch('hasDrawers');
  const drawerCount = watch('drawerCount');
  const type = watch('type');
  const category = watch('category');
  const color = watch('color');

  // Load accessories from DB
  useEffect(() => {
    // In a real scenario, load from DB
    const dummyAccessories: AccessoryWithId[] = [
      { id: '1', name: 'Balama Clip-Top', description: 'Balama hidraulică cu amortizor', price: 15, imageUrl: '', quantity: 0 },
      { id: '2', name: 'Mâner Profil', description: 'Mâner aluminiu 128mm', price: 8, imageUrl: '', quantity: 0 },
      { id: '3', name: 'Sertar Tandem Box', description: 'Sistem complet de sertar', price: 120, imageUrl: '', quantity: 0 },
      { id: '4', name: 'Picioare Plastic', description: 'Set 4 picioare ajustabile', price: 20, imageUrl: '', quantity: 0 },
      { id: '5', name: 'Lift Pneumatic', description: 'Mecanism pentru uși suspendate', price: 60, imageUrl: '', quantity: 0 },
    ];
    
    setAccessories(dummyAccessories);
  }, []);

  // Update preview color when color changes
  useEffect(() => {
    setPreviewColor(color);
  }, [color]);

  // Calculate material price
  useEffect(() => {
    // Calculate surface area in m²
    const calculateSurfaceArea = () => {
      // Convert dimensions to meters
      const w = width / 100;
      const h = height / 100; 
      const d = depth / 100;
      
      // Simple calculation for a box (6 sides)
      // In reality, this would be more complex based on furniture type
      const front = w * h;
      const side = d * h * 2;
      const topBottom = w * d * 2;
      
      return front + side + topBottom;
    };
    
    const surfaceArea = calculateSurfaceArea();
    const basePrice = MATERIAL_PRICES[material as keyof typeof MATERIAL_PRICES] || MATERIAL_PRICES.pal;
    
    let price = surfaceArea * basePrice;
    
    // Add door price if has doors
    if (hasDoors) {
      const doorArea = (width / 100) * (height / 100);
      const doorBasePrice = MATERIAL_PRICES[doorMaterial as keyof typeof MATERIAL_PRICES] || MATERIAL_PRICES.pal;
      price += doorArea * doorBasePrice * 0.9; // Doors are 90% of the front surface
    }
    
    // Add drawer price if has drawers
    if (hasDrawers && drawerCount > 0) {
      const drawerFrontArea = ((width / 100) * (height / (drawerCount * 4))) * drawerCount;
      price += drawerFrontArea * basePrice;
      price += drawerCount * 50; // Additional mechanism cost per drawer
    }
    
    // Add complexity factor based on type
    const complexityFactor = {
      'corp_colt': 1.4,
      'corp_suspendat': 1.2,
      'corp_frigider': 1.3,
      'corp_chiuveta': 1.25,
      'biblioteca': 1.3,
      'dulap': 1.2
    };
    
    const factor = (complexityFactor as any)[type] || 1.0;
    price *= factor;
    
    setMaterialPrice(Math.round(price));
  }, [width, height, depth, material, hasDoors, doorMaterial, hasDrawers, drawerCount, type]);
  
  // Calculate accessories price
  useEffect(() => {
    const price = selectedAccessories.reduce((sum, item) => {
      const accessory = accessories.find(a => a.id === item.id);
      return sum + (accessory?.price || 0) * item.quantity;
    }, 0);
    
    setAccessoriesPrice(price);
  }, [selectedAccessories, accessories]);
  
  // Calculate total price
  useEffect(() => {
    setTotalPrice(materialPrice + accessoriesPrice);
  }, [materialPrice, accessoriesPrice]);

  const handleAddAccessory = (accessoryId: string) => {
    const exists = selectedAccessories.find(a => a.id === accessoryId);
    
    if (exists) {
      setSelectedAccessories(selectedAccessories.map(a => 
        a.id === accessoryId ? { ...a, quantity: a.quantity + 1 } : a
      ));
    } else {
      setSelectedAccessories([...selectedAccessories, { id: accessoryId, quantity: 1 }]);
    }
  };

  const handleRemoveAccessory = (accessoryId: string) => {
    const accessory = selectedAccessories.find(a => a.id === accessoryId);
    
    if (accessory && accessory.quantity > 1) {
      setSelectedAccessories(selectedAccessories.map(a => 
        a.id === accessoryId ? { ...a, quantity: a.quantity - 1 } : a
      ));
    } else {
      setSelectedAccessories(selectedAccessories.filter(a => a.id !== accessoryId));
    }
  };

  const onSubmit = (data: any) => {
    // Create furniture object
    const furnitureAccessories = selectedAccessories.map(item => {
      const accessoryDetails = accessories.find(a => a.id === item.id);
      return {
        ...accessoryDetails,
        quantity: item.quantity
      };
    });
    
    const furniture: ManualFurniture = {
      id: `manual-${Date.now()}`,
      name: data.name || `Corp ${data.type} ${data.width}x${data.height}x${data.depth}cm`,
      type: data.type,
      category: data.category,
      width: data.width,
      height: data.height,
      depth: data.depth,
      material: data.material,
      color: data.color,
      hasDoors: data.hasDoors,
      doorMaterial: data.hasDoors ? data.doorMaterial : undefined,
      hasDrawers: data.hasDrawers,
      drawerCount: data.hasDrawers ? data.drawerCount : undefined,
      accessories: furnitureAccessories as AccessoryWithId[],
      totalPrice: totalPrice
    };
    
    onSave(furniture);
    
    // Reset form
    form.reset({
      name: '',
      type: 'corp',
      category: 'bucatarie',
      width: 60,
      height: 70,
      depth: 60,
      material: 'pal',
      color: '#9b87f5',
      hasDoors: true,
      doorMaterial: 'pal',
      hasDrawers: false,
      drawerCount: 0,
    });
    
    setSelectedAccessories([]);
    toast.success('Corp adăugat cu succes!');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Form */}
        <div className="space-y-4 md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Detalii Corp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Denumire</FormLabel>
                        <FormControl>
                          <Input placeholder="Corp bucătărie" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Type & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip Corp</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Adjust dimensions based on type
                              if (value === 'corp_suspendat') {
                                setValue('height', 72);
                                setValue('depth', 32);
                              } else if (value === 'corp_frigider') {
                                setValue('height', 200);
                                setValue('width', 60);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează tipul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FURNITURE_TYPES.map(type => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categorie</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORIES.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lățime (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Înălțime (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="depth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adâncime (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Material & Color */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează materialul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MATERIAL_TYPES.map(material => (
                                <SelectItem key={material.id} value={material.id}>
                                  {material.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Culoare</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează culoarea" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COLOR_OPTIONS.map(color => (
                                <SelectItem key={color.id} value={color.id}>
                                  <div className="flex items-center">
                                    <div 
                                      className="w-4 h-4 rounded-full mr-2" 
                                      style={{ backgroundColor: color.id }} 
                                    />
                                    {color.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Doors */}
                  <FormField
                    control={form.control}
                    name="hasDoors"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Are uși</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Door Material - conditionally rendered */}
                  {hasDoors && (
                    <FormField
                      control={form.control}
                      name="doorMaterial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material Uși</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează materialul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MATERIAL_TYPES.map(material => (
                                <SelectItem key={material.id} value={material.id}>
                                  {material.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Drawers */}
                  <FormField
                    control={form.control}
                    name="hasDrawers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Are sertare</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Drawer Count - conditionally rendered */}
                  {hasDrawers && (
                    <FormField
                      control={form.control}
                      name="drawerCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Număr de Sertare</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="5" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Separator />

                  {/* Accessories */}
                  <div>
                    <h3 className="mb-2 font-medium">Accesorii Disponibile</h3>
                    <ScrollArea className="h-40">
                      <div className="space-y-2">
                        {accessories.map(accessory => (
                          <div key={accessory.id} className="flex items-center justify-between border rounded p-2">
                            <div>
                              <p className="font-medium">{accessory.name}</p>
                              <p className="text-sm text-gray-500">{accessory.price} RON</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAddAccessory(accessory.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {selectedAccessories.length > 0 && (
                    <div>
                      <h3 className="mb-2 font-medium">Accesorii Selectate</h3>
                      <div className="space-y-2">
                        {selectedAccessories.map(selected => {
                          const accessory = accessories.find(a => a.id === selected.id);
                          return accessory ? (
                            <div key={selected.id} className="flex items-center justify-between border rounded p-2 bg-gray-50">
                              <div>
                                <p className="font-medium">{accessory.name}</p>
                                <p className="text-sm text-gray-500">{accessory.price} RON x {selected.quantity}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveAccessory(selected.id)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span>{selected.quantity}</span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAddAccessory(selected.id)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedAccessories(selectedAccessories.filter(a => a.id !== selected.id))}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Button type="submit" className="w-full">
                      Adaugă în Proiect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>

        {/* Column 2: Preview & Pricing */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previzualizare</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <FurnitureThumbnail 
                type={type} 
                color={previewColor} 
                size={64}
                className="h-32 w-32 mb-4"
              />
              <div className="text-center">
                <h3 className="font-medium">{form.getValues('name') || `Corp ${type} ${width}x${height}x${depth}cm`}</h3>
                <p className="text-sm text-gray-500">{FURNITURE_TYPES.find(t => t.id === type)?.name}</p>
                <p className="text-sm text-gray-500">{width} × {height} × {depth} cm</p>
                <Badge className="mt-2">{MATERIAL_TYPES.find(m => m.id === material)?.name}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calcul Preț</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Materiale:</span>
                <span>{materialPrice} RON</span>
              </div>
              <div className="flex justify-between">
                <span>Accesorii:</span>
                <span>{accessoriesPrice} RON</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{totalPrice} RON</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManualFurnitureForm;
