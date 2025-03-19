import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    const res = await axios.get('/api/notifications');
    setNotifications(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get('/api/notifications/history');
    setHistory(res.data);
  };

  const markAsRead = async (id) => {
    await axios.post(`/api/notifications/mark-as-read/${id}`);
    fetchNotifications();
    fetchHistory();
  };

  useEffect(() => {
    fetchNotifications();
    fetchHistory();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2"
      >
        <Bell />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 rounded-full text-white text-xs w-4 h-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
          <h4 className="font-bold mb-2">Notifications</h4>
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div key={item._id} className="border-b py-2 flex justify-between items-center">
                <span>{item.message}</span>
                <button
                  onClick={() => markAsRead(item._id)}
                  className="text-blue-500 text-xs"
                >
                  Mark as read
                </button>
              </div>
            ))
          ) : (
            <p>No new notifications</p>
          )}

          <hr className="my-3" />
          <h4 className="font-bold mb-2">Notification History</h4>
          <div className="max-h-40 overflow-y-auto">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item._id} className="text-sm text-gray-700 py-1">
                  {item.message}
                  <span className="block text-gray-400 text-xs">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p>No history found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;