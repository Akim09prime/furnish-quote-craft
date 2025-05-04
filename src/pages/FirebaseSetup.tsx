
import React from 'react';
import FirebaseSetupInstructions from '@/components/FirebaseSetupInstructions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FirebaseSetup = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/login">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Înapoi la autentificare
          </Button>
        </Link>
      </div>
      
      <FirebaseSetupInstructions />
    </div>
  );
};

export default FirebaseSetup;
