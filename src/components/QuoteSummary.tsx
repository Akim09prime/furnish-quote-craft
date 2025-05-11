
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, FilePlus, FileText, Trash } from 'lucide-react';
import { Quote } from '@/lib/db';

export interface QuoteSummaryProps {
  quote: Quote;
  onEditClick: () => void;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quote, onEditClick }) => {
  if (!quote) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Sumar Ofertă</h2>
        <Button variant="outline" size="sm" onClick={onEditClick}>
          <Edit className="h-4 w-4 mr-2" />
          Editează
        </Button>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Beneficiar</p>
        <p className="font-medium">{quote.beneficiary || 'Nespecificat'}</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between border-b pb-2">
          <span>Produse:</span>
          <span>{quote.items.length}</span>
        </div>
        
        <div className="flex justify-between border-b pb-2">
          <span>Subtotal:</span>
          <span className="font-medium">{quote.subtotal.toFixed(2)} RON</span>
        </div>
        
        <div className="flex justify-between border-b pb-2">
          <span>Manoperă ({quote.laborPercentage}%):</span>
          <span className="font-medium">{quote.laborCost.toFixed(2)} RON</span>
        </div>
        
        <div className="flex justify-between pt-2">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-xl">{quote.total.toFixed(2)} RON</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 pt-4">
        <Button className="w-full">
          <FilePlus className="mr-2 h-4 w-4" />
          Generează PDF
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Salvează
          </Button>
          
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Șterge
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteSummary;
