import { Layers } from 'lucide-react';
import AgricultureMap from './AgricultureMap';
import React, { useState } from 'react';

const FieldMap = ({ height }) => {
  const [activeLayer, setActiveLayer] = useState('vegetation');

  const fields = [
    { 
      id: 1, 
      name: 'Champ de blé', 
      status: 'healthy', 
      area: '10ha',
      coordinates: [48.8566, 2.3522]
    },
    { 
      id: 2, 
      name: 'Champ de maïs', 
      status: 'warning', 
      area: '15ha',
      coordinates: [48.8576, 2.3532]
    },
    { 
      id: 3, 
      name: 'Champ de pommes de terre', 
      status: 'danger', 
      area: '5ha',
      coordinates: [48.8586, 2.3542]
    }
  ];

  const layers = [
    { id: 'vegetation', name: 'Végétation', description: 'Indice de végétation (NDVI)' },
    { id: 'moisture', name: 'Humidité', description: 'Teneur en eau du sol' },
    { id: 'health', name: 'Santé', description: 'État de santé des cultures' },
    { id: 'yield', name: 'Rendement', description: 'Prévision de rendement' }
  ];

  return (
    <div className="relative h-[600px] rounded-lg overflow-hidden">
      <AgricultureMap 
        center={[48.8566, 2.3522]}
        zoom={13}
        fields={fields}
        activeLayer={activeLayer}
      />
      
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-64">
        <div className="flex items-center mb-3">
          <Layers className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Couches satellite</h3>
        </div>
        <div className="space-y-2">
          {layers.map(layer => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`w-full px-3 py-2 text-left rounded-md text-sm transition-colors ${
                activeLayer === layer.id 
                  ? 'bg-green-50 text-green-700 font-medium' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="font-medium">{layer.name}</div>
              <div className="text-xs text-gray-500">{layer.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldMap;