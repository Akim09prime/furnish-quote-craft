
import React from 'react';
import { Database } from '@/lib/db';
import { Card, CardContent } from "@/components/ui/card";

interface CategorySelectorProps {
  database: Database | null;
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ database, selectedCategory, onSelectCategory }) => {
  console.log("CategorySelector database:", database); // Add this line for debugging
  
  if (!database) return null;

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
