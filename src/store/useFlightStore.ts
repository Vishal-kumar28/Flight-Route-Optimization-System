import { create } from 'zustand';
import { Airport, OptimizationResult, OptimizationCriteria } from '../types';

interface FlightState {
  airports: Airport[];
  selectedAirports: Airport[];
  optimizedRoute: OptimizationResult | null;
  optimizationCriteria: OptimizationCriteria;
  addAirport: (airport: Airport) => void;
  removeAirport: (airportId: string) => void;
  toggleAirportSelection: (airport: Airport) => void;
  optimizeRoute: () => void;
  clearSelection: () => void;
  setOptimizationCriteria: (criteria: OptimizationCriteria) => void;
}

const sampleAirports: Airport[] = [
  { id: '1', name: 'John F. Kennedy International', code: 'JFK', latitude: 40.6413, longitude: -73.7781 },
  { id: '2', name: 'Los Angeles International', code: 'LAX', latitude: 33.9416, longitude: -118.4085 },
  { id: '3', name: "O'Hare International", code: 'ORD', latitude: 41.9742, longitude: -87.9073 },
  { id: '4', name: 'Miami International', code: 'MIA', latitude: 25.7959, longitude: -80.2870 },
  { id: '5', name: 'San Francisco International', code: 'SFO', latitude: 37.7749, longitude: -122.4194 }
];

// Calculate distance between two airports using Haversine formula
export const calculateDistance = (from: Airport, to: Airport): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (to.latitude - from.latitude) * Math.PI / 180;
  const dLon = (to.longitude - from.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Calculate flight duration based on distance
const calculateDuration = (distance: number): number => {
  const averageSpeed = 850; // km/h
  return distance / averageSpeed;
};

// Calculate ticket cost based on distance and time
const calculateCost = (distance: number, duration: number): number => {
  const baseCost = 50;
  const costPerKm = 0.12;
  const costPerHour = 30;
  return baseCost + (distance * costPerKm) + (duration * costPerHour);
};

// Calculate layover time between flights
export const calculateLayoverTime = (from: Airport, to: Airport): number => {
  // Simplified layover calculation based on airport size and distance
  const baseLayover = 1; // hour
  const distanceFactorHours = calculateDistance(from, to) / 2000; // Additional time based on distance
  return baseLayover + distanceFactorHours;
};

// Enhanced optimization algorithm with multiple criteria
const optimizeRoute = (airports: Airport[], criteria: OptimizationCriteria): OptimizationResult => {
  if (airports.length < 2) {
    return {
      route: airports,
      totalDistance: 0,
      totalCost: 0,
      totalDuration: 0,
      totalLayoverTime: 0
    };
  }

  const calculateScore = (from: Airport, to: Airport) => {
    const distance = calculateDistance(from, to);
    const duration = calculateDuration(distance);
    const cost = calculateCost(distance, duration);
    const layover = calculateLayoverTime(from, to);

    switch (criteria) {
      case 'distance':
        return distance;
      case 'cost':
        return cost;
      case 'time':
        return duration + layover;
      case 'balanced':
      default:
        return (distance / 1000) + (cost / 100) + (duration + layover);
    }
  };

  const route: Airport[] = [airports[0]];
  let unvisited = airports.slice(1);
  let totalDistance = 0;
  let totalDuration = 0;
  let totalCost = 0;
  let totalLayoverTime = 0;

  while (unvisited.length > 0) {
    const current = route[route.length - 1];
    let best = unvisited[0];
    let bestScore = calculateScore(current, best);

    for (const airport of unvisited) {
      const score = calculateScore(current, airport);
      if (score < bestScore) {
        bestScore = score;
        best = airport;
      }
    }

    const distance = calculateDistance(current, best);
    const duration = calculateDuration(distance);
    const cost = calculateCost(distance, duration);
    const layover = calculateLayoverTime(current, best);

    totalDistance += distance;
    totalDuration += duration;
    totalCost += cost;
    totalLayoverTime += layover;

    route.push(best);
    unvisited = unvisited.filter(a => a.id !== best.id);
  }

  // Add return to starting point
  const lastToFirst = calculateDistance(route[route.length - 1], route[0]);
  const finalDuration = calculateDuration(lastToFirst);
  const finalCost = calculateCost(lastToFirst, finalDuration);
  
  totalDistance += lastToFirst;
  totalDuration += finalDuration;
  totalCost += finalCost;

  return {
    route,
    totalDistance,
    totalCost,
    totalDuration,
    totalLayoverTime
  };
};

export const useFlightStore = create<FlightState>((set, get) => ({
  airports: sampleAirports,
  selectedAirports: [],
  optimizedRoute: null,
  optimizationCriteria: 'balanced',
  
  addAirport: (airport) => 
    set((state) => ({ airports: [...state.airports, airport] })),
  
  removeAirport: (airportId) =>
    set((state) => ({
      airports: state.airports.filter(a => a.id !== airportId),
      selectedAirports: state.selectedAirports.filter(a => a.id !== airportId),
      optimizedRoute: null
    })),
  
  toggleAirportSelection: (airport) =>
    set((state) => {
      const isSelected = state.selectedAirports.some(a => a.id === airport.id);
      const selectedAirports = isSelected
        ? state.selectedAirports.filter(a => a.id !== airport.id)
        : [...state.selectedAirports, airport];
      return { selectedAirports, optimizedRoute: null };
    }),
  
  optimizeRoute: () => {
    const { selectedAirports, optimizationCriteria } = get();
    const optimizedRoute = optimizeRoute(selectedAirports, optimizationCriteria);
    set({ optimizedRoute });
  },
  
  clearSelection: () => set({ selectedAirports: [], optimizedRoute: null }),
  
  setOptimizationCriteria: (criteria) => set({ optimizationCriteria: criteria }),
}));