import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

const SensorNotification = () => {
  const { latestSensorUpdate } = useData();
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (latestSensorUpdate) {
      // Format the notification message based on sensor data
      const macAddress = latestSensorUpdate.macAddress;
      const batteryLevel = latestSensorUpdate.batteryLevel;
      const readingsCount = latestSensorUpdate.readings?.length || 0;
      
      // Create notification content
      setNotification({
        title: 'Nouvelles données capteur',
        message: `${readingsCount} nouvelle(s) mesure(s) reçue(s) du capteur ${macAddress.slice(-6)}`,
        type: batteryLevel < 20 ? 'warning' : 'info',
        details: {
          batteryLevel,
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          readingTypes: latestSensorUpdate.readings?.map(r => r.type).join(', ')
        }
      });
      
      // Show notification
      setVisible(true);
      
      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [latestSensorUpdate]);

  if (!visible || !notification) {
    return null;
  }

  const { title, message, type, details } = notification;
  
  const bgColor = type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50';
  const borderColor = type === 'warning' ? 'border-yellow-400' : 'border-blue-400';
  const textColor = type === 'warning' ? 'text-yellow-800' : 'text-blue-800';

  return (
    <div className={`fixed bottom-4 right-4 shadow-lg rounded-lg border-l-4 ${borderColor} ${bgColor} p-4 max-w-sm w-full z-50`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'warning' ? (
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 w-full">
          <div className="flex justify-between">
            <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
            <button 
              onClick={() => setVisible(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="mt-2">
            <p className={`text-sm ${textColor}`}>{message}</p>
            
            <div className="mt-2 text-xs text-gray-500">
              <p className="flex justify-between">
                <span>Batterie:</span> 
                <span className={details.batteryLevel < 20 ? 'text-red-500 font-bold' : ''}>
                  {details.batteryLevel}%
                </span>
              </p>
              <p className="flex justify-between">
                <span>Heure:</span> 
                <span>{details.timestamp}</span>
              </p>
              <p className="flex justify-between">
                <span>Types de mesures:</span> 
                <span>{details.readingTypes}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorNotification;