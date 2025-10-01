import React from 'react';
import { X, CheckCircle, Clock, AlertCircle, FileText, Bell } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'approval' | 'exam' | 'system' | 'submission';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionUrl?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'approval',
      title: 'Exam Approved',
      message: 'Your Mathematics Midterm has been approved by Dr. Johnson',
      time: '2 hours ago',
      isRead: false,
      actionUrl: '/exams/1'
    },
    {
      id: '2', 
      type: 'submission',
      title: 'New Submissions',
      message: '15 students submitted Physics Quiz 3',
      time: '3 hours ago',
      isRead: false,
      actionUrl: '/reports/quiz-3'
    },
    {
      id: '3',
      type: 'system',
      title: 'System Update',
      message: 'New question types are now available',
      time: '1 day ago',
      isRead: true
    }
  ];

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'exam':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'submission':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'system':
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      // Navigate to the notification's action URL
      console.log('Navigate to:', notification.actionUrl);
    }
    // Mark as read
    console.log('Mark notification as read:', notification.id);
  };

  const markAllAsRead = () => {
    console.log('Mark all notifications as read');
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {notification.title}
                  </p>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="p-8 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No notifications</p>
        </div>
      )}

      <div className="p-3 border-t border-gray-200">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  );
};
