import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Notification } from '../types';

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notificationData: { message: string; link?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_STORAGE_KEY = 'cornuscore_notifications';
const FIRST_VISIT_KEY = 'cornuscore_first_visit';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Guard for server-side

    try {
      const storedNotifications = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      const initialNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      setNotifications(initialNotifications);
    } catch (error) {
      console.error('Failed to parse notifications from localStorage', error);
    }

    try {
      const isFirstVisit = !window.localStorage.getItem(FIRST_VISIT_KEY);
      if (isFirstVisit && notifications.length === 0) {
        const welcomeNotification: Notification = {
          id: `welcome-${Date.now()}`,
          message: 'Se ha publicado una nueva reseña sobre "Ana Perez". ¡Échale un vistazo!',
          read: false,
          date: new Date().toISOString(),
          link: '#/results/ana%20perez'
        };
        setNotifications([welcomeNotification]);
        window.localStorage.setItem(FIRST_VISIT_KEY, 'false');
      }
    } catch (error) {
      console.error('Failed to set first visit notification', error);
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !initialized) return; // Guard for server-side and before initialized

    try {
      window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications to localStorage', error);
    }
  }, [notifications, initialized]);

  const addNotification = useCallback((notificationData: { message: string; link?: string }) => {
    if (typeof window === 'undefined') return; // Guard for server-side

    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      message: notificationData.message,
      link: notificationData.link,
      read: false,
      date: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!initialized) {
    return <div>Loading...</div>; // Or your preferred loading component
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
