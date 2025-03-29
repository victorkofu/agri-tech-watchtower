import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import Chart from '../components/Chart';
import { useAuth } from '../context/AuthContext';
import { Droplet, Thermometer, Leaf, Bird, AlertTriangle } from 'lucide-react';
import { generateMockData, generateHistoricalData, thresholds, getStatus } from '../api/mockData';
import { simulateWebSocketData } from '../utils/websocket';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sensorData, setSensorData] = useState(generateMockData());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData(12));
  const [alertCount, setAlertCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    // Simulate WebSocket data for real-time updates
    const cleanupWebSocket = simulateWebSocketData((data) => {
      setSensorData(data);
      
      // Update historical data
      setHistoricalData(prev => {
        // Keep only the last 11 entries and add the new one
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
            hydroponics: {
              temperature: data.hydroponics.temperature,
              moistureContent: data.hydroponics.moistureContent
            },
            poultry: {
              temperature: data.poultry.temperature
            }
          }];
        }
        return prev;
      });
    });

    // Count alerts
    const alertInterval = setInterval(() => {
      const data = sensorData;
      let alerts = 0;
      
      // Check aquaponics
      const pondA = data.aquaponics.pondA;
      const pondB = data.aquaponics.pondB;
      
      for (const [key, value] of Object.entries(pondA)) {
        if (thresholds.aquaponics[key] && (value < thresholds.aquaponics[key].min || value > thresholds.aquaponics[key].max)) {
          alerts++;
        }
      }
      
      for (const [key, value] of Object.entries(pondB)) {
        if (thresholds.aquaponics[key] && (value < thresholds.aquaponics[key].min || value > thresholds.aquaponics[key].max)) {
          alerts++;
        }
      }
      
      // Check hydroponics
      for (const [key, value] of Object.entries(data.hydroponics)) {
        if (thresholds.hydroponics[key] && (value < thresholds.hydroponics[key].min || value > thresholds.hydroponics[key].max)) {
          alerts++;
        }
      }
      
      // Check poultry
      for (const [key, value] of Object.entries(data.poultry)) {
        if (thresholds.poultry[key] && (value < thresholds.poultry[key].min || value > thresholds.poultry[key].max)) {
          alerts++;
        }
      }
      
      setAlertCount(alerts);
    }, 3000);

    return () => {
      cleanupWebSocket();
      clearInterval(alertInterval);
    };
  }, [navigate, user, sensorData]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="p-4 md:p-8 sm:ml-64 pt-20">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            title="Aquaponics Status" 
            value={sensorData.aquaponics.pondA.waterPump ? "Active" : "Inactive"}
            icon={<Droplet size={20} />}
          />
          
          <StatsCard 
            title="Hydroponics Temp" 
            value={sensorData.hydroponics.temperature} 
            suffix="°C"
            icon={<Leaf size={20} />}
            change="2.3°C" 
            changeType="positive"
          />
          
          <StatsCard 
            title="Poultry Status" 
            value={sensorData.poultry.movement ? "Activity Detected" : "Normal"}
            icon={<Bird size={20} />}
          />
          
          <StatsCard 
            title="System Alerts" 
            value={alertCount}
            icon={<AlertTriangle size={20} />}
            change={alertCount > 0 ? "Action needed" : "All good"}
            changeType={alertCount > 0 ? "negative" : "positive"}
          />
        </div>
        
        {/* System Overview Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Chart 
            title="Temperature Trends"
            data={historicalData}
            dataKeys={[
              { dataKey: 'aquaponics.pondA.temperature', name: 'Aquaponics A' },
              { dataKey: 'hydroponics.temperature', name: 'Hydroponics' },
              { dataKey: 'poultry.temperature', name: 'Poultry' }
            ]}
          />
          
          <Chart 
            title="Aquaponics pH Levels"
            data={historicalData}
            dataKeys={[
              { dataKey: 'aquaponics.pondA.phLevel', name: 'Pond A' },
              { dataKey: 'aquaponics.pondB.phLevel', name: 'Pond B' }
            ]}
            colors={['#1565C0', '#0D47A1']}
          />
        </div>
        
        {/* Quick Access */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              onClick={() => navigate('/aquaponics')}
              className="cursor-pointer p-4 border rounded-lg flex items-center hover:bg-gray-50 transition-colors"
            >
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Droplet size={24} />
              </div>
              <div>
                <h3 className="font-medium">Aquaponics</h3>
                <p className="text-sm text-gray-500">View fish farm details</p>
              </div>
            </div>
            
            <div 
              onClick={() => navigate('/hydroponics')}
              className="cursor-pointer p-4 border rounded-lg flex items-center hover:bg-gray-50 transition-colors"
            >
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <Leaf size={24} />
              </div>
              <div>
                <h3 className="font-medium">Hydroponics</h3>
                <p className="text-sm text-gray-500">View plant farm details</p>
              </div>
            </div>
            
            <div 
              onClick={() => navigate('/poultry')}
              className="cursor-pointer p-4 border rounded-lg flex items-center hover:bg-gray-50 transition-colors"
            >
              <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                <Bird size={24} />
              </div>
              <div>
                <h3 className="font-medium">Poultry</h3>
                <p className="text-sm text-gray-500">View poultry monitoring</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Alerts */}
        {alertCount > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Alerts</h2>
              <button className="text-sm text-primary hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {sensorData.aquaponics.pondA.phLevel < thresholds.aquaponics.phLevel.min && (
                <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                  <h3 className="font-medium">Low pH Level in Pond A</h3>
                  <p className="text-sm text-gray-700">Current: {sensorData.aquaponics.pondA.phLevel}, Minimum: {thresholds.aquaponics.phLevel.min}</p>
                </div>
              )}
              
              {sensorData.aquaponics.pondA.temperature > thresholds.aquaponics.temperature.max && (
                <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                  <h3 className="font-medium">High Temperature in Pond A</h3>
                  <p className="text-sm text-gray-700">Current: {sensorData.aquaponics.pondA.temperature}°C, Maximum: {thresholds.aquaponics.temperature.max}°C</p>
                </div>
              )}
              
              {sensorData.hydroponics.moistureContent < thresholds.hydroponics.moistureContent.min && (
                <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
                  <h3 className="font-medium">Low Moisture in Hydroponics</h3>
                  <p className="text-sm text-gray-700">Current: {sensorData.hydroponics.moistureContent}%, Minimum: {thresholds.hydroponics.moistureContent.min}%</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
