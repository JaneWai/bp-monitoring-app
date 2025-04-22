import React, { useState } from 'react';
import { Trash2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { BloodPressureReading, BloodPressureStatus } from '../types';
import { getBloodPressureStatus } from '../utils/bloodPressureUtils';

interface ReadingsListProps {
  readings: BloodPressureReading[];
  onDeleteReading: (id: string) => void;
}

const ReadingsList: React.FC<ReadingsListProps> = ({ readings, onDeleteReading }) => {
  const [filter, setFilter] = useState<BloodPressureStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Sort readings by date and time
  const sortedReadings = [...readings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return sortOrder === 'desc' 
      ? dateB.getTime() - dateA.getTime() 
      : dateA.getTime() - dateB.getTime();
  });

  // Filter readings by status
  const filteredReadings = filter === 'all' 
    ? sortedReadings 
    : sortedReadings.filter(reading => 
        getBloodPressureStatus(reading.systolic, reading.diastolic) === filter
      );

  const getStatusColor = (status: BloodPressureStatus) => {
    switch (status) {
      case BloodPressureStatus.HIGH:
        return 'text-red-600 bg-red-50 border-red-200';
      case BloodPressureStatus.LOW:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-primary-dark bg-primary-light border-primary';
    }
  };

  const getStatusText = (status: BloodPressureStatus) => {
    switch (status) {
      case BloodPressureStatus.HIGH:
        return 'High';
      case BloodPressureStatus.LOW:
        return 'Low';
      default:
        return 'Normal';
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDeleteReading(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-reset after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  if (readings.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="bg-primary-light p-3 rounded-full mb-4">
            <Filter size={24} className="text-primary" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No readings yet</h3>
          <p className="text-gray-500 max-w-md">
            Start tracking your blood pressure by adding your first reading using the form.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100 bg-primary-light">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary-dark">Your Readings</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSortOrder}
              className="p-2 rounded-md hover:bg-white/50 transition-colors"
              aria-label={sortOrder === 'desc' ? 'Sort oldest first' : 'Sort newest first'}
            >
              {sortOrder === 'desc' ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-md hover:bg-white/50 transition-colors"
              aria-label="Show filters"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-3 bg-white/70 rounded-lg animate-fade-in">
            <div className="text-sm font-medium text-gray-700 mb-2">Filter by status:</div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter(BloodPressureStatus.NORMAL)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === BloodPressureStatus.NORMAL ? 'bg-primary text-white' : 'bg-primary-light text-primary-dark hover:bg-primary/20'
                }`}
              >
                Normal
              </button>
              <button 
                onClick={() => setFilter(BloodPressureStatus.HIGH)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === BloodPressureStatus.HIGH ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                High
              </button>
              <button 
                onClick={() => setFilter(BloodPressureStatus.LOW)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === BloodPressureStatus.LOW ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Low
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Date</th>
              <th className="table-header">Time</th>
              <th className="table-header">Reading</th>
              <th className="table-header">Status</th>
              <th className="table-header">Notes</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReadings.map((reading) => {
              const status = getBloodPressureStatus(reading.systolic, reading.diastolic);
              const isConfirmingDelete = deleteConfirm === reading.id;
              
              return (
                <tr key={reading.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell text-gray-900">{reading.date}</td>
                  <td className="table-cell text-gray-900">{reading.time}</td>
                  <td className="table-cell font-medium">
                    {reading.systolic}/{reading.diastolic} <span className="text-xs text-gray-500">mmHg</span>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                  </td>
                  <td className="table-cell text-gray-500 max-w-xs truncate">
                    {reading.notes || '-'}
                  </td>
                  <td className="table-cell text-right">
                    <button
                      onClick={() => handleDelete(reading.id)}
                      className={`p-1.5 rounded-md transition-colors ${
                        isConfirmingDelete 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                      }`}
                      aria-label={isConfirmingDelete ? "Confirm delete" : "Delete reading"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredReadings.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No readings match your filter. Try changing the filter or add more readings.
        </div>
      )}
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
        Showing {filteredReadings.length} of {readings.length} readings
        {filter !== 'all' && ` (filtered by ${filter} status)`}
      </div>
    </div>
  );
};

export default ReadingsList;
