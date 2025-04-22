import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const InfoCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card">
      <div 
        className="p-6 border-b border-gray-100 bg-secondary-light cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-secondary p-2 rounded-full mr-3">
              <Info size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Blood Pressure Info</h3>
          </div>
          <button 
            className="p-1 rounded-full hover:bg-white/30 transition-colors"
            aria-label={isExpanded ? "Collapse information" : "Expand information"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6 space-y-4 text-sm text-gray-600 animate-fade-in">
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Normal Range</h4>
            <p className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-primary-light border border-primary mr-2"></span>
              Systolic: 90-139 mmHg
            </p>
            <p className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-primary-light border border-primary mr-2"></span>
              Diastolic: 60-89 mmHg
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-1">High Blood Pressure</h4>
            <p className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-red-100 border border-red-300 mr-2"></span>
              Systolic: 140+ mmHg
            </p>
            <p className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-red-100 border border-red-300 mr-2"></span>
              Diastolic: 90+ mmHg
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Low Blood Pressure</h4>
            <p className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-100 border border-blue-300 mr-2"></span>
              Systolic: Below 90 mmHg
            </p>
            <p className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-100 border border-blue-300 mr-2"></span>
              Diastolic: Below 60 mmHg
            </p>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              This information is for reference only. Always consult with a healthcare professional for medical advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoCard;
