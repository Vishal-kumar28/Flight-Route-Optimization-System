import React from 'react';
import { Plane, RotateCw } from 'lucide-react';
import { useFlightStore } from './store/useFlightStore';
import Map from './components/Map';
import AirportList from './components/AirportList';
import RouteDetails from './components/RouteDetails';

function App() {
  const {
    airports,
    selectedAirports,
    optimizedRoute,
    optimizationCriteria,
    toggleAirportSelection,
    optimizeRoute,
    clearSelection,
    setOptimizationCriteria,
  } = useFlightStore();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Plane className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Flight Route Optimizer</h1>
            </div>
            <div className="flex space-x-3">
              <select
                value={optimizationCriteria}
                onChange={(e) => setOptimizationCriteria(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="balanced">Balanced</option>
                <option value="distance">Shortest Distance</option>
                <option value="cost">Lowest Cost</option>
                <option value="time">Fastest Time</option>
              </select>
              <button
                onClick={clearSelection}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Selection
              </button>
              <button
                onClick={optimizeRoute}
                disabled={selectedAirports.length < 2}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2
                  ${selectedAirports.length < 2
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                <RotateCw className="w-5 h-5" />
                <span>Optimize Route</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <AirportList
              airports={airports}
              selectedAirports={selectedAirports}
              onAirportClick={toggleAirportSelection}
            />
          </div>

          {/* Main Map Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 h-[500px]">
              <Map
                airports={airports}
                selectedAirports={selectedAirports}
                optimizedRoute={optimizedRoute}
              />
            </div>

            {/* Route Details */}
            {optimizedRoute && (
              <RouteDetails result={optimizedRoute} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;