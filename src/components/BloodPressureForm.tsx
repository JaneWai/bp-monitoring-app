import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { BloodPressureReading } from '../types';
import { formatDate, formatTime } from '../utils/bloodPressureUtils';

interface BloodPressureFormProps {
  onAddReading: (reading: BloodPressureReading) => void;
}

const BloodPressureForm: React.FC<BloodPressureFormProps> = ({ onAddReading }) => {
  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!systolic) {
      newErrors.systolic = 'Systolic pressure is required';
    } else if (isNaN(Number(systolic)) || Number(systolic) < 50 || Number(systolic) > 250) {
      newErrors.systolic = 'Enter a valid systolic pressure (50-250)';
    }
    
    if (!diastolic) {
      newErrors.diastolic = 'Diastolic pressure is required';
    } else if (isNaN(Number(diastolic)) || Number(diastolic) < 30 || Number(diastolic) > 150) {
      newErrors.diastolic = 'Enter a valid diastolic pressure (30-150)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    const now = new Date();
    const reading: BloodPressureReading = {
      id: crypto.randomUUID(),
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      date: formatDate(now),
      time: formatTime(now),
      notes: notes.trim()
    };
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      onAddReading(reading);
      
      // Reset form
      setSystolic('');
      setDiastolic('');
      setNotes('');
      setErrors({});
      setIsSubmitting(false);
    }, 300);
  };
  
  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100 bg-primary-light">
        <h2 className="text-xl font-semibold text-primary-dark">Add New Reading</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="systolic" className="form-label">
              Systolic (mmHg)
            </label>
            <input
              type="number"
              id="systolic"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className={`form-input ${errors.systolic ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="120"
              min="50"
              max="250"
            />
            {errors.systolic && <p className="form-error">{errors.systolic}</p>}
          </div>
          
          <div>
            <label htmlFor="diastolic" className="form-label">
              Diastolic (mmHg)
            </label>
            <input
              type="number"
              id="diastolic"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className={`form-input ${errors.diastolic ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="80"
              min="30"
              max="150"
            />
            {errors.diastolic && <p className="form-error">{errors.diastolic}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="form-label">
            Notes <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input"
            placeholder="Add any relevant information..."
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center"
        >
          <PlusCircle size={18} className="mr-1.5" />
          {isSubmitting ? 'Adding...' : 'Add Reading'}
        </button>
      </form>
    </div>
  );
};

export default BloodPressureForm;
