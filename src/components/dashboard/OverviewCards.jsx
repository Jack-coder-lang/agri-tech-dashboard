import React from 'react';
import { Droplets, Thermometer, CloudRain, Plane as Plant, AlertTriangle, Sprout } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const OverviewCards = () => {
  const { soilConditions, weather, sensors } = useData();
  
  // Calculate sensor status statistics
  const activeSensors = sensors.filter(s => s.status === 'active').length;
  const warningSensors = sensors.filter(s => s.status === 'warning').length;
  const errorSensors = sensors.filter(s => s.status === 'error').length;
  const totalSensors = sensors.length;
  
  const cards = [
    {
      title: 'Humidité moyenne du sol',
      value: `${soilConditions['field-1']?.moisture?.current || 0}%`,
      icon: Droplets,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      status: 'normal',
      details: 'Optimal: 30-45%'
    },
    {
      title: 'Température du sol',
      value: `${soilConditions['field-1']?.temperature?.current || 0}°C`,
      icon: Thermometer,
      color: 'text-red-500',
      bg: 'bg-red-100',
      status: 'normal',
      details: 'Optimal: 15-25°C'
    },
    {
      title: 'Précipitations prévues',
      value: `${weather.forecast?.[0]?.precipitation || 0}%`,
      icon: CloudRain,
      color: 'text-indigo-500',
      bg: 'bg-indigo-100',
      status: weather.forecast?.[0]?.precipitation > 50 ? 'warning' : 'normal',
      details: 'Pour les prochaines 24h'
    },
    {
      title: 'Cultures en cours',
      value: '3',
      icon: Plant,
      color: 'text-green-500',
      bg: 'bg-green-100',
      status: 'normal',
      details: '2 en bonne santé, 1 à risque'
    },
    {
      title: 'Zones à risque',
      value: '15%',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-100',
      status: 'warning',
      details: 'de la surface totale'
    },
    {
      title: 'État des capteurs',
      value: `${activeSensors}/${totalSensors}`,
      icon: Sprout,
      color: 'text-purple-500',
      bg: 'bg-purple-100',
      status: errorSensors > 0 ? 'error' : warningSensors > 0 ? 'warning' : 'normal',
      details: `${errorSensors} en erreur, ${warningSensors} en alerte`
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <div className="flex items-start">
            <div className={`${card.bg} p-3 rounded-lg`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <div className="mt-1 flex items-center">
                <span className="text-2xl font-semibold text-gray-900">{card.value}</span>
                {card.status === 'warning' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Attention
                  </span>
                )}
                {card.status === 'error' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Critique
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{card.details}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;