// src/utils/socket.js
import { io } from 'socket.io-client';

// Create a singleton instance of the socket
const socket = io('http://localhost:5000/', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket']
});

// Add event listeners for connection status
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket;