import React, { useEffect, useRef, useState } from 'react';
import Card from './Card';
import { Layers, ZoomIn, ZoomOut, Move, Info } from 'lucide-react';
import SatelliteMap from './SatelliteMap';

const FieldMap = ({ height = '400px', interactive = true, className = '' }) => {
  const mapContainerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedField, setSelectedField] = useState(null);
  const [showLegend, setShowLegend] = useState(true);

  const fields = [
    {
      id: 1,
      name: 'Champ Nord',
      status: 'healthy',
      area: '12.5 ha',
      crop: 'Blé',
      coordinates: { top: '20%', left: '15%' },
      shape: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
      color: 'bg-green-500'
    },
    {
      id: 2,
      name: 'Champ Est',
      status: 'warning',
      area: '8.2 ha',
      crop: 'Maïs',
      coordinates: { top: '45%', left: '35%' },
      shape: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
      color: 'bg-yellow-500'
    },
    {
      id: 3,
      name: 'Champ Ouest',
      status: 'critical',
      area: '5.7 ha',
      crop: 'Pommes de terre',
      coordinates: { top: '30%', left: '60%' },
      shape: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)',
      color: 'bg-red-500'
    },
    {
      id: 4,
      name: 'Champ Sud',
      status: 'healthy',
      area: '9.3 ha',
      crop: 'Orge',
      coordinates: { top: '65%', left: '25%' },
      shape: 'circle(50% at 50% 50%)',
      color: 'bg-green-500'
    }
  ];

  const handleZoom = (direction) => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.min(Math.max(newZoom, 0.5), 3);
    });
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const container = mapContainerRef.current;
    container.innerHTML = '';

    // Création de la carte de base
    const mapBase = document.createElement('div');
    mapBase.className = 'absolute inset-0 bg-blue-50 overflow-hidden';
    mapBase.style.backgroundImage = 'radial-gradient(circle, #a0c8f8 1px, transparent 1px)';
    mapBase.style.backgroundSize = '20px 20px';

    // Ajout des champs
    fields.forEach(field => {
      const fieldElement = document.createElement('div');
      fieldElement.className = `absolute ${field.color} rounded-lg opacity-80 cursor-pointer transition-all duration-300 hover:opacity-100 hover:shadow-md`;
      fieldElement.style.top = field.coordinates.top;
      fieldElement.style.left = field.coordinates.left;
      fieldElement.style.width = `${100 * zoomLevel}px`;
      fieldElement.style.height = `${80 * zoomLevel}px`;
      fieldElement.style.clipPath = field.shape;
      
      const fieldLabel = document.createElement('div');
      fieldLabel.className = 'absolute inset-0 flex items-center justify-center text-white font-medium text-xs pointer-events-none';
      fieldLabel.textContent = field.name;
      
      fieldElement.appendChild(fieldLabel);
      fieldElement.addEventListener('click', () => handleFieldClick(field));
      mapBase.appendChild(fieldElement);
    });

    // Ajout des éléments d'interface
    if (interactive) {
      // Légende
      if (showLegend) {
        const legend = document.createElement('div');
        legend.className = 'absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md z-10';
        legend.innerHTML = `
          <div class="flex items-center mb-2">
            <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span class="text-xs text-gray-700">Sain</span>
          </div>
          <div class="flex items-center mb-2">
            <div class="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span class="text-xs text-gray-700">À surveiller</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span class="text-xs text-gray-700">Critique</span>
          </div>
        `;
        mapBase.appendChild(legend);
      }

      // Contrôles de zoom
      const zoomControls = document.createElement('div');
      zoomControls.className = 'absolute bottom-4 right-4 bg-white rounded-lg shadow-md overflow-hidden z-10';
      zoomControls.innerHTML = `
        <button class="p-2 hover:bg-gray-100 transition-colors">
          <ZoomIn class="w-4 h-4 text-gray-700" />
        </button>
        <div class="border-t border-gray-200"></div>
        <button class="p-2 hover:bg-gray-100 transition-colors">
          <ZoomOut class="w-4 h-4 text-gray-700" />
        </button>
      `;
      zoomControls.querySelectorAll('button')[0].addEventListener('click', () => handleZoom('in'));
      zoomControls.querySelectorAll('button')[1].addEventListener('click', () => handleZoom('out'));
      mapBase.appendChild(zoomControls);

      // Contrôle de la légende
      const legendToggle = document.createElement('button');
      legendToggle.className = 'absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md z-10';
      legendToggle.innerHTML = `<Layers class="w-4 h-4 text-gray-700" />`;
      legendToggle.addEventListener('click', () => setShowLegend(!showLegend));
      mapBase.appendChild(legendToggle);
    }

    container.appendChild(mapBase);

    // Nettoyage
    return () => {
      container.innerHTML = '';
    };
  }, [zoomLevel, showLegend]);

  return (
    <Card 
      title={interactive ? 'Carte des champs' : undefined}
      subtitle={interactive ? 'Visualisation des parcelles agricoles' : undefined}
      className={className}
      headerAction={
        interactive && (
          <button className="text-gray-500 hover:text-gray-700">
            <Move className="w-5 h-5" />
          </button>
        )
      }
    >
     <SatelliteMap />
    </Card>
  );
};

export default FieldMap;