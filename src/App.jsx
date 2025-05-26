import React, { useState } from 'react';
import { 
  Sprout, 
  Map, 
  TestTube2, 
  Warehouse, 
  Users, 
  Calendar, 
  AlertTriangle, 
  Bot, 
  LineChart, 
  BookOpen, 
  GraduationCap, 
  Settings 
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DataProvider } from './contexts/DataContext';

// Layout
import Dashboard from './components/dashboard/Dashboard';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Admin from "./components/dashboard/Admin";

// Pages
import FieldMap from './components/dashboard/FieldMap';
import SoilAnalysisChart from "./components/dashboard/SoilAnalysisChart";
import RecommendationsList from './components/dashboard/RecommendationsList';
import WeatherWidget from './components/dashboard/WeatherWidget';
import OverviewCards from './components/dashboard/OverviewCards';
import Crops from './components/dashboard/Crops';
import RiskZones from './components/dashboard/RiskZones';
import Inventory from './components/dashboard/Inventory';
import Economics from './components/dashboard/Economics';
import Docs from './components/dashboard/Docs';
import Training from './components/dashboard/Training';
import Producers from './components/dashboard/Producers';
import SatelliteMap from './components/dashboard/SatelliteMap';

import './index.css';
import SensorNotification from './components/dashboard/SensorNotification';


const RobotIcon = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="4" width="10" height="8" rx="2" fill="currentColor" />
    <circle cx="10" cy="7" r="1" fill="white" />
    <circle cx="14" cy="7" r="1" fill="white" />
    <line x1="12" y1="4" x2="12" y2="2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <circle cx="12" cy="2" r="0.5" fill="currentColor" />
    <rect x="8" y="12" width="8" height="6" rx="1" fill="currentColor" />
    <rect x="5" y="13" width="3" height="1" rx="0.5" fill="currentColor" />
    <rect x="16" y="13" width="3" height="1" rx="0.5" fill="currentColor" />
    <rect x="9" y="18" width="2" height="3" rx="0.5" fill="currentColor" />
    <rect x="13" y="18" width="2" height="3" rx="0.5" fill="currentColor" />
    <rect x="10.5" y="9" width="3" height="1" rx="0.5" fill="white" />
  </svg>
)
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true); 
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <DataProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              {!isAuthenticated ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                      <Sprout className="mx-auto h-12 w-12 text-[var(--color-primary)]" />
                      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Tableau de bord AGRI-TECH
                      </h2>
                      <p className="mt-2 text-center text-sm text-gray-600">
                        Pilotage agricole intelligent
                      </p>
                    </div>
                    <Login onLogin={handleLogin} />
                  </div>
                </div>
              ) : (
                <div className="flex h-screen overflow-hidden">
                  <Sidebar open={sidebarOpen} />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <Header toggleSidebar={toggleSidebar} />
                    
                    <Routes>
                      {/* Tableau de bord principal */}
                      <Route path="/" element={
                        <Dashboard>
                          <OverviewCards />
                          <WeatherWidget />
                        </Dashboard>
                      } />

                      {/* Cartographie */}
                      <Route path="/carte-parcelles" element={<FieldMap />} />
                      <Route path="/vue-satellite" element={<SatelliteMap />} />

                      {/* Analyses */}
                      <Route path="/analyses-sol" element={<SoilAnalysisChart />} />
                      <Route path="/zones-risque" element={<RiskZones />} />

                      {/* Gestion culturale */}
                      <Route path="/cultures" element={<Crops />} />
                      <Route path="/recommandations" element={<RecommendationsList />} />

                      {/* Gestion opérationnelle */}
                      <Route path="/stocks" element={<Inventory />} />
                      <Route path="/economie" element={<Economics />} />
                      <Route path="/producteurs" element={<Producers />} />

                      {/* Support */}
                      <Route path="/documentation" element={<Docs />} />
                      <Route path="/formation" element={<Training />} />

                      {/* Administration */}
                      <Route path="/admin" element={<Admin />} />
                    </Routes>
                  </div>
                </div>
              )}
            </div>
          </DataProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
