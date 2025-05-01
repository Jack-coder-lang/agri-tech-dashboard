import React, { createContext, useState, useContext, useEffect } from 'react';

// Sample data for demonstration
import { sensorData, soilData, cropData, weatherData, recommendationsData } from '../data/mockData';

const DataContext = createContext(); // 👉 Crée le contexte en premier

export const DataProvider = ({ children }) => {
  const [sensors, setSensors] = useState([]);
  const [soilConditions, setSoilConditions] = useState({});
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simule une récupération de données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setSensors(sensorData);
          setSoilConditions(soilData);
          setCrops(cropData);
          setWeather(weatherData);
          setRecommendations(recommendationsData);
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError('Échec de chargement des données. Veuillez réessayer.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Méthodes pour mise à jour
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
    recommendations,
    loading,
    error,
    updateSensorData,
    updateSoilConditions
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// 👉 Export du hook APRÈS la création du contexte
export const useData = () => useContext(DataContext);
