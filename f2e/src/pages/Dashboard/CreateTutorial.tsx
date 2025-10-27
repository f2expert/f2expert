import React, { useState } from 'react';
import { Button } from '../../components/atoms/Button';
import { Card, CardContent, CardHeader } from '../../components/atoms/Card';
import { FormInput } from '../../components/atoms/FormInput';
import { 
  FaVideo, 
  FaUpload, 
  FaPlay, 
  FaEye, 
  FaClock,
  FaUser,
  FaTag,
  FaFileVideo,
  FaImage,
  FaDownload,
  FaYoutube,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { cn } from '../../lib/utils';

interface TutorialFormData {
  title: string;
  description: string;
  content: string; // Main tutorial content
  author: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string; // Will be split into array
  estimatedReadTime: number;
  tutorialType: 'Article' | 'Video' | 'Interactive';
  tags: string; // Will be split into array
  difficulty: number; // 1-5 scale
  isPublished: boolean;
  thumbnailUrl: string;
  videoUrl: string;
  videoDuration: number; // in seconds
  // UI-only fields
  videoType: 'upload' | 'youtube' | 'external';
  videoFile: File | null;
  thumbnailFile: File | null;
  shortDescription: string; // For UI display
  language: string; // For UI
  downloadableResources: string; // For UI
  isFree: boolean; // For UI
}

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'UI/UX Design',
  'Cybersecurity',
  'Database',
  'Programming Languages'
];



export const CreateTutorial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'content' | 'preview'>('basic');
  const [formData, setFormData] = useState<TutorialFormData>({
    title: '',
    description: '',
    content: '',
    author: '',
    category: '',
    level: 'Beginner',
    technologies: '',
    estimatedReadTime: 5,
    tutorialType: 'Article',
    tags: '',
    difficulty: 3,
    isPublished: false,
    thumbnailUrl: '',
    videoUrl: '',
    videoDuration: 0,
    // UI-only fields
    videoType: 'upload',
    videoFile: null,
    thumbnailFile: null,
    shortDescription: '',
    language: 'English',
    downloadableResources: '',
    isFree: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleInputChange = (field: keyof TutorialFormData, value: string | boolean | File | null | number | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: 'videoFile' | 'thumbnailFile', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));

    if (field === 'thumbnailFile' && file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewThumbnail(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (isDraft: boolean = false): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!isDraft) {
      if (!formData.title.trim()) {
        newErrors.title = 'Tutorial title is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Tutorial description is required';
      }
      if (!formData.content.trim()) {
        newErrors.content = 'Tutorial content is required';
      } else if (formData.content.trim().length < 50) {
        newErrors.content = 'Tutorial content must be at least 50 characters long';
      }
      if (!formData.author.trim()) {
        newErrors.author = 'Author name is required';
      }
      if (!formData.category) {
        newErrors.category = 'Category is required';
      }
      if (formData.thumbnailUrl && !isValidUri(formData.thumbnailUrl)) {
        newErrors.thumbnailUrl = 'Thumbnail URL must be a valid URI (http/https) or empty';
      }
      if (formData.videoUrl && !isValidUri(formData.videoUrl)) {
        newErrors.videoUrl = 'Video URL must be a valid URI (http/https) or empty';
      }
    } else {
      // For drafts, only require title
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required to save as draft';
      }
      // For drafts, if content is provided, it should still meet minimum length
      if (formData.content.trim() && formData.content.trim().length < 50) {
        newErrors.content = 'If provided, content must be at least 50 characters long';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!validateForm(isDraft)) return;

    setIsSubmitting(true);
    
    try {
      // Prepare tutorial payload for API
      const tutorialPayload = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription || formData.description.substring(0, 100), // Use shortDescription or truncate description
        content: formData.content.trim() || (formData.description.length >= 50 ? formData.description : `# ${formData.title}\n\n${formData.description}\n\nThis tutorial will provide comprehensive coverage of the topic with practical examples and detailed explanations.`), // Ensure content meets minimum length requirement
        author: formData.author || 'Anonymous',
        category: formData.category,
        level: formData.level,
        technologies: formData.technologies ? formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech) : [],
        estimatedReadTime: formData.estimatedReadTime,
        tutorialType: formData.tutorialType,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        difficulty: formData.difficulty,
        isPublished: !isDraft,
        thumbnailUrl: formData.thumbnailUrl || '',
        videoUrl: formData.videoUrl || '',
        videoDuration: formData.videoDuration || 0
      };

      console.log('Tutorial API payload:', tutorialPayload);
      
      // Call actual API
      const response = await fetch('http://localhost:5000/api/tutorials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(tutorialPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Tutorial created successfully:', result);
      
      alert(isDraft ? 'Tutorial saved as draft!' : 'Tutorial published successfully!');
      
      // Reset form for new tutorial
      setFormData({
        title: '',
        description: '',
        content: '',
        author: '',
        category: '',
        level: 'Beginner',
        technologies: '',
        estimatedReadTime: 5,
        tutorialType: 'Article',
        tags: '',
        difficulty: 3,
        isPublished: false,
        thumbnailUrl: '',
        videoUrl: '',
        videoDuration: 0,
        videoType: 'upload',
        videoFile: null,
        thumbnailFile: null,
        shortDescription: '',
        language: 'English',
        downloadableResources: '',
        isFree: true
      });
      setPreviewThumbnail('');
      setErrors({});
      
    } catch (error) {
      console.error('Tutorial creation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create tutorial. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const TabButton = ({ 
    tab, 
    label, 
    icon: Icon 
  }: { 
    tab: string; 
    label: string; 
    icon: React.ComponentType<{ className?: string }> 
  }) => (
    <button
      onClick={() => setActiveTab(tab as 'basic' | 'media' | 'content' | 'preview')}
      className={cn(
        'flex items-center px-4 py-2 rounded-lg font-medium transition-colors',
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </button>
  );

  const renderBasicInfoTab = () => (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tutorial Title *
        </label>
        <FormInput
          type="text"
          value={formData.title}
          onChange={(value) => handleInputChange('title', value)}
          placeholder="Enter tutorial title"
          required
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author Name *
        </label>
        <FormInput
          type="text"
          value={formData.author}
          onChange={(value) => handleInputChange('author', value)}
          placeholder="Enter author name"
          required
        />
        {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description
        </label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          placeholder="Brief description for tutorial cards (max 100 characters)"
          maxLength={100}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Full Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Detailed description of what students will learn"
          rows={6}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      {/* Tutorial Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tutorial Content *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Main tutorial content (supports Markdown)\n\n# Introduction\n\nYour tutorial content goes here...\n\nMake sure to provide detailed explanations, examples, and step-by-step instructions."
          rows={12}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            You can use Markdown formatting. This will be the main content of your tutorial. (Min: 50 characters)
          </p>
          <p className={`text-xs ${
            formData.content.length < 50 ? 'text-red-500' : 'text-green-500'
          }`}>
            {formData.content.length}/50 characters
          </p>
        </div>
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={formData.level}
            onChange={(e) => handleInputChange('level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Tutorial Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tutorial Type
          </label>
          <select
            value={formData.tutorialType}
            onChange={(e) => handleInputChange('tutorialType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Article">Article</option>
            <option value="Video">Video</option>
            <option value="Interactive">Interactive</option>
          </select>
        </div>

        {/* Difficulty (1-5 scale) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Rating (1-5)
          </label>
          <select
            value={formData.difficulty}
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

        {/* Estimated Read Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Read Time (minutes)
          </label>
          <input
            type="number"
            value={formData.estimatedReadTime}
            onChange={(e) => handleInputChange('estimatedReadTime', parseInt(e.target.value) || 5)}
            placeholder="e.g., 15"
            min="1"
            max="180"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Video Duration (for video tutorials) */}
        {formData.tutorialType === 'Video' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Duration (seconds)
            </label>
            <input
              type="number"
              value={formData.videoDuration}
              onChange={(e) => handleInputChange('videoDuration', parseInt(e.target.value) || 0)}
              placeholder="e.g., 1800 (30 minutes)"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Duration in seconds (e.g., 1800 = 30 minutes)
            </p>
          </div>
        )}
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Technologies
        </label>
        <FormInput
          type="text"
          value={formData.technologies}
          onChange={(value) => handleInputChange('technologies', value)}
          placeholder="Enter technologies separated by commas (e.g., React, JavaScript, Node.js)"
        />
        <p className="text-xs text-gray-500 mt-1">
          List the main technologies covered in this tutorial
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <FormInput
          type="text"
          value={formData.tags}
          onChange={(value) => handleInputChange('tags', value)}
          placeholder="Enter tags separated by commas (e.g., beginner, tutorial, web-dev)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tags help users discover your tutorial
        </p>
      </div>

      {/* Free/Paid Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tutorial Access
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="tutorialAccess"
              checked={formData.isFree === true}
              onChange={() => handleInputChange('isFree', true)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Free Tutorial</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="tutorialAccess"
              checked={formData.isFree === false}
              onChange={() => handleInputChange('isFree', false)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Paid Tutorial</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formData.isFree 
            ? 'This tutorial will be available to all users for free' 
            : 'This tutorial will require payment or subscription to access'
          }
        </p>
      </div>
    </div>
  );

  const renderMediaTab = () => (
    <div className="space-y-6">
      {/* Video Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Video Source
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('videoType', 'upload')}
            className={cn(
              'p-4 border-2 rounded-lg text-center transition-colors',
              formData.videoType === 'upload'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            <FaUpload className="mx-auto mb-2 h-6 w-6" />
            <div className="font-medium">Upload Video</div>
            <div className="text-sm text-gray-500">Upload from computer</div>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('videoType', 'youtube')}
            className={cn(
              'p-4 border-2 rounded-lg text-center transition-colors',
              formData.videoType === 'youtube'
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            <FaYoutube className="mx-auto mb-2 h-6 w-6" />
            <div className="font-medium">YouTube Video</div>
            <div className="text-sm text-gray-500">Link to YouTube</div>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('videoType', 'external')}
            className={cn(
              'p-4 border-2 rounded-lg text-center transition-colors',
              formData.videoType === 'external'
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            <FaExternalLinkAlt className="mx-auto mb-2 h-6 w-6" />
            <div className="font-medium">External Link</div>
            <div className="text-sm text-gray-500">Other video platform</div>
          </button>
        </div>
      </div>

      {/* Video Upload/URL */}
      {formData.videoType === 'upload' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Video File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <FaFileVideo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-sm text-gray-600 mb-2">
              {formData.videoFile ? formData.videoFile.name : 'Click to upload or drag and drop'}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              MP4, WebM, or AVI (max 500MB)
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload('videoFile', e.target.files?.[0] || null)}
              className="hidden"
              id="video-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('video-upload')?.click()}
            >
              <FaUpload className="mr-2" />
              Select Video
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.videoType === 'youtube' ? 'YouTube URL' : 'Video URL'}
          </label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => handleInputChange('videoUrl', e.target.value)}
            placeholder={
              formData.videoType === 'youtube' 
                ? 'https://www.youtube.com/watch?v=...' 
                : 'https://...'
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.videoUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.videoUrl && <p className="mt-1 text-sm text-red-600">{errors.videoUrl}</p>}
        </div>
      )}

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail Image
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <FaImage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <div className="text-sm text-gray-600 mb-2">
              {formData.thumbnailFile ? formData.thumbnailFile.name : 'Upload thumbnail'}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              JPG, PNG (recommended: 1280x720)
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('thumbnailFile', e.target.files?.[0] || null)}
              className="hidden"
              id="thumbnail-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('thumbnail-upload')?.click()}
            >
              <FaUpload className="mr-2" />
              Select Image
            </Button>
          </div>

          {/* Thumbnail Preview */}
          {(previewThumbnail || formData.thumbnailUrl) && (
            <div className="border rounded-lg overflow-hidden">
              <img
                src={previewThumbnail || formData.thumbnailUrl}
                alt="Thumbnail preview"
                className="w-full h-32 object-cover"
              />
              <div className="p-2 text-xs text-gray-500 text-center">
                Thumbnail Preview
              </div>
            </div>
          )}
        </div>

        {/* Or Thumbnail URL */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or provide thumbnail URL
          </label>
          <input
            type="url"
            value={formData.thumbnailUrl}
            onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.thumbnailUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.thumbnailUrl && <p className="mt-1 text-sm text-red-600">{errors.thumbnailUrl}</p>}
        </div>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Downloadable Resources */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Downloadable Resources (Optional)
        </label>
        <textarea
          value={formData.downloadableResources}
          onChange={(e) => handleInputChange('downloadableResources', e.target.value)}
          placeholder="Provide links to downloadable resources like PDFs, code files, etc. (one per line)"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter URLs or file paths, one per line
        </p>
      </div>

      {/* Tutorial Summary Card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <FaEye className="mr-2" />
            Tutorial Summary
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category:</span>
              <span className="ml-2 font-medium">{formData.category || 'Not selected'}</span>
            </div>
            <div>
              <span className="text-gray-500">Level:</span>
              <span className="ml-2 font-medium">{formData.level}</span>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="ml-2 font-medium">{formData.tutorialType}</span>
            </div>
            <div>
              <span className="text-gray-500">Difficulty:</span>
              <span className="ml-2 font-medium">{formData.difficulty}/5</span>
            </div>
            <div>
              <span className="text-gray-500">Read Time:</span>
              <span className="ml-2 font-medium">{formData.estimatedReadTime} min</span>
            </div>
            <div>
              <span className="text-gray-500">Author:</span>
              <span className="ml-2 font-medium">{formData.author || 'Not specified'}</span>
            </div>
          </div>
          
          {formData.technologies && (
            <div>
              <span className="text-gray-500 text-sm">Technologies:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.technologies.split(',').map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {formData.tags && (
            <div>
              <span className="text-gray-500 text-sm">Tags:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-6">
      {/* Tutorial Preview Card */}
      <Card className="max-w-md mx-auto">
        <div className="relative">
          {(previewThumbnail || formData.thumbnailUrl) ? (
            <img
              src={previewThumbnail || formData.thumbnailUrl}
              alt="Tutorial thumbnail"
              className="w-full h-48 object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <FaVideo className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-t-lg">
            <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
              <FaPlay className="mr-2" /> Preview
            </Button>
          </div>
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            <FaClock className="inline mr-1" />
            {formData.estimatedReadTime} min read
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
              {formData.level}
            </span>
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
              formData.isFree 
                ? 'text-green-600 bg-green-100' 
                : 'text-blue-600 bg-blue-100'
            }`}>
              {formData.isFree ? 'FREE' : 'PAID'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {formData.title || 'Tutorial Title'}
          </h3>
          
          <p className="text-gray-600 mb-4 text-sm">
            {formData.shortDescription || 'Short description will appear here'}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <FaUser className="mr-1" />
              Instructor Name
            </div>
            <div className="text-sm text-gray-500">
              {formData.category || 'Category'}
            </div>
          </div>

          <Button className="w-full" size="sm">
            <FaPlay className="mr-2" /> Watch Tutorial
          </Button>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Validation Summary</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { field: 'title', label: 'Title', required: true },
              { field: 'description', label: 'Description', required: true },
              { field: 'content', label: 'Content', required: true },
              { field: 'author', label: 'Author', required: true },
              { field: 'category', label: 'Category', required: true },
              { field: 'videoUrl', label: 'Video Source', required: formData.tutorialType === 'Video' && formData.videoType !== 'upload' },
              { field: 'videoFile', label: 'Video File', required: formData.tutorialType === 'Video' && formData.videoType === 'upload' }
            ].map(({ field, label, required }) => {
              const value = formData[field as keyof TutorialFormData];
              const isValid = !required || (value && value !== '');
              
              return (
                <div key={field} className="flex items-center text-sm">
                  <div className={cn(
                    'w-2 h-2 rounded-full mr-3',
                    isValid ? 'bg-green-500' : 'bg-red-500'
                  )} />
                  <span className={isValid ? 'text-green-700' : 'text-red-700'}>
                    {label} {required && '*'}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Tutorial</h1>
        <p className="text-gray-600">
          Create a new tutorial to share knowledge with your students
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        <TabButton tab="basic" label="Basic Info" icon={FaTag} />
        <TabButton tab="media" label="Media & Video" icon={FaVideo} />
        <TabButton tab="content" label="Content & Resources" icon={FaDownload} />
        <TabButton tab="preview" label="Preview" icon={FaEye} />
      </div>

      {/* Tab Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          {activeTab === 'basic' && renderBasicInfoTab()}
          {activeTab === 'media' && renderMediaTab()}
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'preview' && renderPreviewTab()}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {activeTab !== 'preview' && 'Fill out all tabs to complete your tutorial'}
          </div>
          {/* API Test Button - remove in production */}
          <button
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:5000/api/tutorials');
                const status = response.ok ? 'Connected' : 'Error';
                alert(`API Status: ${status} (${response.status})`);
              } catch (error) {
                alert('API Status: Disconnected - ' + (error as Error).message);
              }
            }}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            Test API
          </button>
        </div>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          
          <Button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting || !formData.title || !formData.description || !formData.content || !formData.author || !formData.category}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Publishing...
              </div>
            ) : (
              'Publish Tutorial'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTutorial;