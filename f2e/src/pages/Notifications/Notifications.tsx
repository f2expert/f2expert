import React, { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '../../components/atoms';
import { Separator } from '../../components/atoms/Separator';
import { 
  BellIcon, 
  GearIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
  PersonIcon,
  BookmarkIcon,
  TrashIcon
} from '@radix-ui/react-icons';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'course' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  courseUpdates: boolean;
  achievementAlerts: boolean;
  systemUpdates: boolean;
  socialActivity: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

export const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [filter, setFilter] = useState<'all' | 'unread' | 'course' | 'system'>('all');

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'course',
      title: 'New Course Available',
      message: 'Advanced React Patterns course is now available in your premium subscription.',
      timestamp: '2024-10-09T10:30:00Z',
      read: false,
      actionUrl: '/courses/advanced-react-patterns',
      actionText: 'View Course'
    },
    {
      id: '2',
      type: 'success',
      title: 'Certificate Earned',
      message: 'Congratulations! You have successfully completed the TypeScript Fundamentals course.',
      timestamp: '2024-10-08T15:45:00Z',
      read: false,
      actionUrl: '/certificates/typescript-fundamentals',
      actionText: 'Download Certificate'
    },
    {
      id: '3',
      type: 'system',
      title: 'Maintenance Scheduled',
      message: 'System maintenance is scheduled for October 15th from 2:00 AM to 4:00 AM UTC.',
      timestamp: '2024-10-07T09:00:00Z',
      read: true
    },
    {
      id: '4',
      type: 'info',
      title: 'Learning Streak',
      message: 'Great job! You have maintained a 7-day learning streak.',
      timestamp: '2024-10-06T18:20:00Z',
      read: true
    },
    {
      id: '5',
      type: 'warning',
      title: 'Subscription Renewal',
      message: 'Your premium subscription will expire in 30 days. Renew now to continue enjoying all features.',
      timestamp: '2024-10-05T12:15:00Z',
      read: false,
      actionUrl: '/billing',
      actionText: 'Renew Subscription'
    },
    {
      id: '6',
      type: 'social',
      title: 'New Follower',
      message: 'Sarah Johnson started following your learning progress.',
      timestamp: '2024-10-04T14:30:00Z',
      read: true,
      actionUrl: '/profile/sarah-johnson',
      actionText: 'View Profile'
    },
    {
      id: '7',
      type: 'course',
      title: 'Assignment Due Soon',
      message: 'Your Node.js project assignment is due in 2 days.',
      timestamp: '2024-10-03T08:45:00Z',
      read: true,
      actionUrl: '/assignments/nodejs-project',
      actionText: 'View Assignment'
    },
    {
      id: '8',
      type: 'system',
      title: 'New Feature',
      message: 'Introducing dark mode! You can now switch to dark theme in your profile settings.',
      timestamp: '2024-10-02T16:00:00Z',
      read: true,
      actionUrl: '/profile/settings',
      actionText: 'Try Dark Mode'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    achievementAlerts: true,
    systemUpdates: true,
    socialActivity: false,
    weeklyDigest: true,
    marketingEmails: false
  });

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case 'success':
        return <CheckCircledIcon className={`${iconClass} text-green-600`} />;
      case 'error':
        return <CrossCircledIcon className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-600`} />;
      case 'course':
        return <BookmarkIcon className={`${iconClass} text-blue-600`} />;
      case 'system':
        return <GearIcon className={`${iconClass} text-gray-600`} />;
      case 'social':
        return <PersonIcon className={`${iconClass} text-purple-600`} />;
      default:
        return <InfoCircledIcon className={`${iconClass} text-blue-600`} />;
    }
  };

  const getNotificationBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      success: 'default',
      course: 'default',
      info: 'secondary',
      system: 'secondary',
      social: 'secondary',
      warning: 'destructive',
      error: 'destructive'
    };
    
    const labels: Record<string, string> = {
      success: 'Achievement',
      course: 'Course',
      info: 'Info',
      system: 'System',
      social: 'Social',
      warning: 'Important',
      error: 'Error'
    };

    return (
      <Badge variant={variants[type] || 'secondary'}>
        {labels[type] || 'Info'}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'course') return notif.type === 'course';
    if (filter === 'system') return notif.type === 'system';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderNotifications = () => (
    <div className="space-y-6">
      {/* Header with actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BellIcon className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Stay updated with your learning progress and platform updates.
              </CardDescription>
            </div>
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              Mark All Read
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter buttons */}
          <div className="flex gap-2 mb-4">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'course', label: 'Courses' },
              { key: 'system', label: 'System' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(key as typeof filter)}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Notifications list */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BellIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications to show</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          {getNotificationBadge(notification.type)}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.actionUrl && (
                            <Button variant="outline" size="sm">
                              {notification.actionText}
                            </Button>
                          )}
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GearIcon className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Control how and when you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Settings */}
          <div>
            <h4 className="font-medium mb-4">General</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Email Notifications</h5>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Push Notifications</h5>
                  <p className="text-sm text-gray-600">Receive browser push notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                  className="toggle"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Learning Activity */}
          <div>
            <h4 className="font-medium mb-4">Learning Activity</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Course Updates</h5>
                  <p className="text-sm text-gray-600">New courses, assignments, and deadlines</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.courseUpdates}
                  onChange={(e) => updateSetting('courseUpdates', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Achievement Alerts</h5>
                  <p className="text-sm text-gray-600">Certificate completions and milestones</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.achievementAlerts}
                  onChange={(e) => updateSetting('achievementAlerts', e.target.checked)}
                  className="toggle"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* System & Social */}
          <div>
            <h4 className="font-medium mb-4">System & Social</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">System Updates</h5>
                  <p className="text-sm text-gray-600">Platform updates and maintenance notices</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.systemUpdates}
                  onChange={(e) => updateSetting('systemUpdates', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Social Activity</h5>
                  <p className="text-sm text-gray-600">Followers, comments, and community interactions</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.socialActivity}
                  onChange={(e) => updateSetting('socialActivity', e.target.checked)}
                  className="toggle"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Preferences */}
          <div>
            <h4 className="font-medium mb-4">Email Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Weekly Digest</h5>
                  <p className="text-sm text-gray-600">Weekly summary of your learning progress</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(e) => updateSetting('weeklyDigest', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Marketing Emails</h5>
                  <p className="text-sm text-gray-600">Product updates and promotional content</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={(e) => updateSetting('marketingEmails', e.target.checked)}
                  className="toggle"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">Manage your notifications and stay updated with your learning journey.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'notifications' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'settings' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'notifications' && renderNotifications()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default Notifications;