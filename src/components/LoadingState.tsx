
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  loadingError: string | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ loadingError }) => {
  return (
    <div className="h-screen flex items-center justify-center flex-col p-4">
      {!loadingError ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-furniture-purple mb-4" />
          <div className="text-xl font-bold mb-2">Încărcare baza de date...</div>
        </>
      ) : (
        <>
          <div className="text-xl font-bold text-red-500 mb-2">Eroare</div>
          <div className="text-red-500 text-sm mt-2 max-w-md text-center">
            {loadingError}
            <div className="mt-4 text-gray-600">
              Încercați să reîmprospătați pagina sau să reveniți mai târziu.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoadingState;
