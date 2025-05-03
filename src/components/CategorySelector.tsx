
import React, { useEffect } from 'react';
import { Database } from '@/lib/db';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

interface CategorySelectorProps {
  database: Database | null;
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ database, selectedCategory, onSelectCategory }) => {
  console.log("[CategorySelector] Rendering with database:", database);
  console.log("[CategorySelector] Categories available:", database?.categories?.map(c => c.name) || "No categories");
  
  useEffect(() => {
    if (!database) {
      console.error("[CategorySelector] No database provided");
      toast.error("Eroare la încărcarea bazei de date");
      return;
    }
    
    if (!database.categories || database.categories.length === 0) {
      console.error("[CategorySelector] No categories found in database");
      toast.error("Nu s-au găsit categorii în baza de date");
      return;
    }
    
    console.log("[CategorySelector] Successfully loaded categories:", database.categories.map(c => c.name));
  }, [database]);
  
  // Safety check
  if (!database || !database.categories) {
    console.error("[CategorySelector] No database or categories available");
    return <div className="text-red-500 p-4">Eroare la încărcarea categoriilor</div>;
  }
  
  if (database.categories.length === 0) {
    console.error("[CategorySelector] Database loaded but categories array is empty");
    return <div className="text-yellow-500 p-4">Nu există categorii disponibile</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Selectează o categorie</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {database.categories.map(category => (
          <Card 
            key={category.name} 
            className={`cursor-pointer transition-all ${
              selectedCategory === category.name 
                ? 'border-furniture-purple ring-2 ring-furniture-purple/20' 
                : 'hover:border-furniture-purple/30 hover:shadow-md'
            }`}
            onClick={() => onSelectCategory(category.name)}
          >
            <CardContent className="flex justify-center items-center py-8">
              <span className="text-xl font-medium">{category.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
