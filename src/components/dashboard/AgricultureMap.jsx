import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import ee from '@google/earthengine';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const AgricultureMap = ({ center, zoom, fields, activeLayer }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eeInitialized, setEeInitialized] = useState(false);

  useEffect(() => {
    const initializeEarthEngine = async () => {
      try {
        console.log("Tentative d'initialisation d'Earth Engine...");
        ee.data.authenticateViaApiKey("AIzaSyBWQOzZuliTOz5DzpCXc_I0pYNQG6t0D5w"); // Utilisation de la clé API via une variable d'environnement
        ee.initialize();
        console.log("Earth Engine initialisé avec succès.");
        setEeInitialized(true);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de l'initialisation d'Earth Engine:", err);
        setError("Échec de l'initialisation d'Earth Engine. Vérifiez votre clé API.");
        setLoading(false);
      }
    };

    initializeEarthEngine();
  }, []);

  const getLayerStyle = (status) => {
    switch (status) {
      case 'healthy':
        return { color: '#22c55e', fillColor: '#22c55e' };
      case 'warning':
        return { color: '#eab308', fillColor: '#eab308' };
      case 'danger':
        return { color: '#ef4444', fillColor: '#ef4444' };
      default:
        return { color: '#22c55e', fillColor: '#22c55e' };
    }
  };

  const renderSatelliteLayer = () => {
    if (!eeInitialized || activeLayer !== 'vegetation') return null;

    try {
      const ndviParams = { min: -1, max: 1, palette: ['blue', 'white', 'green'] };
      const landsat = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
        .filterDate('2020-01-01', '2020-12-31')
        .median();

      const nir = landsat.select('B5');
      const red = landsat.select('B4');
      const ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI');

      return (
        <TileLayer
          url={`https://earthengine.googleapis.com/map/{z}/{x}/{y}?token=${ndvi.getMap(ndviParams).token}`}
          attribution="Google Earth Engine"
        />
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout de la couche NDVI:", err);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={false}
    >
      {/* Base map layer */}
      <TileLayer
        url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Satellite layer */}
      {renderSatelliteLayer()}

      {/* Field markers and areas */}
      {fields.map((field) => (
        <React.Fragment key={field.id}>
          <Circle
            center={field.coordinates}
            radius={200}
            pathOptions={{
              ...getLayerStyle(field.status),
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
          <Marker position={field.coordinates}>
            <Popup>
              <div className="p-2">
                <h3 className="font-medium text-sm">{field.name}</h3>
                <p className="text-xs text-gray-600">Surface: {field.area}</p>
                <p className="text-xs text-gray-600 mt-1">
                  État: {`field.status === 'healthy' ? 'Sain' : 
                        field.status === 'warning' ? 'À surveiller' : 'Critique'`}
                </p>
              </div>
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default AgricultureMap;