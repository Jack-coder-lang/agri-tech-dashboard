import React, { useEffect, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  LayersControl, 
  Marker, 
  Popup,
  useMap 
} from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Composant pour mettre à jour la position de la carte
const SetMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const SatelliteMap = ({ center, zoom, parcelles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [layers, setLayers] = useState({
    trueColor: null,
    ndvi: null,
    moisture: null
  });

  // Position par défaut (France)
  const defaultCenter = [46.603354, 1.888334]; 
  const defaultZoom = 6;

  useEffect(() => {
    const loadSentinelLayers = async () => {
      setIsLoading(true);
      try {
        const instanceId = process.env.REACT_APP_SENTINEL_HUB_INSTANCE_ID;
        
        if (!instanceId) {
          console.error('REACT_APP_SENTINEL_HUB_INSTANCE_ID n\'est pas défini');
          setIsLoading(false);
          return;
        }

        // Base URL pour Sentinel Hub WMS
        const baseUrl = `https://services.sentinel-hub.com/ogc/wms/${instanceId}`;
        
        // Construction des URLs pour différentes couches
        const trueColorUrl = `${baseUrl}?SERVICE=WMS&REQUEST=GetMap&LAYERS=TRUE-COLOR&MAXCC=20&TIME=2023-01-01/2023-12-31&TRANSPARENT=true&FORMAT=image/png&CRS=EPSG:3857&WIDTH=512&HEIGHT=512&BBOX={bbox}`;
        
        const ndviUrl = `${baseUrl}?SERVICE=WMS&REQUEST=GetMap&LAYERS=NDVI&MAXCC=20&TIME=2023-01-01/2023-12-31&TRANSPARENT=true&FORMAT=image/png&CRS=EPSG:3857&WIDTH=512&HEIGHT=512&BBOX={bbox}`;
        
        const moistureUrl = `${baseUrl}?SERVICE=WMS&REQUEST=GetMap&LAYERS=MOISTURE-INDEX&MAXCC=20&TIME=2023-01-01/2023-12-31&TRANSPARENT=true&FORMAT=image/png&CRS=EPSG:3857&WIDTH=512&HEIGHT=512&BBOX={bbox}`;

        setLayers({
          trueColor: trueColorUrl,
          ndvi: ndviUrl,
          moisture: moistureUrl
        });
      } catch (error) {
        console.error('Erreur lors du chargement des couches Sentinel Hub:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSentinelLayers();
  }, []);

  // Icône personnalisée pour les marqueurs de parcelles
  const parcelleIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-green-600 font-medium">Chargement des données satellite...</p>
          </div>
        </div>
      )}

      <MapContainer
        center={center || defaultCenter}
        zoom={zoom || defaultZoom}
        style={{ height: '100%', width: '100%', minHeight: '600px' }}
        className="z-0"
      >
        <SetMapView center={center || defaultCenter} zoom={zoom || defaultZoom} />
        
        <LayersControl position="topright">
          {/* Couche de base - OpenStreetMap */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          
          {/* Couche de base - Satellite Google */}
          <LayersControl.BaseLayer name="Google Satellite">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution="&copy; Google"
            />
          </LayersControl.BaseLayer>

          {/* Couches de superposition Sentinel Hub */}
          {layers.trueColor && (
            <LayersControl.Overlay name="Couleurs réelles (Sentinel)">
              <TileLayer 
                url={layers.trueColor}
                attribution="&copy; Sentinel Hub"
              />
            </LayersControl.Overlay>
          )}
          
          {layers.ndvi && (
            <LayersControl.Overlay name="NDVI - Santé végétale">
              <TileLayer 
                url={layers.ndvi}
                attribution="&copy; Sentinel Hub"
              />
            </LayersControl.Overlay>
          )}
          
          {layers.moisture && (
            <LayersControl.Overlay name="Indice d'humidité">
              <TileLayer 
                url={layers.moisture}
                attribution="&copy; Sentinel Hub"
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>

        {/* Marqueurs pour les parcelles */}
        {parcelles.map((parcelle, index) => (
          <Marker 
            key={parcelle.id || index} 
            position={[parcelle.lat, parcelle.lng]} 
            icon={parcelleIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{parcelle.nom}</h3>
                <p>Surface: {parcelle.surface} ha</p>
                <p>Culture: {parcelle.culture}</p>
                {parcelle.description && <p>{parcelle.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default SatelliteMap;