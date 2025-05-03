
import React, { useState } from 'react';
import { 
  Category, 
  Database, 
  saveDatabase,
  addSubcategory
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
import { PlusCircle, Save } from 'lucide-react';

// Form validation schema
const newSubcategorySchema = z.object({
  name: z.string().min(2, {
    message: "Numele subcategoriei trebuie să aibă cel puțin 2 caractere"
  }),
  fieldName: z.string().min(2, {
    message: "Numele câmpului trebuie să aibă cel puțin 2 caractere"
  }),
  fieldType: z.enum(["select", "text", "number", "boolean"]),
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
  const [fields, setFields] = useState<{
    name: string;
    type: "select" | "text" | "number" | "boolean";
    options?: string[];
  }[]>([]);
  
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
      type: fieldType,
      ...(options ? { options } : {})
    }]);

    // Reset the field inputs
    form.setValue("fieldName", "");
    form.setValue("fieldOptions", "");
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: NewSubcategoryFormValues) => {
    // Validate that we have at least one field
    if (fields.length === 0) {
      toast.error("Trebuie să adăugați cel puțin un câmp");
      return;
    }

    // Add subcategory to database
    try {
      const updatedDb = addSubcategory(database, category.name, {
        name: data.name,
        fields: fields,
        products: []
      });
      
      saveDatabase(updatedDb);
      onDatabaseUpdate(updatedDb);
      
      // Reset form state
      setFields([]);
      setShowForm(false);
      form.reset();
      
      toast.success(`Subcategoria "${data.name}" a fost adăugată`);
    } catch (error) {
      toast.error(`Eroare la adăugarea subcategoriei: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFormCancel = () => {
    setFields([]);
    setShowForm(false);
    form.reset();
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
        {showForm ? (
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium">Adaugă Subcategorie Nouă</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume Subcategorie</FormLabel>
                      <FormControl>
                        <Input placeholder="ex. Picurator vase" {...field} />
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
                    <span>Salvează Subcategoria</span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 text-sm">
              Selectați "Subcategorie Nouă" pentru a adăuga o nouă subcategorie la {category.name}.
            </p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Subcategorii existente:</h3>
              <ul className="list-disc pl-5">
                {category.subcategories.map((sub, idx) => (
                  <li key={idx}>{sub.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCategoryManager;
