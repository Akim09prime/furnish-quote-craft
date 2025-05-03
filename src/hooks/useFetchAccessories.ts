
import { useState, useEffect } from 'react';
import { fetchFilteredFeroShopDB } from '@/lib/feroshop';

export function useFetchAccessories() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFilteredFeroShopDB()
      .then(json => {
        const db = JSON.parse(json);
        const accessories = db.products.filter((p: any) => p.categorySlug === 'accesorii');
        setData(accessories);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, isLoading, error };
}
