import React from 'react';
import { useData } from '../../contexts/DataContext';

const SoilAnalysisChart = ({ metricType }) => {
  const { soilConditions } = useData();
  const fieldData = soilConditions['field-1'];
  
  if (!fieldData) {
    return <div className="flex justify-center items-center h-48 bg-gray-50 rounded">
      <p className="text-gray-500">Aucune donnée disponible</p>
    </div>;
  }
  
  // In a real application, we would use a charting library like Chart.js or Recharts
  // For this demo, we'll create simplified visualizations
  
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
      case 'nutrient':
        return renderNutrientChart();
      default:
        // Default visualization shows multiple metrics
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">pH du sol</h3>
              {renderPHChart()}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Humidité</h3>
              {renderMoistureChart()}
            </div>
          </div>
        );
    }
  };
  
  const renderPHChart = () => {
    const data = fieldData.ph;
    const { current, optimal } = data;
    const percentage = ((current - 0) / (14 - 0)) * 100; // pH scale is 0-14
    
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
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0</span>
          <span>Acide</span>
          <span>Neutre</span>
          <span>Basique</span>
          <span>14</span>
        </div>
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          {/* Optimal zone */}
          <div 
            className="absolute h-full bg-green-100" 
            style={{ 
              left: `${(optimal.min / 14) * 100}%`, 
              width: `${((optimal.max - optimal.min) / 14) * 100}%` 
            }}
          ></div>
          
          {/* Current value indicator */}
          <div 
            className={`absolute h-full w-4 ${getColorClass()}`} 
            style={{ left: `calc(${percentage}% - 8px)` }}
          ></div>
          
          {/* pH scale markers */}
          <div className="absolute inset-0 flex justify-between px-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-px h-full bg-gray-400 opacity-30"></div>
            ))}
          </div>
        </div>
        <div className="mt-2 text-center">
          <span className="text-lg font-medium">{current}</span>
          <span className="text-sm text-gray-500 ml-2">pH</span>
          <div className="text-xs text-gray-500 mt-1">
            Optimal: {optimal.min} - {optimal.max}
          </div>
        </div>
      </div>
    );
  };
  
  const renderMoistureChart = () => {
    const data = fieldData.moisture;
    const { current, optimal } = data;
    const percentage = (current / 100) * 100; // Moisture is 0-100%
    
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
      <div>
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          {/* Optimal zone */}
          <div 
            className="absolute h-full bg-green-100" 
            style={{ 
              left: `${optimal.min}%`, 
              width: `${optimal.max - optimal.min}%` 
            }}
          ></div>
          
          {/* Current value indicator */}
          <div 
            className={`absolute h-full ${getColorClass()}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Sec (0%)</span>
          <span>Humide (100%)</span>
        </div>
        <div className="mt-2 text-center">
          <span className="text-lg font-medium">{current}%</span>
          <div className="text-xs text-gray-500 mt-1">
            Optimal: {optimal.min}% - {optimal.max}%
          </div>
        </div>
      </div>
    );
  };
  
  const renderTemperatureChart = () => {
    const data = fieldData.temperature;
    const { current, optimal } = data;
    // Temperature scale from 0 to 40°C
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
      <div>
        <div className="relative h-8 bg-gradient-to-r from-blue-300 via-green-300 to-red-300 rounded-full overflow-hidden">
          {/* Optimal zone marker */}
          <div 
            className="absolute h-full bg-green-200 bg-opacity-60" 
            style={{ 
              left: `${(optimal.min / 40) * 100}%`, 
              width: `${((optimal.max - optimal.min) / 40) * 100}%` 
            }}
          ></div>
          
          {/* Current value indicator */}
          <div 
            className="absolute top-0 bottom-0 w-2 bg-gray-800" 
            style={{ left: `calc(${percentage}% - 1px)` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0°C</span>
          <span>10°C</span>
          <span>20°C</span>
          <span>30°C</span>
          <span>40°C</span>
        </div>
        <div className="mt-2 text-center">
          <span className="text-lg font-medium">{current}°C</span>
          <div className="text-xs text-gray-500 mt-1">
            Optimal: {optimal.min}°C - {optimal.max}°C
          </div>
        </div>
      </div>
    );
  };
  
  const renderHeavyMetalsChart = () => {
    const data = fieldData.heavyMetals.current;
    
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((item) => {
            const percentage = (item.value / item.threshold) * 100;
            const isExceeded = item.value > item.threshold;
            
            return (
              <div key={item.metal} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{item.metal}</span>
                    <span className="ml-1 text-xs text-gray-500">({item.unit})</span>
                  </div>
                  <span className={`text-xs font-medium ${isExceeded ? 'text-red-500' : 'text-green-500'}`}>
                    {isExceeded ? 'Seuil dépassé' : 'Normal'}
                  </span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`absolute h-full ${isExceeded ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                  
                  {/* Threshold marker */}
                  <div className="absolute top-0 bottom-0 w-px bg-gray-800" style={{ left: '100%' }}></div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{item.value}</span>
                    <span className="text-xs text-gray-500">Seuil: {item.threshold}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
          <h4 className="text-sm font-medium text-yellow-800">Information</h4>
          <p className="text-xs text-yellow-700 mt-1">
            Les niveaux de métaux lourds sont mesurés en parties par million (ppm). 
            Les seuils affichés sont basés sur les recommandations de l'OMS pour les sols agricoles.
          </p>
        </div>
      </div>
    );
  };
  
  const renderNutrientChart = () => {
    const data = fieldData.nutrient.current;
    const optimal = fieldData.nutrient.optimal;
    
    const nutrients = [
      { key: 'nitrogen', name: 'Azote (N)', color: 'bg-blue-500' },
      { key: 'phosphorus', name: 'Phosphore (P)', color: 'bg-yellow-500' },
      { key: 'potassium', name: 'Potassium (K)', color: 'bg-purple-500' }
    ];
    
    return (
      <div className="space-y-4">
        {nutrients.map((nutrient) => {
          const value = data[nutrient.key];
          const min = optimal[nutrient.key].min;
          const max = optimal[nutrient.key].max;
          const percentage = (value / max) * 100;
          
          const getStatus = () => {
            if (value >= min && value <= max) {
              return { label: 'Optimal', color: 'text-green-500' };
            } else if (value < min) {
              return { label: 'Déficient', color: 'text-red-500' };
            } else {
              return { label: 'Excès', color: 'text-yellow-500' };
            }
          };
          
          const status = getStatus();
          
          return (
            <div key={nutrient.key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{nutrient.name}</span>
                <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
              </div>
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                {/* Optimal zone */}
                <div 
                  className="absolute h-full bg-green-100" 
                  style={{ 
                    left: `${(min / max) * 100}%`, 
                    width: `${((max - min) / max) * 100}%` 
                  }}
                ></div>
                
                {/* Current value */}
                <div 
                  className={`absolute h-full ${nutrient.color}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>Niveau (ppm)</span>
                <span>{max}</span>
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">
                Valeur actuelle: <span className="font-medium">{value} ppm</span> • 
                Optimal: <span className="font-medium">{min}-{max} ppm</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="p-1">
      {renderMetricChart()}
    </div>
  );
};

export default SoilAnalysisChart;