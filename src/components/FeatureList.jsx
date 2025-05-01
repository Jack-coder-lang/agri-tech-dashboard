import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FeatureManager() {
  const [features, setFeatures] = useState([
    { id: 1, name: 'Tableau de bord', path: '/dashboard', enabled: false },
    { id: 2, name: 'Carte des parcelles', path: '/field-map', enabled: false },
    { id: 3, name: 'Analyses sol & eau', path: '/soil-analysis', enabled: true },
    { id: 4, name: 'Cultures en cours', path: '/crops', enabled: false },
    { id: 5, name: 'Zones à risque', path: '/risk-zones', enabled: false },
    { id: 6, name: 'Recommandations IA', path: '/ai-recommendations', enabled: false },
    { id: 7, name: 'Stocks & Récoltes', path: '/inventory', enabled: true },
    { id: 8, name: 'Résultats économiques', path: '/economics', enabled: false },
    { id: 9, name: 'Documentation', path: '/docs', enabled: false },
    { id: 10, name: 'Formation', path: '/training', enabled: false },
    { id: 11, name: 'Gestion des producteurs', path: '/producers', enabled: true },
    { id: 12, name: 'Administration', path: '/admin', enabled: true },
  ]);

  const toggleFeature = (id) => {
    setFeatures(features.map(feature => 
      feature.id === id ? {...feature, enabled: !feature.enabled} : feature
    ));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des Fonctionnalités</h1>
      
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={feature.enabled}
              onChange={() => toggleFeature(feature.id)}
              className="h-5 w-5 mr-3"
            />
            
            <Link 
              to={feature.path} 
              className={`flex-1 ${feature.enabled ? 'text-blue-600' : 'text-gray-400'}`}
            >
              {feature.name}
            </Link>
            
            {feature.enabled && (
              <span className="ml-2 text-green-500">✓</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}