import React from 'react';
import { Database } from '@/lib/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from "sonner";
import AdminCategoryManager from '@/components/AdminCategoryManager';

interface ManageCategoriesTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const ManageCategoriesTab: React.FC<ManageCategoriesTabProps> = ({ database, onDatabaseUpdate }) => {
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const category = database.categories.find(c => c.name === selectedCategory);

  // Function to create a backup of the current database
  const createBackup = (db: Database) => {
    try {
      const BACKUP_KEY = "furniture-quote-db-backups";
      
      const newBackup = {
        date: new Date().toISOString(),
        database: db
      };
      
      // Get existing backups
      const savedBackups = localStorage.getItem(BACKUP_KEY);
      let existingBackups = [];
      
      if (savedBackups) {
        existingBackups = JSON.parse(savedBackups);
      }
      
      // Add new backup
      existingBackups.push(newBackup);
      
      // Keep only the last 10 backups
      const limitedBackups = existingBackups.slice(-10);
      
      // Save to localStorage
      localStorage.setItem(BACKUP_KEY, JSON.stringify(limitedBackups));
      
      console.log("Backup created:", newBackup.date);
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  };

  // Function to save a specific category
  const saveCategory = (categoryName: string) => {
    if (!database) return;
    
    console.log(`Saving category: ${categoryName}`);
    
    // Create backup before saving
    createBackup(database);
    
    // Save to localStorage
    onDatabaseUpdate({...database});
    
    toast.success(`Categoria "${categoryName}" a fost salvată cu succes`, {
      duration: 20000
    });
  };
  
  // Function to specifically save Balamale
  const saveBalamale = () => {
    console.log("Saving Balamale category");
    saveCategory("Balamale");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2">
          <label className="text-sm font-medium mb-2 block">Categorie</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        
        <div className="flex gap-2">
          {/* Save button for Balamale */}
          <Button 
            onClick={saveBalamale}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvează Balamale
          </Button>
          
          {selectedCategory && (
            <Button 
              onClick={() => saveCategory(selectedCategory)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvează {selectedCategory}
            </Button>
          )}
        </div>
      </div>

      {category ? (
        <AdminCategoryManager
          database={database}
          category={category}
          onDatabaseUpdate={onDatabaseUpdate}
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 py-10">
              Selectează o categorie pentru a începe gestionarea
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageCategoriesTab;
