
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EnvironmentGauge from '../components/EnvironmentGauge';
import ControlPanel from '../components/ControlPanel';
import Chart from '../components/Chart';
import { Sun, Thermometer, Droplet, Waves } from 'lucide-react';
import { generateMockData, generateHistoricalData, thresholds, getStatus } from '../api/mockData';
import { simulateWebSocketData } from '../utils/websocket';

const Hydroponics = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sensorData, setSensorData] = useState(generateMockData());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData(12));

  useEffect(() => {
    // Simulate WebSocket data for real-time updates
    const cleanupWebSocket = simulateWebSocketData((data) => {
      setSensorData(data);
      
      // Update historical data
      setHistoricalData(prev => {
        if (prev.length >= 12) {
          return [...prev.slice(1), {
            timestamp: new Date().toISOString(),
            aquaponics: data.aquaponics,
            hydroponics: {
              temperature: data.hydroponics.temperature,
              phLevel: data.hydroponics.phLevel,
              moistureContent: data.hydroponics.moistureContent,
              lightIntensity: data.hydroponics.lightIntensity
            },
            poultry: data.poultry
          }];
        }
        return prev;
      });
    });

    return () => {
      cleanupWebSocket();
    };
  }, []);

  const handleControlChange = (controlId, value) => {
    console.log(`Control ${controlId} changed to ${value}`);
    
    // Update the state based on the control that changed
    setSensorData(prev => {
      const newData = { ...prev };
      
      if (controlId === 'waterPump') {
        newData.hydroponics.waterPump = value;
      }
      
      return newData;
    });
  };

  const hydroponicsData = sensorData.hydroponics;

  const controls = [
    {
      id: 'waterPump',
      type: 'switch',
      label: 'Watering System',
      value: hydroponicsData.waterPump,
      icon: <Waves size={18} />,
      status: hydroponicsData.moistureContent < 70 ? 'warning' : 'normal',
      statusMessage: hydroponicsData.moistureContent < 70 ? 'Low moisture detected' : ''
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="p-4 md:p-8 sm:ml-64 pt-20">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Hydroponics Monitoring</h1>
          <p className="text-gray-600">Monitor and control your plant environment</p>
        </div>
        
        {/* Sensor Readings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <EnvironmentGauge 
                value={hydroponicsData.lightIntensity} 
                min={300} 
                max={2500}
                unit="lux"
                label="Light Intensity"
                status={getStatus(hydroponicsData.lightIntensity, thresholds.hydroponics.lightIntensity)}
              />
              
              <EnvironmentGauge 
                value={hydroponicsData.temperature} 
                min={15} 
                max={32}
                unit="°C"
                label="Temperature"
                status={getStatus(hydroponicsData.temperature, thresholds.hydroponics.temperature)}
              />
              
              <EnvironmentGauge 
                value={hydroponicsData.phLevel} 
                min={5.0} 
                max={7.5}
                unit="pH"
                label="pH Level"
                status={getStatus(hydroponicsData.phLevel, thresholds.hydroponics.phLevel)}
              />
              
              <EnvironmentGauge 
                value={hydroponicsData.moistureContent} 
                min={50} 
                max={100}
                unit="%"
                label="Moisture Content"
                status={getStatus(hydroponicsData.moistureContent, thresholds.hydroponics.moistureContent)}
              />
            </div>
          </div>
          
          <div>
            <ControlPanel 
              title="Hydroponics Controls"
              controls={controls}
              onControlChange={handleControlChange}
            />
            
            <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
              <h3 className="text-lg font-medium mb-4">Plant Health Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Optimal Growing Conditions</span>
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">Recommended pH: 5.8 - 6.5</p>
                  <p className="text-sm text-gray-600 mb-2">Ideal Temperature: 21°C - 26°C</p>
                  <p className="text-sm text-gray-600">Light Period: 12-16 hours daily</p>
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Water plants when moisture falls below 70%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart 
            title="Temperature & Moisture Trends"
            data={historicalData}
            dataKeys={[
              { dataKey: 'hydroponics.temperature', name: 'Temperature (°C)' },
              { dataKey: 'hydroponics.moistureContent', name: 'Moisture (%)' }
            ]}
            colors={['#F59E0B', '#3B82F6']}
          />
          
          <Chart 
            title="pH & Light Intensity"
            data={historicalData}
            dataKeys={[
              { dataKey: 'hydroponics.phLevel', name: 'pH Level' },
              { dataKey: 'hydroponics.lightIntensity', name: 'Light (lux x 0.01)' }
            ]}
            colors={['#10B981', '#F59E0B']}
          />
        </div>
      </div>
    </div>
  );
};

export default Hydroponics;
