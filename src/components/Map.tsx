import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Airport, OptimizationResult } from '../types';

interface MapProps {
  airports: Airport[];
  selectedAirports: Airport[];
  optimizedRoute: OptimizationResult | null;
}

const Map: React.FC<MapProps> = ({ airports, selectedAirports, optimizedRoute }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create projection
    const projection = d3.geoMercator()
      .center([-98, 39])
      .scale(800)
      .translate([width / 2, height / 2]);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Draw base map (simplified)
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f0f9ff');

    // Draw airports
    airports.forEach(airport => {
      const [x, y] = projection([airport.longitude, airport.latitude]) as [number, number];
      
      const isSelected = selectedAirports.some(a => a.id === airport.id);
      
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', isSelected ? '#2563eb' : '#64748b')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    });

    // Draw optimized route
    if (optimizedRoute) {
      const { route } = optimizedRoute;
      
      for (let i = 0; i < route.length; i++) {
        const from = route[i];
        const to = route[(i + 1) % route.length];
        
        const [x1, y1] = projection([from.longitude, from.latitude]) as [number, number];
        const [x2, y2] = projection([to.longitude, to.latitude]) as [number, number];
        
        svg.append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)
          .attr('stroke', '#2563eb')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4,4');
      }
    }
  }, [airports, selectedAirports, optimizedRoute]);

  return <svg ref={svgRef} className="w-full h-full" />;
};

export default Map;