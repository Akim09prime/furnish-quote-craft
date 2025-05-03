
import React, { useState } from 'react';
import { Database, updateSubcategory } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

interface TypesEditorTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
  categoryName: string;
  subcategoryName: string;
  fieldName: string;
  title: string;
  description: string;
  addButtonLabel: string;
  inputLabel: string;
  inputPlaceholder: string;
  successMessage: string;
}

const TypesEditorTab: React.FC<TypesEditorTabProps> = ({
  database,
  onDatabaseUpdate,
  categoryName,
  subcategoryName,
  fieldName,
  title,
  description,
  addButtonLabel,
  inputLabel,
  inputPlaceholder,
  successMessage
}) => {
  const [newTypeOption, setNewTypeOption] = useState<string>("");
  const [showAddType, setShowAddType] = useState<boolean>(false);

  // Get the current options list
  const category = database.categories.find(cat => cat.name === categoryName);
  const subcategory = category?.subcategories.find(sub => sub.name === subcategoryName);
  const field = subcategory?.fields.find(field => field.name === fieldName);
  const currentOptions = field?.options || [];

  const handleAddNewTypeOption = () => {
    if (!newTypeOption.trim()) {
      toast.error(`${inputLabel} nu poate fi gol`);
      return;
    }
    
    if (!category) {
      toast.error(`Categoria ${categoryName} nu a fost găsită`);
      return;
    }
    
    if (!subcategory) {
      toast.error(`Subcategoria ${subcategoryName} nu a fost găsită`);
      return;
    }
    
    // Find the Type field
    if (!field || !field.options) {
      toast.error(`Câmpul ${fieldName} nu a fost găsit sau nu are opțiuni`);
      return;
    }
    
    // Check if option already exists
    if (field.options.includes(newTypeOption.trim())) {
      toast.error(`Opțiunea "${newTypeOption}" există deja`);
      return;
    }
    
    // Create updated subcategory with new option
    const updatedSubcategory = {
      ...subcategory,
      fields: subcategory.fields.map(field => {
        if (field.name === fieldName) {
          return {
            ...field,
            options: [...field.options!, newTypeOption.trim()]
          };
        }
        return field;
      })
    };
    
    try {
      // Update the database
      const updatedDb = updateSubcategory(
        database,
        categoryName,
        subcategoryName,
        updatedSubcategory
      );
      
      onDatabaseUpdate(updatedDb);
      setNewTypeOption("");
      setShowAddType(false);
      
      toast.success(successMessage.replace("{type}", newTypeOption));
      
      // Force page refresh to get updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding type option:", error);
      toast.error("A apărut o eroare la adăugarea tipului");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowAddType(!showAddType)} variant="outline" className="gap-2">
              <PlusCircle size={16} />
              <span>{addButtonLabel}</span>
            </Button>
          </div>

          {showAddType && (
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Adaugă {inputLabel}</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nume Tip</label>
                <Input 
                  value={newTypeOption} 
                  onChange={(e) => setNewTypeOption(e.target.value)} 
                  placeholder={inputPlaceholder}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddNewTypeOption} className="gap-2">
                  <Save size={16} />
                  <span>Salvează</span>
                </Button>
              </div>
            </div>
          )}

          {/* Display existing types */}
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Tipuri Existente</th>
                </tr>
              </thead>
              <tbody>
                {currentOptions.length === 0 ? (
                  <tr>
                    <td className="text-center py-4">
                      Nu există tipuri
                    </td>
                  </tr>
                ) : (
                  currentOptions.map((type) => (
                    <tr key={type} className="border-b">
                      <td className="py-3 px-4">{type}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypesEditorTab;
