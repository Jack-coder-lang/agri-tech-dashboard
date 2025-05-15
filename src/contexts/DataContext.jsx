import React, { createContext, useState, useContext, useEffect } from 'react';
import { sensorData, soilData, cropData, weatherData } from '../data/mockData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sensors, setSensors] = useState([]);
  const [soilConditions, setSoilConditions] = useState({});
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setSensors(sensorData);
          setSoilConditions(soilData);
          setCrops(cropData);
          setWeather(weatherData);
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateSensorData = (newSensorData) => {
    setSensors(prev => [...prev, newSensorData]);
  };

  const updateSoilConditions = (newConditions) => {
    setSoilConditions(prev => ({ ...prev, ...newConditions }));
  };

  const value = {
    sensors,
    soilConditions,
    crops,
    weather,
    loading,
    error,
    updateSensorData,
    updateSoilConditions,
    recommendations: crops.map(crop => ({
      id: crop.id,
      type: 'crop',
      title: `Recommandation pour ${crop.name}`,
      description: `Vérifiez les conditions de croissance pour ${crop.name}.`,
      priority: crop.healthStatus === 'danger' ? 'high' : crop.healthStatus === 'warning' ? 'medium' : 'low',
      date: new Date().toISOString(),
      actions: ['Irrigation', 'Fertilisation', 'Inspection']
    })) 
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);