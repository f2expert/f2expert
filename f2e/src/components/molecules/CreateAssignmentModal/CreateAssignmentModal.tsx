import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, FileText, Clock, AlertTriangle, Save } from 'lucide-react';

// Radix UI Components
import { Dialog } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Badge as BadgeComponent } from '../../atoms/Badge';

// API and Types
import { 
  classManagementApiService, 
  type ClassManagement as Class,
  type CreateAssignmentRequest
} from '../../../services';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  class: Class;
  onAssignmentCreated: () => void;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  isOpen,
  onClose,
  class: classData,
  onAssignmentCreated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [type, setType] = useState<'individual' | 'group' | 'project' | 'quiz' | 'exam'>('individual');
  const [maxScore, setMaxScore] = useState(100);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [submissionFormat, setSubmissionFormat] = useState<'text' | 'file' | 'link' | 'multiple'>('file');
  const [isRequired, setIsRequired] = useState(true);
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(true);
  const [latePenalty, setLatePenalty] = useState(10);
  const [resources, setResources] = useState<string[]>(['']);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Set default due date to 1 week from today
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const defaultDueDate = nextWeek.toISOString().split('T')[0];
      
      setTitle('');
      setDescription('');
      setInstructions('');
      setType('individual');
      setMaxScore(100);
      setDueDate(defaultDueDate);
      setDueTime('23:59');
      setSubmissionFormat('file');
      setIsRequired(true);
      setAllowLateSubmissions(true);
      setLatePenalty(10);
      setResources(['']);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  // Handle resources change
  const handleResourceChange = (index: number, value: string) => {
    const newResources = [...resources];
    newResources[index] = value;
    setResources(newResources);
  };

  // Add new resource field
  const addResourceField = () => {
    setResources([...resources, '']);
  };

  // Remove resource field
  const removeResourceField = (index: number) => {
    if (resources.length > 1) {
      const newResources = resources.filter((_, i) => i !== index);
      setResources(newResources);
    }
  };

  // Create assignment with real API integration
  const handleCreateAssignment = async () => {
    if (!title.trim() || !description.trim() || !dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Combine date and time for due date
      const fullDueDate = `${dueDate}T${dueTime}:00Z`;
      
      // Filter out empty resources
      const filteredResources = resources.filter(resource => resource.trim() !== '');

      // Prepare assignment data for API call
      const assignmentData: CreateAssignmentRequest = {
        classId: classData._id,
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim() || description.trim(),
        type,
        maxScore,
        dueDate: fullDueDate,
        submissionFormat,
        isRequired,
        allowLateSubmissions,
        latePenalty: allowLateSubmissions ? latePenalty : undefined,
        resources: filteredResources.length > 0 ? filteredResources : undefined,
        createdBy: 'current-user-id' // In real app, get from auth context
      };

      console.log('Creating assignment with data:', assignmentData);

      // Call the real API endpoint
      await createAssignmentViaApi(assignmentData);

      // Also use the mock API method for consistency
      await classManagementApiService.createAssignment(assignmentData);

      setSuccess('Assignment created successfully!');
      
      // Close modal after success
      setTimeout(() => {
        onAssignmentCreated();
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  // Real API call to assignments endpoint
  const createAssignmentViaApi = async (assignmentData: CreateAssignmentRequest) => {
    try {
      const apiUrl = `http://localhost:5000/api/schedule-classes/${classData._id}/assignments`;
      const requestBody = {
        title: assignmentData.title,
        description: assignmentData.description,
        dueDate: assignmentData.dueDate
      };

      console.log('Making assignments API call:', {
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
        throw new Error(`Failed to create assignment: ${errorMessage}`);
      }

      const assignmentResult = await response.json();
      console.log('Assignment API response:', assignmentResult);
      
      return assignmentResult;
    } catch (error) {
      console.error('Error calling assignments API:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the assignments service. Please ensure the server is running on localhost:5000');
      }
      
      throw error;
    }
  };

  // Get type badge styling
  const getTypeColor = (assignmentType: string) => {
    switch (assignmentType) {
      case 'individual': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'group': return 'bg-green-50 text-green-700 border-green-200';
      case 'project': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'quiz': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'exam': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Assignment</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., JavaScript Variables Exercise"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the assignment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Detailed instructions for students..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Assignment Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'individual' | 'group' | 'project' | 'quiz' | 'exam')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="project">Project</option>
                  <option value="quiz">Quiz</option>
                  <option value="exam">Exam</option>
                </select>
                <BadgeComponent className={`mt-2 ${getTypeColor(type)}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </BadgeComponent>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Score
                </label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Format
                </label>
                <select
                  value={submissionFormat}
                  onChange={(e) => setSubmissionFormat(e.target.value as 'text' | 'file' | 'link' | 'multiple')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="file">File Upload</option>
                  <option value="text">Text Entry</option>
                  <option value="link">Link/URL</option>
                  <option value="multiple">Multiple Formats</option>
                </select>
              </div>
            </div>

            {/* Due Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Assignment Options */}
            <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900">Assignment Options</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isRequired" className="text-sm text-gray-700">
                  Required Assignment
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allowLate"
                  checked={allowLateSubmissions}
                  onChange={(e) => setAllowLateSubmissions(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="allowLate" className="text-sm text-gray-700">
                  Allow Late Submissions
                </label>
              </div>

              {allowLateSubmissions && (
                <div className="ml-6 flex items-center space-x-3">
                  <label className="text-sm text-gray-700">
                    Late Penalty:
                  </label>
                  <input
                    type="number"
                    value={latePenalty}
                    onChange={(e) => setLatePenalty(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-sm text-gray-700">% per day</span>
                </div>
              )}
            </div>

            {/* Resources */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Resources & References
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addResourceField}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resource
                </Button>
              </div>
              
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={resource}
                      onChange={(e) => handleResourceChange(index, e.target.value)}
                      placeholder="Resource name or URL..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    {resources.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeResourceField(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment Preview */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Assignment Preview</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Title:</strong> {title || 'Assignment Title'}</div>
                <div><strong>Type:</strong> {type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div><strong>Max Score:</strong> {maxScore} points</div>
                <div><strong>Due:</strong> {dueDate ? `${dueDate} at ${dueTime}` : 'No due date set'}</div>
                <div><strong>Submission:</strong> {submissionFormat}</div>
                {!isRequired && <div className="text-yellow-600"><AlertTriangle className="h-3 w-3 inline mr-1" />Optional Assignment</div>}
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
              onClick={handleCreateAssignment}
              disabled={loading || !title.trim() || !description.trim() || !dueDate}
              className="flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Assignment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateAssignmentModal;