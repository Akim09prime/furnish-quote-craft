
import React, { useState } from 'react';
import { Database, addCategory, deleteCategory } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CategoriesAdminTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const CategoriesAdminTab: React.FC<CategoriesAdminTabProps> = ({ database, onDatabaseUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Numele categoriei nu poate fi gol");
      return;
    }

    try {
      const updatedDb = addCategory(database, newCategoryName);
      onDatabaseUpdate(updatedDb);
      setNewCategoryName("");
      setShowAddCategory(false);
      toast.success(`Categoria "${newCategoryName}" a fost adăugată`);
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : 'Eroare la adăugarea categoriei'}`);
    }
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) {
      toast.error("Selectați o categorie pentru ștergere");
      return;
    }

    try {
      const updatedDb = deleteCategory(database, selectedCategory);
      onDatabaseUpdate(updatedDb);
      setSelectedCategory("");
      toast.success(`Categoria "${selectedCategory}" a fost ștearsă`);
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : 'Eroare la ștergerea categoriei'}`);
    }
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
                <Button onClick={handleAddCategory} className="gap-2">
                  <Save size={16} />
                  <span>Salvează Categoria</span>
                </Button>
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
                {database.categories.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-4">
                      Nu există categorii
                    </td>
                  </tr>
                ) : (
                  database.categories.map((cat) => (
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
