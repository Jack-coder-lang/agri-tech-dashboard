// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import FeatureList from '../components/FeatureList';
import Dashboard from '../components/Dashboard';
import SoilAnalysis from '../components/SoilAnalysis';
import Inventory from '../components/Inventory';
import Producers from '../components/Producers';
import Admin from '../components/Admin';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FeatureList />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/soil-analysis" element={<SoilAnalysis />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/producers" element={<Producers />} />
      <Route path="/admin" element={<Admin />} />
      {/* Ajoutez d'autres routes au besoin */}
    </Routes>
  );
}