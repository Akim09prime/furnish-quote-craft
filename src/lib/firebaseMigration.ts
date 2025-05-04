
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { Database, Category, Quote, loadDatabase, loadQuote } from "@/lib/db";

// Migration function to transfer local database to Firestore
export const migrateLocalToFirestore = async (userId: string): Promise<void> => {
  try {
    // First, check if user already has data in Firestore
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      console.log("User data already exists in Firestore, skipping migration.");
      return;
    }
    
    // Load database from localStorage
    const localDB = loadDatabase();
    if (!localDB) {
      console.log("No local database to migrate.");
      return;
    }
    
    // Create user document in Firestore
    await setDoc(userRef, {
      createdAt: new Date(),
      email: "user@example.com", // This should be updated with the actual user email
    });
    
    // Store categories
    const categoriesRef = collection(db, "users", userId, "categories");
    for (const category of localDB.categories) {
      await setDoc(doc(categoriesRef, category.name), category);
    }
    
    // Load and store current quote
    const localQuote = loadQuote();
    if (localQuote) {
      const quotesRef = collection(db, "users", userId, "quotes");
      await setDoc(doc(quotesRef, "current"), localQuote);
    }
    
    console.log("Migration to Firestore completed successfully.");
  } catch (error) {
    console.error("Error migrating data to Firestore:", error);
    throw error;
  }
};

// Function to fetch database from Firestore
export const loadDatabaseFromFirestore = async (userId: string): Promise<Database | null> => {
  try {
    const categoriesRef = collection(db, "users", userId, "categories");
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    const categories: Category[] = [];
    categoriesSnapshot.forEach(doc => {
      categories.push(doc.data() as Category);
    });
    
    return {
      categories
    };
  } catch (error) {
    console.error("Error loading database from Firestore:", error);
    return null;
  }
};

// Function to fetch quote from Firestore
export const loadQuoteFromFirestore = async (userId: string, quoteId: string = "current"): Promise<Quote | null> => {
  try {
    const quoteRef = doc(db, "users", userId, "quotes", quoteId);
    const quoteSnapshot = await getDoc(quoteRef);
    
    if (quoteSnapshot.exists()) {
      return quoteSnapshot.data() as Quote;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading quote from Firestore:", error);
    return null;
  }
};
