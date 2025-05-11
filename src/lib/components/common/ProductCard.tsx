
import React from 'react';
import { Product } from '@/lib/db';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, ShoppingCart, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  mode?: 'view' | 'edit' | 'select';
  onEditClick?: (product: Product) => void;
  onSelectClick?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  mode = 'view',
  onEditClick,
  onSelectClick,
  onViewDetails
}) => {
  // Get product display name
  const getProductDisplayName = () => {
    if (product.name) return product.name;
    if (product.type) return `${product.type}`;
    return `Produs ${product.cod}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {product.imageUrl ? (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={getProductDisplayName()}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Fără imagine</span>
        </div>
      )}
      
      <CardContent className="pt-4">
        <h3 className="font-medium text-lg">{getProductDisplayName()}</h3>
        <p className="text-sm text-gray-500 mt-1">Cod: {product.cod}</p>
        <p className="text-lg font-bold mt-2">{product.pret} RON</p>
        
        {/* Show additional fields based on the product */}
        {Object.entries(product)
          .filter(([key]) => !['id', 'cod', 'pret', 'imageUrl', 'name', 'type'].includes(key))
          .slice(0, 2) // Limit to 2 additional fields
          .map(([key, value]) => (
            <p key={key} className="text-sm text-gray-600 mt-1 capitalize">
              {key}: {value?.toString()}
            </p>
          ))}
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 pt-4 flex justify-between gap-2">
        {mode === 'view' && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onViewDetails?.(product)}
          >
            <Info className="h-4 w-4 mr-2" />
            Vezi detalii
          </Button>
        )}
        
        {mode === 'edit' && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onEditClick?.(product)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editează
          </Button>
        )}
        
        {mode === 'select' && (
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => onSelectClick?.(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adaugă la ofertă
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
