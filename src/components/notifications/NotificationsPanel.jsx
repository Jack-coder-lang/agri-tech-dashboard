import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const NotificationsPanel = () => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotification();

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} h`;
    } else {
      return `Il y a ${diffDays} j`;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg overflow-hidden z-50">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
        >
          Tout marquer comme lu
        </button>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Aucune notification
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${notification.read ? 'opacity-70' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  {getSeverityIcon(notification.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    <button
                      className="ml-2 text-gray-400 hover:text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                    <span>{formatTimestamp(notification.timestamp)}</span>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Nouveau
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-3 border-t border-gray-200 text-center">
        <a
          href="#notifications"
          className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
        >
          Voir toutes les notifications
        </a>
      </div>
    </div>
  );
};

export default NotificationsPanel;