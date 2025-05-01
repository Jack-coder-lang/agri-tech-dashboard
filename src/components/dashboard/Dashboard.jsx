import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import OverviewCards from './OverviewCards';
import FieldMap from './FieldMap';
import SoilAnalysisChart from './SoilAnalysisChart';
import WeatherWidget from './WeatherWidget';
import RecommendationsList from './RecommendationsList';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard = () => {
  const { loading, error } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'soil', label: 'Sol & Eau' },
    { id: 'crops', label: 'Cultures' },
    { id: 'recommendations', label: 'Recommandations' }
  ];

  if (loading) {
    return <LoadingSpinner message="Chargement des données agricoles..." />;
  }

  if (error) {
    return (
      <div className="p-4 flex justify-center">
        <div className="alert-danger w-full max-w-3xl">
          <h3 className="font-bold">Erreur de chargement</h3>
          <p>{error}</p>
          <button className="mt-2 btn btn-primary">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
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
                } whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition-colors duration-200`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <OverviewCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Carte des parcelles</h2>
                  <FieldMap height="400px" />
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
                <SoilAnalysisChart />
              </div>
              
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recommandations IA</h2>
                <RecommendationsList limit={3} />
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
                  <SoilAnalysisChart metricType="ph" />
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-2">Humidité</h3>
                  <SoilAnalysisChart metricType="moisture" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-2">Température</h3>
                  <SoilAnalysisChart metricType="temperature" />
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-2">Nutriments</h3>
                  <SoilAnalysisChart metricType="nutrient" />
                </div>
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Métaux lourds</h2>
              <SoilAnalysisChart metricType="heavyMetals" />
            </div>
            
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Qualité de l'eau d'irrigation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">TDS</h3>
                  <p className="text-2xl font-semibold text-gray-900">325 ppm</p>
                  <span className="badge badge-success">Excellent</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">pH</h3>
                  <p className="text-2xl font-semibold text-gray-900">7.2</p>
                  <span className="badge badge-success">Excellent</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Turbidité</h3>
                  <p className="text-2xl font-semibold text-gray-900">15 NTU</p>
                  <span className="badge badge-warning">Acceptable</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Température</h3>
                  <p className="text-2xl font-semibold text-gray-900">18.5°C</p>
                  <span className="badge badge-success">Excellent</span>
                </div>
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Blé</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Champ #1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 ha</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/03/2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/07/2025</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-success">Bon</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">65%</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Maïs</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Champ #2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 ha</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/04/2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/08/2025</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-warning">À surveiller</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">45%</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pommes de terre</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Champ #3</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 ha</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/04/2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/09/2025</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-danger">Critique</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">35%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Prévisions de rendement</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Blé</span>
                      <span className="text-sm font-medium text-gray-700">5.2 t/ha</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Prévision initiale: 5.5 t/ha</span>
                      <span className="text-xs text-gray-500">95% de l'objectif</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Maïs</span>
                      <span className="text-sm font-medium text-gray-700">8.3 t/ha</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Prévision initiale: 9.0 t/ha</span>
                      <span className="text-xs text-gray-500">92% de l'objectif</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Pommes de terre</span>
                      <span className="text-sm font-medium text-gray-700">20.5 t/ha</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Prévision initiale: 25.0 t/ha</span>
                      <span className="text-xs text-gray-500">82% de l'objectif</span>
                    </div>
                  </div>
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
              <RecommendationsList />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;