export interface Airport {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
}

export interface Route {
  from: Airport;
  to: Airport;
  distance: number;
  cost: number;
  duration: number;
  layoverTime?: number;
}

export interface OptimizationResult {
  route: Airport[];
  totalDistance: number;
  totalCost: number;
  totalDuration: number;
  totalLayoverTime: number;
}

export type OptimizationCriteria = 'distance' | 'cost' | 'time' | 'balanced';