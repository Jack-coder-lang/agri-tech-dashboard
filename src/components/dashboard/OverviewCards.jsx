import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Thermometer, CloudRain, Plane as Plant, AlertTriangle, Sprout } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const OverviewCards = ({ realTimeData }) => {
  const { soilConditions, weather, sensors } = useData();
  
  // Fusion des données statiques et temps réel
  const mergedData = {
    moisture: realTimeData?.moisture || soilConditions['field-1']?.moisture,
    temperature: realTimeData?.temperature || soilConditions['field-1']?.temperature,
    batteryLevel: realTimeData?.batteryLevel,
    precipitation: weather.forecast?.[0]?.precipitation
  };

  // Calcul des statuts des capteurs
  const activeSensors = sensors.filter(s => s.status === 'active').length;
  const warningSensors = sensors.filter(s => s.status === 'warning').length;
  const errorSensors = sensors.filter(s => s.status === 'error').length;
  const totalSensors = sensors.length;

  // Fonction pour déterminer le statut en fonction des valeurs optimales
  const getStatus = (value, optimalRange) => {
    if (!value || !optimalRange) return 'normal';
    if (value >= optimalRange.min && value <= optimalRange.max) return 'normal';
    if (value < optimalRange.min * 0.9 || value > optimalRange.max * 1.1) return 'error';
    return 'warning';
  };

  const cards = [
    {
      id: 'moisture',
      title: 'Humidité moyenne du sol',
      value: `${mergedData.moisture?.current?.toFixed(1) || '--'}%`,
      icon: Droplets,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      status: getStatus(mergedData.moisture?.current, mergedData.moisture?.optimal),
      details: mergedData.moisture?.optimal 
        ? `Optimal: ${mergedData.moisture.optimal.min}-${mergedData.moisture.optimal.max}%` 
        : '--'
    },
    {
      id: 'temperature',
      title: 'Température du sol',
      value: `${mergedData.temperature?.current?.toFixed(1) || '--'}°C`,
      icon: Thermometer,
      color: 'text-red-500',
      bg: 'bg-red-100',
      status: getStatus(mergedData.temperature?.current, mergedData.temperature?.optimal),
      details: mergedData.temperature?.optimal 
        ? `Optimal: ${mergedData.temperature.optimal.min}-${mergedData.temperature.optimal.max}°C` 
        : '--'
    },
    {
      id: 'precipitation',
      title: 'Précipitations prévues',
      value: `${mergedData.precipitation || 0}%`,
      icon: CloudRain,
      color: 'text-indigo-500',
      bg: 'bg-indigo-100',
      status: mergedData.precipitation > 50 ? 'warning' : 'normal',
      details: 'Pour les prochaines 24h'
    },
    {
      id: 'crops',
      title: 'Cultures en cours',
      value: '3',
      icon: Plant,
      color: 'text-green-500',
      bg: 'bg-green-100',
      status: 'normal',
      details: '2 en bonne santé, 1 à risque'
    },
    {
      id: 'risk',
      title: 'Zones à risque',
      value: '15%',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-100',
      status: 'warning',
      details: 'de la surface totale'
    },
    {
      id: 'sensors',
      title: 'État des capteurs',
      value: `${activeSensors}/${totalSensors}`,
      icon: Sprout,
      color: 'text-purple-500',
      bg: 'bg-purple-100',
      status: errorSensors > 0 ? 'error' : warningSensors > 0 ? 'warning' : 'normal',
      details: `${errorSensors} en erreur, ${warningSensors} en alerte`
    }
  ];

  // Couleurs et textes pour les différents statuts
  const statusConfig = {
    normal: { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      label: 'Normal' 
    },
    warning: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      label: 'Attention' 
    },
    error: { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      label: 'Critique' 
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="card p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-start">
            <div className={`${card.bg} p-3 rounded-lg`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-semibold text-gray-900">
                  {card.value}
                </span>
                {card.status !== 'normal' && (
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[card.status].bg} ${statusConfig[card.status].text}`}>
                    {statusConfig[card.status].label}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{card.details}</p>
              
              {/* Barre de progression pour les indicateurs numériques */}
              {['moisture', 'temperature'].includes(card.id) && mergedData[card.id]?.current && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <motion.div
  initial={{ width: 0 }}
  animate={{
    width: `${Math.min(
      100,
      (mergedData[card.id].current / (mergedData[card.id].optimal?.max * 1.2)) * 100
    )}%`,
  }}
  transition={{ duration: 1, delay: 0.3 }}
  className={`h-2 rounded-full ${
    card.status === 'normal'
      ? 'bg-green-500'
      : card.status === 'warning'
      ? 'bg-yellow-500'
      : 'bg-red-500'
  }`}
/>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;