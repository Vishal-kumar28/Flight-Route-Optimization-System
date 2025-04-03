import React from 'react';
import { Plane } from 'lucide-react';
import { Airport } from '../types';

interface AirportListProps {
  airports: Airport[];
  selectedAirports: Airport[];
  onAirportClick: (airport: Airport) => void;
}

const AirportList: React.FC<AirportListProps> = ({ airports, selectedAirports, onAirportClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Available Airports</h2>
      <div className="space-y-2">
        {airports.map(airport => {
          const isSelected = selectedAirports.some(a => a.id === airport.id);
          
          return (
            <button
              key={airport.id}
              onClick={() => onAirportClick(airport)}
              className={`w-full p-3 rounded-lg flex items-center space-x-3 transition-colors
                ${isSelected 
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                  : 'hover:bg-gray-100'
                }`}
            >
              <Plane className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
              <div className="flex-1 text-left">
                <p className="font-medium">{airport.name}</p>
                <p className="text-sm text-gray-500">{airport.code}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AirportList;