import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { BloodPressureAlert, BloodPressureStatus } from '../types';

interface AlertBannerProps {
  alert: BloodPressureAlert | null;
  onDismiss: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onDismiss }) => {
  if (!alert) return null;
  
  const getAlertStyles = () => {
    switch (alert.type) {
      case BloodPressureStatus.HIGH:
        return 'bg-red-50 border-red-200 text-red-700';
      case BloodPressureStatus.LOW:
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };
  
  return (
    <div className={`mb-6 rounded-lg border p-4 animate-fade-in shadow-sm ${getAlertStyles()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{alert.message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                alert.type === BloodPressureStatus.HIGH
                  ? 'hover:bg-red-100 focus:ring-red-600'
                  : 'hover:bg-blue-100 focus:ring-blue-600'
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
