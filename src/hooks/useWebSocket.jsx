import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url) {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialisation de la connexion
    socketRef.current = new WebSocket(url);

    // Gestion des événements
    socketRef.current.onopen = () => {
      setIsConnected(true);
      console.log('Connecté au serveur WebSocket');
    };

    socketRef.current.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
      console.log('Déconnecté du serveur WebSocket');
    };

    // Nettoyage
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  // Fonction pour envoyer des données
  const sendData = (message) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { data, isConnected, sendData };
}