import React, { useState, useEffect } from 'react';
import { X, MessageSquare, AlertTriangle, Pin, Clock, Users, Save, Upload } from 'lucide-react';

// Radix UI Components
import { Dialog } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Badge as BadgeComponent } from '../../atoms/Badge';

// API and Types
import { 
  classManagementApiService, 
  type ClassManagement as Class,
  type CreateAnnouncementRequest
} from '../../../services';

interface PostAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  class: Class;
  onAnnouncementPosted: () => void;
}

const PostAnnouncementModal: React.FC<PostAnnouncementModalProps> = ({
  isOpen,
  onClose,
  class: classData,
  onAnnouncementPosted
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'general' | 'urgent' | 'reminder' | 'cancellation' | 'assignment' | 'material'>('general');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [targetAudience, setTargetAudience] = useState<'all' | 'students' | 'instructors'>('students');
  const [isVisible, setIsVisible] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [scheduledFor, setScheduledFor] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [expiresTime, setExpiresTime] = useState('');
  const [attachments, setAttachments] = useState<Array<{fileName: string; fileUrl: string; fileSize: number; fileType: string}>>([]);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setType('general');
      setPriority('medium');
      setTargetAudience('students');
      setIsVisible(true);
      setIsPinned(false);
      setScheduledFor('');
      setScheduledTime('');
      setExpiresAt('');
      setExpiresTime('');
      setAttachments([]);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  // Handle file attachment (mock implementation)
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newAttachment = {
        fileName: file.name,
        fileUrl: `/attachments/${file.name}`, // Mock URL
        fileSize: file.size,
        fileType: file.type
      };
      setAttachments(prev => [...prev, newAttachment]);
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Post announcement with real API integration
  const handlePostAnnouncement = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare announcement data for API call
      const announcementData: CreateAnnouncementRequest = {
        classId: classData._id,
        title: title.trim(),
        content: content.trim(),
        type,
        priority,
        targetAudience,
        isVisible,
        isPinned,
        scheduledFor: scheduledFor && scheduledTime ? `${scheduledFor}T${scheduledTime}:00Z` : undefined,
        expiresAt: expiresAt && expiresTime ? `${expiresAt}T${expiresTime}:00Z` : undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
        createdBy: 'current-user-id' // In real app, get from auth context
      };

      console.log('Posting announcement with data:', announcementData);

      // Call the real API endpoint
      await postAnnouncementViaApi(announcementData);

      // Also use the mock API method for consistency
      await classManagementApiService.createAnnouncement(announcementData);

      setSuccess('Announcement posted successfully!');
      
      // Close modal after success
      setTimeout(() => {
        onAnnouncementPosted();
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Error posting announcement:', err);
      setError(err instanceof Error ? err.message : 'Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  // Real API call to announcements endpoint
  const postAnnouncementViaApi = async (announcementData: CreateAnnouncementRequest) => {
    try {
      const apiUrl = `http://localhost:5000/api/schedule-classes/${classData._id}/announcements`;
      const requestBody = {
        message: announcementData.content,
        isUrgent: announcementData.priority === 'high'
      };

      console.log('Making announcements API call:', {
        url: apiUrl,
        method: 'POST',
        body: requestBody
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to post announcement: ${errorMessage}`);
      }

      const announcementResult = await response.json();
      console.log('Announcement API response:', announcementResult);
      
      return announcementResult;
    } catch (error) {
      console.error('Error calling announcements API:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the announcements service. Please ensure the server is running on localhost:5000');
      }
      
      throw error;
    }
  };

  // Get priority color styling
  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get type icon
  const getTypeIcon = (announcementType: string) => {
    switch (announcementType) {
      case 'urgent': return AlertTriangle;
      case 'reminder': return Clock;
      case 'assignment': return MessageSquare;
      case 'material': return Upload;
      default: return MessageSquare;
    }
  };

  const TypeIcon = getTypeIcon(type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Post Announcement</h2>
              <p className="text-sm text-gray-600 mt-1">
                {classData.className}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Class Schedule Change"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your announcement message here..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Announcement Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Announcement Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'general' | 'urgent' | 'reminder' | 'cancellation' | 'assignment' | 'material')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="reminder">Reminder</option>
                  <option value="cancellation">Cancellation</option>
                  <option value="assignment">Assignment</option>
                  <option value="material">Material</option>
                </select>
                <div className="mt-2 flex items-center">
                  <TypeIcon className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-600">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <BadgeComponent className={`mt-2 ${getPriorityColor(priority)}`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </BadgeComponent>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as 'all' | 'students' | 'instructors')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Everyone</option>
                  <option value="students">Students Only</option>
                  <option value="instructors">Instructors Only</option>
                </select>
                <div className="mt-2 flex items-center">
                  <Users className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-600">{targetAudience === 'all' ? 'All users' : targetAudience}</span>
                </div>
              </div>
            </div>

            {/* Scheduling Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule For (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to post immediately</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expires At (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={expiresTime}
                    onChange={(e) => setExpiresTime(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Announcement will auto-hide after this time</p>
              </div>
            </div>

            {/* Announcement Options */}
            <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900">Display Options</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isVisible" className="text-sm text-gray-700">
                  Make announcement visible to target audience
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isPinned" className="text-sm text-gray-700 flex items-center">
                  <Pin className="h-4 w-4 mr-1" />
                  Pin announcement to top
                </label>
              </div>
            </div>

            {/* File Attachments */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Attachments
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Add File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileAttachment}
                  className="hidden"
                  multiple
                />
              </div>
              
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{attachment.fileName}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({Math.round(attachment.fileSize / 1024)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Announcement Preview */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Announcement Preview</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center space-x-2">
                  <TypeIcon className="h-4 w-4" />
                  <strong>{title || 'Announcement Title'}</strong>
                  {isPinned && <Pin className="h-3 w-3 text-yellow-600" />}
                  <BadgeComponent className={getPriorityColor(priority)}>
                    {priority}
                  </BadgeComponent>
                </div>
                <div className="pl-6">
                  <p>{content || 'Announcement content will appear here...'}</p>
                  {attachments.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        📎 {attachments.length} attachment(s)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePostAnnouncement}
              disabled={loading || !title.trim() || !content.trim()}
              className="flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Post Announcement
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PostAnnouncementModal;