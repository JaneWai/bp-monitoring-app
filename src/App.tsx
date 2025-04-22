import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Header from './components/Header';
import BloodPressureForm from './components/BloodPressureForm';
import ReadingsList from './components/ReadingsList';
import CalendarView from './components/CalendarView';
import AlertBanner from './components/AlertBanner';
import InfoCard from './components/InfoCard';
import useLocalStorage from './hooks/useLocalStorage';
import { BloodPressureReading, BloodPressureAlert, BloodPressureStatus } from './types';
import { checkConsecutiveReadings } from './utils/bloodPressureUtils';

function App() {
  const [readings, setReadings] = useLocalStorage<BloodPressureReading[]>('bp-readings', []);
  const [alert, setAlert] = useState<BloodPressureAlert | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useLocalStorage<string[]>('dismissed-alerts', []);
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');

  // Check for consecutive high or low readings
  useEffect(() => {
    const { isHigh, isLow } = checkConsecutiveReadings(readings);
    
    if (isHigh) {
      const alertId = `high-${new Date().toISOString().split('T')[0]}`;
      if (!dismissedAlerts.includes(alertId)) {
        setAlert({
          type: BloodPressureStatus.HIGH,
          message: "You've had high blood pressure readings for 7 consecutive days. Please consult with a healthcare professional as soon as possible.",
          date: new Date().toISOString()
        });
      }
    } else if (isLow) {
      const alertId = `low-${new Date().toISOString().split('T')[0]}`;
      if (!dismissedAlerts.includes(alertId)) {
        setAlert({
          type: BloodPressureStatus.LOW,
          message: "You've had low blood pressure readings for 7 consecutive days. Please consult with a healthcare professional as soon as possible.",
          date: new Date().toISOString()
        });
      }
    }
  }, [readings, dismissedAlerts]);

  const handleAddReading = (reading: BloodPressureReading) => {
    setReadings([...readings, reading]);
  };

  const handleDeleteReading = (id: string) => {
    setReadings(readings.filter(reading => reading.id !== id));
  };

  const handleDismissAlert = () => {
    if (alert) {
      const alertId = `${alert.type}-${new Date().toISOString().split('T')[0]}`;
      setDismissedAlerts([...dismissedAlerts, alertId]);
      setAlert(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <AlertBanner alert={alert} onDismiss={handleDismissAlert} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* View toggle buttons */}
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setActiveView('list')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'list' 
                    ? 'bg-primary-light text-primary-dark' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setActiveView('calendar')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'calendar' 
                    ? 'bg-primary-light text-primary-dark' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Calendar View
              </button>
            </div>
            
            {/* Active view */}
            {activeView === 'list' ? (
              <ReadingsList readings={readings} onDeleteReading={handleDeleteReading} />
            ) : (
              <CalendarView readings={readings} />
            )}
            
            {readings.length > 0 && (
              <div className="bg-secondary-light border border-secondary rounded-lg p-4 text-sm text-neutral-dark">
                <p className="font-medium">Did you know?</p>
                <p className="mt-1">Consistent tracking of your blood pressure can help identify patterns and improve your health management.</p>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <BloodPressureForm onAddReading={handleAddReading} />
            <InfoCard />
          </div>
        </div>
      </main>
      
      <footer className="bg-primary-dark text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center justify-center md:justify-start">
                <Heart size={18} className="text-secondary mr-2" />
                <p className="font-medium">BP Monitor</p>
              </div>
              <p className="text-sm text-gray-300 mt-1 text-center md:text-left">Your personal health companion</p>
            </div>
            <div className="text-sm text-gray-300 text-center md:text-right">
              <p>Built with ChatAndBuild</p>
              <p className="mt-1">This app is for informational purposes only and is not a substitute for medical advice.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
