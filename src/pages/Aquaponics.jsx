
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EnvironmentGauge from '../components/EnvironmentGauge';
import ControlPanel from '../components/ControlPanel';
import CameraView from '../components/CameraView';
import Chart from '../components/Chart';
import { Droplet, Thermometer, Waves, Gauge, Lightbulb } from 'lucide-react';
import { generateMockData, generateHistoricalData, thresholds, getStatus } from '../api/mockData';
import { simulateWebSocketData } from '../utils/websocket';

const Aquaponics = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sensorData, setSensorData] = useState(generateMockData());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData(12));
  const [activeTab, setActiveTab] = useState('pondA');

  useEffect(() => {
    // Simulate WebSocket data for real-time updates
    const cleanupWebSocket = simulateWebSocketData((data) => {
      setSensorData(data);
      
      // Update historical data
      setHistoricalData(prev => {
        if (prev.length >= 12) {
          return [...prev.slice(1), {
            timestamp: new Date().toISOString(),
            aquaponics: {
              pondA: {
                phLevel: data.aquaponics.pondA.phLevel,
                temperature: data.aquaponics.pondA.temperature,
                dissolvedOxygen: data.aquaponics.pondA.dissolvedOxygen
              },
              pondB: {
                phLevel: data.aquaponics.pondB.phLevel,
                temperature: data.aquaponics.pondB.temperature,
                dissolvedOxygen: data.aquaponics.pondB.dissolvedOxygen
              }
            },
            hydroponics: data.hydroponics,
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
      
      if (activeTab === 'pondA') {
        if (controlId === 'waterPump') {
          newData.aquaponics.pondA.waterPump = value;
        } else if (controlId === 'light') {
          newData.aquaponics.pondA.light = value;
        }
      } else {
        if (controlId === 'waterPump') {
          newData.aquaponics.pondB.waterPump = value;
        } else if (controlId === 'light') {
          newData.aquaponics.pondB.light = value;
        }
      }
      
      return newData;
    });
  };

  const currentPond = activeTab === 'pondA' ? sensorData.aquaponics.pondA : sensorData.aquaponics.pondB;

  const controls = [
    {
      id: 'waterPump',
      type: 'switch',
      label: 'Water Pump',
      value: currentPond.waterPump,
      icon: <Waves size={18} />,
      status: currentPond.waterPump ? 'normal' : 'warning',
      statusMessage: currentPond.waterPump ? '' : 'Pump is currently inactive'
    },
    {
      id: 'light',
      type: 'switch',
      label: 'Lighting',
      value: currentPond.light,
      icon: <Lightbulb size={18} />,
      status: 'normal'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="p-4 md:p-8 sm:ml-64 pt-20">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Aquaponics Monitoring</h1>
          <p className="text-gray-600">Monitor and control your fish farm environment</p>
        </div>
        
        {/* Pond Selection Tabs */}
        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`py-3 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'pondA'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('pondA')}
            >
              Fish Pond A
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'pondB'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('pondB')}
            >
              Fish Pond B
            </button>
          </div>
        </div>
        
        {/* Sensor Readings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <EnvironmentGauge 
                value={currentPond.phLevel} 
                min={5.5} 
                max={9.0}
                unit="pH"
                label="pH Level"
                status={getStatus(currentPond.phLevel, thresholds.aquaponics.phLevel)}
              />
              
              <EnvironmentGauge 
                value={currentPond.dissolvedOxygen} 
                min={3} 
                max={14}
                unit="mg/L"
                label="Dissolved Oxygen"
                status={getStatus(currentPond.dissolvedOxygen, thresholds.aquaponics.dissolvedOxygen)}
              />
              
              <EnvironmentGauge 
                value={currentPond.temperature} 
                min={20} 
                max={32}
                unit="°C"
                label="Temperature"
                status={getStatus(currentPond.temperature, thresholds.aquaponics.temperature)}
              />
              
              <EnvironmentGauge 
                value={currentPond.pressure} 
                min={980} 
                max={1040}
                unit="hPa"
                label="Pressure"
                status={getStatus(currentPond.pressure, thresholds.aquaponics.pressure)}
              />
              
              <EnvironmentGauge 
                value={currentPond.turbidity} 
                min={0} 
                max={15}
                unit="NTU"
                label="Turbidity"
                status={getStatus(currentPond.turbidity, thresholds.aquaponics.turbidity)}
              />
            </div>
          </div>
          
          <div>
            <ControlPanel 
              title="Pond Controls"
              controls={controls}
              onControlChange={handleControlChange}
            />
          </div>
        </div>
        
        {/* Charts and Camera */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart 
            title={`${activeTab === 'pondA' ? 'Pond A' : 'Pond B'} - Recent Data`}
            data={historicalData}
            dataKeys={[
              { 
                dataKey: `aquaponics.${activeTab}.phLevel`, 
                name: 'pH Level' 
              },
              { 
                dataKey: `aquaponics.${activeTab}.dissolvedOxygen`, 
                name: 'Dissolved Oxygen' 
              },
              { 
                dataKey: `aquaponics.${activeTab}.temperature`, 
                name: 'Temperature' 
              }
            ]}
          />
          
          <CameraView title="Pond Camera View" />
        </div>
      </div>
    </div>
  );
};

export default Aquaponics;
