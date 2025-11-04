import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if(link) {
      window.location.href = link;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
        aria-label="Toggle notifications"
      >
        <i className="fa-solid fa-bell text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-50">
          <div className="p-3 flex justify-between items-center border-b dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Notificaciones</h3>
            {notifications.length > 0 && (
                 <button onClick={markAllAsRead} className="text-xs text-pink-500 hover:underline">Marcar todas como leídas</button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.link)}
                  className={`p-3 flex items-start gap-3 border-b dark:border-gray-700/50 last:border-b-0 ${ n.link ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : 'cursor-default'}`}
                >
                  {!n.read && <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 flex-shrink-0"></div>}
                  <div className={`flex-grow ${n.read ? 'ml-4' : ''}`}>
                    <p className={`text-sm ${n.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(n.date).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">No tienes notificaciones.</p>
            )}
          </div>
           {notifications.length > 0 && (
                <div className="p-2 border-t dark:border-gray-700 text-center">
                    <button onClick={clearNotifications} className="text-xs text-gray-500 hover:text-red-500 dark:hover:text-red-400">Limpiar todo</button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
