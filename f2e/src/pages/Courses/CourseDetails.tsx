import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { Card, CardContent, CardHeader } from '../../components/atoms/Card';
import { Skeleton } from '../../components/atoms/Skeleton';
import { useCourses } from '../../hooks';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaPlay, 
  FaClock, 
  FaUsers, 
  FaStar, 
  FaUser, 
  FaCalendarAlt, 
  FaBookOpen, 
  FaCheck, 
  FaHeart, 
  FaShare, 
  FaArrowLeft,
  FaCertificate,
  FaProjectDiagram,
  FaBriefcase,
  FaHeadset,
  FaMobile,
  FaVideo,
  FaFileAlt,
  FaQuestionCircle,
  FaTrophy,
  FaThumbsUp
} from 'react-icons/fa';
import { cn } from '../../lib/utils';

// Review interfaces
interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  verifiedReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  reportedReviews: number;
}

interface Review {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    instructor: string;
    category: string;
  };
  userId: {
    _id: string;
    email: string;
    photo?: string;
  };
  content: string;
  rating: number;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  isAnonymous: boolean;
  helpfulVotes: string[];
  unhelpfulVotes: string[];
  helpfulCount: number;
  unhelpfulCount: number;
  isReported: boolean;
  reportCount: number;
  isDeleted: boolean;
  isEdited: boolean;
  reports: unknown[];
  editHistory: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// StarRating component moved outside to prevent re-renders
const StarRating = ({ rating, onRatingChange, readonly = false }: { 
  rating: number; 
  onRatingChange?: (rating: number) => void; 
  readonly?: boolean 
}) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          className={cn(
            'text-2xl transition-colors',
            readonly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-400',
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          )}
          disabled={readonly}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
};

export const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { currentCourse, isLoading, error, loadCourseById, enroll, isEnrolling } = useCourses();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  
  // Review state
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);

  // Load course details
  useEffect(() => {
    if (courseId) {
      loadCourseById(courseId);
    }
  }, [courseId, loadCourseById]);

  // Extract review data from course response
  useEffect(() => {
    if (currentCourse && 'reviewData' in currentCourse) {
      const courseWithReviews = currentCourse as typeof currentCourse & {
        reviewData: {
          stats: ReviewStats;
          recentReviews: Review[];
          hasMoreReviews: boolean;
        };
      };
      setReviewStats(courseWithReviews.reviewData.stats);
      setReviews(courseWithReviews.reviewData.recentReviews || []);
    }
  }, [currentCourse]);


  // Early return if no courseId
  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaQuestionCircle className="text-6xl text-red-300 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Invalid Course URL</h2>
          <p className="text-gray-500 mb-6">No course ID provided in the URL.</p>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!courseId) return;

    const result = await enroll(courseId);
    if (result.success) {
      alert('Successfully enrolled in the course!');
      setShowEnrollDialog(false);
    } else {
      alert(`Enrollment failed: ${result.error}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentCourse?.title || 'Course',
        text: currentCourse?.shortDescription || currentCourse?.description || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Course link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!courseId || reviewRating === 0 || !reviewComment.trim()) {
      alert('Please provide both rating and comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          content: reviewComment.trim(),
          userId: user?.id,
          courseId: courseId,
          // Add any additional fields that the API expects
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      
      // Refresh course data to get updated reviews
      if (courseId) {
        loadCourseById(courseId);
      }
      
      setShowReviewDialog(false);
      setReviewRating(0);
      setReviewComment('');
      
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return <CourseDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaQuestionCircle className="text-6xl text-red-300 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Course</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBookOpen className="text-6xl text-gray-300 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const course = currentCourse;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-purple-600">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-purple-600">Courses</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/courses')}
                  className="mr-4 border-white text-white hover:bg-white hover:text-purple-600"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </Button>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  course.level === 'Beginner' ? 'bg-green-500 text-white' :
                  course.level === 'Intermediate' ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6 opacity-90">
                {course.shortDescription || course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(course.rating) ? '' : 'text-gray-400'} />
                    ))}
                  </div>
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-300 ml-2">({course.totalStudents.toLocaleString()} students)</span>
                </div>
                
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>{course.instructor}</span>
                </div>

                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>Last updated: {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Course Features */}
              <div className="flex flex-wrap gap-3">
                {course.certificateProvided && (
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                    <FaCertificate className="mr-2" />
                    <span className="text-sm">Certificate</span>
                  </div>
                )}
                {course.hasProjects && (
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                    <FaProjectDiagram className="mr-2" />
                    <span className="text-sm">Live Projects</span>
                  </div>
                )}
                {course.jobAssistance && (
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                    <FaBriefcase className="mr-2" />
                    <span className="text-sm">Job Assistance</span>
                  </div>
                )}
                {course.supportProvided && (
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                    <FaHeadset className="mr-2" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Preview & Enrollment */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <div className="relative">
                  <img
                    src={course.thumbnailUrl || '/assets/topics/default-course.png'}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-t-lg cursor-pointer">
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                      <FaPlay className="mr-2" /> Preview Course
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {course.currency}{course.price}
                    </div>
                    <div className="text-gray-500 line-through text-lg">
                      {course.currency}{Math.round(course.price * 1.3)}
                    </div>
                    <div className="text-green-600 font-semibold">
                      Save {Math.round(((course.price * 1.3 - course.price) / (course.price * 1.3)) * 100)}%
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 text-black">
                    <Button
                      onClick={() => setShowEnrollDialog(true)}
                      className="w-full"
                      size="lg"
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={cn(
                          'flex items-center justify-center',
                          isWishlisted && 'text-red-600 border-red-600'
                        )}
                      >
                        <FaHeart className={cn('mr-2', isWishlisted && 'fill-current')} />
                        Wishlist
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleShare}
                        className="flex items-center justify-center"
                      >
                        <FaShare className="mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="text-gray-500">
                    <h3 className="font-semibold mb-3">This course includes:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <FaVideo className="text-purple-600 mr-3" />
                        <span>{course.duration} of video content</span>
                      </div>
                      <div className="flex items-center">
                        <FaFileAlt className="text-purple-600 mr-3" />
                        <span>Downloadable resources</span>
                      </div>
                      <div className="flex items-center">
                        <FaMobile className="text-purple-600 mr-3" />
                        <span>Access on mobile and TV</span>
                      </div>
                      <div className="flex items-center">
                        <FaCertificate className="text-purple-600 mr-3" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center">
                        <FaTrophy className="text-purple-600 mr-3" />
                        <span>Lifetime access</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex flex-wrap border-b mb-8">
                {[
                  { id: 'overview', label: 'Overview', icon: FaBookOpen },
                  { id: 'curriculum', label: 'Curriculum', icon: FaPlay },
                  { id: 'instructor', label: 'Instructor', icon: FaUser },
                  { id: 'reviews', label: 'Reviews', icon: FaStar }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as 'overview' | 'curriculum' | 'instructor' | 'reviews')}
                    className={cn(
                      'flex items-center px-6 py-3 font-medium border-b-2 transition-colors',
                      activeTab === id
                        ? 'text-purple-600 border-purple-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    )}
                  >
                    <Icon className="mr-2" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{course.description}</p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Master the fundamentals and advanced concepts',
                        'Build real-world projects from scratch',
                        'Industry best practices and standards',
                        'Problem-solving and debugging techniques',
                        'Performance optimization strategies',
                        'Deployment and production considerations'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <FaCheck className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Basic computer knowledge</li>
                      <li>• Access to a computer with internet connection</li>
                      <li>• Willingness to learn and practice</li>
                      <li>• No prior experience required - we'll teach you everything!</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                  <div className="space-y-4">
                    {/* Mock curriculum - replace with actual data */}
                    {Array.from({ length: 8 }, (_, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Module {i + 1}: Introduction to Advanced Concepts</h3>
                            <span className="text-sm text-gray-500">5 lectures • 45 min</span>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {Array.from({ length: 3 }, (_, j) => (
                              <div key={j} className="flex items-center justify-between py-2 hover:bg-gray-50 px-3 rounded">
                                <div className="flex items-center">
                                  <FaPlay className="text-purple-600 mr-3 text-sm" />
                                  <span className="text-sm">Lecture {j + 1}: Core Fundamentals</span>
                                </div>
                                <span className="text-xs text-gray-500">12:30</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'instructor' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">About the Instructor</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-6">
                        <img
                          src="/assets/trainer/default-trainer.png"
                          alt={course.instructor}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{course.instructor}</h3>
                          <p className="text-gray-600 mb-4">Senior Software Engineer & Technical Trainer</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center">
                              <FaUsers className="text-purple-600 mr-2" />
                              <span className="text-sm">10,000+ Students</span>
                            </div>
                            <div className="flex items-center">
                              <FaStar className="text-yellow-500 mr-2" />
                              <span className="text-sm">4.8 Rating</span>
                            </div>
                            <div className="flex items-center">
                              <FaBookOpen className="text-purple-600 mr-2" />
                              <span className="text-sm">25 Courses</span>
                            </div>
                            <div className="flex items-center">
                              <FaTrophy className="text-purple-600 mr-2" />
                              <span className="text-sm">5+ Years Experience</span>
                            </div>
                          </div>

                          <p className="text-gray-700">
                            An experienced professional with extensive knowledge in software development 
                            and training. Passionate about sharing knowledge and helping students achieve 
                            their career goals in technology.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Student Reviews</h2>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowReviewDialog(true)}
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? 'Write a Review' : 'Login to Review'}
                    </Button>
                  </div>

                  {/* Rating Summary */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold mb-2">
                            {reviewStats?.averageRating || course.rating || 0}
                          </div>
                          <div className="flex text-yellow-400 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < Math.floor(reviewStats?.averageRating || course.rating || 0) ? '' : 'text-gray-300'} 
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reviewStats?.totalReviews || 0} Review{(reviewStats?.totalReviews || 0) !== 1 ? 's' : ''}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviewStats?.ratingDistribution?.[star.toString() as keyof typeof reviewStats.ratingDistribution] || 0;
                            const total = reviewStats?.totalReviews || 1;
                            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                            
                            return (
                              <div key={star} className="flex items-center mb-1">
                                <span className="text-sm w-3">{star}</span>
                                <FaStar className="text-yellow-400 mx-2" />
                                <div className="flex-1 h-2 bg-gray-200 rounded">
                                  <div 
                                    className="h-full bg-yellow-400 rounded" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm ml-2 w-8">{percentage}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => {
                        // Extract user name from email if available
                        const userName = review.isAnonymous 
                          ? 'Anonymous User' 
                          : review.userId.email.split('@')[0] || 'User';
                        
                        return (
                          <Card key={review._id}>
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={review.userId.photo || '/assets/student/default-student.png'}
                                  alt={userName}
                                  className="w-12 h-12 rounded-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/assets/student/default-student.png';
                                  }}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <h4 className="font-semibold capitalize">{userName}</h4>
                                      {review.isVerifiedPurchase && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                          <FaCheck className="mr-1 text-xs" />
                                          Verified Purchase
                                        </span>
                                      )}
                                      {review.isEdited && (
                                        <span className="text-xs text-gray-400">(edited)</span>
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex text-yellow-400 mb-2">
                                    <StarRating rating={review.rating} readonly />
                                  </div>
                                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{review.content}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <button className="flex items-center hover:text-blue-600 transition-colors">
                                      <FaThumbsUp className="mr-1" />
                                      Helpful ({review.helpfulCount})
                                    </button>
                                    {review.unhelpfulCount > 0 && (
                                      <span className="flex items-center">
                                        <FaThumbsUp className="mr-1 rotate-180" />
                                        {review.unhelpfulCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <FaStar className="text-4xl text-gray-300 mb-4 mx-auto" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-500 mb-6">Be the first to review this course and help other students!</p>
                        {isAuthenticated && (
                          <Button onClick={() => setShowReviewDialog(true)}>
                            Write the first review
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Course Stats */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Course Stats</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Students Enrolled:</span>
                        <span className="font-semibold">{course.totalStudents.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-semibold">English</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-semibold">{course.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-semibold">{course.level}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Courses */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Related Courses</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="flex space-x-3">
                          <img
                            src="/assets/topics/default-course.png"
                            alt="Related course"
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-2">
                              Advanced {course.category} Masterclass
                            </h4>
                            <p className="text-xs text-gray-500">$599</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Confirmation Dialog */}
      {showEnrollDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <h3 className="text-xl font-bold">Confirm Enrollment</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Are you sure you want to enroll in "{course.title}" for {course.currency}{course.price}?
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={handleEnroll} 
                  disabled={isEnrolling}
                  className="flex-1"
                >
                  {isEnrolling ? 'Processing...' : 'Confirm Enrollment'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEnrollDialog(false)}
                  className="flex-1"
                  disabled={isEnrolling}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Write Review Dialog */}
      {showReviewDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-lg w-full mx-4">
            <CardHeader>
              <h3 className="text-xl font-bold">Write a Review</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <StarRating 
                    rating={reviewRating} 
                    onRatingChange={setReviewRating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this course..."
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {reviewComment.length}/1000 characters
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={handleReviewSubmit}
                  disabled={isSubmittingReview || reviewRating === 0 || !reviewComment.trim()}
                  className="flex-1"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowReviewDialog(false);
                    setReviewRating(0);
                    setReviewComment('');
                  }}
                  className="flex-1"
                  disabled={isSubmittingReview}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Skeleton loader component
const CourseDetailsSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Skeleton className="h-4 w-64" />
      </div>
    </div>

    <section className="bg-gradient-to-r from-purple-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 text-white">
            <Skeleton className="h-8 w-20 mb-4 bg-white bg-opacity-20" />
            <Skeleton className="h-10 w-3/4 mb-4 bg-white bg-opacity-20" />
            <Skeleton className="h-6 w-full mb-6 bg-white bg-opacity-20" />
            <div className="flex gap-6 mb-6">
              <Skeleton className="h-5 w-32 bg-white bg-opacity-20" />
              <Skeleton className="h-5 w-24 bg-white bg-opacity-20" />
              <Skeleton className="h-5 w-20 bg-white bg-opacity-20" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <Skeleton className="w-full h-48 rounded-t-lg" />
              <CardContent className="p-6">
                <Skeleton className="h-8 w-20 mx-auto mb-4" />
                <Skeleton className="h-12 w-full mb-4" />
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex gap-4 border-b mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default CourseDetails;