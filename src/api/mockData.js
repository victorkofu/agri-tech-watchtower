
// Mock data generator for the farm monitoring dashboard
// This simulates the data that would come from the Django backend

// Define thresholds for various parameters
export const thresholds = {
  aquaponics: {
    phLevel: { min: 6.0, max: 8.5 },
    dissolvedOxygen: { min: 4.0, max: 12.0 },
    temperature: { min: 22, max: 30 },
    pressure: { min: 990, max: 1030 },
    turbidity: { min: 0, max: 10 }
  },
  hydroponics: {
    temperature: { min: 18, max: 30 },
    phLevel: { min: 5.5, max: 7.0 },
    moistureContent: { min: 60, max: 90 },
    lightIntensity: { min: 600, max: 2000 }
  },
  poultry: {
    temperature: { min: 18, max: 35 },
    humidity: { min: 30, max: 70 }
  }
};

// Helper function to get status based on thresholds
export const getStatus = (value, thresholdObj) => {
  if (value < thresholdObj.min) return 'low';
  if (value > thresholdObj.max) return 'high';
  return 'normal';
};

// Generate random number within range
const randomInRange = (min, max, precision = 0) => {
  const value = Math.random() * (max - min) + min;
  return precision === 0 ? Math.floor(value) : parseFloat(value.toFixed(precision));
};

// Generate slightly different value from previous one
const generateNewValue = (previousValue, min, max, maxChange, precision = 0) => {
  const change = randomInRange(-maxChange, maxChange, precision);
  let newValue = previousValue + change;
  
  // Ensure value stays within range
  newValue = Math.max(min, Math.min(max, newValue));
  
  return precision === 0 ? Math.floor(newValue) : parseFloat(newValue.toFixed(precision));
};

// Generate mock data for all systems
export const generateMockData = (previousData) => {
  // If previous data exists, generate slight variations
  if (previousData) {
    return {
      aquaponics: {
        pondA: {
          phLevel: generateNewValue(previousData.aquaponics.pondA.phLevel, 5.5, 9.0, 0.2, 1),
          dissolvedOxygen: generateNewValue(previousData.aquaponics.pondA.dissolvedOxygen, 3, 14, 0.5, 1),
          temperature: generateNewValue(previousData.aquaponics.pondA.temperature, 20, 32, 0.5, 1),
          pressure: generateNewValue(previousData.aquaponics.pondA.pressure, 980, 1040, 2, 0),
          turbidity: generateNewValue(previousData.aquaponics.pondA.turbidity, 0, 15, 0.5, 1),
          waterPump: previousData.aquaponics.pondA.waterPump,
          light: previousData.aquaponics.pondA.light
        },
        pondB: {
          phLevel: generateNewValue(previousData.aquaponics.pondB.phLevel, 5.5, 9.0, 0.2, 1),
          dissolvedOxygen: generateNewValue(previousData.aquaponics.pondB.dissolvedOxygen, 3, 14, 0.5, 1),
          temperature: generateNewValue(previousData.aquaponics.pondB.temperature, 20, 32, 0.5, 1),
          pressure: generateNewValue(previousData.aquaponics.pondB.pressure, 980, 1040, 2, 0),
          turbidity: generateNewValue(previousData.aquaponics.pondB.turbidity, 0, 15, 0.5, 1),
          waterPump: previousData.aquaponics.pondB.waterPump,
          light: previousData.aquaponics.pondB.light
        }
      },
      hydroponics: {
        temperature: generateNewValue(previousData.hydroponics.temperature, 15, 32, 0.5, 1),
        phLevel: generateNewValue(previousData.hydroponics.phLevel, 5.0, 7.5, 0.1, 1),
        moistureContent: generateNewValue(previousData.hydroponics.moistureContent, 50, 100, 2, 0),
        lightIntensity: generateNewValue(previousData.hydroponics.lightIntensity, 300, 2500, 50, 0),
        waterPump: previousData.hydroponics.waterPump
      },
      poultry: {
        temperature: generateNewValue(previousData.poultry.temperature, 15, 40, 0.5, 1),
        movement: Math.random() < 0.2, // 20% chance of movement detection
        movementTimestamp: previousData.poultry.movement ? previousData.poultry.movementTimestamp : new Date().toISOString()
      }
    };
  }
  
  // Generate fresh data
  return {
    aquaponics: {
      pondA: {
        phLevel: randomInRange(6.0, 8.0, 1),
        dissolvedOxygen: randomInRange(5.0, 10.0, 1),
        temperature: randomInRange(22, 28, 1),
        pressure: randomInRange(990, 1010, 0),
        turbidity: randomInRange(2, 8, 1),
        waterPump: true,
        light: false
      },
      pondB: {
        phLevel: randomInRange(6.0, 8.0, 1),
        dissolvedOxygen: randomInRange(5.0, 10.0, 1),
        temperature: randomInRange(22, 28, 1),
        pressure: randomInRange(990, 1010, 0),
        turbidity: randomInRange(2, 8, 1),
        waterPump: true,
        light: true
      }
    },
    hydroponics: {
      temperature: randomInRange(20, 28, 1),
      phLevel: randomInRange(5.5, 6.5, 1),
      moistureContent: randomInRange(60, 85, 0),
      lightIntensity: randomInRange(800, 1800, 0),
      waterPump: false
    },
    poultry: {
      temperature: randomInRange(20, 30, 1),
      movement: false,
      movementTimestamp: new Date().toISOString()
    }
  };
};

// Generate historical data (for charts)
export const generateHistoricalData = (dataPoints = 12) => {
  const data = [];
  const baseTimestamp = new Date();
  
  for (let i = 0; i < dataPoints; i++) {
    // Calculate timestamp (going back in time)
    const timestamp = new Date(baseTimestamp);
    timestamp.setMinutes(timestamp.getMinutes() - (dataPoints - i) * 5);
    
    data.push({
      timestamp: timestamp.toISOString(),
      aquaponics: {
        pondA: {
          phLevel: randomInRange(6.0, 8.0, 1),
          dissolvedOxygen: randomInRange(5.0, 10.0, 1),
          temperature: randomInRange(22, 28, 1)
        },
        pondB: {
          phLevel: randomInRange(6.0, 8.0, 1),
          dissolvedOxygen: randomInRange(5.0, 10.0, 1),
          temperature: randomInRange(22, 28, 1)
        }
      },
      hydroponics: {
        temperature: randomInRange(20, 28, 1),
        phLevel: randomInRange(5.5, 6.5, 1),
        moistureContent: randomInRange(60, 85, 0),
        lightIntensity: randomInRange(800, 1800, 0)
      },
      poultry: {
        temperature: randomInRange(20, 30, 1)
      }
    });
  }
  
  return data;
};
