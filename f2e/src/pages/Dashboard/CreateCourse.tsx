import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardHeader } from '../../components/atoms';
import { FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

interface CourseFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  originalPrice: number;
  currency: string;
  language: string;
  prerequisites: string[];
  learningOutcomes: string[];
  thumbnailUrl: string;
  tags: string[];
  isFree: boolean;
  isPublished: boolean;
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

export const CreateCourse: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'pricing' | 'preview'>('basic');

  const [courseData, setCourseData] = useState<CourseFormData>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    level: 'beginner',
    duration: '',
    price: 0,
    originalPrice: 0,
    currency: '₹',
    language: 'English',
    prerequisites: [''],
    learningOutcomes: [''],
    thumbnailUrl: '',
    tags: [''],
    isFree: true,
    isPublished: false
  });

  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: '',
      description: '',
      lessons: [
        {
          id: '1',
          title: '',
          description: '',
          videoUrl: '',
          duration: '',
          resources: ['']
        }
      ]
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'AI/Machine Learning',
    'Database Management',
    'UI/UX Design',
    'Software Testing'
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleInputChange = (field: keyof CourseFormData, value: string | number | boolean | string[]) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayFieldChange = (field: keyof CourseFormData, index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: keyof CourseFormData) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field] as string[], '']
    }));
  };

  const removeArrayField = (field: keyof CourseFormData, index: number) => {
    setCourseData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      description: '',
      lessons: [
        {
          id: Date.now().toString(),
          title: '',
          description: '',
          videoUrl: '',
          duration: '',
          resources: ['']
        }
      ]
    };
    setModules(prev => [...prev, newModule]);
  };

  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(module => module.id !== moduleId));
  };

  const updateModule = (moduleId: string, field: keyof Module, value: string | Lesson[]) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, [field]: value } : module
    ));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      resources: ['']
    };
    
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: string | string[]) => {
    setModules(prev => prev.map(module => 
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!courseData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!courseData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }

    if (!courseData.category) {
      newErrors.category = 'Category is required';
    }

    if (!courseData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    if (!courseData.isFree && courseData.price <= 0) {
      newErrors.price = 'Price must be greater than 0 for paid courses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Here you would typically call an API to create the course
      const coursePayload = {
        ...courseData,
        modules,
        instructorId: user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Creating course:', coursePayload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Course created successfully!');
      
      // Reset form or redirect
      
    } catch (error) {
      console.error('Course creation failed:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        <label className="block text-sm font-medium mb-2">Short Description *</label>
        <textarea
          value={courseData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          placeholder="Brief description of the course"
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.shortDescription ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Full Description</label>
        <textarea
          value={courseData.fullDescription}
          onChange={(e) => handleInputChange('fullDescription', e.target.value)}
          placeholder="Detailed description of the course"
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <label className="block text-sm font-medium mb-2">Level</label>
          <select
            value={courseData.level}
            onChange={(e) => handleInputChange('level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {levels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Duration *</label>
          <Input
            value={courseData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="e.g., 40 hours, 8 weeks"
            className={errors.duration ? 'border-red-500' : ''}
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <Input
            value={courseData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            placeholder="Course language"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Course Thumbnail</label>
        <div className="flex items-center space-x-4">
          <Input
            value={courseData.thumbnailUrl}
            onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
            placeholder="Thumbnail image URL"
            className="flex-1"
          />
          <Button variant="outline" className="flex items-center space-x-2">
            <FaUpload className="text-sm" />
            <span>Upload</span>
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Prerequisites</label>
        {courseData.prerequisites.map((prerequisite, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              value={prerequisite}
              onChange={(e) => handleArrayFieldChange('prerequisites', index, e.target.value)}
              placeholder="Enter prerequisite"
              className="flex-1"
            />
            {courseData.prerequisites.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('prerequisites', index)}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrash />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayField('prerequisites')}
          className="flex items-center space-x-2"
        >
          <FaPlus className="text-sm" />
          <span>Add Prerequisite</span>
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Learning Outcomes</label>
        {courseData.learningOutcomes.map((outcome, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              value={outcome}
              onChange={(e) => handleArrayFieldChange('learningOutcomes', index, e.target.value)}
              placeholder="What will students learn?"
              className="flex-1"
            />
            {courseData.learningOutcomes.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('learningOutcomes', index)}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrash />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayField('learningOutcomes')}
          className="flex items-center space-x-2"
        >
          <FaPlus className="text-sm" />
          <span>Add Learning Outcome</span>
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        {courseData.tags.map((tag, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              value={tag}
              onChange={(e) => handleArrayFieldChange('tags', index, e.target.value)}
              placeholder="Enter tag"
              className="flex-1"
            />
            {courseData.tags.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('tags', index)}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrash />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayField('tags')}
          className="flex items-center space-x-2"
        >
          <FaPlus className="text-sm" />
          <span>Add Tag</span>
        </Button>
      </div>
    </div>
  );

  const renderContent = () => (
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

      {modules.map((module, moduleIndex) => (
        <Card key={module.id} className="border">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
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
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      {/* Course Access Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Access
        </label>
        <div className="flex items-center space-x-4">
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
        <p className="text-xs text-gray-500 mt-1">
          {courseData.isFree 
            ? 'This course will be available to all users for free' 
            : 'This course will require payment to access'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Currency</label>
          <select
            value={courseData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={courseData.isFree}
          >
            <option value="₹">₹ (INR)</option>
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Course Price {!courseData.isFree && '*'}
          </label>
          <Input
            type="number"
            value={courseData.isFree ? 0 : courseData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
            placeholder={courseData.isFree ? "Free" : "0.00"}
            min="0"
            step="0.01"
            disabled={courseData.isFree}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          {courseData.isFree && <p className="mt-1 text-sm text-green-600">This course is free for all users</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Original Price</label>
          <Input
            type="number"
            value={courseData.isFree ? 0 : courseData.originalPrice}
            onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
            placeholder={courseData.isFree ? "Free" : "0.00"}
            min="0"
            step="0.01"
            disabled={courseData.isFree}
          />
          <p className="mt-1 text-sm text-gray-500">
            {courseData.isFree ? 'Not applicable for free courses' : 'Leave empty if no discount'}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Pricing Preview</h3>
        <div className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{courseData.title || 'Course Title'}</h4>
              <p className="text-gray-600">{courseData.shortDescription || 'Course description'}</p>
            </div>
            <div className="text-right">
              {courseData.isFree ? (
                <div className="text-2xl font-bold text-green-600">
                  FREE
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">
                    {courseData.currency}{courseData.price || '0'}
                  </div>
                  {courseData.originalPrice > 0 && courseData.originalPrice > courseData.price && (
                    <div className="text-sm text-gray-500 line-through">
                      {courseData.currency}{courseData.originalPrice}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          {courseData.thumbnailUrl ? (
            <img
              src={courseData.thumbnailUrl}
              alt="Course thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-500">No thumbnail uploaded</div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
              {courseData.level}
            </span>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-600">
                {courseData.currency}{courseData.price}
              </span>
              {courseData.originalPrice > 0 && courseData.originalPrice > courseData.price && (
                <div className="text-sm text-gray-500 line-through">
                  {courseData.currency}{courseData.originalPrice}
                </div>
              )}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {courseData.title || 'Course Title'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {courseData.shortDescription || 'Course description'}
          </p>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Duration: {courseData.duration || 'Not specified'}</span>
            <span>Category: {courseData.category || 'Not specified'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600 mt-2">Build and publish your course content</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        {[
          { key: 'basic', label: 'Basic Info' },
          { key: 'content', label: 'Content' },
          { key: 'pricing', label: 'Pricing' },
          { key: 'preview', label: 'Preview' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'basic' | 'content' | 'pricing' | 'preview')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            {activeTab === 'basic' && renderBasicInfo()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'pricing' && renderPricing()}
            {activeTab === 'preview' && renderPreview()}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={courseData.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Publish immediately</span>
            </label>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Save as draft logic
                console.log('Saving as draft...');
              }}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Course...</span>
                </>
              ) : (
                <>
                  <span>Create Course</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;