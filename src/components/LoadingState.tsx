
import React from 'react';

interface LoadingStateProps {
  loadingError: string | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ loadingError }) => {
  return (
    <div className="h-screen flex items-center justify-center flex-col p-4">
      <div className="text-xl font-bold mb-2">Încărcare baza de date...</div>
      {loadingError && (
        <div className="text-red-500 text-sm mt-2 max-w-md text-center">
          {loadingError}
        </div>
      )}
    </div>
  );
};

export default LoadingState;
