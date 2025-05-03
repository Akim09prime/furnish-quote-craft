
import React, { useState } from 'react';
import { Database, saveDatabase } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  successMessage,
}) => {
  const [newType, setNewType] = useState("");
  const [editing, setEditing] = useState<{ index: number; oldValue: string; newValue: string } | null>(null);
  
  // Find the subcategory and field
  const category = database.categories.find(c => c.name === categoryName);
  const subcategory = category?.subcategories.find(s => s.name === subcategoryName);
  const field = subcategory?.fields.find(f => f.name === fieldName);
  
  const types = field?.options || [];

  const addType = () => {
    if (!newType.trim()) {
      toast.error("Trebuie să introduceți un tip");
      return;
    }

    if (types.includes(newType.trim())) {
      toast.error(`Tipul "${newType}" există deja`);
      return;
    }

    // Add the new type
    const updatedDb = { ...database };
    const categoryIndex = updatedDb.categories.findIndex(c => c.name === categoryName);
    if (categoryIndex === -1) return;

    const subcategoryIndex = updatedDb.categories[categoryIndex].subcategories
      .findIndex(s => s.name === subcategoryName);
    if (subcategoryIndex === -1) return;

    const fieldIndex = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].fields
      .findIndex(f => f.name === fieldName);
    if (fieldIndex === -1) return;

    const field = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].fields[fieldIndex];
    if (field.type !== 'select' || !field.options) return;

    field.options.push(newType.trim());

    // Save and update
    saveDatabase(updatedDb);
    onDatabaseUpdate(updatedDb);
    setNewType("");
    toast.success(successMessage.replace("{type}", newType));
  };
  
  const startEditing = (index: number) => {
    setEditing({
      index,
      oldValue: types[index],
      newValue: types[index]
    });
  };
  
  const cancelEditing = () => {
    setEditing(null);
  };
  
  const saveEdit = () => {
    if (!editing) return;
    
    if (!editing.newValue.trim()) {
      toast.error("Valoarea nu poate fi goală");
      return;
    }
    
    if (types.includes(editing.newValue.trim()) && editing.newValue.trim() !== editing.oldValue) {
      toast.error(`Tipul "${editing.newValue}" există deja`);
      return;
    }
    
    // Update the type
    const updatedDb = { ...database };
    const categoryIndex = updatedDb.categories.findIndex(c => c.name === categoryName);
    if (categoryIndex === -1) return;

    const subcategoryIndex = updatedDb.categories[categoryIndex].subcategories
      .findIndex(s => s.name === subcategoryName);
    if (subcategoryIndex === -1) return;

    const fieldIndex = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].fields
      .findIndex(f => f.name === fieldName);
    if (fieldIndex === -1) return;

    const field = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].fields[fieldIndex];
    if (field.type !== 'select' || !field.options) return;

    // Update the option
    field.options[editing.index] = editing.newValue.trim();
    
    // Save and update
    saveDatabase(updatedDb);
    onDatabaseUpdate(updatedDb);
    toast.success("Modificările au fost salvate");
    setEditing(null);
  };
  
  const deleteType = (index: number) => {
    const typeToDelete = types[index];
    
    // Check if the type is used in any products
    const isTypeUsed = checkIfTypeIsUsed(typeToDelete);
    if (isTypeUsed) {
      toast.error(`Tipul "${typeToDelete}" este folosit în produse și nu poate fi șters`);
      return;
    }
    
    // Delete the type
    const updatedDb = { ...database };
    const categoryIndex = updatedDb.categories.findIndex(c => c.name === categoryName);
    if (categoryIndex === -1) return;

    const subcategoryIndex = updatedDb.categories[categoryIndex].subcategories
      .findIndex(s => s.name === subcategoryName);
    if (subcategoryIndex === -1) return;

    const fieldIndex = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].fields
      .findIndex(f => f.name === fieldName);
    if (fieldIndex === -1) return;

    const field = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].fields[fieldIndex];
    if (field.type !== 'select' || !field.options) return;

    // Remove the option
    field.options.splice(index, 1);
    
    // Save and update
    saveDatabase(updatedDb);
    onDatabaseUpdate(updatedDb);
    toast.success(`Tipul "${typeToDelete}" a fost șters`);
  };
  
  const checkIfTypeIsUsed = (typeValue: string): boolean => {
    const category = database.categories.find(c => c.name === categoryName);
    if (!category) return false;
    
    const subcategory = category.subcategories.find(s => s.name === subcategoryName);
    if (!subcategory) return false;
    
    // Check if any product uses this type
    return subcategory.products.some(product => product[fieldName] === typeValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm mb-2 block">{inputLabel}</label>
            <Input
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder={inputPlaceholder}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addType} className="gap-1">
              <Plus size={16} /> {addButtonLabel}
            </Button>
          </div>
        </div>

        <h3 className="font-medium mb-2">Tipuri Existente:</h3>
        <div className="border rounded-md">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-2 px-3">Tip</th>
                <th className="w-[150px] py-2 px-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {types.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    Nu există tipuri definite
                  </td>
                </tr>
              ) : (
                types.map((type, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-2 px-3">
                      {editing && editing.index === index ? (
                        <Input 
                          value={editing.newValue} 
                          onChange={(e) => setEditing({...editing, newValue: e.target.value})}
                          className="h-8" 
                        />
                      ) : (
                        type
                      )}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {editing && editing.index === index ? (
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={cancelEditing}
                          >
                            <X size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50"
                            onClick={saveEdit}
                          >
                            <Save size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => startEditing(index)}
                          >
                            <Edit size={16} />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Sigur doriți să ștergeți tipul "{type}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Anulează</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteType(index)}>
                                  Șterge
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypesEditorTab;
