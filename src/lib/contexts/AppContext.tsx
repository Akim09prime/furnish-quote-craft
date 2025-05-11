import React, { createContext, useState, useContext, useEffect } from 'react';
import { Database } from '@/lib/db';

interface AppContextType {
  database: Database | null;
  updateDatabase: (db: Database) => void;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  createBackup: () => void;
  cloudinaryStatus: {
    available: boolean;
    message?: string;
  } | null;
  checkCloudinaryStatus: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
  initialDatabase?: Database;
}

export const AppProvider: React.FC<AppProviderProps> = ({ 
  children, 
  initialDatabase = null 
}) => {
  const [database, setDatabase] = useState<Database | null>(initialDatabase);
  const [isEditMode, setIsEditMode] = useState(false);
  const [cloudinaryStatus, setCloudinaryStatus] = useState<{
    available: boolean;
    message?: string;
  } | null>(null);

  // Load database from localStorage on mount
  useEffect(() => {
    if (!database) {
      const savedDB = localStorage.getItem('furniture-quote-db');
      if (savedDB) {
        try {
          setDatabase(JSON.parse(savedDB));
        } catch (error) {
          console.error('Error parsing database from localStorage:', error);
        }
      }
    }
  }, [database]);

  // Save database to localStorage when it changes
  const updateDatabase = (db: Database) => {
    setDatabase(db);
    try {
      localStorage.setItem('furniture-quote-db', JSON.stringify(db));
    } catch (error) {
      console.error('Error saving database to localStorage:', error);
    }
  };

  // Create a backup of the database
  const createBackup = () => {
    if (!database) return;

    try {
      const BACKUP_KEY = "furniture-quote-db-backups";
      
      const newBackup = {
        date: new Date().toISOString(),
        database: database
      };
      
      // Get existing backups
      const savedBackups = localStorage.getItem(BACKUP_KEY);
      let existingBackups = [];
      
      if (savedBackups) {
        existingBackups = JSON.parse(savedBackups);
      }
      
      // Add new backup
      existingBackups.push(newBackup);
      
      // Keep only the last 10 backups
      const limitedBackups = existingBackups.slice(-10);
      
      // Save to localStorage
      localStorage.setItem(BACKUP_KEY, JSON.stringify(limitedBackups));
      
      console.log("Backup created:", newBackup.date);
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  };

  // Check Cloudinary status
  const checkCloudinaryStatus = async () => {
    try {
      // Simulăm verificarea statusului Cloudinary
      // În implementarea reală, aici ar trebui să faceți o cerere API
      setCloudinaryStatus({
        available: true
      });
    } catch (error) {
      setCloudinaryStatus({
        available: false,
        message: error instanceof Error ? error.message : 'Eroare la verificarea statusului Cloudinary'
      });
    }
  };

  // Check Cloudinary status on mount
  useEffect(() => {
    checkCloudinaryStatus();
  }, []);

  // Folosim direct setIsEditMode pentru funcționalitatea de setEditMode
  const value = {
    database,
    updateDatabase,
    isEditMode,
    setEditMode: setIsEditMode,
    createBackup,
    cloudinaryStatus,
    checkCloudinaryStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
