
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EnvironmentGauge = ({ value, min, max, unit, label, status = 'normal' }) => {
  const chartRef = useRef(null);
  
  // Normalize the value between 0 and 1
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));
  
  const getStatusColor = () => {
    switch (status) {
      case 'low': return '#3b82f6'; // blue
      case 'high': return '#ef4444'; // red
      case 'normal': return '#10b981'; // green
      default: return '#10b981';
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      createGauge();
    }
    
    function createGauge() {
      // Clear previous chart
      d3.select(chartRef.current).selectAll('*').remove();

      // Set up dimensions
      const width = chartRef.current.clientWidth;
      const height = width * 0.6;
      const radius = Math.min(width, height) / 2;
      
      // Create SVG
      const svg = d3.select(chartRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height - 10})`);
      
      // Create scale
      const scale = d3.scaleLinear()
        .domain([0, 1])
        .range([-Math.PI / 2, Math.PI / 2]);
      
      // Arc generator
      const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);
      
      // Add background arc
      svg.append('path')
        .datum({ endAngle: Math.PI / 2 })
        .attr('d', arc)
        .attr('fill', '#e5e7eb');
      
      // Add colored arc based on value
      const valueArc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8)
        .startAngle(-Math.PI / 2)
        .endAngle(scale(normalizedValue));
      
      svg.append('path')
        .attr('d', valueArc)
        .attr('fill', getStatusColor());
      
      // Add center text
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', -radius * 0.15)
        .attr('class', 'text-2xl font-medium')
        .text(value);
      
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', radius * 0.05)
        .attr('class', 'text-sm text-gray-500')
        .text(unit);
      
      // Add min and max labels
      svg.append('text')
        .attr('text-anchor', 'start')
        .attr('x', -radius * 0.8)
        .attr('y', 5)
        .attr('class', 'text-xs text-gray-500')
        .text(min);
      
      svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', radius * 0.8)
        .attr('y', 5)
        .attr('class', 'text-xs text-gray-500')
        .text(max);
    }
    
    const handleResize = () => {
      createGauge();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [value, min, max, normalizedValue, status]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{label}</h3>
        <div className={`w-3 h-3 rounded-full bg-${status === 'normal' ? 'green' : status === 'low' ? 'blue' : 'red'}-500`}></div>
      </div>
      <div className="gauge-container" ref={chartRef}></div>
    </div>
  );
};

export default EnvironmentGauge;
