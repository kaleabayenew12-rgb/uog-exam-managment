import React, { useState } from 'react';
import { Bell, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationPanel } from './NotificationPanel';

export const Header: React.FC = () => {
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <form onSubmit={handleSearch} className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exams, questions, or students..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </span>
            </button>
            
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>
          
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
