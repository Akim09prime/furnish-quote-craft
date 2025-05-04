
import React, { useState, useEffect } from 'react';
import { Database } from '@/lib/db';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the Material type
export interface Material {
  id: string;
  name: string;
  type: string;
  thickness: number;
  length: number;
  width: number;
  pricePerSheet: number;
  pricePerSquareMeter: number;
  updatedAt: string;
}

// Form schema validation
const materialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  type: z.string().min(1, "Selectați tipul materialului"),
  thickness: z.number().positive("Grosimea trebuie să fie un număr pozitiv"),
  length: z.number().positive("Lungimea trebuie să fie un număr pozitiv"),
  width: z.number().positive("Lățimea trebuie să fie un număr pozitiv"),
  pricePerSheet: z.number().positive("Prețul trebuie să fie un număr pozitiv"),
});

// Props interface
interface MaterialsTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ database, onDatabaseUpdate }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Initialize react-hook-form
  const form = useForm<z.infer<typeof materialSchema>>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: "",
      type: "PAL",
      thickness: 18,
      length: 2800,
      width: 2070,
      pricePerSheet: 0,
    },
  });
  
  // Load materials from database
  useEffect(() => {
    if (database) {
      // Check if materials exist in the database, if not, initialize them
      if (!database.materials) {
        const updatedDb = {
          ...database,
          materials: []
        };
        onDatabaseUpdate(updatedDb);
        setMaterials([]);
      } else {
        setMaterials(database.materials);
      }
    }
  }, [database, onDatabaseUpdate]);

  // Calculate price per square meter
  const calculatePricePerSquareMeter = (length: number, width: number, price: number): number => {
    const areaInSquareMeters = (length / 1000) * (width / 1000);
    return areaInSquareMeters > 0 ? price / areaInSquareMeters : 0;
  };

  // Add new material
  const handleAddMaterial = (data: z.infer<typeof materialSchema>) => {
    const pricePerSquareMeter = calculatePricePerSquareMeter(
      data.length,
      data.width,
      data.pricePerSheet
    );
    
    const newMaterial: Material = {
      id: data.id || Date.now().toString(),
      name: data.name,
      type: data.type,
      thickness: data.thickness,
      length: data.length,
      width: data.width,
      pricePerSheet: data.pricePerSheet,
      pricePerSquareMeter: pricePerSquareMeter,
      updatedAt: new Date().toISOString()
    };
    
    let updatedMaterials: Material[] = [];
    
    if (data.id) {
      // Update existing material
      updatedMaterials = materials.map(material => 
        material.id === data.id ? newMaterial : material
      );
      toast.success(`Materialul "${data.name}" a fost actualizat`);
    } else {
      // Add new material
      updatedMaterials = [...materials, newMaterial];
      toast.success(`Materialul "${data.name}" a fost adăugat`);
    }
    
    // Update state and database
    setMaterials(updatedMaterials);
    const updatedDb = {
      ...database,
      materials: updatedMaterials
    };
    onDatabaseUpdate(updatedDb);
    
    // Reset form and close dialog
    form.reset();
    setIsDialogOpen(false);
  };

  // Edit material
  const handleEditMaterial = (material: Material) => {
    form.reset({
      id: material.id,
      name: material.name,
      type: material.type,
      thickness: material.thickness,
      length: material.length,
      width: material.width,
      pricePerSheet: material.pricePerSheet,
    });
    setIsDialogOpen(true);
  };

  // Delete material
  const handleDeleteMaterial = (id: string) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest material?")) {
      const updatedMaterials = materials.filter(material => material.id !== id);
      setMaterials(updatedMaterials);
      const updatedDb = {
        ...database,
        materials: updatedMaterials
      };
      onDatabaseUpdate(updatedDb);
      toast.success("Materialul a fost șters");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Prețuri Materiale
          </CardTitle>
          <CardDescription>
            Administrarea prețurilor pentru materiale (PAL, MDF, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Adaugă Material Nou
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {form.getValues("id") ? "Editare Material" : "Adaugă Material Nou"}
                  </DialogTitle>
                  <DialogDescription>
                    Completează detaliile materialului. Toate câmpurile sunt obligatorii.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddMaterial)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Denumire material</FormLabel>
                            <FormControl>
                              <Input placeholder="ex: PAL Alb" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tip material</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectează tipul" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PAL">PAL</SelectItem>
                                <SelectItem value="MDF">MDF</SelectItem>
                                <SelectItem value="PFL">PFL</SelectItem>
                                <SelectItem value="HDF">HDF</SelectItem>
                                <SelectItem value="OSB">OSB</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="thickness"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grosime (mm)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lungime (mm)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lățime (mm)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="pricePerSheet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preț per foaie (RON)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Anulează
                      </Button>
                      <Button type="submit">
                        {form.getValues("id") ? "Actualizează" : "Adaugă"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Denumire</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead className="text-right">Grosime (mm)</TableHead>
                    <TableHead className="text-right">Dimensiuni (mm)</TableHead>
                    <TableHead className="text-right">Preț/foaie (RON)</TableHead>
                    <TableHead className="text-right">Preț/m² (RON)</TableHead>
                    <TableHead className="text-right">Actualizat</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                        Nu există materiale. Adaugă un material nou.
                      </TableCell>
                    </TableRow>
                  ) : (
                    materials.map((material) => (
                      <TableRow key={material.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{material.name}</TableCell>
                        <TableCell>{material.type}</TableCell>
                        <TableCell className="text-right">{material.thickness}</TableCell>
                        <TableCell className="text-right">
                          {material.length} x {material.width}
                        </TableCell>
                        <TableCell className="text-right">
                          {material.pricePerSheet.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {material.pricePerSquareMeter.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Date(material.updatedAt).toLocaleDateString('ro-RO')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleEditMaterial(material)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDeleteMaterial(material.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsTab;
