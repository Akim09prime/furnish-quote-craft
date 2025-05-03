
import { Database, Product } from './types';
import { getCategoryByName } from './helpers';

export const addProduct = (db: Database, categoryName: string, subcategoryName: string, product: Omit<Product, "id">): Database => {
  const newDb = { ...db };
  const category = getCategoryByName(newDb, categoryName);
  if (!category) return db;

  const subcategoryIndex = category.subcategories.findIndex(s => s.name === subcategoryName);
  if (subcategoryIndex === -1) return db;

  // Ensure product has the required properties
  if (!product.cod || product.pret === undefined) {
    console.error("Product must have 'cod' and 'pret' properties");
    return db;
  }

  const newProduct: Product = {
    id: Date.now().toString(), // Simple ID generation
    cod: product.cod,          // Explicitly add required properties
    pret: product.pret,        // Explicitly add required properties
    ...product,                // Spread the rest of the properties
  };

  category.subcategories[subcategoryIndex].products.push(newProduct);
  return newDb;
};

export const updateProduct = (db: Database, categoryName: string, subcategoryName: string, product: Product): Database => {
  const newDb = { ...db };
  const category = getCategoryByName(newDb, categoryName);
  if (!category) return db;

  const subcategoryIndex = category.subcategories.findIndex(s => s.name === subcategoryName);
  if (subcategoryIndex === -1) return db;

  const productIndex = category.subcategories[subcategoryIndex].products.findIndex(p => p.id === product.id);
  if (productIndex === -1) return db;

  category.subcategories[subcategoryIndex].products[productIndex] = product;
  return newDb;
};

export const deleteProduct = (db: Database, categoryName: string, subcategoryName: string, productId: string): Database => {
  const newDb = { ...db };
  const category = getCategoryByName(newDb, categoryName);
  if (!category) return db;

  const subcategoryIndex = category.subcategories.findIndex(s => s.name === subcategoryName);
  if (subcategoryIndex === -1) return db;

  category.subcategories[subcategoryIndex].products = category.subcategories[subcategoryIndex].products.filter(p => p.id !== productId);
  return newDb;
};

// Delete a subcategory from the database
export const deleteSubcategory = (db: Database, categoryName: string, subcategoryName: string): Database => {
  const newDb = { ...db };
  const categoryIndex = newDb.categories.findIndex(c => c.name === categoryName);
  
  if (categoryIndex === -1) {
    throw new Error(`Categoria "${categoryName}" nu există`);
  }
  
  // Check if subcategory exists
  const subcategoryIndex = newDb.categories[categoryIndex].subcategories.findIndex(s => s.name === subcategoryName);
  if (subcategoryIndex === -1) {
    throw new Error(`Subcategoria "${subcategoryName}" nu există în categoria "${categoryName}"`);
  }
  
  // Remove subcategory
  newDb.categories[categoryIndex].subcategories.splice(subcategoryIndex, 1);
  
  return newDb;
};
