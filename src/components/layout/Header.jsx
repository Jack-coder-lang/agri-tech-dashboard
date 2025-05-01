import React, { useRef, useEffect } from 'react';
import { Bell, Menu, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationsPanel from '../notifications/NotificationsPanel';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const { notifications, getUnreadCount, markAllAsRead } = useNotification();
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const unreadCount = getUnreadCount();

  // Fermer les menus quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    if (!notificationOpen && unreadCount > 0) {
      markAllAsRead();
    }
    setNotificationOpen(!notificationOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      producer: 'Producteur',
      cooperative: 'Coopérative',
      admin: 'Administrateur'
    };
    return roleLabels[role] || 'Utilisateur';
  };

  const getRoleColor = (role) => {
    const roleColors = {
      producer: 'bg-green-100 text-green-800',
      cooperative: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <header className="bg-white shadow-sm z-10 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Partie gauche */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 hidden md:block">
              AGRI-TECH Dashboard
            </h1>
          </div>

          {/* Partie droite */}
          <div className="flex items-center space-x-4">
            {/* Bouton Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                className={`p-2 rounded-full relative ${notificationOpen ? 'text-[var(--color-primary)] bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                onClick={toggleNotifications}
                aria-label="Notifications"
                aria-expanded={notificationOpen}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <NotificationsPanel onClose={() => setNotificationOpen(false)} />
                </div>
              )}
            </div>

            {/* Menu Utilisateur */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                className={`flex items-center space-x-2 p-1 rounded-full ${userMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                onClick={toggleUserMenu}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {currentUser?.name.split(' ')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-3 px-4 border-b">
                    <div className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</div>
                    <div className="text-xs text-gray-500 truncate">{currentUser?.email}</div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(currentUser?.role)}`}>
                        {getRoleLabel(currentUser?.role)}
                      </span>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Mon Profil
                      </div>
                    </Link>
                    <Link
                      to="/parametres"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;