
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
  Archive
} from 'lucide-react';

interface FurnitureThumbnailProps {
  type: string;
  color: string;
  size?: number;
  className?: string;
}

const FurnitureThumbnail: React.FC<FurnitureThumbnailProps> = ({ 
  type, 
  color, 
  size = 24,
  className = ""
}) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'canapea':
        return <Sofa size={size} />;
      case 'scaun':
        return <Armchair size={size} />;
      case 'biblioteca':
        return <BookOpen size={size} />;
      case 'dulap':
        return <PackageOpen size={size} />; // Înlocuit Cabinet cu PackageOpen
      case 'masa':
        return <Table size={size} />;
      case 'pat':
        return <Bed size={size} />;
      case 'bucatarie':
        return <ChefHat size={size} />;
      case 'corp': 
        return <Home size={size} />;
      case 'corp_colt':
        return <LayoutGrid size={size} />;
      case 'corp_suspendat':
        return <Container size={size} />;
      case 'corp_sertar':
        return <Archive size={size} />; // Înlocuit Drawer cu Archive
      case 'corp_frigider':
        return <RefrigeratorIcon size={size} />; // Înlocuit Fridge cu RefrigeratorIcon
      case 'corp_chiuveta':
        return <Inbox size={size} />;
      default:
        return <Home size={size} />;
    }
  };

  return (
    <div 
      className={`flex items-center justify-center rounded-md overflow-hidden p-2 ${className}`}
      style={{ backgroundColor: color, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="text-white">
        {getIcon()}
      </div>
    </div>
  );
};

export default FurnitureThumbnail;
