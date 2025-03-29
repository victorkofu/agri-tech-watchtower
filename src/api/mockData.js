
// Mock data for demonstration purposes
export const generateMockData = () => {
  return {
    aquaponics: {
      pondA: {
        phLevel: parseFloat((Math.random() * (8.5 - 6.0) + 6.0).toFixed(2)),
        dissolvedOxygen: parseFloat((Math.random() * (12 - 5) + 5).toFixed(2)), // mg/L
        temperature: parseFloat((Math.random() * (30 - 22) + 22).toFixed(1)), // °C
        pressure: parseFloat((Math.random() * (1030 - 990) + 990).toFixed(1)), // hPa
        turbidity: parseFloat((Math.random() * (10 - 0) + 0).toFixed(1)), // NTU
        waterPump: Math.random() > 0.5,
        light: Math.random() > 0.5
      },
      pondB: {
        phLevel: parseFloat((Math.random() * (8.5 - 6.0) + 6.0).toFixed(2)),
        dissolvedOxygen: parseFloat((Math.random() * (12 - 5) + 5).toFixed(2)), // mg/L
        temperature: parseFloat((Math.random() * (30 - 22) + 22).toFixed(1)), // °C
        pressure: parseFloat((Math.random() * (1030 - 990) + 990).toFixed(1)), // hPa
        turbidity: parseFloat((Math.random() * (10 - 0) + 0).toFixed(1)), // NTU
        waterPump: Math.random() > 0.5,
        light: Math.random() > 0.5
      },
    },
    hydroponics: {
      lightIntensity: parseFloat((Math.random() * (2000 - 500) + 500).toFixed(0)), // lux
      temperature: parseFloat((Math.random() * (30 - 18) + 18).toFixed(1)), // °C
      phLevel: parseFloat((Math.random() * (7.5 - 5.5) + 5.5).toFixed(2)),
      moistureContent: parseFloat((Math.random() * (95 - 60) + 60).toFixed(1)), // %
      waterPump: Math.random() > 0.5
    },
    poultry: {
      temperature: parseFloat((Math.random() * (35 - 20) + 20).toFixed(1)), // °C
      movement: Math.random() > 0.7,
      movementTimestamp: new Date().toISOString(),
      movementImageUrl: 'https://example.com/poultry-image.jpg' // Placeholder
    }
  };
};

// Historical data for charts
export const generateHistoricalData = (hours = 24) => {
  const now = new Date();
  return Array.from({ length: hours }, (_, index) => {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - (hours - index - 1));
    
    return {
      timestamp: timestamp.toISOString(),
      aquaponics: {
        pondA: {
          phLevel: parseFloat((Math.random() * (8.5 - 6.0) + 6.0).toFixed(2)),
          temperature: parseFloat((Math.random() * (30 - 22) + 22).toFixed(1)),
          dissolvedOxygen: parseFloat((Math.random() * (12 - 5) + 5).toFixed(2))
        },
        pondB: {
          phLevel: parseFloat((Math.random() * (8.5 - 6.0) + 6.0).toFixed(2)),
          temperature: parseFloat((Math.random() * (30 - 22) + 22).toFixed(1)),
          dissolvedOxygen: parseFloat((Math.random() * (12 - 5) + 5).toFixed(2))
        }
      },
      hydroponics: {
        temperature: parseFloat((Math.random() * (30 - 18) + 18).toFixed(1)),
        moistureContent: parseFloat((Math.random() * (95 - 60) + 60).toFixed(1))
      },
      poultry: {
        temperature: parseFloat((Math.random() * (35 - 20) + 20).toFixed(1))
      }
    };
  });
};

// Alert thresholds
export const thresholds = {
  aquaponics: {
    phLevel: { min: 6.5, max: 8.0 },
    dissolvedOxygen: { min: 6.0, max: 11.0 },
    temperature: { min: 24.0, max: 28.0 },
    pressure: { min: 1000, max: 1020 },
    turbidity: { min: 0, max: 5 }
  },
  hydroponics: {
    phLevel: { min: 5.8, max: 7.0 },
    temperature: { min: 20.0, max: 28.0 },
    moistureContent: { min: 70, max: 90 },
    lightIntensity: { min: 800, max: 1800 }
  },
  poultry: {
    temperature: { min: 22.0, max: 32.0 }
  }
};

// Generate status based on thresholds
export const getStatus = (value, threshold) => {
  if (value < threshold.min) return 'low';
  if (value > threshold.max) return 'high';
  return 'normal';
};
