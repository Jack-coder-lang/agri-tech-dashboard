import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import OverviewCards from './OverviewCards';
import FieldMap from './FieldMap';
import SoilAnalysisChart from './SoilAnalysisChart';
import WeatherWidget from './WeatherWidget';
import RecommendationsList from './RecommendationsList';
import LoadingSpinner from '../ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
// import ConnectionStatus from '../ui/ConnectionStatus';

const Dashboard = () => {
  const { loading, error, soilConditions } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [realTimeData, setRealTimeData] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
      setConnectionStatus('connected');
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealTimeData(prev => {
        // Garder les anciennes données si aucune nouvelle donnée n'est reçue
        if (!data || !data.readings) return prev;
        return { ...data, timestamp: new Date().toISOString() };
      });
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };
    
    ws.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('WebSocket disconnected');
    };
    
    return () => ws.close();
  }, []);

  // Fusion des données en temps réel avec les données du contexte
  const getMergedData = (fieldId = 'field-1') => {
    const fieldData = soilConditions[fieldId] || {};
    
    if (!realTimeData) return fieldData;
    
    const merged = { ...fieldData };
    
    // Mise à jour des valeurs en temps réel
    if (realTimeData.readings) {
      realTimeData.readings.forEach(reading => {
        merged[reading.type] = {
          ...merged[reading.type],
          current: reading.value,
          unit: reading.unit,
          timestamp: reading.timestamp
        };
      });
    }
    
    // Ajout du niveau de batterie
    if (realTimeData.batteryLevel) {
      merged.batteryLevel = realTimeData.batteryLevel;
    }
    
    return merged;
  };

  const mergedData = getMergedData();

  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { opacity: 0, y: -10 }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des données agricoles..." />;
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 flex justify-center"
      >
        <div className="alert-danger w-full max-w-3xl">
          <h3 className="font-bold">Erreur de chargement</h3>
          <p>{error}</p>
          <button 
            className="mt-2 btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </motion.div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'soil', label: 'Sol & Eau' },
    { id: 'crops', label: 'Cultures' },
    { id: 'recommendations', label: 'Recommandations' }
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec statut de connexion */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord agricole</h1>
        </div>
        
        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4 overflow-x-auto pb-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition-colors duration-200 relative`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets avec animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <OverviewCards realTimeData={realTimeData} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="card">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Carte des parcelles</h2>
                      <FieldMap 
  height="500px" 
  interactive={true}
  className="mb-6"
/>
                    </div>
                  </div>
                  
                  <div>
                    <div className="card h-full">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Météo</h2>
                      <WeatherWidget />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Analyse du sol</h2>
                    <SoilAnalysisChart metricType="all" realTimeData={realTimeData} />
                  </div>
                  
                  <div className="card">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Recommandations IA</h2>
                    <RecommendationsList limit={3} soilData={mergedData} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'soil' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Analyse détaillée du sol</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">pH du sol</h3>
                      <SoilAnalysisChart metricType="ph" realTimeData={realTimeData} />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Humidité</h3>
                      <SoilAnalysisChart metricType="moisture" realTimeData={realTimeData} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Température</h3>
                      <SoilAnalysisChart metricType="temperature" realTimeData={realTimeData} />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Nutriments</h3>
                      <SoilAnalysisChart metricType="nutrient" realTimeData={realTimeData} />
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Métaux lourds</h2>
                  <SoilAnalysisChart metricType="heavyMetals" realTimeData={realTimeData} />
                </div>
                
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Qualité de l'eau d'irrigation</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'TDS', value: mergedData.tds?.current || 325, unit: 'ppm', status: 'success' },
                      { name: 'pH', value: mergedData.ph?.current || 7.2, unit: '', status: 'success' },
                      { name: 'Turbidité', value: 15, unit: 'NTU', status: 'warning' },
                      { name: 'Température', value: mergedData.temperature?.current || 18.5, unit: '°C', status: 'success' }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-blue-50 p-4 rounded-lg"
                      >
                        <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {metric.value.toFixed(metric.name === 'pH' ? 1 : 0)}{metric.unit}
                        </p>
                        <span className={`badge badge-${metric.status}`}>
                          {metric.status === 'success' ? 'Excellent' : 'Acceptable'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'crops' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Cultures en cours</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Culture</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcelle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plantation</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Récolte prévue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Croissance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { crop: 'Blé', field: 'Champ #1', area: '10 ha', planting: '15/03/2025', harvest: '15/07/2025', status: 'success', growth: 65 },
                          { crop: 'Maïs', field: 'Champ #2', area: '15 ha', planting: '01/04/2025', harvest: '15/08/2025', status: 'warning', growth: 45 },
                          { crop: 'Pommes de terre', field: 'Champ #3', area: '5 ha', planting: '15/04/2025', harvest: '01/09/2025', status: 'danger', growth: 35 }
                        ].map((row, rowIndex) => (
                          <motion.tr
                            key={row.crop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: rowIndex * 0.1 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.crop}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.field}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.area}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.planting}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.harvest}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`badge badge-${row.status}`}>
                                {row.status === 'success' ? 'Bon' : row.status === 'warning' ? 'À surveiller' : 'Critique'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${row.growth}%` }}
                                  transition={{ duration: 1, delay: rowIndex * 0.2 }}
                                  className={`h-2.5 rounded-full ${
                                    row.status === 'success' ? 'bg-green-600' : 
                                    row.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{row.growth}%</span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Prévisions de rendement</h2>
                    <div className="space-y-4">
                      {[
                        { crop: 'Blé', yield: 5.2, target: 5.5, status: 'success' },
                        { crop: 'Maïs', yield: 8.3, target: 9.0, status: 'warning' },
                        { crop: 'Pommes de terre', yield: 20.5, target: 25.0, status: 'danger' }
                      ].map((item, index) => {
                        const percentage = Math.round((item.yield / item.target) * 100);
                        
                        return (
                          <motion.div
                            key={item.crop}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">{item.crop}</span>
                              <span className="text-sm font-medium text-gray-700">{item.yield} t/ha</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                className={`h-2.5 rounded-full ${
                                  item.status === 'success' ? 'bg-green-600' : 
                                  item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">Prévision initiale: {item.target} t/ha</span>
                              <span className="text-xs text-gray-500">{percentage}% de l'objectif</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="card">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Historique de croissance</h2>
                    <div className="h-64 bg-gray-100 rounded flex justify-center items-center">
                      <p className="text-gray-500">Graphique d'historique de croissance</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recommandations IA</h2>
                  <RecommendationsList soilData={mergedData} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Dashboard;