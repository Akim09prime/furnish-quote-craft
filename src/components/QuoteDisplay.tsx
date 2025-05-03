
import React from 'react';
import { useQuoteContext } from '@/context/QuoteContext';
import QuoteItem from '@/components/QuoteItem';

const QuoteDisplay: React.FC = () => {
  const { quote, quoteType, handleUpdateQuantity, handleRemoveItem } = useQuoteContext();

  if (!quote) return null;

  return (
    <div className="print:block">
      <div className="print:mb-8">
        <h2 className="text-2xl font-bold mb-4 print:text-3xl print:text-center">
          {quote.title || "Ofertă Mobilier"}
        </h2>
        {quote.beneficiary && (
          <p className="text-gray-700 print:text-center print:text-lg">
            Client: {quote.beneficiary}
          </p>
        )}
        <p className="text-gray-500 print:text-center print:text-lg">
          Data: {new Date().toLocaleDateString('ro-RO')}
        </p>
      </div>
      
      {quote.items.length > 0 ? (
        <div className="space-y-4 print:mt-8">
          <h3 className="text-xl font-medium print:text-2xl print:mb-4">
            Produse în ofertă
          </h3>
          <table className="w-full hidden print:table">
            <thead className="border-b">
              <tr>
                {quoteType === 'internal' && <th className="text-left py-2">Cod</th>}
                <th className="text-left py-2">Categorie</th>
                <th className="text-left py-2">Specificații</th>
                {quoteType === 'internal' && <th className="text-right py-2">Preț/buc</th>}
                <th className="text-right py-2">Cant.</th>
                {quoteType === 'internal' && <th className="text-right py-2">Total</th>}
              </tr>
            </thead>
            <tbody>
              {quote.items.map(item => (
                <tr key={item.id} className="border-b">
                  {quoteType === 'internal' && <td className="py-2">{item.productDetails.cod}</td>}
                  <td className="py-2">{item.categoryName}</td>
                  <td className="py-2">
                    {Object.entries(item.productDetails)
                      .filter(([key]) => !['id', 'cod', 'pret'].includes(key) && typeof item.productDetails[key] !== 'object')
                      .map(([key, value]) => (
                        <div key={key}>
                          {quoteType === 'internal' ? (
                            <><span className="font-medium">{key}:</span> {String(value)}</>
                          ) : (
                            <>{String(value)}</>
                          )}
                        </div>
                      ))}
                  </td>
                  {quoteType === 'internal' && <td className="py-2 text-right">{item.pricePerUnit.toFixed(2)} RON</td>}
                  <td className="py-2 text-right">{item.quantity}</td>
                  {quoteType === 'internal' && <td className="py-2 text-right font-medium">{item.total.toFixed(2)} RON</td>}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
            {quote.items.map(item => (
              <QuoteItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg print:hidden">
          <p className="text-gray-500">
            Nu există produse în ofertă. Selectează produse pentru a le adăuga.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuoteDisplay;
