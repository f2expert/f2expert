import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Target,
  Package,
  Tag,
  Repeat,
  FileText
} from 'lucide-react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { cn } from '../../../lib/utils';

// Import types and services
import type { CreateClassRequest, Address, RecurringPattern } from '../../../services';
import { classManagementApiService } from '../../../services';
import { useAuth } from '../../../hooks';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassAdded: () => void;
}

interface FormData extends Omit<CreateClassRequest, 'createdBy'> {
  createdBy: string;
}

const AddClassModal: React.FC<AddClassModalProps> = ({
  isOpen,
  onClose,
  onClassAdded
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    courseId: '',
    instructorId: '',
    className: '',
    description: '',
    scheduledDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    },
    capacity: 30,
    maxEnrollments: 25,
    isRecurring: false,
    recurringPattern: {
      type: 'weekly',
      interval: 1,
      endDate: '',
      daysOfWeek: []
    },
    objectives: [''],
    prerequisites: [''],
    requiredMaterials: [''],
    classPrice: 0,
    currency: 'INR',
    tags: [''],
    createdBy: user?.id ?? '507f1f77bcf86cd799439013'
  });

  // Dropdown options
  const [courses, setCourses] = useState<Array<{ _id: string; title: string }>>([]);
  const [instructors, setInstructors] = useState<Array<{ _id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      setLoading(true);
      try {
        const [coursesData, instructorsData] = await Promise.all([
          classManagementApiService.getCourses(),
          classManagementApiService.getInstructors()
        ]);
        setCourses(coursesData);
        setInstructors(instructorsData);
      } catch (error) {
        console.error('Failed to load dropdown data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        courseId: '',
        instructorId: '',
        className: '',
        description: '',
        scheduledDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: 'India',
          zipCode: ''
        },
        capacity: 30,
        maxEnrollments: 25,
        isRecurring: false,
        recurringPattern: {
          type: 'weekly',
          interval: 1,
          endDate: '',
          daysOfWeek: [],
        },
        objectives: [''],
        prerequisites: [''],
        requiredMaterials: [''],
        classPrice: 0,
        currency: 'INR',
        tags: [''],
        createdBy: '507f1f77bcf86cd799439013'
      });
    }
  }, [isOpen]);

  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Schedule & Venue', icon: Calendar },
    { id: 3, title: 'Learning Details', icon: Target },
    { id: 4, title: 'Preview', icon: Eye }
  ];

  // Validation functions
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.courseId && formData.instructorId && formData.className && formData.description);
      case 2:
        return !!(
          formData.scheduledDate &&
          formData.startTime &&
          formData.endTime &&
          formData.venue &&
          formData.address.street &&
          formData.address.city &&
          formData.address.state &&
          formData.address.zipCode &&
          formData.capacity > 0 &&
          formData.maxEnrollments > 0
        );
      case 3:
        return (
          formData.objectives.some(obj => obj.trim() !== '') &&
          formData.prerequisites.some(pre => pre.trim() !== '') &&
          formData.requiredMaterials.some(mat => mat.trim() !== '') &&
          formData.tags.some(tag => tag.trim() !== '')
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Navigation functions
  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form update functions
  const updateFormData = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAddressData = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const updateRecurringPattern = (field: keyof RecurringPattern, value: string | number | number[]) => {
    setFormData(prev => ({
      ...prev,
      recurringPattern: {
        ...prev.recurringPattern,
        [field]: value
      } as RecurringPattern
    }));
  };

  // Array field handlers
  const addArrayField = (field: 'objectives' | 'prerequisites' | 'requiredMaterials' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayField = (field: 'objectives' | 'prerequisites' | 'requiredMaterials' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: 'objectives' | 'prerequisites' | 'requiredMaterials' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Clean up form data - remove empty array items
      const cleanedData: CreateClassRequest = {
        ...formData,
        objectives: formData.objectives.filter(obj => obj.trim() !== ''),
        prerequisites: formData.prerequisites.filter(pre => pre.trim() !== ''),
        requiredMaterials: formData.requiredMaterials.filter(mat => mat.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };

      await classManagementApiService.createClass(cleanedData);
      onClassAdded();
      onClose();
    } catch (error) {
      console.error('Failed to create class:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility functions
  const formatPrice = (price: number, currency: string = 'INR') => {
    if (price === 0) return 'Free';
    return `${currency === 'INR' ? '₹' : currency}${price}`;
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course *
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => updateFormData('courseId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor *
                </label>
                <select
                  value={formData.instructorId}
                  onChange={(e) => updateFormData('instructorId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Select an instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name *
              </label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => updateFormData('className', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter class name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what this class will cover"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => updateFormData('scheduledDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => updateFormData('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => updateFormData('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Recurring Options */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => updateFormData('isRecurring', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isRecurring" className="ml-2 text-sm font-medium text-gray-700">
                  Recurring Class
                </label>
              </div>

              {formData.isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={formData.recurringPattern?.type || 'weekly'}
                      onChange={(e) => updateRecurringPattern('type', e.target.value as 'daily' | 'weekly' | 'monthly')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interval
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.recurringPattern?.interval || 1}
                      onChange={(e) => updateRecurringPattern('interval', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.recurringPattern?.endDate || ''}
                      onChange={(e) => updateRecurringPattern('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => updateFormData('venue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Classroom A, Lab 1, Conference Room"
              />
            </div>

            {/* Address */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Address</h4>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => updateAddressData('street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street Address *"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => updateAddressData('city', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City *"
                  />
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => updateAddressData('state', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="State *"
                  />
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => updateAddressData('zipCode', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ZIP Code *"
                  />
                </div>
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => updateFormData('capacity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Enrollments *
                </label>
                <input
                  type="number"
                  min="1"
                  max={formData.capacity}
                  value={formData.maxEnrollments}
                  onChange={(e) => updateFormData('maxEnrollments', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.classPrice}
                  onChange={(e) => updateFormData('classPrice', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Learning Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives *
              </label>
              <div className="space-y-2">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateArrayField('objectives', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Learning objective ${index + 1}`}
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('objectives', index)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <FaTrash className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('objectives')}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <FaPlus className="h-3 w-3 mr-1" />
                  Add Objective
                </Button>
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites *
              </label>
              <div className="space-y-2">
                {formData.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={prerequisite}
                      onChange={(e) => updateArrayField('prerequisites', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Prerequisite ${index + 1}`}
                    />
                    {formData.prerequisites.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('prerequisites', index)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <FaTrash className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('prerequisites')}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <FaPlus className="h-3 w-3 mr-1" />
                  Add Prerequisite
                </Button>
              </div>
            </div>

            {/* Required Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Materials *
              </label>
              <div className="space-y-2">
                {formData.requiredMaterials.map((material, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => updateArrayField('requiredMaterials', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Required material ${index + 1}`}
                    />
                    {formData.requiredMaterials.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('requiredMaterials', index)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <FaTrash className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('requiredMaterials')}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <FaPlus className="h-3 w-3 mr-1" />
                  Add Material
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags *
              </label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateArrayField('tags', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Tag ${index + 1}`}
                    />
                    {formData.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('tags', index)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <FaTrash className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('tags')}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <FaPlus className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        );

      case 4: {
        // Preview step
        const selectedCourse = courses.find(c => c._id === formData.courseId);
        const selectedInstructor = instructors.find(i => i._id === formData.instructorId);
        
        return (
          <div className="space-y-6">
            {/* Class Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Class Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Class Name:</span>
                  <p className="font-medium">{formData.className}</p>
                </div>
                <div>
                  <span className="text-gray-600">Course:</span>
                  <p className="font-medium">{selectedCourse?.title}</p>
                </div>
                <div>
                  <span className="text-gray-600">Instructor:</span>
                  <p className="font-medium">{selectedInstructor?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <p className="font-medium">{formatPrice(formData.classPrice, formData.currency)}</p>
                </div>
              </div>
            </div>

            {/* Schedule & Venue */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule & Venue
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Date & Time:</span>
                  <p className="font-medium">
                    {new Date(formData.scheduledDate).toLocaleDateString('en-IN')} | {formData.startTime} - {formData.endTime}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Venue:</span>
                  <p className="font-medium">{formData.venue}</p>
                </div>
                <div>
                  <span className="text-gray-600">Capacity:</span>
                  <p className="font-medium">{formData.capacity} students (Max enrollments: {formData.maxEnrollments})</p>
                </div>
                {formData.isRecurring && (
                  <div>
                    <span className="text-gray-600">Recurring:</span>
                    <p className="font-medium flex items-center">
                      <Repeat className="h-3 w-3 mr-1" />
                      {formData.recurringPattern?.type} (Interval: {formData.recurringPattern?.interval})
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Details Preview */}
            <div className="space-y-4">
              {formData.objectives.filter(obj => obj.trim() !== '').length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Learning Objectives
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {formData.objectives.filter(obj => obj.trim() !== '').map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.prerequisites.filter(pre => pre.trim() !== '').length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {formData.prerequisites.filter(pre => pre.trim() !== '').map((prerequisite, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        {prerequisite}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.requiredMaterials.filter(mat => mat.trim() !== '').length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Required Materials
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {formData.requiredMaterials.filter(mat => mat.trim() !== '').map((material, index) => (
                      <li key={index} className="flex items-start">
                        <Package className="h-3 w-3 text-blue-500 mr-2 mt-0.5" />
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.tags.filter(tag => tag.trim() !== '').length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.filter(tag => tag.trim() !== '').map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Schedule New Class
            </DialogTitle>
          </div>

          {/* Step Progress */}
          <div className="flex items-center justify-between mt-4 px-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isValid = isCompleted || (isActive && validateCurrentStep());

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isActive
                          ? isValid
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-white border-red-300 text-red-500'
                          : 'bg-white border-gray-300 text-gray-400'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={cn(
                        'text-xs mt-1 text-center',
                        isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-4 transition-colors',
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            {currentStep === steps.length ? (
              <Button
                onClick={handleSubmit}
                disabled={!validateCurrentStep() || isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Class'
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className="flex items-center"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;