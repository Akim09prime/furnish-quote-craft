
import { Database, Category, Subcategory, Product } from './types';
import { initialDB } from '../data/initialDB';

// DB operations
const DB_KEY = "furniture-quote-db";

export const loadDatabase = (): Database => {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate that the parsed object has the expected structure
        if (parsed && parsed.categories && Array.isArray(parsed.categories)) {
          console.log("Using saved database with categories:", 
            parsed.categories.map(c => c.name).join(", "));
          return parsed;
        } else {
          console.error("Saved database has invalid structure, using initial DB");
          return initialDB;
        }
      } catch (e) {
        console.error("Failed to parse saved database, using initial DB", e);
        return initialDB;
      }
    }
    console.log("No saved database found, using initial DB");
    return initialDB;
  } catch (e) {
    console.error("Error in loadDatabase, using initial DB", e);
    return initialDB;
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
    saveDatabase(data);
    return true;
  } catch (e) {
    console.error("Failed to import database", e);
    return false;
  }
};
