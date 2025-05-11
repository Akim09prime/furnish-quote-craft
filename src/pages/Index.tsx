
import React, { useState, useEffect } from 'react';
import { Database, loadDatabase } from '@/lib/db';
import { useQuote } from '@/hooks/use-quote';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import QuoteTypeSelector from '@/components/QuoteTypeSelector';
import QuoteDetailsDrawer from '@/components/QuoteDetailsDrawer';
import QuoteSummary from '@/components/QuoteSummary';
import PageHeader from '@/lib/components/common/PageHeader';
import ProductSelector from '@/components/ProductSelector';

const Index = () => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { quote } = useQuote();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Load database
  useEffect(() => {
    try {
      const db = loadDatabase();
      console.log("Database loaded:", db);
      setDatabase(db);
    } catch (error) {
      console.error("Error loading database:", error);
      toast.error("Eroare la încărcarea bazei de date");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return (
    <AppLayout>
      <PageHeader 
        title="Generator Oferte" 
        description="Creează și gestionează oferte personalizate pentru clienți"
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Încărcare...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Selectează Tipul de Ofertă</h2>
                <QuoteTypeSelector />
              </section>
              
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Adaugă Produse</h2>
                {database && <ProductSelector database={database} />}
              </section>
            </div>
            
            <div>
              <section className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <QuoteSummary onEditClick={() => setDrawerOpen(true)} />
              </section>
            </div>
          </div>
          
          <QuoteDetailsDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
      )}
    </AppLayout>
  );
};

export default Index;
