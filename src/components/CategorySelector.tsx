
import React from 'react';
import { Database, Category } from '@/lib/db';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CategorySelectorProps = {
  database: Database;
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
};

const CategorySelector: React.FC<CategorySelectorProps> = ({
  database,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Selectează Categoria</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {database.categories.map((category) => (
          <Card 
            key={category.name}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedCategory === category.name 
                ? 'border-furniture-purple ring-2 ring-furniture-purple/20' 
                : 'border-gray-200 hover:border-furniture-purple/50'
            }`}
            onClick={() => onSelectCategory(category.name)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <h3 className="font-medium text-lg mb-2">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {category.subcategories.length} subcategorii
              </p>
              <Button
                variant={selectedCategory === category.name ? "default" : "outline"}
                className="mt-auto"
              >
                {selectedCategory === category.name ? "Selectat" : "Selectează"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
