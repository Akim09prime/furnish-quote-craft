
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRound, UserCog } from 'lucide-react';

interface QuoteTypeSelectorProps {
  quoteType: 'client' | 'internal';
  onChangeQuoteType: (type: 'client' | 'internal') => void;
}

const QuoteTypeSelector: React.FC<QuoteTypeSelectorProps> = ({ 
  quoteType, 
  onChangeQuoteType 
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm border p-4 mb-6">
      <h3 className="font-medium mb-3">Tip Ofertă</h3>
      <div className="flex gap-2">
        <Button 
          onClick={() => onChangeQuoteType('client')}
          variant={quoteType === 'client' ? 'default' : 'outline'}
          className="flex-1 gap-2"
        >
          <UserRound size={18} />
          <span>Pentru Client</span>
        </Button>
        <Button 
          onClick={() => onChangeQuoteType('internal')}
          variant={quoteType === 'internal' ? 'default' : 'outline'}
          className="flex-1 gap-2"
        >
          <UserCog size={18} />
          <span>Intern</span>
        </Button>
      </div>
    </div>
  );
};

export default QuoteTypeSelector;
