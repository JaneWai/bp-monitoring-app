import { BloodPressureReading, BloodPressureStatus } from '../types';

export const getBloodPressureStatus = (systolic: number, diastolic: number): BloodPressureStatus => {
  if (systolic >= 140 || diastolic >= 90) {
    return BloodPressureStatus.HIGH;
  } else if (systolic < 90 || diastolic < 60) {
    return BloodPressureStatus.LOW;
  } else {
    return BloodPressureStatus.NORMAL;
  }
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toTimeString().split(' ')[0].substring(0, 5);
};

export const checkConsecutiveReadings = (readings: BloodPressureReading[]): { isHigh: boolean; isLow: boolean } => {
  if (readings.length < 7) {
    return { isHigh: false, isLow: false };
  }
  
  // Sort readings by date and time
  const sortedReadings = [...readings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Get the 7 most recent readings
  const recentReadings = sortedReadings.slice(0, 7);
  
  // Check if all recent readings are high or low
  const allHigh = recentReadings.every(reading => 
    getBloodPressureStatus(reading.systolic, reading.diastolic) === BloodPressureStatus.HIGH
  );
  
  const allLow = recentReadings.every(reading => 
    getBloodPressureStatus(reading.systolic, reading.diastolic) === BloodPressureStatus.LOW
  );
  
  return { isHigh: allHigh, isLow: allLow };
};
