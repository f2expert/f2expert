import React, { useState } from 'react';
import { 
  Eye, 
  BookOpen, 
  User, 
  Clock, 
  Calendar, 
  DollarSign, 
  Star, 
  Users, 
  Monitor, 
  CheckCircle2, 
  XCircle,
  Award,
  Target,
  FileText,
  HelpCircle,
  Briefcase,
  Globe,
  ChevronRight,
  ImageIcon
} from 'lucide-react';

import { Button } from '../../atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Badge } from '../../atoms/Badge';

import { type Course } from '../../../services/courseManagementApi';

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

interface ViewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const ViewCourseModal: React.FC<ViewCourseModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset image error when modal opens or course changes
  React.useEffect(() => {
    if (isOpen) {
      setImageError(false);
    }
  }, [isOpen, course.thumbnailUrl]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center text-xl font-semibold">
            <Eye className="mr-2 h-5 w-5" />
            Course Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
          {/* Header Section with Status */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {course.title}
                  </h2>
                  {course.isFeatured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-2">Course ID: {course._id}</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {course.shortDescription}
                </p>
              </div>
              <div className="text-right ml-6">
                <Badge 
                  className={`${getStatusColor(course.status)} mb-2`}
                >
                  <div className="flex items-center">
                    {course.isPublished ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {course.status || (course.isPublished ? 'Published' : 'Draft')}
                  </div>
                </Badge>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-end">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {course.rating.toFixed(1)} ({course.totalStudents} students)
                  </div>
                  <div className="flex items-center justify-end">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="mt-4">
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {course.thumbnailUrl && !imageError ? (
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                      <ImageIcon className="h-12 w-12 mb-2" />
                      <span className="text-sm">
                        {course.thumbnailUrl ? 'Thumbnail not available' : 'No thumbnail set'}
                      </span>
                      {course.thumbnailUrl && (
                        <span className="text-xs text-gray-400 mt-1">Failed to load image</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gray-50">
                  <p className="text-sm text-gray-600">Course Thumbnail</p>
                  {course.thumbnailUrl ? (
                    <p className="text-xs text-gray-500 truncate mt-1" title={course.thumbnailUrl}>
                      {course.thumbnailUrl}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">No thumbnail URL provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded border p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{course.totalEnrollments}</div>
                <div className="text-xs text-gray-600">Enrollments</div>
              </div>
              <div className="bg-white rounded border p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{formatPrice(course.price, course.currency)}</div>
                <div className="text-xs text-gray-600">Price</div>
              </div>
              <div className="bg-white rounded border p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{course.totalLectures}</div>
                <div className="text-xs text-gray-600">Lectures</div>
              </div>
              <div className="bg-white rounded border p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">{course.totalHours}h</div>
                <div className="text-xs text-gray-600">Duration</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Information */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Course Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub Category:</span>
                  <span className="font-medium">{course.subCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-medium flex items-center">
                    <Monitor className="h-4 w-4 mr-1" />
                    {course.mode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= course.difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Information */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Instructor Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{course.instructor}</span>
                </div>
                {course.instructorBio && (
                  <div>
                    <span className="text-gray-600 block mb-1">Bio:</span>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {course.instructorBio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Enrollment */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Pricing & Enrollment
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatPrice(course.price, course.currency)}
                  </span>
                </div>
                {course.originalPrice !== course.price && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="font-medium text-gray-500 line-through">
                      {formatPrice(course.originalPrice, course.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Students:</span>
                  <span className="font-medium">{course.minStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Students:</span>
                  <span className="font-medium">{course.maxStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enrollment Period:</span>
                  <span className="font-medium text-sm">
                    {formatDate(course.enrollmentStartDate)} - {formatDate(course.enrollmentEndDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Schedule */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Course Schedule
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{formatDate(course.courseStartDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">{formatDate(course.courseEndDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">{course.totalHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Lectures:</span>
                  <span className="font-medium">{course.totalLectures} lectures</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Features */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Course Features
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`flex items-center p-2 rounded ${course.certificateProvided ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Award className={`h-4 w-4 mr-2 ${course.certificateProvided ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Certificate</span>
              </div>
              <div className={`flex items-center p-2 rounded ${course.hasProjects ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Briefcase className={`h-4 w-4 mr-2 ${course.hasProjects ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Projects</span>
              </div>
              <div className={`flex items-center p-2 rounded ${course.hasAssignments ? 'bg-green-50' : 'bg-gray-50'}`}>
                <FileText className={`h-4 w-4 mr-2 ${course.hasAssignments ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Assignments</span>
              </div>
              <div className={`flex items-center p-2 rounded ${course.hasQuizzes ? 'bg-green-50' : 'bg-gray-50'}`}>
                <HelpCircle className={`h-4 w-4 mr-2 ${course.hasQuizzes ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Quizzes</span>
              </div>
              <div className={`flex items-center p-2 rounded ${course.supportProvided ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Users className={`h-4 w-4 mr-2 ${course.supportProvided ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Support</span>
              </div>
              <div className={`flex items-center p-2 rounded ${course.jobAssistance ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Briefcase className={`h-4 w-4 mr-2 ${course.jobAssistance ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Job Assistance</span>
              </div>
            </div>
          </div>

          {/* Technologies & Prerequisites */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Monitor className="mr-2 h-5 w-5" />
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.technologies.length > 0 ? (
                  course.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None specified</span>
                )}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Prerequisites
              </h3>
              <div className="space-y-2">
                {course.prerequisites.length > 0 ? (
                  course.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{prereq}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No prerequisites</span>
                )}
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Learning Outcomes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {course.learningOutcomes.length > 0 ? (
                course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{outcome}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No learning outcomes specified</span>
              )}
            </div>
          </div>

          {/* Course Description */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Course Description
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>
          </div>

          {/* Course Modules */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Course Content
              {/* Debug info */}
              <span className="ml-2 text-xs text-gray-400">
                ({(() => {
                  const courseWithModules = course as Course & { modules?: Module[] };
                  return courseWithModules.modules ? `${courseWithModules.modules.length} modules` : 'No modules';
                })()})
              </span>
            </h3>
            {(() => {
              const courseWithModules = course as Course & { modules?: Module[] };
              
              if (!courseWithModules.modules || courseWithModules.modules.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm">No course modules available</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Course content will be displayed here once modules are added
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {courseWithModules.modules.map((module, moduleIndex) => (
                    <div key={module.id || moduleIndex} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Module {moduleIndex + 1}: {module.title || 'Untitled Module'}
                      </h4>
                      {module.description && (
                        <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                      )}
                      <div className="space-y-2">
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id || lessonIndex} className="flex items-center bg-gray-50 rounded p-3">
                              <Monitor className="mr-3 h-4 w-4 text-blue-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Lesson {lessonIndex + 1}: {lesson.title || 'Untitled Lesson'}
                                </p>
                                {lesson.description && (
                                  <p className="text-xs text-gray-500 mt-1">{lesson.description}</p>
                                )}
                                {lesson.videoUrl && (
                                  <div className="flex items-center mt-1">
                                    <Globe className="mr-1 h-3 w-3 text-blue-400" />
                                    <span className="text-xs text-blue-600">Video Available</span>
                                  </div>
                                )}
                              </div>
                              {lesson.duration && (
                                <div className="flex items-center text-xs text-gray-400">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {lesson.duration}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-400">
                            <p className="text-xs">No lessons in this module</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-medium">{formatDate(course.createdAt)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium">{formatDate(course.updatedAt)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Version</p>
                <p className="font-medium">v{course.__v || 1}</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Fixed Footer - Always visible at bottom */}
        <div className="flex-shrink-0 flex justify-end pt-4 border-t mt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ViewCourseModal };