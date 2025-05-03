
import React, { useState } from 'react';
import { Database } from '@/lib/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <CategoriesAdminTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>

        <TabsContent value="glisiere">
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
            successMessage='Tipul de glisieră "{type}" a fost adăugat'
          />
        </TabsContent>
        
        <TabsContent value="balamale">
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
            successMessage='Tipul de balamale "{type}" a fost adăugat'
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
