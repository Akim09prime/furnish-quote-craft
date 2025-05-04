
import React, { useState, useEffect } from 'react';
import { Database } from '@/lib/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import AdminCategoryEditor from '@/components/AdminCategoryEditor';
import { toast } from 'sonner';
import { storage } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface EditProductsTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const EditProductsTab: React.FC<EditProductsTabProps> = ({ database, onDatabaseUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(false);

  const category = database.categories.find(c => c.name === selectedCategory);
  const subcategory = category?.subcategories.find(s => s.name === selectedSubcategory);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory("");
  };

  // Check if Firebase Storage is initialized
  useEffect(() => {
    const checkStorage = async () => {
      try {
        if (!storage) {
          console.error("Firebase Storage nu este inițializat în EditProductsTab!");
          toast.error("Eroare: Firebase Storage nu este disponibil");
          setStorageAvailable(false);
          return;
        }
        
        console.log("Firebase Storage este disponibil în EditProductsTab");
        setStorageAvailable(true);
      } catch (error) {
        console.error("Error checking Firebase Storage:", error);
        toast.error("Eroare la verificarea Firebase Storage");
        setStorageAvailable(false);
      }
    };
    
    checkStorage();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Categorie</label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează categoria" />
            </SelectTrigger>
            <SelectContent>
              {database.categories.map(category => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Subcategorie</label>
          <Select 
            value={selectedSubcategory} 
            onValueChange={setSelectedSubcategory}
            disabled={!selectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectează subcategoria" />
            </SelectTrigger>
            <SelectContent>
              {category?.subcategories.map(sub => (
                <SelectItem key={sub.name} value={sub.name}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!storageAvailable && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenție!</AlertTitle>
          <AlertDescription>
            Firebase Storage nu este disponibil. Încărcarea imaginilor nu va funcționa.
            Verificați consola pentru mai multe detalii.
          </AlertDescription>
        </Alert>
      )}

      {category && subcategory ? (
        <AdminCategoryEditor 
          database={database}
          category={category}
          subcategory={subcategory}
          onDatabaseUpdate={onDatabaseUpdate}
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 py-10">
              Selectează o categorie și o subcategorie pentru a începe editarea
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditProductsTab;
