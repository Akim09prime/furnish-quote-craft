import React, { useState } from 'react';
import { Database, saveDatabase } from '@/lib/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditProductsTab from './admin/EditProductsTab';
import ManageCategoriesTab from './admin/ManageCategoriesTab';
import CategoriesAdminTab from './admin/CategoriesAdminTab';
import TypesEditorTab from './admin/TypesEditorTab';
import ExportImportTab from './admin/ExportImportTab';

interface AdminPanelProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ database, onDatabaseUpdate }) => {
  const [activeTab, setActiveTab] = useState("edit");

  // Function to create a backup of the current database
  const createBackup = (db: Database) => {
    try {
      const BACKUP_KEY = "furniture-quote-db-backups";
      
      const newBackup = {
        date: new Date().toISOString(),
        database: db
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

  // Function to save a specific category
  const saveCategoryData = (categoryName: string) => {
    if (!database) return;
    
    console.log(`Saving category: ${categoryName}`);
    
    // Create backup before saving
    createBackup(database);
    
    // Save to localStorage
    saveDatabase(database);
    
    toast.success(`Categoria "${categoryName}" a fost salvată cu succes`, {
      duration: 10000
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Administrare Bază de Date</h1>
        <p className="text-gray-500">
          Modifică produsele și prețurile sau exportă/importă baza de date
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Editare Produse</TabsTrigger>
          <TabsTrigger value="manage">Gestionare Categorii</TabsTrigger>
          <TabsTrigger value="categories">Categorii</TabsTrigger>
          <TabsTrigger value="glisiere">Tipuri Glisiere</TabsTrigger>
          <TabsTrigger value="balamale">Tipuri Balamale</TabsTrigger>
          <TabsTrigger value="export">Export/Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <EditProductsTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>

        <TabsContent value="manage">
          <ManageCategoriesTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>

        <TabsContent value="categories">
          <div className="mb-4">
            <Button 
              variant="outline"
              onClick={() => saveCategoryData("Categories")}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvează Categoriile
            </Button>
          </div>
          <CategoriesAdminTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>

        <TabsContent value="glisiere">
          <div className="mb-4">
            <Button 
              variant="outline"
              onClick={() => saveCategoryData("Accesorii")}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvează Glisiere
            </Button>
          </div>
          <TypesEditorTab 
            database={database}
            onDatabaseUpdate={onDatabaseUpdate}
            categoryName="Accesorii"
            subcategoryName="Glisiere"
            fieldName="Type"
            title="Administrare Tipuri de Glisiere"
            description="Adaugă tipuri noi de glisiere în baza de date"
            addButtonLabel="Tip Nou de Glisieră"
            inputLabel="Tip Nou de Glisieră"
            inputPlaceholder="ex. Tandem, Legrabox, etc."
            successMessage="Tipul de glisieră {type} a fost adăugat"
          />
        </TabsContent>
        
        <TabsContent value="balamale">
          <div className="mb-4">
            <Button 
              variant="outline"
              onClick={() => saveCategoryData("Balamale")}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvează Balamale
            </Button>
          </div>
          <TypesEditorTab 
            database={database}
            onDatabaseUpdate={onDatabaseUpdate}
            categoryName="Accesorii"
            subcategoryName="Balamale"
            fieldName="Tip"
            title="Administrare Tipuri de Balamale"
            description="Adaugă tipuri noi de balamale în baza de date"
            addButtonLabel="Tip Nou de Balamale"
            inputLabel="Tip Nou de Balamale"
            inputPlaceholder="ex. Aplicată, Semi-aplicată, Sticlă, etc."
            successMessage="Tipul de balamale {type} a fost adăugat"
          />
        </TabsContent>
        
        <TabsContent value="export">
          <ExportImportTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
