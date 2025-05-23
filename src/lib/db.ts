import { initialDB as dbInitialData } from "../data/initialDB";
import { FurnitureDesign } from "@/components/FurnitureSetManager";
import type { Accessory as AccessoryComponent } from "@/components/AccessorySelector";

// Re-export initialDB
export const initialDB = dbInitialData;

export type Product = {
  id: string;
  cod: string;
  pret: number;
  imageUrl?: string; // Add optional imageUrl field
  [key: string]: any;
};

export type Subcategory = {
  name: string;
  products: Product[];
  fields: {
    name: string;
    type: "select" | "text" | "number" | "boolean";
    options?: string[];
  }[];
};

export type Category = {
  name: string;
  subcategories: Subcategory[];
};

export type Material = {
  id: string;
  name: string;
  type: string;
  thickness: number;
  length: number;
  width: number;
  pricePerSheet: number;
  pricePerSquareMeter: number;
  updatedAt: string;
};

// Define the Accessory type
export type Accessory = {
  id: string;
  name: string;
  type: string;
  price: number;
  unit: string;
  quantity: number;
  description?: string;
};

// Update the Database type to include accessories
export type Database = {
  categories: Category[];
  materials?: Material[];
  accessories?: Accessory[];
};

// DB operations
const DB_KEY = "furniture-quote-db";

export const loadDatabase = (): Database => {
  console.log("[db] Loading database...");
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      try {
        console.log("[db] Found saved database in localStorage, parsing...");
        const parsed = JSON.parse(saved);
        // Validate that the parsed object has the expected structure
        if (parsed && parsed.categories && Array.isArray(parsed.categories)) {
          console.log("[db] Successfully parsed saved database with categories:", 
            parsed.categories.map((c: {name: string}) => c.name).join(", "));
          
          // Ensure materials exists
          if (!parsed.materials) {
            parsed.materials = [];
          }
          
          // Ensure accessories exists
          if (!parsed.accessories) {
            parsed.accessories = [];
          }
          
          return parsed;
        } else {
          console.error("[db] Saved database has invalid structure, using initial DB");
          // Initialize localStorage with initial data
          const initialDbWithMaterials = {
            ...initialDB,
            materials: [],
            accessories: []
          };
          localStorage.setItem(DB_KEY, JSON.stringify(initialDbWithMaterials));
          return initialDbWithMaterials;
        }
      } catch (e) {
        console.error("[db] Failed to parse saved database, using initial DB", e);
        // Initialize localStorage with initial data
        const initialDbWithMaterials = {
          ...initialDB,
          materials: [],
          accessories: []
        };
        localStorage.setItem(DB_KEY, JSON.stringify(initialDbWithMaterials));
        return initialDbWithMaterials;
      }
    }
    console.log("[db] No saved database found, using initial DB and saving to localStorage");
    // Initialize localStorage with initial data
    const initialDbWithMaterials = {
      ...initialDB,
      materials: [],
      accessories: []
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDbWithMaterials));
    return initialDbWithMaterials;
  } catch (e) {
    console.error("[db] Error in loadDatabase, using initial DB", e);
    const initialDbWithMaterials = {
      ...initialDB,
      materials: [],
      accessories: []
    };
    return initialDbWithMaterials;
  }
};

export const saveDatabase = (db: Database): void => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const exportDatabaseJSON = (): string => {
  return JSON.stringify(loadDatabase(), null, 2);
};

export const importDatabaseJSON = (json: string): boolean => {
  try {
    const data = JSON.parse(json) as Database;
    if (!data.categories) {
      throw new Error("Invalid database structure");
    }
    
    // Ensure materials exists
    if (!data.materials) {
      data.materials = [];
    }
    
    // Ensure accessories exists
    if (!data.accessories) {
      data.accessories = [];
    }
    
    saveDatabase(data);
    return true;
  } catch (e) {
    console.error("Failed to import database", e);
    return false;
  }
};

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

// Materials management functions
export const addMaterial = (db: Database, material: Material): Database => {
  const newDb = { ...db };
  
  // Initialize materials array if it doesn't exist
  if (!newDb.materials) {
    newDb.materials = [];
  }
  
  // Check if material with same ID already exists
  const existingIndex = newDb.materials.findIndex(m => m.id === material.id);
  
  if (existingIndex !== -1) {
    // Update existing material
    newDb.materials[existingIndex] = material;
  } else {
    // Add new material
    newDb.materials.push(material);
  }
  
  return newDb;
};

export const deleteMaterial = (db: Database, materialId: string): Database => {
  const newDb = { ...db };
  
  if (!newDb.materials) {
    return newDb;
  }
  
  newDb.materials = newDb.materials.filter(m => m.id !== materialId);
  return newDb;
};

// Quote calculation
export type QuoteItem = {
  id: string;
  categoryName: string;
  subcategoryName: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
  productDetails: Record<string, any>;
};

export type Quote = {
  items: QuoteItem[];
  laborPercentage: number;
  subtotal: number;
  laborCost: number;
  total: number;
  beneficiary: string;
  title: string;
};

// Helper function to create a new empty quote
export const createNewQuote = (): Quote => ({
  items: [],
  laborPercentage: 0,
  subtotal: 0,
  laborCost: 0,
  total: 0,
  beneficiary: "",
  title: ""
});

// Quote storage functions
const QUOTE_KEY = "furniture-quote-current";

export const loadQuote = (): Quote => {
  const saved = localStorage.getItem(QUOTE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved quote, creating new one", e);
      return createNewQuote();
    }
  }
  return createNewQuote();
};

export const saveQuote = (quote: Quote): void => {
  localStorage.setItem(QUOTE_KEY, JSON.stringify(quote));
};

// Function to recalculate quote totals
export const recalculateQuote = (quote: Quote): Quote => {
  const subtotal = quote.items.reduce((sum, item) => sum + item.total, 0);
  const laborCost = (subtotal * quote.laborPercentage) / 100;
  const total = subtotal + laborCost;

  return {
    ...quote,
    subtotal,
    laborCost,
    total,
  };
};

// Function to add item to quote
export const addItemToQuote = (quote: Quote, item: Omit<QuoteItem, "id">): Quote => {
  const newItem = {
    ...item,
    id: Date.now().toString(), // Simple ID generation
    total: item.pricePerUnit * item.quantity,
  };

  const newQuote = {
    ...quote,
    items: [...quote.items, newItem],
  };

  return recalculateQuote(newQuote);
};

// Function to add a manual item to the quote (PAL or MDF)
export const addManualPalItem = (
  quote: Quote, 
  description: string, 
  quantity: number, 
  pricePerUnit: number,
  categoryName: string = "PAL" // Default to PAL for backward compatibility
): Quote => {
  const newItem = {
    id: Date.now().toString(),
    categoryName: categoryName,
    subcategoryName: "Manual",
    productId: "manual-" + Date.now(),
    quantity,
    pricePerUnit,
    total: pricePerUnit * quantity,
    productDetails: {
      cod: `MANUAL-${categoryName}-${Date.now().toString().slice(-6)}`,
      pret: pricePerUnit,
      description
    }
  };

  const newQuote = {
    ...quote,
    items: [...quote.items, newItem],
  };

  return recalculateQuote(newQuote);
};

// Function to add a furniture design item to the quote
export const addFurnitureDesignToQuote = (
  quote: Quote,
  design: FurnitureDesign,
  calculatedCost: number
): Quote => {
  const newItem = {
    id: Date.now().toString(),
    categoryName: "Mobilier",
    subcategoryName: design.type,
    productId: design.id,
    quantity: 1,
    pricePerUnit: calculatedCost,
    total: calculatedCost,
    productDetails: {
      cod: `DESIGN-${design.id.slice(-6)}`,
      pret: calculatedCost,
      name: design.name,
      type: design.type,
      material: design.material,
      doorMaterial: design.doorMaterial || "N/A",
      dimensions: `${design.width}x${design.height}x${design.depth}cm`,
      accessories: design.accessories || [],
      hasDoors: design.hasDoors ? "Da" : "Nu",
      hasDrawers: design.hasDrawers ? "Da" : "Nu",
      color: design.color,
      designId: design.id
    }
  };

  const newQuote = {
    ...quote,
    items: [...quote.items, newItem],
  };

  return recalculateQuote(newQuote);
};

// Function to add all designs in a furniture set to the quote
export const addFurnitureSetToQuote = (
  quote: Quote,
  setName: string,
  designs: FurnitureDesign[],
  designCosts: Map<string, number>
): Quote => {
  let newQuote = { ...quote };
  
  designs.forEach(design => {
    const cost = designCosts.get(design.id) || calculateDesignCost(design);
    newQuote = addFurnitureDesignToQuote(newQuote, design, cost);
  });
  
  return newQuote;
};

// Helper function to calculate the cost of a furniture design
export const calculateDesignCost = (design: FurnitureDesign): number => {
  // Base calculation logic
  const basePrice: Record<string, number> = {
    canapea: 1200,
    scaun: 250,
    biblioteca: 800,
    dulap: 1500,
    masa: 700,
    pat: 1000,
    bucatarie: 2000,
    corp: 500,
    corp_colt: 700,
    corp_suspendat: 600,
    corp_sertar: 800
  };
  
  // Material multiplier
  const materialMultiplier: Record<string, number> = {
    pal: 1,
    pal_hdf: 1.2,
    mdf: 1.5,
    mdf_lucios: 1.8,
    lemn_masiv: 2.5
  };
  
  // Calculate size factor (larger = more expensive)
  const volumeFactor = (design.width * design.height * design.depth) / 100000;
  
  // Preset multiplier
  const presetMultiplier = design.presetId ? 1.1 : 1;
  
  // Door multiplier
  const doorMultiplier = design.hasDoors ? 
    (design.doorMaterial === 'mdf_lucios' ? 1.3 : design.doorMaterial === 'lemn_masiv' ? 1.5 : 1.1) : 1;
  
  // Drawer multiplier
  const drawerMultiplier = design.hasDrawers ? 1.2 : 1;
  
  // Calculate price
  let materialCost = basePrice[design.type] * 
                   (materialMultiplier[design.material] || 1) * 
                   volumeFactor * 
                   presetMultiplier *
                   doorMultiplier *
                   drawerMultiplier;
  
  // Accessories cost
  let accessoriesCost = 0;
  if (design.accessories && design.accessories.length > 0) {
    accessoriesCost = design.accessories.reduce((sum, acc) => sum + acc.price * acc.quantity, 0);
  } else {
    // Default accessories (estimated as 15% of material cost)
    accessoriesCost = materialCost * 0.15;
  }
  
  return materialCost + accessoriesCost;
};

// Function to update item in quote
export const updateQuoteItem = (quote: Quote, itemId: string, updates: Partial<QuoteItem>): Quote => {
  const index = quote.items.findIndex(i => i.id === itemId);
  if (index === -1) return quote;

  const updatedItem = {
    ...quote.items[index],
    ...updates,
  };

  // Recalculate the total for this item
  updatedItem.total = updatedItem.pricePerUnit * updatedItem.quantity;

  const newQuote = {
    ...quote,
    items: [
      ...quote.items.slice(0, index),
      updatedItem,
      ...quote.items.slice(index + 1),
    ],
  };

  return recalculateQuote(newQuote);
};

// Function to remove item from quote
export const removeQuoteItem = (quote: Quote, itemId: string): Quote => {
  const newQuote = {
    ...quote,
    items: quote.items.filter(i => i.id !== itemId),
  };

  return recalculateQuote(newQuote);
};

// Function to update labor percentage
export const setLaborPercentage = (quote: Quote, percentage: number): Quote => {
  const newQuote = {
    ...quote,
    laborPercentage: percentage,
  };

  return recalculateQuote(newQuote);
};

// Function to update beneficiary and title
export const updateQuoteMetadata = (quote: Quote, metadata: { beneficiary?: string, title?: string }): Quote => {
  return {
    ...quote,
    beneficiary: metadata.beneficiary !== undefined ? metadata.beneficiary : quote.beneficiary,
    title: metadata.title !== undefined ? metadata.title : quote.title
  };
};

// Furniture type definitions for the 6-step quote process
export type FurnitureType = {
  id: string;
  name: string; 
  description?: string;
};

export type FurnitureBodyPart = {
  id: string;
  materialId: string;
  length: number;
  width: number;
  quantity: number;
  edgeBanding?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
};

export type FurnitureBody = {
  id: string;
  typeId: string; 
  name: string;
  imageSrc?: string;
  parts: FurnitureBodyPart[];
  accessories: string[]; // IDs of accessories
  paintingArea?: number;
  paintingFaces?: number;
};
