
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from '@/lib/db';
import EditProductsTab from './admin/EditProductsTab';
import ManageCategoriesTab from './admin/ManageCategoriesTab';
import MaterialsTab from './admin/MaterialsTab';
import TypesEditorTab from './admin/TypesEditorTab';
import ExportImportTab from './admin/ExportImportTab';
import AIAssistantTab from './admin/AIAssistantTab';
import AISettingsTab from './admin/AISettingsTab';
import CategoriesAdminTab from './admin/CategoriesAdminTab';
import FurnitureComponentsTab from './admin/FurnitureComponentsTab';

interface AdminPanelProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
  cloudinaryStatus?: {
    available: boolean;
    message?: string;
  } | null;
  onCheckCloudinary?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  database, 
  onDatabaseUpdate,
  cloudinaryStatus,
  onCheckCloudinary = () => {}
}) => {
  const [activeTab, setActiveTab] = useState("edit-products");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full h-auto">
        <TabsTrigger value="edit-products" className="text-xs md:text-sm">
          Editare Produse
        </TabsTrigger>
        <TabsTrigger value="categories" className="text-xs md:text-sm">
          Categorii Simple
        </TabsTrigger>
        <TabsTrigger value="categories-admin" className="text-xs md:text-sm">
          Categorii Advanced
        </TabsTrigger>
        <TabsTrigger value="furniture-components" className="text-xs md:text-sm">
          Corpuri Mobilier
        </TabsTrigger>
        <TabsTrigger value="materials" className="text-xs md:text-sm">
          Materiale
        </TabsTrigger>
        <TabsTrigger value="types-editor" className="text-xs md:text-sm">
          Editor Tipuri
        </TabsTrigger>
        <TabsTrigger value="export-import" className="text-xs md:text-sm">
          Export/Import
        </TabsTrigger>
        <TabsTrigger value="ai" className="text-xs md:text-sm">
          AI
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="edit-products">
          <EditProductsTab 
            database={database} 
            onDatabaseUpdate={onDatabaseUpdate}
            cloudinaryStatus={cloudinaryStatus}
            onCheckCloudinary={onCheckCloudinary}
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <ManageCategoriesTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>
        
        <TabsContent value="categories-admin">
          <CategoriesAdminTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>
        
        <TabsContent value="furniture-components">
          <FurnitureComponentsTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>
        
        <TabsContent value="materials">
          <MaterialsTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>
        
        <TabsContent value="types-editor">
          <TypesEditorTab />
        </TabsContent>
        
        <TabsContent value="export-import">
          <ExportImportTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
        </TabsContent>
        
        <TabsContent value="ai">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIAssistantTab />
            <AISettingsTab />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default AdminPanel;
