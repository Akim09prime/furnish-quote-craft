
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '@/lib/contexts/AppContext';
import SaveButton from '@/lib/components/common/SaveButton';
import PageHeader from '@/lib/components/common/PageHeader';
import { useCategories } from '@/lib/hooks/useCategories';

const CategoriesAdminTab: React.FC = () => {
  const { createBackup } = useAppContext();
  const { categories, selectedCategory, setSelectedCategory, addCategory, deleteCategory } = useCategories();
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Numele categoriei nu poate fi gol");
      return;
    }

    addCategory(newCategoryName);
    setNewCategoryName("");
    setShowAddCategory(false);
    createBackup();
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) {
      toast.error("Selectați o categorie pentru ștergere");
      return;
    }

    deleteCategory(selectedCategory);
    createBackup();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administrare Categorii</CardTitle>
        <CardDescription>
          Adaugă sau șterge categorii în baza de date
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowAddCategory(!showAddCategory)} variant="outline" className="gap-2">
              <PlusCircle size={16} />
              <span>Categorie Nouă</span>
            </Button>
          </div>

          {showAddCategory && (
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Adaugă Categorie Nouă</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nume Categorie</label>
                <Input 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)} 
                  placeholder="ex. Glisiere, Balamale, etc."
                />
              </div>
              <div className="flex justify-end">
                <SaveButton 
                  onClick={handleAddCategory}
                  label="Salvează Categoria"
                />
              </div>
            </div>
          )}

          <div className="border rounded-md">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Nume Categorie</th>
                  <th className="py-3 px-4 w-20">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-4">
                      Nu există categorii
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.name} className="border-b">
                      <td className="py-3 px-4">{cat.name}</td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            if (selectedCategory === cat.name) {
                              handleDeleteCategory();
                            } else {
                              setSelectedCategory(cat.name);
                              toast.info(`Selectați "Șterge" din nou pentru a confirma ștergerea categoriei "${cat.name}"`);
                            }
                          }}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {selectedCategory && (
            <div className="flex justify-end">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteCategory}
                className="gap-2"
              >
                <Trash2 size={16} />
                <span>Șterge "{selectedCategory}"</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesAdminTab;
