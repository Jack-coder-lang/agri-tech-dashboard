import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Settings, LogOut, Shield, AlertCircle } from 'lucide-react';
import DashboardLayout from '../layout/DashboardLayout';

const Profile = () => {
  const { currentUser, logout, ROLES } = useAuth();

  if (!currentUser) return null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header avec badge de rôle */}
        <div className={`p-6 text-white ${
          currentUser.role === ROLES.ADMIN ? 'bg-red-600' : 
          currentUser.role === ROLES.COOPERATIVE ? 'bg-blue-600' : 'bg-green-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{currentUser.name}</h1>
                <p className="text-white/80">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-sm">
              {currentUser.role === ROLES.ADMIN && (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Administrateur</span>
                </>
              )}
              {currentUser.role === ROLES.COOPERATIVE && <span>Coopérative</span>}
              {currentUser.role === ROLES.PRODUCER && <span>Producteur</span>}
            </div>
          </div>
        </div>

        {/* Section Admin (visible seulement pour les admins) */}
        {currentUser.role === ROLES.ADMIN && (
          <div className="bg-yellow-50 border-y border-yellow-200 p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Accès Administrateur</h3>
              <p className="text-sm text-yellow-700">
                Vous avez des privilèges complets sur le système.
              </p>
            </div>
          </div>
        )}

        {/* Menu Profil */}
        <div className="divide-y divide-gray-200">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-500 mr-3" />
              <span>Informations du compte</span>
            </div>
            <span className="text-sm text-gray-500">Modifier</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-gray-500 mr-3" />
              <span>Paramètres système</span>
            </div>
            {currentUser.role === ROLES.ADMIN && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Admin seulement
              </span>
            )}
          </button>
          
          <button 
            onClick={logout}
            className="w-full flex items-center p-4 hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Détails spécifiques au rôle */}
        <div className="p-6 border-t">
          {currentUser.role === ROLES.ADMIN && (
            <>
              <h3 className="font-medium mb-3">Actions Administrateur</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="btn btn-outline">
                  Gérer les utilisateurs
                </button>
                <button className="btn btn-outline">
                  Paramètres avancés
                </button>
                <button className="btn btn-outline">
                  Voir les journaux système
                </button>
                <button className="btn btn-outline">
                  Sauvegardes
                </button>
              </div>
            </>
          )}

          {currentUser.role === ROLES.PRODUCER && currentUser.farms && (
            <div>
              <h3 className="font-medium mb-2">Exploitations</h3>
              <ul className="space-y-2">
                {currentUser.farms.map(farm => (
                  <li key={farm.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{farm.name}</span>
                    <span className="text-sm text-gray-600">{farm.area} ha</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;