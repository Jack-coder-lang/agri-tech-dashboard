import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

const SoilAnalysisChart = ({ metricType }) => {
  const [realTimeData, setRealTimeData] = useState(null);
  const { soilConditions } = useData();
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealTimeData(data);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
    
    return () => {
      ws.close();
    };
  }, []);
  console.log('Received data:', realTimeData);

  // Merge real-time data with context data
  const getFieldData = () => {
    const fieldData = soilConditions['field-1'] || {};
    
    if (!realTimeData || !realTimeData.readings) return fieldData;
    
    const readings = {};
    realTimeData.readings.forEach(reading => {
      if (reading && reading.type) {
        readings[reading.type] = {
          current: reading.value,
          unit: reading.unit,
          timestamp: reading.timestamp
        };
        
        if (fieldData[reading.type]?.optimal) {
          readings[reading.type].optimal = fieldData[reading.type].optimal;
        }
      }
    });
    
    return {
      ...fieldData,
      ...readings,
      batteryLevel: realTimeData.batteryLevel,
      lastUpdated: realTimeData.readings[0]?.timestamp
    };
  };

  const fieldData = getFieldData();
  
  // Animation variants
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const barVariants = {
    initial: { width: 0 },
    animate: { 
      width: "100%",
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  const valueVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    }
  };

  if (!fieldData) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-48 bg-gray-50 rounded"
      >
        <p className="text-gray-500">Aucune donnée disponible</p>
      </motion.div>
    );
  }

  const renderBatteryIndicator = () => {
    if (!fieldData.batteryLevel) return null;
    
    const batteryPercentage = Math.round(fieldData.batteryLevel);
    let batteryColor = 'text-green-500';
    
    if (batteryPercentage < 20) {
      batteryColor = 'text-red-500';
    } else if (batteryPercentage < 50) {
      batteryColor = 'text-yellow-500';
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-end text-xs text-gray-500 mb-2"
      >
        <span className="mr-1">Batterie:</span>
        <span className={`font-medium ${batteryColor}`}>{batteryPercentage}%</span>
        <div className="ml-1 inline-block relative w-4 h-2 border border-gray-400 rounded-sm">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${batteryPercentage}%` }}
            transition={{ duration: 1, delay: 0.4 }}
            className={`absolute top-0 left-0 bottom-0 ${batteryColor.replace('text', 'bg')}`}
          ></motion.div>
        </div>
      </motion.div>
    );
  };

  const renderTimestamp = () => {
    if (!fieldData.lastUpdated) return null;
    
    const date = new Date(fieldData.lastUpdated);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-right text-xs text-gray-400 mb-2"
      >
        Mis à jour: {timeString}
      </motion.div>
    );
  };

  const renderMetricChart = () => {
    switch (metricType) {
      case 'ph':
        return renderPHChart();
      case 'moisture':
        return renderMoistureChart();
      case 'temperature':
        return renderTemperatureChart();
      case 'heavyMetals':
        return renderHeavyMetalsChart();
      case 'nutrients':
        return renderNutrientChart();
      case 'tds':
        return renderTDSChart();
      case 'all':
        return renderAllMetrics();
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={chartVariants}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">pH du sol</h3>
              {renderPHChart()}
            </motion.div>
            <motion.div variants={chartVariants}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Humidité</h3>
              {renderMoistureChart()}
            </motion.div>
          </div>
        );
    }
  };
  
  const renderPHChart = () => {
    const data = fieldData.ph;
    if (!data?.current) return renderNoData();
    
    const current = data.current;
    const optimal = data.optimal || { min: 6, max: 7.5 };
    const percentage = ((current - 0) / (14 - 0)) * 100;
    
    const getColorClass = () => {
      if (current >= optimal.min && current <= optimal.max) {
        return 'bg-green-500';
      } else if (current < optimal.min) {
        return 'bg-yellow-500';
      } else {
        return 'bg-red-500';
      }
    };
    
    return (
      <motion.div variants={chartVariants}>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0</span>
          <span>Acide</span>
          <span>Neutre</span>
          <span>Basique</span>
          <span>14</span>
        </div>
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ 
              width: `${((optimal.max - optimal.min) / 14) * 100}%`,
              left: `${(optimal.min / 14) * 100}%`
            }}
            transition={{ duration: 0.8 }}
            className="absolute h-full bg-green-100" 
          ></motion.div>
          
          <motion.div 
            initial={{ left: 0 }}
            animate={{ left: `calc(${percentage}% - 8px)` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`absolute h-full w-4 ${getColorClass()}`}
          ></motion.div>
          
          <div className="absolute inset-0 flex justify-between px-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-px h-full bg-gray-400 opacity-30"></div>
            ))}
          </div>
        </div>
        <motion.div 
          variants={valueVariants}
          className="mt-2 text-center"
        >
          <span className="text-lg font-medium">{current.toFixed(2)}</span>
          <span className="text-sm text-gray-500 ml-2">pH</span>
          <div className="text-xs text-gray-500 mt-1">
            Optimal: {optimal.min} - {optimal.max}
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  const renderMoistureChart = () => {
    const data = fieldData.moisture;
    if (!data?.current) return renderNoData();
    
    const current = data.current;
    const optimal = data.optimal || { min: 30, max: 60 };
    const percentage = current;
    
    const getColorClass = () => {
      if (current >= optimal.min && current <= optimal.max) {
        return 'bg-green-500';
      } else if (current < optimal.min) {
        return 'bg-yellow-500';
      } else {
        return 'bg-blue-500';
      }
    };
    
    return (
      <motion.div variants={chartVariants}>
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0, left: 0 }}
            animate={{ 
              width: `${optimal.max - optimal.min}`,
              left: `${optimal.min}`
            }}
            transition={{ duration: 0.8 }}
            className="absolute h-full bg-green-100" 
          ></motion.div>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage/100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`absolute h-full ${getColorClass()}`}
          ></motion.div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Humide (0)</span>
          <span>Sec (2000)</span>

        </div>
        <motion.div 
          variants={valueVariants}
          className="mt-2 text-center"
        >
          <span className="text-lg font-medium">{current.toFixed(2)}</span>
          <div className="text-xs text-gray-500 mt-1">
            Optimal: {700} - {1200}
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  const renderTemperatureChart = () => {
    const data = fieldData.temperature;
    if (!data?.current) return renderNoData();
    
    const current = data.current;
    const optimal = data.optimal || { min: 18, max: 28 };
    const percentage = (current / 40) * 100;
    
    const getColorClass = () => {
      if (current >= optimal.min && current <= optimal.max) {
        return 'bg-green-500';
      } else if (current < optimal.min) {
        return 'bg-blue-500';
      } else {
        return 'bg-red-500';
      }
    };
    
    return (
      <motion.div variants={chartVariants}>
        <div className="relative h-8 bg-gradient-to-r from-blue-300 via-green-300 to-red-300 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0, left: 0 }}
            animate={{ 
              width: `${((optimal.max - optimal.min) / 40) * 100}`,
              left: `${(optimal.min / 40) * 100}%`
            }}
            transition={{ duration: 0.8 }}
            className="absolute h-full bg-green-200 bg-opacity-60" 
          ></motion.div>
          
          <motion.div 
            initial={{ left: 0 }}
            animate={{ left: `calc(${percentage}% - 1px)` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-0 bottom-0 w-2 bg-gray-800" 
          ></motion.div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0°C</span>
          <span>10°C</span>
          <span>20°C</span>
          <span>30°C</span>
          <span>40°C</span>
        </div>
        <motion.div 
          variants={valueVariants}
          className="mt-2 text-center"
        >
          <span className="text-lg font-medium">{current.toFixed(2)}°C</span>
          <div className="text-xs text-gray-500 mt-1">
            Optimal: {optimal.min}°C - {optimal.max}°C
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  const renderHeavyMetalsChart = () => {
    const metals = [
      { key: 'lead', name: 'Plomb', threshold: 0.5, unit: 'mg/L' },
      { key: 'mercury', name: 'Mercure', threshold: 0.1, unit: 'mg/L' },
      { key: 'arsenic', name: 'Arsenic', threshold: 0.4, unit: 'mg/L' }
    ];
    
    return (
      <motion.div variants={chartVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metals.map((metal, index) => {
            const value = fieldData[metal.key]?.current;
            if (value === undefined) return null;
            
            const percentage = (value / metal.threshold) * 100;
            const isExceeded = value > metal.threshold;
            
            return (
              <motion.div
                key={metal.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{metal.name}</span>
                    <span className="ml-1 text-xs text-gray-500">({metal.unit})</span>
                  </div>
                  <span className={`text-xs font-medium ${isExceeded ? 'text-red-500' : 'text-green-500'}`}>
                    {isExceeded ? 'Seuil dépassé' : 'Normal'}
                  </span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    className={`absolute h-full ${isExceeded ? 'bg-red-500' : 'bg-green-500'}`}
                  ></motion.div>
                  
                  <div className="absolute top-0 bottom-0 w-px bg-gray-800" style={{ left: '100%' }}></div>
                </div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="mt-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{value.toFixed(4)}</span>
                    <span className="text-xs text-gray-500">Seuil: {metal.threshold}</span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100"
        >
          <h4 className="text-sm font-medium text-yellow-800">Information</h4>
          <p className="text-xs text-yellow-700 mt-1">
            Les niveaux de métaux lourds sont mesurés en milligrammes par litre (mg/L). 
            Les seuils affichés sont basés sur les recommandations de l'OMS pour les sols agricoles.
          </p>
        </motion.div>
      </motion.div>
    );
  };
  
  const renderNutrientChart = () => {
    const nutrients = [
      { key: 'nitrogen', name: 'Azote (N)', color: 'bg-blue-500', unit: 'mg/L' },
      { key: 'phosphorus', name: 'Phosphore (P)', color: 'bg-yellow-500', unit: 'mg/L' },
      { key: 'potassium', name: 'Potassium (K)', color: 'bg-purple-500', unit: 'mg/L' }
    ];
    
    return (
      <motion.div variants={chartVariants} className="space-y-4">
        {nutrients.map((nutrient, index) => {
          const value = fieldData[nutrient.key]?.current;
          if (value === undefined) return null;
          
          const optimal = fieldData[nutrient.key]?.optimal || { min: 2, max: 5 };
          const percentage = (value / optimal.max) * 100;
          
          const getStatus = () => {
            if (value >= optimal.min && value <= optimal.max) {
              return { label: 'Optimal', color: 'text-green-500' };
            } else if (value < optimal.min) {
              return { label: 'Déficient', color: 'text-red-500' };
            } else {
              return { label: 'Excès', color: 'text-yellow-500' };
            }
          };
          
          const status = getStatus();
          
          return (
            <motion.div
              key={nutrient.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{nutrient.name}</span>
                <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
              </div>
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0, left: 0 }}
                  animate={{ 
                    width: `${((optimal.max - optimal.min) / optimal.max) * 100}%`,
                    left: `${(optimal.min / optimal.max) * 100}%`
                  }}
                  transition={{ duration: 0.8 }}
                  className="absolute h-full bg-green-100" 
                ></motion.div>
                
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                  className={`absolute h-full ${nutrient.color}`}
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>Niveau ({nutrient.unit})</span>
                <span>{optimal.max}</span>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="text-center text-xs text-gray-500 mt-1"
              >
                Valeur actuelle: <span className="font-medium">{value.toFixed(2)} {nutrient.unit}</span> • 
                Optimal: <span className="font-medium">{optimal.min}-{optimal.max} {nutrient.unit}</span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };
  
  const renderTDSChart = () => {
    const data = fieldData.tds;
    if (!data?.current) return renderNoData();
    
    const current = data.current;
    const optimal = data.optimal || { min: 200, max: 500 };
    const percentage = (current / 1000) * 100;
    
    const getColorClass = () => {
      if (current >= optimal.min && current <= optimal.max) {
        return 'bg-green-500';
      } else if (current < optimal.min) {
        return 'bg-blue-500';
      } else {
        return 'bg-red-500';
      }
    };
    
    return (
      <motion.div variants={chartVariants}>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Solides dissous totaux (TDS)</h3>
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0, left: 0 }}
            animate={{ 
              width: `${((optimal.max - optimal.min) / 1000) * 100}%`,
              left: `${(optimal.min / 1000) * 100}%`
            }}
            transition={{ duration: 0.8 }}
            className="absolute h-full bg-green-100" 
          ></motion.div>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`absolute h-full ${getColorClass()}`}
          ></motion.div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 ppm</span>
          <span>500 ppm</span>
          <span>1000 ppm</span>
        </div>
        <motion.div 
          variants={valueVariants}
          className="mt-2 text-center"
        >
          <span className="text-lg font-medium">{current.toFixed(2)} ppm</span>
          <div className="text-xs text-gray-500 mt-1">
            Optimal: {optimal.min} - {optimal.max} ppm
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-xs text-gray-500"
        >
          <p>Le TDS mesure la concentration totale de substances dissoutes dans l'eau.</p>
          <p className="mt-1">Niveaux recommandés pour l'agriculture: 200-500 ppm</p>
        </motion.div>
      </motion.div>
    );
  };
  
  const renderAllMetrics = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">pH du sol</h3>
            {renderPHChart()}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Humidité</h3>
            {renderMoistureChart()}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">Température</h3>
          {renderTemperatureChart()}
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">Nutriments</h3>
          {renderNutrientChart()}
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">Métaux lourds</h3>
          {renderHeavyMetalsChart()}
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">TDS</h3>
          {renderTDSChart()}
        </motion.div>
      </motion.div>
    );
  };
  
  const renderNoData = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-32 bg-gray-50 rounded"
      >
        <p className="text-gray-500">Donnée non disponible</p>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-white rounded-lg shadow"
    >
      {renderBatteryIndicator()}
      {renderTimestamp()}
      
      <AnimatePresence mode="wait">
        {renderMetricChart()}
      </AnimatePresence>
    </motion.div>
  );
};

export default SoilAnalysisChart;