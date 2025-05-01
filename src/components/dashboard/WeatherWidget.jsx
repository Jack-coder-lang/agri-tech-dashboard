import React from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudDrizzle, 
  Droplets,
  Wind,
  AlertTriangle
} from 'lucide-react';

const WeatherWidget = () => {
  const { weather } = useData();
  
  if (!weather) {
    return <div className="flex justify-center items-center h-48 bg-gray-50 rounded">
      <p className="text-gray-500">Aucune donnée météo disponible</p>
    </div>;
  }

  const getWeatherIcon = (conditions) => {
    switch (conditions.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'partly cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'showers':
        return <CloudDrizzle className="h-8 w-8 text-blue-400" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div>
      {/* Current weather */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-gray-500 text-sm mb-1">Aujourd'hui</div>
          <div className="flex items-center">
            <span className="text-3xl font-semibold">{weather.current.temperature}°C</span>
            <div className="ml-2 text-sm text-gray-600">
              <div>{weather.current.conditions}</div>
              <div>Humidité: {weather.current.humidity}%</div>
            </div>
          </div>
        </div>
        <div>
          {getWeatherIcon(weather.current.conditions)}
        </div>
      </div>
      
      {/* Forecast */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Prévisions à 5 jours</h3>
        <div className="grid grid-cols-5 gap-1 text-center">
          {weather.forecast.map((day, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              <div className="text-xs text-gray-500">
                {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
              </div>
              <div className="my-2">
                {getWeatherIcon(day.conditions)}
              </div>
              <div className="text-sm font-medium">{day.temperatureHigh}°</div>
              <div className="text-xs text-gray-500">{day.temperatureLow}°</div>
              <div className="flex justify-center mt-1">
                <Droplets className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-gray-500 ml-1">{day.precipitation}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Weather alerts */}
      {weather.alerts && weather.alerts.length > 0 && (
        <div className="mt-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Alerte météo</h4>
                <p className="text-xs text-yellow-700 mt-1">
                  {weather.alerts[0].message}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {new Date(weather.alerts[0].startDate).toLocaleDateString()} - 
                  {new Date(weather.alerts[0].endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Additional weather details */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="bg-gray-50 p-2 rounded">
          <div className="flex items-center">
            <Wind className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-700">Vent</span>
          </div>
          <div className="text-sm font-medium mt-1">
            {weather.current.windSpeed} km/h
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="flex items-center">
            <Droplets className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-700">Humidité</span>
          </div>
          <div className="text-sm font-medium mt-1">
            {weather.current.humidity}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;