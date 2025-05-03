
import React, { useEffect } from 'react';
import { Database } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";

interface CategorySelectorProps {
  database: Database | null;
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ database, selectedCategory, onSelectCategory }) => {
  // Enhanced debugging - check what's actually in the database prop
  useEffect(() => {
    console.log("CategorySelector database:", database);
    console.log("Categories available:", database?.categories?.map(c => c.name) || "No categories");
    console.log("Categories count:", database?.categories?.length || 0);
    
    // Check if there are any initialization problems
    if (!database) {
      console.error("DATABASE IS NULL");
    } else if (!database.categories) {
      console.error("DATABASE CATEGORIES IS NULL OR UNDEFINED");
    } else if (database.categories.length === 0) {
      console.error("DATABASE CATEGORIES IS EMPTY ARRAY");
    } else {
      console.log("DATABASE IS VALID WITH CATEGORIES:", database.categories.length);
    }
  }, [database]);
  
  // Safety check with more detailed error message
  if (!database || !database.categories || database.categories.length === 0) {
    console.error("No database or categories available");
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
        <h3 className="font-bold">Eroare la încărcarea categoriilor</h3>
        <p className="text-sm">
          {!database ? "Baza de date nu este disponibilă." : 
           !database.categories ? "Categoriile nu sunt definite." : 
           "Nu există categorii în baza de date."}
        </p>
      </div>
    );
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
