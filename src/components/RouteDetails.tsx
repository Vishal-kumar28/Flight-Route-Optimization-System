import React from 'react';
import { Route, MapPin, Clock, DollarSign, Plane } from 'lucide-react';
import { OptimizationResult } from '../types';
import { calculateLayoverTime } from '../store/useFlightStore';

interface RouteDetailsProps {
  result: OptimizationResult;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ result }) => {
  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Route className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Optimized Route</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800">Total Distance</span>
          </div>
          <span className="font-semibold">{Math.round(result.totalDistance)} km</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Total Cost</span>
          </div>
          <span className="font-semibold">${Math.round(result.totalCost).toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800">Flight Time</span>
          </div>
          <span className="font-semibold">{formatDuration(result.totalDuration)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-orange-800">Layover Time</span>
          </div>
          <span className="font-semibold">{formatDuration(result.totalLayoverTime)}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Route Order</h3>
        <div className="space-y-4">
          {result.route.map((airport, index) => (
            <div key={airport.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{airport.name}</p>
                <p className="text-sm text-gray-500">{airport.code}</p>
              </div>
              {index < result.route.length - 1 && (
                <div className="text-sm text-gray-500">
                  {formatDuration(calculateLayoverTime(airport, result.route[index + 1]))} layover
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;