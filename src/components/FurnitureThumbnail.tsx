
import React from 'react';
import { 
  Armchair, 
  BookOpen, 
  Table, 
  Bed, 
  Sofa, 
  ChefHat, 
  Inbox, 
  Home, 
  Container, 
  LayoutGrid, 
  RefrigeratorIcon, 
  PackageOpen,  
  Archive,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type FurnitureType = 
  'canapea' | 'scaun' | 'biblioteca' | 'dulap' | 'masa' | 
  'pat' | 'bucatarie' | 'corp' | 'corp_colt' | 'corp_suspendat' | 
  'corp_sertar' | 'corp_frigider' | 'corp_chiuveta';

interface FurnitureThumbnailProps {
  type: string;
  color: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

// Modificăm tipul mapării pentru a folosi LucideIcon în loc de FC<{ size: number }>
const FURNITURE_ICON_MAP: Record<FurnitureType, LucideIcon> = {
  'canapea': Sofa,
  'scaun': Armchair,
  'biblioteca': BookOpen,
  'dulap': PackageOpen,
  'masa': Table,
  'pat': Bed,
  'bucatarie': ChefHat,
  'corp': Home,
  'corp_colt': LayoutGrid,
  'corp_suspendat': Container,
  'corp_sertar': Archive,
  'corp_frigider': RefrigeratorIcon,
  'corp_chiuveta': Inbox
};

const FurnitureThumbnail: React.FC<FurnitureThumbnailProps> = ({ 
  type, 
  color, 
  size = 24,
  className = "",
  onClick
}) => {
  const getIcon = () => {
    const IconComponent = FURNITURE_ICON_MAP[type.toLowerCase() as FurnitureType] || Home;
    return <IconComponent size={size} />;
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-md overflow-hidden p-2",
        onClick ? "cursor-pointer" : "",
        className
      )}
      style={{ backgroundColor: color, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
      onClick={onClick}
    >
      <div className="text-white">
        {getIcon()}
      </div>
    </div>
  );
};

export default FurnitureThumbnail;
