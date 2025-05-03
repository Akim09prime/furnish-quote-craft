
import { Database, Category, Subcategory, Product } from './types';
import { saveDatabase } from './database';

// Helper functions for working with the database
export const getCategoryByName = (db: Database, name: string): Category | undefined => {
  return db.categories.find(c => c.name === name);
};

export const getSubcategoryByName = (category: Category, name: string): Subcategory | undefined => {
  return category.subcategories.find(s => s.name === name);
};

export const getProductById = (subcategory: Subcategory, id: string): Product | undefined => {
  return subcategory.products.find(p => p.id === id);
};

// Add a new category to the database
export const addCategory = (db: Database, categoryName: string): Database => {
  const newDb = { ...db };
  
  // Check if category already exists
  if (newDb.categories.some(c => c.name === categoryName)) {
    throw new Error(`Categoria "${categoryName}" există deja`);
  }
  
  // Add new category
  newDb.categories.push({
    name: categoryName,
    subcategories: []
  });
  
  saveDatabase(newDb); // Save the database immediately
  return newDb;
};

// Delete a category from the database
export const deleteCategory = (db: Database, categoryName: string): Database => {
  const newDb = { ...db };
  
  // Check if category exists
  const categoryIndex = newDb.categories.findIndex(c => c.name === categoryName);
  if (categoryIndex === -1) {
    throw new Error(`Categoria "${categoryName}" nu există`);
  }
  
  // Remove category
  newDb.categories.splice(categoryIndex, 1);
  
  saveDatabase(newDb); // Save the database immediately
  return newDb;
};

export const addSubcategory = (db: Database, categoryName: string, subcategory: Subcategory): Database => {
  const newDb = JSON.parse(JSON.stringify(db)); // Deep clone to avoid reference issues
  const categoryIndex = newDb.categories.findIndex(c => c.name === categoryName);
  
  if (categoryIndex === -1) {
    throw new Error(`Categoria "${categoryName}" nu există`);
  }
  
  // Check if subcategory with this name already exists
  if (newDb.categories[categoryIndex].subcategories.some(s => s.name === subcategory.name)) {
    throw new Error(`O subcategorie cu numele "${subcategory.name}" există deja`);
  }
  
  // Add subcategory
  newDb.categories[categoryIndex].subcategories.push(subcategory);
  
  saveDatabase(newDb); // Save the database immediately
  return newDb;
};

// Update an existing subcategory in the database
export const updateSubcategory = (
  db: Database, 
  categoryName: string, 
  oldSubcategoryName: string, 
  updatedSubcategory: Subcategory
): Database => {
  const newDb = JSON.parse(JSON.stringify(db)); // Deep clone to avoid reference issues
  const categoryIndex = newDb.categories.findIndex(c => c.name === categoryName);
  
  if (categoryIndex === -1) {
    throw new Error(`Categoria "${categoryName}" nu există`);
  }
  
  // Find the subcategory to update
  const subcategoryIndex = newDb.categories[categoryIndex].subcategories.findIndex(
    s => s.name === oldSubcategoryName
  );
  
  if (subcategoryIndex === -1) {
    throw new Error(`Subcategoria "${oldSubcategoryName}" nu există în categoria "${categoryName}"`);
  }
  
  // If the name is changing, make sure the new name doesn't already exist
  if (oldSubcategoryName !== updatedSubcategory.name) {
    const nameExists = newDb.categories[categoryIndex].subcategories.some(
      s => s.name === updatedSubcategory.name && s.name !== oldSubcategoryName
    );
    
    if (nameExists) {
      throw new Error(`O subcategorie cu numele "${updatedSubcategory.name}" există deja`);
    }
  }
  
  // Update the subcategory
  newDb.categories[categoryIndex].subcategories[subcategoryIndex] = updatedSubcategory;
  
  saveDatabase(newDb); // Save the database immediately
  return newDb;
};
