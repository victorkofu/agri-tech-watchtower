
let socket = null;

export const connectWebSocket = (url, onMessage) => {
  if (socket) {
    socket.close();
  }

  try {
    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (socket) {
          connectWebSocket(url, onMessage);
        }
      }, 5000);
    };

    return socket;
  } catch (error) {
    console.error('Failed to establish WebSocket connection:', error);
    return null;
  }
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const sendWebSocketMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
    return true;
  }
  return false;
};

// For demonstration, simulate WebSocket data
export const simulateWebSocketData = (callback) => {
  const intervalId = setInterval(() => {
    import('../api/mockData').then(({ generateMockData }) => {
      callback(generateMockData());
    });
  }, 3000);

  return () => clearInterval(intervalId);
};
