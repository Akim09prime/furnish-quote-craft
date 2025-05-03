
import React, { useState } from 'react';
import { useFetchAccessories } from '@/hooks/useFetchAccessories';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import Header from '@/components/Header';

// Placeholder components - you'll need to implement or adapt these
const Hero = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="bg-furniture-purple/5 py-12">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center">{title}</h1>
      <p className="text-center text-gray-600 mt-2">{subtitle}</p>
    </div>
  </div>
);

const FilterByPrice = () => (
  <div className="border p-4 rounded-md">
    <h3 className="font-medium mb-2">Filtrare după preț</h3>
    {/* Add price range slider implementation */}
    <div className="flex items-center gap-2">
      <input type="range" className="w-full" min="0" max="1000" step="10" />
    </div>
  </div>
);

const FilterByType = () => (
  <div className="border p-4 rounded-md">
    <h3 className="font-medium mb-2">Filtrare după tip</h3>
    {/* Add type checkboxes */}
    <div className="space-y-2">
      <div className="flex items-center">
        <input type="checkbox" id="type-balamale" className="mr-2" />
        <label htmlFor="type-balamale">Balamale</label>
      </div>
      <div className="flex items-center">
        <input type="checkbox" id="type-glisiere" className="mr-2" />
        <label htmlFor="type-glisiere">Glisiere</label>
      </div>
    </div>
  </div>
);

const ProductGrid = ({ items, badge }: { items: any[]; badge: string }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {items.map((item, idx) => (
      <div key={idx} className="border rounded-md overflow-hidden">
        <div className="p-4">
          <span className="inline-block bg-furniture-purple text-white text-xs px-2 py-1 rounded-full mb-2">
            {badge}
          </span>
          <h3 className="font-medium">{item.name || 'Produs'}</h3>
          <p className="text-gray-600 text-sm">{item.description || 'Descriere produs'}</p>
          <p className="font-bold mt-2">{item.price || '0'} RON</p>
        </div>
      </div>
    ))}
  </div>
);

const Spinner = () => (
  <div className="flex justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-furniture-purple"></div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <p className="text-gray-500">{message}</p>
  </div>
);

const Accesorii: React.FC = () => {
  const { data, isLoading, error } = useFetchAccessories();
  const PAGE_SIZE = 12;
  const { 
    currentPage, 
    totalPages, 
    currentItems, 
    handlePageChange 
  } = usePagination(data, PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Hero 
          title="Accesorii" 
          subtitle="Descoperă cele mai noi accesorii pentru mobilierul tău" 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <div className="lg:col-span-1 space-y-4">
            <FilterByPrice />
            <FilterByType />
          </div>
          
          <div className="lg:col-span-3">
            {isLoading ? (
              <Spinner />
            ) : error ? (
              <EmptyState message={`Eroare: ${error}`} />
            ) : data.length === 0 ? (
              <EmptyState message="Nu există accesorii disponibile." />
            ) : (
              <>
                <ProductGrid items={currentItems} badge="Accesoriu" />
                
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => (
                          <PaginationItem key={i}>
                            <button
                              className={`w-10 h-10 flex items-center justify-center rounded-md ${
                                currentPage === i + 1
                                  ? "bg-furniture-purple text-white"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => handlePageChange(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Accesorii;
