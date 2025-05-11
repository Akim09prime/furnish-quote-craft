
import { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/contexts/AppContext';
import { toast } from 'sonner';
import { Category, Subcategory } from '@/lib/db'; // Asigurăm-ne că importăm tipurile corecte

export const useCategories = () => {
  const { database, updateDatabase } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory("");
  }, [selectedCategory]);

  const categories = database?.categories || [];
  
  const currentCategory = categories.find(c => c.name === selectedCategory);
  const subcategories = currentCategory?.subcategories || [];
  const currentSubcategory = subcategories.find(s => s.name === selectedSubcategory);

  const addCategory = (name: string) => {
    if (!database) return;
    
    if (categories.some(c => c.name === name)) {
      toast.error(`Categoria "${name}" există deja`);
      return;
    }
    
    // Creăm o categorie nouă cu structura corectă
    const newCategory: Category = {
      name,
      subcategories: []
    };
    
    const updatedCategories = [...categories, newCategory];
    
    updateDatabase({
      ...database,
      categories: updatedCategories
    });
    
    toast.success(`Categoria "${name}" a fost adăugată`);
  };

  const deleteCategory = (name: string) => {
    if (!database) return;
    
    const updatedCategories = categories.filter(c => c.name !== name);
    
    updateDatabase({
      ...database,
      categories: updatedCategories
    });
    
    if (selectedCategory === name) {
      setSelectedCategory("");
    }
    
    toast.success(`Categoria "${name}" a fost ștearsă`);
  };

  const addSubcategory = (categoryName: string, subcategoryName: string) => {
    if (!database) return;
    
    const category = categories.find(c => c.name === categoryName);
    if (!category) return;
    
    if (category.subcategories.some(s => s.name === subcategoryName)) {
      toast.error(`Subcategoria "${subcategoryName}" există deja`);
      return;
    }
    
    // Creăm o subcategorie nouă cu structura corectă
    const newSubcategory: Subcategory = {
      name: subcategoryName,
      products: [],
      fields: [] // Adăugăm câmpul obligatoriu fields
    };
    
    const updatedCategories = categories.map(c => {
      if (c.name === categoryName) {
        return {
          ...c,
          subcategories: [...c.subcategories, newSubcategory]
        };
      }
      return c;
    });
    
    updateDatabase({
      ...database,
      categories: updatedCategories
    });
    
    toast.success(`Subcategoria "${subcategoryName}" a fost adăugată`);
  };

  const deleteSubcategory = (categoryName: string, subcategoryName: string) => {
    if (!database) return;
    
    const updatedCategories = categories.map(c => {
      if (c.name === categoryName) {
        return {
          ...c,
          subcategories: c.subcategories.filter(s => s.name !== subcategoryName)
        };
      }
      return c;
    });
    
    updateDatabase({
      ...database,
      categories: updatedCategories
    });
    
    if (selectedSubcategory === subcategoryName) {
      setSelectedSubcategory("");
    }
    
    toast.success(`Subcategoria "${subcategoryName}" a fost ștearsă`);
  };

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    currentCategory,
    subcategories,
    currentSubcategory,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory
  };
};
