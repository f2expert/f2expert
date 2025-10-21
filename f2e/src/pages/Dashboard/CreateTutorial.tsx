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
  shortDescription: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  duration: string;
  videoType: 'upload' | 'youtube' | 'external';
  videoUrl: string;
  videoFile: File | null;
  thumbnailFile: File | null;
  thumbnailUrl: string;
  downloadableResources: string;
  tags: string;
  isFree: boolean;
  isPublished: boolean;
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

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Hindi',
  'Arabic'
];

export const CreateTutorial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'content' | 'preview'>('basic');
  const [formData, setFormData] = useState<TutorialFormData>({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    level: 'Beginner',
    language: 'English',
    duration: '',
    videoType: 'upload',
    videoUrl: '',
    videoFile: null,
    thumbnailFile: null,
    thumbnailUrl: '',
    downloadableResources: '',
    tags: '',
    isFree: true,
    isPublished: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState<string>('');

  const handleInputChange = (field: keyof TutorialFormData, value: string | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    
    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'videoFile' && key !== 'thumbnailFile' && value !== null) {
          submitData.append(key, value.toString());
        }
      });

      // Add files
      if (formData.videoFile) {
        submitData.append('video', formData.videoFile);
      }
      if (formData.thumbnailFile) {
        submitData.append('thumbnail', formData.thumbnailFile);
      }

      submitData.append('isPublished', (!isDraft).toString());

      // TODO: Replace with actual API call
      console.log('Tutorial submission data:', {
        ...formData,
        isPublished: !isDraft,
        videoFile: formData.videoFile?.name,
        thumbnailFile: formData.thumbnailFile?.name
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(isDraft ? 'Tutorial saved as draft!' : 'Tutorial published successfully!');
      
      // Reset form or redirect
      // navigate('/dashboard/tutorials');
      
    } catch (error) {
      console.error('Error submitting tutorial:', error);
      alert('Error submitting tutorial. Please try again.');
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <FormInput
            type="text"
            value={formData.duration}
            onChange={(value) => handleInputChange('duration', value)}
            placeholder="e.g., 15 mins, 1 hour"
          />
        </div>
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
          placeholder="Enter tags separated by commas (e.g., react, javascript, frontend)"
        />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
              <span className="text-gray-500">Duration:</span>
              <span className="ml-2 font-medium">{formData.duration || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-gray-500">Language:</span>
              <span className="ml-2 font-medium">{formData.language}</span>
            </div>
            <div>
              <span className="text-gray-500">Access:</span>
              <span className={`ml-2 font-medium ${
                formData.isFree ? 'text-green-600' : 'text-blue-600'
              }`}>
                {formData.isFree ? 'Free' : 'Paid'}
              </span>
            </div>
          </div>
          
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
          {formData.duration && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
              <FaClock className="inline mr-1" />
              {formData.duration}
            </div>
          )}
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
              { field: 'category', label: 'Category', required: true },
              { field: 'videoUrl', label: 'Video Source', required: formData.videoType !== 'upload' },
              { field: 'videoFile', label: 'Video File', required: formData.videoType === 'upload' }
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
    <div className="max-w-6xl mx-auto p-6">
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
        <div className="text-sm text-gray-500">
          {activeTab !== 'preview' && 'Fill out all tabs to complete your tutorial'}
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
            disabled={isSubmitting || !formData.title || !formData.description || !formData.category}
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