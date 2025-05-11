
import React from 'react';
import { Category } from '@/lib/db';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
  variant?: 'cards' | 'dropdown';
  className?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  variant = 'cards',
  className = ''
}) => {
  if (!categories || categories.length === 0) {
    return <div className="text-yellow-500 p-4">Nu există categorii disponibile</div>;
  }

  if (variant === 'dropdown') {
    return (
      <div className={className}>
        <Select 
          value={selectedCategory || ''} 
          onValueChange={onSelectCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selectează o categorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.name} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold">Selectează o categorie</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
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
