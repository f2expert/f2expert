import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { BookOpen, FileText, DollarSign, Eye, ChevronLeft, ChevronRight, Loader2, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Card } from '../../atoms/Card';

interface Course {
  title?: string;
  description?: string;
  instructor?: string;
  instructorBio?: string;
  category?: string;
  subCategory?: string;
  level?: string;
  estimatedDuration?: string;
  language?: string;
  price?: number;
  currency?: string;
  isFree?: boolean;
  thumbnailUrl?: string;
  tags?: string[];
  prerequisites?: string[];
  whatYoullLearn?: string[];
  isPublished?: boolean;
  modules?: Module[];
}

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onCourseUpdated: () => void;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  resources: string[];
}

interface CourseFormData {
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  category: string;
  subCategory: string;
  level: string;
  estimatedDuration: string;
  language: string;
  price: number;
  currency: string;
  isFree: boolean;
  thumbnailUrl: string;
  tags: string[];
  prerequisites: string[];
  whatYoullLearn: string[];
  isPublished: boolean;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  course,
  onCourseUpdated
}) => {
  const [currentStep, setCurrentStep] = useState<'basic' | 'content' | 'pricing' | 'preview'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modules, setModules] = useState<Module[]>([]);


  const [courseData, setCourseData] = useState<CourseFormData>({
    title: '',
    description: '',
    instructor: '',
    instructorBio: '',
    category: '',
    subCategory: '',
    level: 'Beginner',
    estimatedDuration: '',
    language: 'English',
    price: 0,
    currency: 'USD',
    isFree: true,
    thumbnailUrl: '',
    tags: [''],
    prerequisites: [''],
    whatYoullLearn: [''],
    isPublished: false
  });

  // Initialize form with course data
  useEffect(() => {
    if (course && isOpen) {
      setCourseData({
        title: course.title || '',
        description: course.description || '',
        instructor: course.instructor || '',
        instructorBio: course.instructorBio || '',
        category: course.category || '',
        subCategory: course.subCategory || '',
        level: course.level || 'Beginner',
        estimatedDuration: course.estimatedDuration || '',
        language: course.language || 'English',
        price: course.price || 0,
        currency: course.currency || 'USD',
        isFree: course.isFree ?? true,
        thumbnailUrl: course.thumbnailUrl || '',
        tags: course.tags || [''],
        prerequisites: course.prerequisites || [''],
        whatYoullLearn: course.whatYoullLearn || [''],
        isPublished: course.isPublished || false
      });

      // Initialize modules if course has them
      if (course.modules) {
        setModules(course.modules);
      } else {
        setModules([{
          id: Date.now().toString(),
          title: '',
          description: '',
          lessons: [{
            id: Date.now().toString() + '_lesson',
            title: '',
            description: '',
            videoUrl: '',
            duration: '',
            resources: []
          }]
        }]);
      }

      setCurrentStep('basic');
      setErrors({});
    }
  }, [course, isOpen]);

  const steps = [
    { key: 'basic', title: 'Basic Info', icon: FileText },
    { key: 'content', title: 'Course Content', icon: BookOpen },
    { key: 'pricing', title: 'Pricing', icon: DollarSign },
    { key: 'preview', title: 'Preview', icon: Eye }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  const categories = [
    'Technology', 'Business', 'Design', 'Marketing', 
    'Photography', 'Music', 'Health & Fitness', 'Language'
  ];



  const handleInputChange = (field: keyof CourseFormData, value: string | number | boolean | string[]) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate current step before proceeding
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'basic':
        if (!courseData.title?.trim()) {
          newErrors.title = 'Course title is required';
        }
        if (!courseData.description?.trim()) {
          newErrors.description = 'Course description is required';
        }
        if (!courseData.instructor?.trim()) {
          newErrors.instructor = 'Instructor name is required';
        }
        if (!courseData.category?.trim()) {
          newErrors.category = 'Category is required';
        }
        if (!courseData.estimatedDuration?.trim()) {
          newErrors.duration = 'Duration is required';
        }
        break;

      case 'content':
        if (modules.length === 0) {
          newErrors.content = 'At least one module is required';
        } else {
          const hasEmptyModules = modules.some(module => 
            !module.title?.trim() || module.lessons.length === 0
          );
          const hasEmptyLessons = modules.some(module =>
            module.lessons.some(lesson => !lesson.title?.trim())
          );
          
          if (hasEmptyModules) {
            newErrors.content = 'All modules must have a title and at least one lesson';
          } else if (hasEmptyLessons) {
            newErrors.content = 'All lessons must have a title';
          }
        }
        break;

      case 'pricing':
        if (courseData.isFree === false && (!courseData.price || courseData.price <= 0)) {
          newErrors.price = 'Price must be greater than 0 for paid courses';
        }
        break;

      case 'preview':
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key as 'basic' | 'content' | 'pricing' | 'preview');
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key as 'basic' | 'content' | 'pricing' | 'preview');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onCourseUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Module management functions
  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      description: '',
      lessons: [{
        id: Date.now().toString() + '_lesson',
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        resources: []
      }]
    };
    setModules([...modules, newModule]);
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const updateModule = (moduleId: string, field: keyof Module, value: string | Lesson[]) => {
    setModules(modules.map(module =>
      module.id === moduleId ? { ...module, [field]: value } : module
    ));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString() + '_lesson',
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      resources: []
    };

    setModules(modules.map(module =>
      module.id === moduleId
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(module =>
      module.id === moduleId
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: string | string[]) => {
    setModules(modules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            )
          }
        : module
    ));
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Course Title *</label>
        <Input
          value={courseData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter course title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Course Description *</label>
        <textarea
          value={courseData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe what students will learn in this course"
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Instructor Name *</label>
          <Input
            value={courseData.instructor}
            onChange={(e) => handleInputChange('instructor', e.target.value)}
            placeholder="Enter instructor name"
            className={errors.instructor ? 'border-red-500' : ''}
          />
          {errors.instructor && <p className="mt-1 text-sm text-red-600">{errors.instructor}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            value={courseData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Duration *</label>
          <Input
            value={courseData.estimatedDuration}
            onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
            placeholder="e.g., 4 hours"
            className={errors.duration ? 'border-red-500' : ''}
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Level</label>
          <select
            value={courseData.level}
            onChange={(e) => handleInputChange('level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCourseContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Modules</h3>
        <Button
          variant="outline"
          onClick={addModule}
          className="flex items-center space-x-2"
        >
          <FaPlus className="text-sm" />
          <span>Add Module</span>
        </Button>
      </div>

      {errors.content && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.content}</p>
        </div>
      )}

      {modules.map((module, moduleIndex) => (
        <Card key={module.id} className="border">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 space-y-3">
                <Input
                  value={module.title}
                  onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                  placeholder={`Module ${moduleIndex + 1} title`}
                  className="font-medium"
                />
                <Input
                  value={module.description}
                  onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                  placeholder="Module description"
                />
              </div>
              {modules.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeModule(module.id)}
                  className="ml-4 text-red-600 hover:text-red-700"
                >
                  <FaTrash />
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Lessons</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLesson(module.id)}
                  className="flex items-center space-x-2"
                >
                  <FaPlus className="text-sm" />
                  <span>Add Lesson</span>
                </Button>
              </div>

              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium">Lesson {lessonIndex + 1}</h5>
                    {module.lessons.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLesson(module.id, lesson.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={lesson.title}
                      onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                      placeholder="Lesson title"
                    />
                    <Input
                      value={lesson.duration}
                      onChange={(e) => updateLesson(module.id, lesson.id, 'duration', e.target.value)}
                      placeholder="Duration (e.g., 15 min)"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <Input
                      value={lesson.description}
                      onChange={(e) => updateLesson(module.id, lesson.id, 'description', e.target.value)}
                      placeholder="Lesson description"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <Input
                      value={lesson.videoUrl}
                      onChange={(e) => updateLesson(module.id, lesson.id, 'videoUrl', e.target.value)}
                      placeholder="Video URL"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Course Access</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="courseAccess"
              checked={courseData.isFree === true}
              onChange={() => handleInputChange('isFree', true)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Free Course</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="courseAccess"
              checked={courseData.isFree === false}
              onChange={() => handleInputChange('isFree', false)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Paid Course</span>
          </label>
        </div>
      </div>

      {!courseData.isFree && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={courseData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price *</label>
            <Input
              type="number"
              value={courseData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">Course Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Title:</span> {courseData.title || 'Not specified'}</p>
              <p><span className="font-medium">Instructor:</span> {courseData.instructor || 'Not specified'}</p>
              <p><span className="font-medium">Category:</span> {courseData.category || 'Not specified'}</p>
              <p><span className="font-medium">Duration:</span> {courseData.estimatedDuration || 'Not specified'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Pricing</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Access:</span> {courseData.isFree ? 'Free' : 'Paid'}</p>
              {!courseData.isFree && (
                <p><span className="font-medium">Price:</span> {courseData.currency} {courseData.price || 0}</p>
              )}
            </div>
          </div>
        </div>
        
        {courseData.description && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-600">{courseData.description}</p>
          </div>
        )}

        {modules.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Course Content</h4>
            <div className="space-y-2">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="text-sm">
                  <p className="font-medium">Module {moduleIndex + 1}: {module.title || `Module ${moduleIndex + 1}`}</p>
                  <p className="text-gray-600 ml-4">{module.lessons.length} lesson(s)</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Ready to Update?</h3>
        <p className="text-gray-600 mb-4">
          Review all the changes above. The course will be updated with the new information.
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>✓ Course will be saved as {courseData.isPublished ? 'Published' : 'Draft'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center text-xl font-semibold">
            <Edit3 className="mr-2 h-5 w-5" />
            Edit Course
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.key === currentStep;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={step.key} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : isCompleted
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`ml-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="px-6">
          {currentStep === 'basic' && renderBasicInfo()}
          {currentStep === 'content' && renderCourseContent()}
          {currentStep === 'pricing' && renderPricing()}
          {currentStep === 'preview' && renderPreview()}
        </div>
        </div>

        {/* Fixed Footer - Always visible at bottom */}
        <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t mt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {steps.length}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleClose}
              variant="outline"
            >
              Cancel
            </Button>
            {currentStep === 'preview' ? (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
                {isSubmitting ? 'Updating Course...' : 'Update Course'}
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export { EditCourseModal };