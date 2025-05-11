
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from '@/lib/db';
import PageHeader from '@/lib/components/common/PageHeader';
import { Button } from "@/components/ui/button";
import { Settings, Package, LayersIcon, Database as DatabaseIcon, Import, BookOpen } from 'lucide-react';

// Tab components
import EditProductsTab from './admin/EditProductsTab';
import CategoriesAdminTab from './admin/CategoriesAdminTab';
import FurnitureComponentsTab from './admin/FurnitureComponentsTab';
import MaterialsTab from './admin/MaterialsTab';
import TypesEditorTab from './admin/TypesEditorTab';
import ExportImportTab from './admin/ExportImportTab';
import AIAssistantTab from './admin/AIAssistantTab';
import AISettingsTab from './admin/AISettingsTab';
import AccessoriesTab from './admin/AccessoriesTab';

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

  // Default values for TypesEditorTab
  const defaultCategoryName = database.categories[0]?.name || "Mobila";
  const defaultSubcategoryName = database.categories[0]?.subcategories[0]?.name || "Bucatarie";
  const defaultFieldName = "type";
  const defaultTitle = "Editor Tipuri Produse";
  const defaultDescription = "Adaugă, modifică sau șterge tipuri de produse";
  const defaultAddButtonLabel = "Adaugă Tip";
  const defaultInputLabel = "Nume Tip Nou";
  const defaultInputPlaceholder = "Introduceți numele tipului";
  const defaultSuccessMessage = "Tipul '{type}' a fost adăugat cu succes";

  return (
    <div className="bg-white rounded-lg shadow-md">
      <PageHeader 
        title="Panou administrare" 
        description="Gestionați produsele, categoriile, materialele și setările aplicației"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 w-full h-auto">
          <TabsTrigger value="edit-products" className="text-xs md:text-sm flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span className="hidden md:inline">Produse</span>
          </TabsTrigger>
          
          <TabsTrigger value="categories-admin" className="text-xs md:text-sm flex items-center gap-1">
            <LayersIcon className="h-4 w-4" />
            <span className="hidden md:inline">Categorii</span>
          </TabsTrigger>
          
          <TabsTrigger value="furniture-components" className="text-xs md:text-sm flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Corpuri</span>
          </TabsTrigger>
          
          <TabsTrigger value="materials" className="text-xs md:text-sm flex items-center gap-1">
            <DatabaseIcon className="h-4 w-4" />
            <span className="hidden md:inline">Materiale</span>
          </TabsTrigger>
          
          <TabsTrigger value="accessories" className="text-xs md:text-sm flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span className="hidden md:inline">Accesorii</span>
          </TabsTrigger>
          
          <TabsTrigger value="types-editor" className="text-xs md:text-sm flex items-center gap-1">
            <LayersIcon className="h-4 w-4" />
            <span className="hidden md:inline">Tipuri</span>
          </TabsTrigger>
          
          <TabsTrigger value="export-import" className="text-xs md:text-sm flex items-center gap-1">
            <Import className="h-4 w-4" />
            <span className="hidden md:inline">Import/Export</span>
          </TabsTrigger>
          
          <TabsTrigger value="ai" className="text-xs md:text-sm flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">AI & Setări</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 p-4">
          <TabsContent value="edit-products">
            <EditProductsTab 
              database={database} 
              onDatabaseUpdate={onDatabaseUpdate}
              cloudinaryStatus={cloudinaryStatus}
              onCheckCloudinary={onCheckCloudinary}
            />
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
          
          <TabsContent value="accessories">
            <AccessoriesTab database={database} onDatabaseUpdate={onDatabaseUpdate} />
          </TabsContent>
          
          <TabsContent value="types-editor">
            <TypesEditorTab 
              database={database} 
              onDatabaseUpdate={onDatabaseUpdate}
              categoryName={defaultCategoryName}
              subcategoryName={defaultSubcategoryName}
              fieldName={defaultFieldName}
              title={defaultTitle}
              description={defaultDescription}
              addButtonLabel={defaultAddButtonLabel}
              inputLabel={defaultInputLabel}
              inputPlaceholder={defaultInputPlaceholder}
              successMessage={defaultSuccessMessage}
            />
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
    </div>
  );
};

export default AdminPanel;
