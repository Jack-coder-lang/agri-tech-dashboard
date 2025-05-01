import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [
      ...prev,
      {
        id,
        ...notification,
        read: false,
        timestamp: new Date()
      }
    ]);

    // Auto-remove the notification after a delay if it's a toast
    if (notification.type === 'toast') {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  };

  // Remove a notification by ID
  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Get unread count
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  // Load mock notifications for demo
  useEffect(() => {
    // In a real app, these would come from an API or websocket
    const mockNotifications = [
      {
        id: 1,
        title: 'Alerte: pH du sol critique',
        message: 'Le pH du champ #3 est descendu en dessous de 5.5',
        type: 'alert',
        severity: 'error',
        read: false,
        timestamp: new Date(Date.now() - 60000) // 1 minute ago
      },
      {
        id: 2,
        title: 'Prévision météo',
        message: 'Risque de sécheresse dans les 7 prochains jours',
        type: 'alert',
        severity: 'warning',
        read: false,
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        id: 3,
        title: 'Maintenance capteur',
        message: 'Le capteur d\'humidité du sol #2 nécessite un étalonnage',
        type: 'alert', 
        severity: 'info',
        read: false,
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};