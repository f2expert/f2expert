import React, { useState } from 'react';
import { FaPlus, FaTrash, FaUpload, FaVideo } from 'react-icons/fa';
import { Card } from '../../atoms/Card';
import { BookOpen, FileText, DollarSign, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';


interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseAdded: () => void;
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
  description: string; // Main description (backend expects this)
  shortDescription: string;
  instructor: string;
  instructorBio: string;
  category: string;
  subCategory: string;
  level: string;
  technologies: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  price: number;
  originalPrice: number;
  currency: string;
  duration: string;
  totalHours: number;
  totalLectures: number;
  language: string;
  mode: string;
  isPublished: boolean;
  isFeatured: boolean;
  difficulty: number;
  certificateProvided: boolean;
  hasProjects: boolean;
  hasAssignments: boolean;
  hasQuizzes: boolean;
  supportProvided: boolean;
  jobAssistance: boolean;
  thumbnailUrl: string;
  videoPreviewUrl: string;
  tags: string[];
  maxStudents: number;
  minStudents: number;
  isFree: boolean; // Keep for UI logic
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onCourseAdded,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'basic' | 'content' | 'pricing' | 'preview'>('basic');
  
  // Steps configuration for progress indicator
  const steps = [
    { key: 'basic', title: 'Basic Info', icon: FileText },
    { key: 'content', title: 'Course Content', icon: BookOpen },
    { key: 'pricing', title: 'Pricing', icon: DollarSign },
    { key: 'preview', title: 'Preview', icon: Eye }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  const [courseData, setCourseData] = useState<CourseFormData>({
    title: '',
    description: '',
    shortDescription: '',
    instructor: '',
    instructorBio: '',
    category: '',
    subCategory: '',
    level: 'Intermediate',
    technologies: [''],
    prerequisites: [''],
    learningOutcomes: [''],
    price: 0,
    originalPrice: 0,
    currency: 'USD',
    duration: '',
    totalHours: 0,
    totalLectures: 0,
    language: 'English',
    mode: 'Online',
    isPublished: false,
    isFeatured: false,
    difficulty: 3,
    certificateProvided: true,
    hasProjects: false,
    hasAssignments: false,
    hasQuizzes: false,
    supportProvided: true,
    jobAssistance: false,
    thumbnailUrl: '',
    videoPreviewUrl: '',
    tags: [''],
    maxStudents: 30,
    minStudents: 5,
    isFree: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
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

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

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

  const subCategories: Record<string, string[]> = {
    'Web Development': ['Full Stack Development', 'Frontend Development', 'Backend Development', 'Web Design'],
    'Mobile Development': ['iOS Development', 'Android Development', 'React Native', 'Flutter'],
    'Data Science': ['Machine Learning', 'Data Analysis', 'Big Data', 'Statistics'],
    'Cloud Computing': ['AWS', 'Azure', 'Google Cloud', 'DevOps'],
    'Cybersecurity': ['Ethical Hacking', 'Network Security', 'Web Security', 'Cryptography'],
    'DevOps': ['CI/CD', 'Docker', 'Kubernetes', 'Infrastructure'],
    'AI/Machine Learning': ['Deep Learning', 'NLP', 'Computer Vision', 'MLOps'],
    'Database Management': ['SQL', 'NoSQL', 'Database Design', 'Data Modeling'],
    'UI/UX Design': ['User Interface', 'User Experience', 'Design Systems', 'Prototyping'],
    'Software Testing': ['Manual Testing', 'Automation Testing', 'Performance Testing', 'API Testing']
  };

  const levels = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Expert', label: 'Expert' }
  ];

  const currencies = [
    { value: 'USD', label: '$ (USD)' },
    { value: 'INR', label: '₹ (INR)' },
    { value: 'EUR', label: '€ (EUR)' }
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

  const handleThumbnailFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setThumbnailFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      
      // Don't set thumbnailUrl until after successful upload
      // Clear any existing thumbnailUrl when new file is selected
      handleInputChange('thumbnailUrl', '');
    }
  };

  const handleThumbnailUpload = async () => {
    if (!thumbnailFile) {
      alert('Please select a file first');
      return;
    }

    setIsUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('thumbnail', thumbnailFile);
      
      // Try to upload to actual endpoint
      try {
        const response = await fetch('http://localhost:5000/api/upload/thumbnail', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          // Update the thumbnailUrl with the uploaded file URL (should be a valid URI)
          const uploadedUrl = result.url || result.fileUrl || result.path;
          if (uploadedUrl && (uploadedUrl.startsWith('http') || uploadedUrl.startsWith('https'))) {
            handleInputChange('thumbnailUrl', uploadedUrl);
            alert('Thumbnail uploaded successfully!');
          } else {
            // If upload doesn't return valid URI, leave thumbnailUrl empty
            handleInputChange('thumbnailUrl', '');
            alert('Thumbnail uploaded but no valid URL returned. You can manually enter a URL.');
          }
        } else {
          throw new Error('Upload failed');
        }
      } catch (uploadError) {
        // For demo/development mode - don't set thumbnailUrl with local preview
        console.log('Upload endpoint not available:', uploadError);
        handleInputChange('thumbnailUrl', '');
        alert('Demo mode: File selected successfully. Upload endpoint not available.\nYou can manually enter a valid image URL if needed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Don't set thumbnailUrl with invalid URI
      handleInputChange('thumbnailUrl', '');
      alert('Upload failed. You can manually enter a valid image URL if needed.');
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview('');
    }
    handleInputChange('thumbnailUrl', '');
  };

  // Helper function to validate URI
  const isValidUri = (str: string): boolean => {
    if (!str) return true; // Empty string is valid (optional field)
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateForm = (isDraft: boolean = false): boolean => {
    const newErrors: Record<string, string> = {};
    
    // For drafts, only validate basic required fields
    if (!isDraft) {
      if (!courseData.title.trim()) {
        newErrors.title = 'Course title is required';
      }

      if (!courseData.description.trim()) {
        newErrors.description = 'Course description is required';
      }

      if (!courseData.instructor.trim()) {
        newErrors.instructor = 'Instructor name is required';
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

      // Validate thumbnailUrl if provided
      if (courseData.thumbnailUrl && !isValidUri(courseData.thumbnailUrl)) {
        newErrors.thumbnailUrl = 'Thumbnail URL must be a valid URI (http/https) or empty';
      }
    } else {
      // For drafts, only require title
      if (!courseData.title.trim()) {
        newErrors.title = 'Title is required to save as draft';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate current step before proceeding
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'basic':
        // Validate basic info fields
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
        if (!courseData.duration?.trim()) {
          newErrors.duration = 'Duration is required';
        }
        // Validate thumbnailUrl if provided
        if (courseData.thumbnailUrl?.trim() && !isValidUri(courseData.thumbnailUrl)) {
          newErrors.thumbnailUrl = 'Thumbnail URL must be a valid URI (http/https) or empty';
        }
        break;

      case 'content':
        // Content validation - ensure at least one module with one lesson
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
        // Validate pricing fields
        if (courseData.isFree === false && (!courseData.price || courseData.price <= 0)) {
          newErrors.price = 'Price must be greater than 0 for paid courses';
        }
        break;

      case 'preview':
        // No additional validation needed for preview
        break;
    }

    setErrors(newErrors);
    
    // If there are errors, scroll to the first error element
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorField = Object.keys(newErrors)[0];
        const errorElement = document.querySelector(`[name="${firstErrorField}"], #${firstErrorField}`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions for steps
  const handleNext = () => {
    if (validateCurrentStep() && currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key as 'basic' | 'content' | 'pricing' | 'preview');
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key as 'basic' | 'content' | 'pricing' | 'preview');
    }
  };

  // Helper function to determine thumbnail URL for submission
  const getThumbnailUrlForSubmission = (): string | null => {
    // Priority 1: Manual URL entry
    if (courseData.thumbnailUrl && courseData.thumbnailUrl.trim()) {
      return courseData.thumbnailUrl;
    }
    
    // Priority 2: For demo purposes, use preview if file is selected but not uploaded
    if (thumbnailPreview && thumbnailFile) {
      // Convert blob URL to a placeholder or use a default
      return '/assets/topics/default-course.png'; // Fallback to default image
    }
    
    // Priority 3: No thumbnail
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(false)) return;

    setIsSubmitting(true);
    
    try {
      // Prepare course payload for publishing
      const coursePayload = {
        title: courseData.title,
        description: courseData.description,
        shortDescription: courseData.shortDescription,
        instructor: courseData.instructor,
        instructorBio: courseData.instructorBio,
        category: courseData.category,
        subCategory: courseData.subCategory,
        level: courseData.level,
        technologies: courseData.technologies.filter(tech => tech.trim()),
        prerequisites: courseData.prerequisites.filter(req => req.trim()),
        learningOutcomes: courseData.learningOutcomes.filter(outcome => outcome.trim()),
        price: courseData.price,
        originalPrice: courseData.originalPrice,
        currency: courseData.currency,
        duration: courseData.duration,
        totalHours: courseData.totalHours,
        totalLectures: courseData.totalLectures,
        language: courseData.language,
        mode: courseData.mode,
        certificateProvided: courseData.certificateProvided,
        hasProjects: courseData.hasProjects,
        hasAssignments: courseData.hasAssignments,
        hasQuizzes: courseData.hasQuizzes,
        supportProvided: courseData.supportProvided,
        jobAssistance: courseData.jobAssistance,
        thumbnailUrl: "http://localhost:3000"+getThumbnailUrlForSubmission(),
        videoPreviewUrl: courseData.videoPreviewUrl && courseData.videoPreviewUrl.trim() ? courseData.videoPreviewUrl : null,
        tags: courseData.tags.filter(tag => tag.trim()),
        enrollmentStartDate: new Date().toISOString(),
        enrollmentEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        courseStartDate: new Date().toISOString(),
        courseEndDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
        maxStudents: courseData.maxStudents,
        minStudents: courseData.minStudents,
        modules: modules.filter(module => 
          module.title.trim() && 
          module.lessons.some(lesson => lesson.title.trim())
        )
      };

      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(coursePayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Course created successfully:', result);
      
      alert('Course created successfully!');
      onCourseAdded(); // Refresh the parent list
      handleClose(); // Close the modal
      
    } catch (error) {
      console.error('Course creation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create course. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setCourseData({
      title: '',
      description: '',
      shortDescription: '',
      instructor: '',
      instructorBio: '',
      category: '',
      subCategory: '',
      level: 'Intermediate',
      technologies: [''],
      prerequisites: [''],
      learningOutcomes: [''],
      price: 0,
      originalPrice: 0,
      currency: 'USD',
      duration: '',
      totalHours: 0,
      totalLectures: 0,
      language: 'English',
      mode: 'Online',
      isPublished: false,
      isFeatured: false,
      difficulty: 3,
      certificateProvided: true,
      hasProjects: false,
      hasAssignments: false,
      hasQuizzes: false,
      supportProvided: true,
      jobAssistance: false,
      thumbnailUrl: '',
      videoPreviewUrl: '',
      tags: [''],
      maxStudents: 30,
      minStudents: 5,
      isFree: true
    });
    // Clear thumbnail state
    setThumbnailFile(null);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview('');
    }
    setCurrentStep('basic');
    setErrors({});
    
    // Reset modules to initial state
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
    
    onClose();
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
          placeholder="Comprehensive description of the course"
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Short Description</label>
        <textarea
          value={courseData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          placeholder="Brief summary for course listing"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          <label className="block text-sm font-medium mb-2">Instructor Bio</label>
          <Input
            value={courseData.instructorBio}
            onChange={(e) => handleInputChange('instructorBio', e.target.value)}
            placeholder="Brief instructor background"
          />
        </div>
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
          <label className="block text-sm font-medium mb-2">Sub Category</label>
          <select
            value={courseData.subCategory}
            onChange={(e) => handleInputChange('subCategory', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!courseData.category}
          >
            <option value="">Select Sub Category</option>
            {courseData.category && subCategories[courseData.category]?.map(subCat => (
              <option key={subCat} value={subCat}>{subCat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <label className="block text-sm font-medium mb-2">Difficulty (1-5)</label>
          <select
            value={courseData.difficulty}
            onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1 - Very Easy</option>
            <option value={2}>2 - Easy</option>
            <option value={3}>3 - Medium</option>
            <option value={4}>4 - Hard</option>
            <option value={5}>5 - Very Hard</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Duration *</label>
          <Input
            value={courseData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="e.g., 12 weeks"
            className={errors.duration ? 'border-red-500' : ''}
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Total Hours</label>
          <Input
            type="number"
            value={courseData.totalHours}
            onChange={(e) => handleInputChange('totalHours', parseInt(e.target.value) || 0)}
            placeholder="e.g., 40"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Total Lectures</label>
          <Input
            type="number"
            value={courseData.totalLectures}
            onChange={(e) => handleInputChange('totalLectures', parseInt(e.target.value) || 0)}
            placeholder="e.g., 50"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <Input
            value={courseData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            placeholder="Course language"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mode</label>
          <select
            value={courseData.mode}
            onChange={(e) => handleInputChange('mode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Students</label>
          <Input
            type="number"
            value={courseData.maxStudents}
            onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 30)}
            placeholder="30"
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Course Thumbnail 
            <span className="text-xs font-normal text-gray-500 ml-1">(Optional)</span>
          </label>
          <div className="space-y-3">
            {/* File Input */}
            <div className="flex items-center space-x-4">
              <Input
                value={courseData.thumbnailUrl}
                onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                placeholder="Thumbnail image URL (https://...)"
                className={`flex-1 ${errors.thumbnailUrl ? 'border-red-500' : ''}`}
                readOnly={!!thumbnailFile}
              />
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2" 
                  type="button"
                  onClick={() => document.getElementById('thumbnail-upload')?.click()}
                >
                  <FaUpload className="text-sm" />
                  <span>Choose File</span>
                </Button>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailFileChange}
                />
                {thumbnailFile && (
                  <Button 
                    variant="outline" 
                    onClick={handleThumbnailUpload}
                    className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    type="button"
                    disabled={isUploadingThumbnail}
                  >
                    {isUploadingThumbnail ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Error Message */}
            {errors.thumbnailUrl && <p className="mt-1 text-sm text-red-600">{errors.thumbnailUrl}</p>}
            
            {/* Preview */}
            {(thumbnailPreview || courseData.thumbnailUrl) && (
              <div className="relative">
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={thumbnailPreview || courseData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%236b7280">No Image</text></svg>';
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
            
            {/* File Info */}
            {thumbnailFile && (
              <div className="text-xs text-gray-500">
                <p>File: {thumbnailFile.name}</p>
                <p>Size: {(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF. Max size: 5MB. Recommended: 1280x720px
            </p>
            
            {/* Status indicator */}
            <div className="text-xs">
              {courseData.thumbnailUrl ? (
                <span className="text-green-600">✓ Thumbnail URL provided</span>
              ) : thumbnailFile ? (
                <span className="text-blue-600">📁 File selected - will use default thumbnail for demo</span>
              ) : (
                <span className="text-gray-500">💡 No thumbnail - will use default image</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Video Preview URL</label>
          <Input
            value={courseData.videoPreviewUrl}
            onChange={(e) => handleInputChange('videoPreviewUrl', e.target.value)}
            placeholder="Course preview video URL"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Technologies</label>
        {courseData.technologies.map((tech, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              value={tech}
              onChange={(e) => handleArrayFieldChange('technologies', index, e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js"
              className="flex-1"
            />
            {courseData.technologies.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('technologies', index)}
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
          onClick={() => addArrayField('technologies')}
          className="flex items-center space-x-2"
        >
          <FaPlus className="text-sm" />
          <span>Add Technology</span>
        </Button>
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

      <div>
        <h3 className="text-lg font-semibold mb-4">Course Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={courseData.certificateProvided}
              onChange={(e) => handleInputChange('certificateProvided', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Certificate Provided</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={courseData.hasProjects}
              onChange={(e) => handleInputChange('hasProjects', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Has Projects</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={courseData.hasAssignments}
              onChange={(e) => handleInputChange('hasAssignments', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Has Assignments</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={courseData.hasQuizzes}
              onChange={(e) => handleInputChange('hasQuizzes', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Has Quizzes</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={courseData.supportProvided}
              onChange={(e) => handleInputChange('supportProvided', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Support Provided</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={courseData.jobAssistance}
              onChange={(e) => handleInputChange('jobAssistance', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Job Assistance</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={courseData.isFeatured}
              onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Featured Course</span>
          </label>
        </div>
      </div>
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
            {currencies.map(curr => (
              <option key={curr.value} value={curr.value}>{curr.label}</option>
            ))}
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
                    {currencies.find(c => c.value === courseData.currency)?.label.split(' ')[0] || '$'}{courseData.price || '0'}
                  </div>
                  {courseData.originalPrice > 0 && courseData.originalPrice > courseData.price && (
                    <div className="text-sm text-gray-500 line-through">
                      {currencies.find(c => c.value === courseData.currency)?.label.split(' ')[0] || '$'}{courseData.originalPrice}
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

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          {(thumbnailPreview || courseData.thumbnailUrl) ? (
            <img
              src={thumbnailPreview || courseData.thumbnailUrl}
              alt="Course thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="text-gray-500">Invalid thumbnail URL</div>';
                }
              }}
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
                {currencies.find(c => c.value === courseData.currency)?.label.split(' ')[0] || '$'}{courseData.price}
              </span>
              {courseData.originalPrice > 0 && courseData.originalPrice > courseData.price && (
                <div className="text-sm text-gray-500 line-through">
                  {currencies.find(c => c.value === courseData.currency)?.label.split(' ')[0] || '$'}{courseData.originalPrice}
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
      
      {/* Course Modules Preview */}
      {modules.some(module => module.title.trim()) && (
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Course Content</h4>
          <div className="space-y-4">
            {modules
              .filter(module => module.title.trim())
              .map((module, index) => (
                <div key={module.id} className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    Module {index + 1}: {module.title}
                  </h5>
                  {module.description && (
                    <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  )}
                  <div className="space-y-2">
                    {module.lessons
                      .filter(lesson => lesson.title.trim())
                      .map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center text-sm text-gray-600">
                          <FaVideo className="mr-2 text-blue-500" />
                          <span>Lesson {lessonIndex + 1}: {lesson.title}</span>
                          {lesson.duration && (
                            <span className="ml-auto text-gray-400">({lesson.duration})</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center text-xl font-semibold">
            <BookOpen className="mr-2 h-5 w-5" />
            Create New Course
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
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
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep === 'preview' ? (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className="flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaPlus className="h-4 w-4" />}
                {isSubmitting ? 'Creating Course...' : 'Create Course'}
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

export { AddCourseModal };