
interface FeroDB {
  categories: Array<{ id: string; slug: string; [key: string]: any }>;
  products: Array<{ categoryId: string; categorySlug?: string; [key: string]: any }>;
  [key: string]: any;
}

export async function fetchFilteredFeroShopDB(): Promise<FeroDB> {
  const res = await fetch(import.meta.env.VITE_FEROSHOP_API_URL);
  if (!res.ok) throw new Error('Eroare la preluare FeroShop: ' + res.status);
  
  const db = (await res.json()) as FeroDB;
  const allowed = (import.meta.env.VITE_FEROSHOP_ALLOWED_CATEGORIES || 'accesorii')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  
  // Filtrare categorii
  const filteredCats = db.categories.filter(cat => allowed.includes(cat.slug));
  const allowedIds = new Set(filteredCats.map(c => c.id));
  
  // Filtrare produse doar din categoriile selectate
  const filteredProds = db.products.filter(p => allowedIds.has(p.categoryId));
  
  // Add categorySlug to each product based on its categoryId
  filteredProds.forEach(product => {
    const category = filteredCats.find(c => c.id === product.categoryId);
    if (category) {
      product.categorySlug = category.slug;
    }
  });

  return { ...db, categories: filteredCats, products: filteredProds };
}
