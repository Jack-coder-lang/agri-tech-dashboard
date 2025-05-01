import React from 'react';
import { 
  Home, 
  Map, 
  Droplets, 
  Layers, 
  AlertTriangle, 
  BarChart3, 
  Package, 
  FileText, 
  BookOpen, 
  Settings, 
  Users, 
  HelpCircle, 
  Sprout,
  Bot,
  Satellite
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ open }) => {
  const { currentUser, ROLES } = useAuth() || { currentUser: { role: 'ADMIN' }, ROLES: { ADMIN: 'ADMIN', COOPERATIVE: 'COOPERATIVE' } };
  const { pathname } = useLocation();
  const isAdmin = currentUser?.role === ROLES.ADMIN;
  const isCooperative = currentUser?.role === ROLES.COOPERATIVE;

  const navItems = [
    { name: 'Tableau de bord', path: '/', icon: Home, visible: true },
    { name: 'Carte des parcelles', path: '/carte-parcelles', icon: Map, visible: true },
    { name: 'Vue satellite', path: '/vue-satellite', icon: Satellite, visible: true },
    { name: 'Analyses du sol', path: '/analyses-sol', icon: Droplets, visible: true },
    { name: 'Zones à risque', path: '/zones-risque', icon: AlertTriangle, visible: true },
    { name: 'Cultures', path: '/cultures', icon: Layers, visible: true },
    { name: 'Recommandations', path: '/recommandations', icon: Bot, visible: true },
    { name: 'Stocks', path: '/stocks', icon: Package, visible: true },
    { name: 'Économie', path: '/economie', icon: BarChart3, visible: true },
    { name: 'Documentation', path: '/documentation', icon: FileText, visible: true },
    { name: 'Formation', path: '/formation', icon: BookOpen, visible: true },
    { name: 'Producteurs', path: '/producteurs', icon: Users, visible: isCooperative || isAdmin },
    { name: 'Administration', path: '/admin', icon: Settings, visible: isAdmin },
  ];

  // Vérifie si l'élément est actif
  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className={`bg-white shadow-md transition-all duration-300 ${open ? 'w-64' : 'w-20'} flex flex-col h-screen z-20`}>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-center h-16 border-b">
          <Link to="/" className={`flex items-center ${open ? 'px-4' : 'px-2'}`}>
            <Sprout className="h-8 w-8 text-[var(--color-primary)]" />
            {open && (
              <span className="ml-2 text-lg font-semibold text-gray-900">AGRI-TECH</span>
            )}
          </Link>
        </div>
        <nav className="mt-4 flex-1 px-2 space-y-1">
          {navItems
            .filter(item => item.visible)
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${open 
                  ? 'flex items-center px-4 py-2 text-sm font-medium rounded-md' 
                  : 'flex flex-col items-center justify-center px-2 py-3 text-xs rounded-md'
                } ${
                  isActive(item.path) 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className={`${open ? 'mr-3 h-5 w-5' : 'h-5 w-5 mb-1'} ${
                  isActive(item.path) ? 'text-[var(--color-primary)]' : 'text-gray-500'
                }`} />
                <span className={`${!open && 'text-[9px] text-center'}`}>{item.name}</span>
              </Link>
            ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <Link
          to="/help"
          className={`${open 
            ? 'flex items-center text-sm font-medium' 
            : 'flex flex-col items-center text-xs'
          } text-gray-700 hover:text-gray-900`}
        >
          <HelpCircle className={`${open ? 'mr-2 h-5 w-5' : 'h-5 w-5 mb-1'} text-gray-500`} />
          <span>{open ? 'Aide & Support' : 'Aide'}</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;