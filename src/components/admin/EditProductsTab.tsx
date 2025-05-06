import React, { useState, useEffect } from 'react';
import { Database } from '@/lib/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import AdminCategoryEditor from '@/components/AdminCategoryEditor';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkCloudinaryAvailability } from '@/lib/cloudinary';

interface EditProductsTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const EditProductsTab: React.FC<EditProductsTabProps> = ({ database, onDatabaseUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [cloudinaryAvailable, setCloudinaryAvailable] = useState(true);
  const [isCheckingService, setIsCheckingService] = useState(false);

  const category = database.categories.find(c => c.name === selectedCategory);
  const subcategory = category?.subcategories.find(s => s.name === selectedSubcategory);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory("");
  };

  // Verificăm dacă putem accesa Cloudinary
  useEffect(() => {
    checkCloudinaryAvailability();
  }, []);

  const checkCloudinaryAvailability = async () => {
    setIsCheckingService(true);
    try {
      // Verificăm dacă putem accesa API-ul Cloudinary folosind metoda nouă
      const isAvailable = await checkCloudinaryAvailability();
      setCloudinaryAvailable(isAvailable);
      
      if (isAvailable) {
        console.log("Cloudinary API este disponibil");
        toast.success("Cloudinary API este disponibil");
      } else {
        console.error("Cloudinary API nu este disponibil");
        toast.error("Eroare: Cloudinary API nu este disponibil");
      }
    } catch (error) {
      console.error("Eroare la verificarea Cloudinary:", error);
      setCloudinaryAvailable(false);
      toast.error("Eroare la verificarea Cloudinary");
    } finally {
      setIsCheckingService(false);
    }
  };

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

      {!cloudinaryAvailable && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenție!</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Cloudinary API nu este disponibil. Încărcarea imaginilor nu va funcționa.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 flex items-center gap-1" 
              onClick={checkCloudinaryAvailability}
              disabled={isCheckingService}
            >
              <RefreshCw className="h-3 w-3" />
              {isCheckingService ? "Verificare..." : "Verifică din nou"}
            </Button>
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
