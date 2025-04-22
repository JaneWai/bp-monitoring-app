import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { BloodPressureReading, BloodPressureStatus } from '../types';
import { getBloodPressureStatus } from '../utils/bloodPressureUtils';

interface CalendarViewProps {
  readings: BloodPressureReading[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ readings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get days in month, first day of month, etc.
  const daysInMonth = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  }, [currentMonth]);
  
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  }, [currentMonth]);
  
  // Group readings by date - Fix timezone issues by using the date string directly
  const readingsByDate = useMemo(() => {
    const grouped: Record<string, BloodPressureReading[]> = {};
    
    readings.forEach(reading => {
      // Use the date string directly from the reading
      const dateStr = reading.date;
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(reading);
    });
    
    return grouped;
  }, [readings]);
  
  // Get status for a specific date
  const getStatusForDate = (dateStr: string): BloodPressureStatus | null => {
    const dayReadings = readingsByDate[dateStr] || [];
    
    if (dayReadings.length === 0) return null;
    
    // If there are multiple readings in a day, prioritize HIGH > LOW > NORMAL
    let hasHigh = false;
    let hasLow = false;
    
    for (const reading of dayReadings) {
      const status = getBloodPressureStatus(reading.systolic, reading.diastolic);
      if (status === BloodPressureStatus.HIGH) {
        hasHigh = true;
      } else if (status === BloodPressureStatus.LOW) {
        hasLow = true;
      }
    }
    
    if (hasHigh) return BloodPressureStatus.HIGH;
    if (hasLow) return BloodPressureStatus.LOW;
    return BloodPressureStatus.NORMAL;
  };
  
  // Navigate to previous/next month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Get month name and year
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  
  // Generate calendar days
  const calendarDays = [];
  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    // Fix timezone issues by constructing the date string directly
    // Format: YYYY-MM-DD (same format as in the readings)
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${currentMonth.getFullYear()}-${month}-${dayStr}`;
    
    const status = getStatusForDate(dateStr);
    
    // Get today's date in YYYY-MM-DD format for comparison
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const isToday = todayStr === dateStr;
    
    calendarDays.push({
      day,
      date: dateStr,
      status,
      readings: readingsByDate[dateStr] || [],
      isToday
    });
  }
  
  // Add empty cells for days after the last day of the month
  while (calendarDays.length < totalCells) {
    calendarDays.push(null);
  }
  
  // Split days into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  
  // Get status color
  const getStatusColor = (status: BloodPressureStatus | null) => {
    switch (status) {
      case BloodPressureStatus.HIGH:
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case BloodPressureStatus.LOW:
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case BloodPressureStatus.NORMAL:
        return 'bg-primary-light text-primary-dark border-primary hover:bg-primary-light/80';
      default:
        return 'bg-white hover:bg-gray-100';
    }
  };
  
  // Get reading summary for a day
  const getReadingSummary = (readings: BloodPressureReading[]) => {
    if (readings.length === 0) return null;
    
    if (readings.length === 1) {
      const reading = readings[0];
      return `${reading.systolic}/${reading.diastolic} mmHg`;
    }
    
    // For multiple readings, show the average
    const totalSystolic = readings.reduce((sum, r) => sum + r.systolic, 0);
    const totalDiastolic = readings.reduce((sum, r) => sum + r.diastolic, 0);
    const avgSystolic = Math.round(totalSystolic / readings.length);
    const avgDiastolic = Math.round(totalDiastolic / readings.length);
    
    return `Avg: ${avgSystolic}/${avgDiastolic} mmHg`;
  };
  
  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100 bg-primary-light">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary-dark">Calendar View</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-md hover:bg-white/50 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} className="text-primary-dark" />
            </button>
            <div className="font-medium text-primary-dark">
              {monthName} {year}
            </div>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-md hover:bg-white/50 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} className="text-primary-dark" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`
                    min-h-[80px] p-2 border rounded-md transition-all duration-200
                    ${day === null ? 'border-transparent' : 'border-gray-200'}
                    ${day?.isToday ? 'ring-2 ring-primary ring-opacity-50' : ''}
                    ${day?.status ? getStatusColor(day.status) : ''}
                  `}
                >
                  {day !== null && (
                    <>
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${day.isToday ? 'text-primary' : 'text-gray-700'}`}>
                          {day.day}
                        </span>
                        {day.readings.length > 0 && (
                          <span className="text-xs font-medium bg-gray-200 text-gray-700 rounded-full px-1.5 py-0.5">
                            {day.readings.length}
                          </span>
                        )}
                      </div>
                      
                      {day.readings.length > 0 && (
                        <div className="mt-2 text-xs">
                          <div className="font-medium">
                            {getReadingSummary(day.readings)}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Color indicates blood pressure status
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary-light border border-primary mr-1"></div>
            <span className="text-xs text-gray-600">Normal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200 mr-1"></div>
            <span className="text-xs text-gray-600">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200 mr-1"></div>
            <span className="text-xs text-gray-600">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
