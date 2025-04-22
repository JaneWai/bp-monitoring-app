import React from 'react';
import { Heart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary-light p-2 rounded-full mr-3">
              <Heart size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">BP Monitor</h1>
              <p className="text-sm text-gray-500">Track your blood pressure</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
