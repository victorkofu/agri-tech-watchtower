
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EnvironmentGauge from '../components/EnvironmentGauge';
import CameraView from '../components/CameraView';
import Chart from '../components/Chart';
import { Thermometer, Activity, Clock } from 'lucide-react';
import { generateMockData, generateHistoricalData, thresholds, getStatus } from '../api/mockData';
import { simulateWebSocketData } from '../utils/websocket';

const Poultry = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sensorData, setSensorData] = useState(generateMockData());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData(12));
  const [movementEvents, setMovementEvents] = useState([]);

  useEffect(() => {
    // Simulate WebSocket data for real-time updates
    const cleanupWebSocket = simulateWebSocketData((data) => {
      // Check if there's a new movement event
      if (data.poultry.movement && !sensorData.poultry.movement) {
        const newEvent = {
          timestamp: new Date().toISOString(),
          temperature: data.poultry.temperature,
          imageUrl: `https://picsum.photos/800/450?random=${Math.random()}`
        };
        
        setMovementEvents(prev => [newEvent, ...prev].slice(0, 5));
      }
      
      setSensorData(data);
      
      // Update historical data
      setHistoricalData(prev => {
        if (prev.length >= 12) {
          return [...prev.slice(1), {
            timestamp: new Date().toISOString(),
            aquaponics: data.aquaponics,
            hydroponics: data.hydroponics,
            poultry: {
              temperature: data.poultry.temperature
            }
          }];
        }
        return prev;
      });
    });

    return () => {
      cleanupWebSocket();
    };
  }, [sensorData]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="p-4 md:p-8 sm:ml-64 pt-20">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Poultry Monitoring</h1>
          <p className="text-gray-600">Monitor and observe your poultry environment</p>
        </div>
        
        {/* Top Section - Gauges and Camera */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <EnvironmentGauge 
              value={sensorData.poultry.temperature} 
              min={15} 
              max={40}
              unit="°C"
              label="Temperature"
              status={getStatus(sensorData.poultry.temperature, thresholds.poultry.temperature)}
            />
            
            <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Movement Status</h3>
                <div className={`w-3 h-3 rounded-full ${sensorData.poultry.movement ? 'bg-red-500' : 'bg-green-500'}`}></div>
              </div>
              <div className="flex items-center">
                <Activity size={20} className="mr-2 text-gray-500" />
                <span className="text-sm">
                  {sensorData.poultry.movement ? 'Activity Detected' : 'Normal Activity'}
                </span>
              </div>
              {sensorData.poultry.movement && (
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>Detected at {formatDate(sensorData.poultry.movementTimestamp)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <CameraView title="Poultry Camera View" />
          </div>
        </div>
        
        {/* Chart */}
        <div className="grid grid-cols-1 mb-6">
          <Chart 
            title="Temperature History"
            data={historicalData}
            dataKeys={[
              { dataKey: 'poultry.temperature', name: 'Temperature (°C)' }
            ]}
            colors={['#F59E0B']}
          />
        </div>
        
        {/* Movement Events */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Movement Events</h2>
          
          {movementEvents.length === 0 ? (
            <div className="text-center p-6 text-gray-500">
              <Activity size={40} className="mx-auto mb-2 opacity-40" />
              <p>No movement events recorded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {movementEvents.map((event, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={`Movement event ${index + 1}`} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Movement Detected</span>
                      <div className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Alert</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="mb-1">
                        <Clock size={12} className="inline mr-1" />
                        {formatDate(event.timestamp)}
                      </p>
                      <p>
                        <Thermometer size={12} className="inline mr-1" />
                        Temperature: {event.temperature}°C
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Poultry;
