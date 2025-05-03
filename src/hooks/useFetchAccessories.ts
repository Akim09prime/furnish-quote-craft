
import { useState, useEffect } from 'react';
import { fetchFilteredFeroShopDB, FeroDB } from '@/lib/feroshop';

export function useFetchAccessories() {
  const [data, setData] = useState<FeroDB['products']>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFilteredFeroShopDB()
      .then(db => {
        const accessories = db.products.filter(p => {
          const cat = db.categories.find(c => c.id === p.categoryId);
          return cat?.slug === 'accesorii';
        });
        setData(accessories);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, isLoading, error };
}
