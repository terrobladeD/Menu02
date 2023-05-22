const WebSocket = require('ws');
var wss;

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const setupWebSocketServer = (server) => {
   wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    // // Send a welcome message to the connected client
    // ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

    // Listen for messages from the client
    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
    });

    // Listen for the socket to close
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
};

module.exports = {
  setupWebSocketServer,
  broadcastMessage,
};
