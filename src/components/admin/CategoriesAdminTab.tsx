
import React, { useState } from 'react';
import { useAppContext } from '@/lib/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import SaveButton from '@/lib/components/common/SaveButton';
import PageHeader from '@/lib/components/common/PageHeader';
import { useCategories } from '@/lib/hooks/useCategories';
import { Database } from '@/lib/db';

// Adăugăm interfața props-urilor
interface CategoriesAdminTabProps {
  database?: Database;
  onDatabaseUpdate?: (db: Database) => void;
}

const CategoriesAdminTab: React.FC<CategoriesAdminTabProps> = ({ database, onDatabaseUpdate }) => {
  const { createBackup } = useAppContext();
  const { categories, selectedCategory, setSelectedCategory, addCategory, deleteCategory } = useCategories();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Numele categoriei nu poate fi gol');
      return;
    }
    
    addCategory(newCategoryName);
    setNewCategoryName('');
    setIsAdding(false);
    createBackup();
  };

  const handleDeleteCategory = (categoryName: string) => {
    if (window.confirm(`Sigur doriți să ștergeți categoria "${categoryName}" și toate subcategoriile sale?`)) {
      deleteCategory(categoryName);
      createBackup();
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Gestionare Categorii" 
        description="Adaugă, modifică sau șterge categorii de produse" 
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Categorii</h3>
            <SaveButton onClick={() => createBackup()} tooltip="Salvează modificările" />
          </div>
          
          {/* Lista de categorii */}
          <div className="space-y-2">
            {categories.map((category) => (
              <div 
                key={category.name}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <span className="font-medium">{category.name}</span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    Editează
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteCategory(category.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Adăugare categorie nouă */}
          {isAdding ? (
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Nume categorie"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                autoFocus
              />
              <Button onClick={handleAddCategory}>Adaugă</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Anulează</Button>
            </div>
          ) : (
            <Button 
              className="mt-4 w-full" 
              variant="outline"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adaugă categorie
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesAdminTab;
