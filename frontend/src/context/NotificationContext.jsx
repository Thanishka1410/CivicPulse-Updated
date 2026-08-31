import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_NOTIFICATIONS } from '../utils/sampleData';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('civicpulse_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_NOTIFICATIONS; }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('civicpulse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = ({ userId, title, message, type = 'info', complaintId = '' }) => {
    const newNotif = {
      id: 'notif_' + Date.now(),
      userId,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      complaintId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
