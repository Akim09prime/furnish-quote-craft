
import React from 'react';
import { Database } from '@/lib/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import AdminCategoryManager from '@/components/AdminCategoryManager';

interface ManageCategoriesTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const ManageCategoriesTab: React.FC<ManageCategoriesTabProps> = ({ database, onDatabaseUpdate }) => {
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const category = database.categories.find(c => c.name === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
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
