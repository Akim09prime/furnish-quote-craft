
import React, { useState } from 'react';
import { 
  Category, 
  Database, 
  addSubcategory,
  deleteSubcategory,
  updateSubcategory
} from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, 
} from "@/components/ui/form";
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, Save, Trash2, Edit, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Form validation schema
const newSubcategorySchema = z.object({
  name: z.string().min(2, {
    message: "Numele subcategoriei trebuie să aibă cel puțin 2 caractere"
  }),
  fieldName: z.string().min(2, {
    message: "Numele câmpului trebuie să aibă cel puțin 2 caractere"
  }).optional(),
  fieldType: z.enum(["select", "text", "number", "boolean"]).optional(),
  fieldOptions: z.string().optional(),
});

type NewSubcategoryFormValues = z.infer<typeof newSubcategorySchema>;

interface AdminCategoryManagerProps {
  database: Database;
  category: Category;
  onDatabaseUpdate: (db: Database) => void;
}

const AdminCategoryManager: React.FC<AdminCategoryManagerProps> = ({ 
  database, 
  category,
  onDatabaseUpdate
}) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [fields, setFields] = useState<{
    name: string;
    type: "select" | "text" | "number" | "boolean";
    options?: string[];
  }[]>([]);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  // Initialize the form
  const form = useForm<NewSubcategoryFormValues>({
    resolver: zodResolver(newSubcategorySchema),
    defaultValues: {
      name: "",
      fieldName: "",
      fieldType: "select",
      fieldOptions: "",
    },
  });

  const startEditSubcategory = (subcategoryName: string) => {
    const subcategory = category.subcategories.find(s => s.name === subcategoryName);
    if (!subcategory) return;
    
    setIsEditing(true);
    setEditingSubcategory(subcategoryName);
    setShowForm(true);
    form.setValue("name", subcategoryName);
    setFields([...subcategory.fields]); // make a copy of fields
  };

  const startEditFields = (subcategoryName: string) => {
    const subcategory = category.subcategories.find(s => s.name === subcategoryName);
    if (!subcategory) return;
    
    setSelectedSubcategory(subcategoryName);
    setShowFieldEditor(true);
    setFields([...subcategory.fields]); // make a copy of fields
    form.reset();
  };

  const addField = () => {
    const { fieldName, fieldType, fieldOptions } = form.getValues();
    
    // Validate field data
    if (!fieldName) {
      toast.error("Trebuie să specificați un nume pentru câmp");
      return;
    }

    // Convert comma-separated options to array for select fields
    let options: string[] | undefined;
    if (fieldType === "select") {
      if (!fieldOptions) {
        toast.error("Trebuie să specificați opțiuni pentru câmpul de tip select");
        return;
      }
      options = fieldOptions.split(',').map(opt => opt.trim());
    }

    // Add the field to our local state
    setFields([...fields, {
      name: fieldName,
      type: fieldType as "select" | "text" | "number" | "boolean",
      ...(options ? { options } : {})
    }]);

    // Reset the field inputs
    form.setValue("fieldName", "");
    form.setValue("fieldOptions", "");
    
    // Show temporary feedback
    toast.success(`Câmpul "${fieldName}" a fost adăugat`);
  };

  const removeField = (index: number) => {
    const fieldName = fields[index].name;
    setFields(fields.filter((_, i) => i !== index));
    toast.info(`Câmpul "${fieldName}" a fost eliminat`);
  };

  const handleSubmit = (data: NewSubcategoryFormValues) => {
    // Clear any previous success message
    setSuccessMessage(null);
    
    // Validate that we have at least one field
    if (fields.length === 0) {
      toast.error("Trebuie să adăugați cel puțin un câmp");
      return;
    }

    try {
      let updatedDb;
      
      if (isEditing && editingSubcategory) {
        // Update existing subcategory
        updatedDb = updateSubcategory(database, category.name, editingSubcategory, {
          name: data.name,
          fields: [...fields], // Make a copy of fields array
          products: category.subcategories.find(s => s.name === editingSubcategory)?.products || []
        });
        
        setSuccessMessage(`Subcategoria "${data.name}" a fost actualizată cu succes`);
        toast.success(`Subcategoria "${data.name}" a fost actualizată`);
      } else {
        // Add new subcategory
        updatedDb = addSubcategory(database, category.name, {
          name: data.name,
          fields: [...fields], // Make a copy of fields array
          products: []
        });
        
        setSuccessMessage(`Subcategoria "${data.name}" a fost adăugată cu succes în categoria "${category.name}"`);
        toast.success(`Subcategoria "${data.name}" a fost adăugată`);
      }
      
      // Update parent component's database state
      onDatabaseUpdate(updatedDb);
      
      // Reset form state
      setFields([]);
      form.reset();
      setIsEditing(false);
      setEditingSubcategory(null);
      
      // Close form after success
      setShowForm(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      toast.error(`Eroare: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error adding/updating subcategory:', error);
    }
  };

  const saveFieldChanges = () => {
    if (!selectedSubcategory) return;
    
    try {
      // Get current subcategory
      const subcategory = category.subcategories.find(s => s.name === selectedSubcategory);
      if (!subcategory) return;
      
      // Update subcategory with new fields
      const updatedDb = updateSubcategory(database, category.name, selectedSubcategory, {
        name: selectedSubcategory,
        fields: [...fields],
        products: subcategory.products
      });
      
      // Update parent component's database state
      onDatabaseUpdate(updatedDb);
      
      // Show success message
      toast.success(`Câmpurile subcategoriei "${selectedSubcategory}" au fost actualizate`);
      
      // Reset state and close editor
      setShowFieldEditor(false);
      setSelectedSubcategory(null);
      setFields([]);
    } catch (error) {
      toast.error(`Eroare: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error updating subcategory fields:', error);
    }
  };

  const handleDeleteSubcategory = (subcategoryName: string) => {
    try {
      const updatedDb = deleteSubcategory(database, category.name, subcategoryName);
      onDatabaseUpdate(updatedDb);
      
      toast.success(`Subcategoria "${subcategoryName}" a fost ștearsă`);
      setSubcategoryToDelete(null);
    } catch (error) {
      toast.error(`Eroare la ștergerea subcategoriei: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFormCancel = () => {
    setFields([]);
    setShowForm(false);
    setIsEditing(false);
    setEditingSubcategory(null);
    form.reset();
  };

  const handleFieldEditorCancel = () => {
    setShowFieldEditor(false);
    setSelectedSubcategory(null);
    setFields([]);
  };

  const getFieldTypeDisplay = (type: string) => {
    switch(type) {
      case "select": return "Selecție";
      case "text": return "Text";
      case "number": return "Număr";
      case "boolean": return "Da/Nu";
      default: return type;
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Administrare Categorie: {category.name}</span>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            variant="outline" 
            size="sm"
            className="gap-1"
          >
            <PlusCircle size={16} />
            <span>Subcategorie Nouă</span>
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md">
            {successMessage}
          </div>
        )}
      
        {showForm ? (
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium">
              {isEditing ? `Editare Subcategorie: ${editingSubcategory}` : 'Adaugă Subcategorie Nouă'}
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume Subcategorie</FormLabel>
                      <FormControl>
                        <Input placeholder="ex. Glisiere GTV pe bile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-2">Câmpuri Produs</h4>
                  
                  {fields.length > 0 && (
                    <div className="mb-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-1">Nume Câmp</th>
                            <th className="text-left pb-1">Tip</th>
                            <th className="text-left pb-1">Opțiuni</th>
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((field, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="py-1">{field.name}</td>
                              <td>{getFieldTypeDisplay(field.type)}</td>
                              <td>
                                {field.options ? field.options.join(', ') : ''}
                              </td>
                              <td>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeField(idx)}
                                  className="h-7 w-7"
                                >
                                  ×
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <FormField
                      control={form.control}
                      name="fieldName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nume Câmp</FormLabel>
                          <FormControl>
                            <Input placeholder="ex. Dimensiune" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fieldType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip Câmp</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              <option value="select">Selecție (dropdown)</option>
                              <option value="text">Text</option>
                              <option value="number">Număr</option>
                              <option value="boolean">Da/Nu (checkbox)</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {form.watch("fieldType") === "select" && (
                    <FormField
                      control={form.control}
                      name="fieldOptions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opțiuni (separate prin virgulă)</FormLabel>
                          <FormControl>
                            <Input placeholder="ex. 30mm, 40mm, 50mm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addField}
                    className="mt-2"
                  >
                    Adaugă Câmp
                  </Button>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={handleFormCancel}>
                    Anulează
                  </Button>
                  <Button type="submit" className="gap-1">
                    <Save size={16} />
                    <span>{isEditing ? 'Salvează Modificările' : 'Salvează Subcategoria'}</span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : showFieldEditor ? (
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium">
              Editare Câmpuri pentru: {selectedSubcategory}
            </h3>
            
            <div className="space-y-4">
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Câmpuri Existente</h4>
                
                {fields.length > 0 ? (
                  <div className="mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-1">Nume Câmp</th>
                          <th className="text-left pb-1">Tip</th>
                          <th className="text-left pb-1">Opțiuni</th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="py-1">{field.name}</td>
                            <td>{getFieldTypeDisplay(field.type)}</td>
                            <td>
                              {field.options ? field.options.join(', ') : ''}
                            </td>
                            <td>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeField(idx)}
                                className="h-7 w-7"
                              >
                                ×
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Nu există câmpuri</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="text-sm font-medium">Nume Câmp</label>
                    <Input 
                      placeholder="ex. Dimensiune" 
                      {...form.register("fieldName")}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Tip Câmp</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...form.register("fieldType")}
                    >
                      <option value="select">Selecție (dropdown)</option>
                      <option value="text">Text</option>
                      <option value="number">Număr</option>
                      <option value="boolean">Da/Nu (checkbox)</option>
                    </select>
                  </div>
                </div>
                
                {form.watch("fieldType") === "select" && (
                  <div className="mb-4">
                    <label className="text-sm font-medium">Opțiuni (separate prin virgulă)</label>
                    <Input 
                      placeholder="ex. 30mm, 40mm, 50mm" 
                      {...form.register("fieldOptions")}
                    />
                  </div>
                )}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addField}
                  className="mt-2"
                >
                  Adaugă Câmp
                </Button>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleFieldEditorCancel}>
                  Anulează
                </Button>
                <Button onClick={saveFieldChanges} className="gap-1">
                  <Save size={16} />
                  <span>Salvează Câmpurile</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 text-sm">
              Selectați "Subcategorie Nouă" pentru a adăuga o nouă subcategorie la {category.name}.
            </p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Subcategorii existente:</h3>
              {category.subcategories.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nu există subcategorii</p>
              ) : (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-2 px-3">Nume Subcategorie</th>
                        <th className="text-left py-2 px-3">Câmpuri</th>
                        <th className="text-left py-2 px-3">Produse</th>
                        <th className="w-40 py-2 px-3">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.subcategories.map((sub, idx) => (
                        <tr key={idx} className="border-b last:border-b-0">
                          <td className="py-2 px-3">{sub.name}</td>
                          <td className="py-2 px-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="text-left w-full">
                                  <div className="flex flex-wrap gap-1">
                                    {sub.fields.map((field, fidx) => (
                                      <Badge key={fidx} variant="outline" className="text-xs">
                                        {field.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    {sub.fields.map(f => f.name).join(', ')}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                          <td className="py-2 px-3">{sub.products.length}</td>
                          <td className="py-2 px-3 text-right flex space-x-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50"
                              onClick={() => startEditFields(sub.name)}
                              title="Editare câmpuri"
                            >
                              <Plus size={16} />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => startEditSubcategory(sub.name)}
                              title="Editare subcategorie"
                            >
                              <Edit size={16} />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setSubcategoryToDelete(sub.name)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Ștergere Subcategorie</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Sunteți sigur că doriți să ștergeți subcategoria "{sub.name}"?
                                    <br />
                                    <br />
                                    <strong className="text-red-600">
                                      Atenție: Această acțiune va șterge toate produsele asociate și nu poate fi anulată!
                                    </strong>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Anulează</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteSubcategory(sub.name)}
                                  >
                                    Șterge
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCategoryManager;
