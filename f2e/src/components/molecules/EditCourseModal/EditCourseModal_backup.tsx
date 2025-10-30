import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { BookOpen, FileText, DollarSign, Eye, ChevronLeft, ChevronRight, Loader2, Edit3 } from 'lucide-react';

import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Card, CardHeader, CardContent } from '../../atoms/Card';

import { 
  courseManagementApiService, 
  type Course, 
  type UpdateCourseData 
} from '../../../services/courseManagementApi';

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

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onCourseUpdated: () => void;
}

type FormStep = 'basic' | 'content' | 'pricing' | 'preview';

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  course,
  onCourseUpdated,
}) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateCourseData>({
    title: '',
    description: '',
    shortDescription: '',
    instructor: '',
    instructorBio: '',
    category: '',
    subCategory: '',
    level: 'Beginner',
    technologies: [],
    prerequisites: [],
    learningOutcomes: [],
    price: 0,
    originalPrice: 0,
    currency: 'USD',
    duration: '',
    totalHours: 0,
    totalLectures: 0,
    language: 'English',
    maxStudents: 50,
    minStudents: 5,
    mode: 'Online',
    certificateProvided: false,
    hasProjects: false,
    hasAssignments: false,
    hasQuizzes: false,
    supportProvided: false,
    jobAssistance: false,
    isPublished: false,
    isFeatured: false,
    thumbnailUrl: ''
  });

  // Temporary state for array inputs
  const [tempTechnology, setTempTechnology] = useState('');
  const [tempPrerequisite, setTempPrerequisite] = useState('');
  const [tempLearningOutcome, setTempLearningOutcome] = useState('');
  const [modules, setModules] = useState<Module[]>([
    {
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
    }
  ]);

  const steps = [
    { key: 'basic', title: 'Basic Info', icon: FileText },
    { key: 'content', title: 'Course Content', icon: BookOpen },
    { key: 'pricing', title: 'Pricing', icon: DollarSign },
    { key: 'preview', title: 'Preview', icon: Eye }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  // Initialize form data with course data
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        instructor: course.instructor,
        instructorBio: course.instructorBio,
        category: course.category,
        subCategory: course.subCategory,
        level: course.level,
        technologies: [...course.technologies],
        prerequisites: [...course.prerequisites],
        learningOutcomes: [...course.learningOutcomes],
        price: course.price,
        originalPrice: course.originalPrice,
        currency: course.currency,
        duration: course.duration,
        totalHours: course.totalHours,
        totalLectures: course.totalLectures,
        language: course.language,
        maxStudents: course.maxStudents,
        minStudents: course.minStudents,
        mode: course.mode,
        certificateProvided: course.certificateProvided,
        hasProjects: course.hasProjects,
        hasAssignments: course.hasAssignments,
        hasQuizzes: course.hasQuizzes,
        supportProvided: course.supportProvided,
        jobAssistance: course.jobAssistance,
        isPublished: course.isPublished,
        isFeatured: course.isFeatured,
        thumbnailUrl: course.thumbnailUrl || ''
      });

      // Initialize modules from course data if available
      const courseWithModules = course as Course & { modules?: Module[] };
      if (courseWithModules.modules && courseWithModules.modules.length > 0) {
        setModules(courseWithModules.modules);
      } else {
        // Default empty module if no modules exist
        setModules([
          {
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
          }
        ]);
      }
    }
  }, [course]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (arrayField: 'technologies' | 'prerequisites' | 'learningOutcomes', value: string) => {
    if (!value.trim()) return;

    setFormData(prev => ({
      ...prev,
      [arrayField]: [...(prev[arrayField] || []), value.trim()]
    }));

    // Clear temp input
    if (arrayField === 'technologies') setTempTechnology('');
    if (arrayField === 'prerequisites') setTempPrerequisite('');
    if (arrayField === 'learningOutcomes') setTempLearningOutcome('');
  };

  const handleArrayRemove = (arrayField: 'technologies' | 'prerequisites' | 'learningOutcomes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: (prev[arrayField] || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.title || !formData.instructor || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Include modules in the update data and handle optional fields properly
      const updateData = {
        ...formData,
        // Only include thumbnailUrl if it's not empty
        ...(formData.thumbnailUrl && formData.thumbnailUrl.trim() ? { thumbnailUrl: formData.thumbnailUrl } : {}),
        modules: modules.filter(module => 
          module.title.trim() && 
          module.lessons.some(lesson => lesson.title.trim())
        )
      };
      
      // Remove empty thumbnailUrl if it exists
      if (updateData.thumbnailUrl === '') {
        delete updateData.thumbnailUrl;
      }

      await courseManagementApiService.updateCourse(course._id, updateData);
      onCourseUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key as FormStep);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key as FormStep);
    }
  };

  // Module management functions
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor *
                </label>
                <Input
                  value={formData.instructor || ''}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  placeholder="Enter instructor name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <Input
                value={formData.shortDescription || ''}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief description of the course"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the course"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category
                </label>
                <Input
                  value={formData.subCategory || ''}
                  onChange={(e) => handleInputChange('subCategory', e.target.value)}
                  placeholder="Enter sub category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.level || ''}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.language || ''}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.mode || ''}
                  onChange={(e) => handleInputChange('mode', e.target.value)}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor Bio
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                value={formData.instructorBio || ''}
                onChange={(e) => handleInputChange('instructorBio', e.target.value)}
                placeholder="Brief bio of the instructor"
              />
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tempTechnology}
                  onChange={(e) => setTempTechnology(e.target.value)}
                  placeholder="Add technology (e.g., React, Node.js)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleArrayAdd('technologies', tempTechnology);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleArrayAdd('technologies', tempTechnology)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.technologies || []).map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('technologies', index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tempPrerequisite}
                  onChange={(e) => setTempPrerequisite(e.target.value)}
                  placeholder="Add prerequisite"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleArrayAdd('prerequisites', tempPrerequisite);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleArrayAdd('prerequisites', tempPrerequisite)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.prerequisites || []).map((prereq, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{prereq}</span>
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('prerequisites', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Outcomes
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tempLearningOutcome}
                  onChange={(e) => setTempLearningOutcome(e.target.value)}
                  placeholder="Add learning outcome"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleArrayAdd('learningOutcomes', tempLearningOutcome);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleArrayAdd('learningOutcomes', tempLearningOutcome)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.learningOutcomes || []).map((outcome, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{outcome}</span>
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('learningOutcomes', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Modules */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Course Modules</h3>
                <Button
                  type="button"
                  onClick={addModule}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Module</span>
                </Button>
              </div>

              {modules.map((module, moduleIndex) => (
                <Card key={module.id} className="border mb-4">
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
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeModule(module.id)}
                          className="ml-4 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Lessons</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addLesson(module.id)}
                          className="flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Lesson</span>
                        </Button>
                      </div>

                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-medium">Lesson {lessonIndex + 1}</h5>
                            {module.lessons.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeLesson(module.id, lesson.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
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
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Price
                </label>
                <Input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price
                </label>
                <Input
                  type="number"
                  value={formData.originalPrice || 0}
                  onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.currency || ''}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Students
                </label>
                <Input
                  type="number"
                  value={formData.minStudents || 0}
                  onChange={(e) => handleInputChange('minStudents', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Students
                </label>
                <Input
                  type="number"
                  value={formData.maxStudents || 0}
                  onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="1"
                />
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Course Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Title:</span> {formData.title || 'Not specified'}</p>
                    <p><span className="font-medium">Instructor:</span> {formData.instructor || 'Not specified'}</p>
                    <p><span className="font-medium">Category:</span> {formData.category || 'Not specified'}</p>
                    <p><span className="font-medium">Duration:</span> {formData.estimatedDuration || 'Not specified'}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium">Has Projects</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.hasProjects || false}
                    onChange={(e) => handleInputChange('hasProjects', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-orange-600" />
                    <span className="text-sm font-medium">Has Assignments</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.hasAssignments || false}
                    onChange={(e) => handleInputChange('hasAssignments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-sm font-medium">Has Quizzes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.hasQuizzes || false}
                    onChange={(e) => handleInputChange('hasQuizzes', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-teal-600" />
                    <span className="text-sm font-medium">Support Provided</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.supportProvided || false}
                    onChange={(e) => handleInputChange('supportProvided', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-red-600" />
                    <span className="text-sm font-medium">Job Assistance</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.jobAssistance || false}
                    onChange={(e) => handleInputChange('jobAssistance', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <Input
                  value={formData.duration || ''}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 12 weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Hours
                </label>
                <Input
                  type="number"
                  value={formData.totalHours || 0}
                  onChange={(e) => handleInputChange('totalHours', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Lectures
                </label>
                <Input
                  type="number"
                  value={formData.totalLectures || 0}
                  onChange={(e) => handleInputChange('totalLectures', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail URL
              </label>
              <Input
                value={formData.thumbnailUrl || ''}
                onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
                type="url"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Published</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isPublished || false}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-yellow-600" />
                    <span className="text-sm font-medium">Featured Course</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold">
            <Edit3 className="mr-2 h-5 w-5" />
            Edit Course - {course.title}
          </DialogTitle>
        </DialogHeader>

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
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {renderStepContent()}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50 mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
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

      </DialogContent>
    </Dialog>
  );
};
                  
                  {currentStepIndex < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Course'}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { EditCourseModal };