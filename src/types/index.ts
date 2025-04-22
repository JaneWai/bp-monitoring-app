export enum BloodPressureStatus {
  NORMAL = 'normal',
  HIGH = 'high',
  LOW = 'low'
}

export interface BloodPressureReading {
  id: string;
  systolic: number;
  diastolic: number;
  date: string;
  time: string;
  notes: string;
}

export interface BloodPressureAlert {
  type: BloodPressureStatus;
  message: string;
  date: string;
}
