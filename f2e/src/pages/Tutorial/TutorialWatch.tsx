import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/atoms/Button";
import { Card, CardContent, CardHeader } from "../../components/atoms/Card";
import { useTutorials, useTutorial } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import {
  FaPlay,
  FaArrowLeft,
  FaBookmark,
  FaRegBookmark,
  FaThumbsUp,
  FaThumbsDown,
  FaShare,
  FaDownload,
  FaList,
  FaUser,
  FaClock,
  FaStar,
  FaEye,
  FaFileAlt,
  FaComments,
  FaPrint,
  FaLightbulb,
  FaQuestionCircle,
} from "react-icons/fa";
import { YouTubeEmbed } from "react-social-media-embed";
import { cn } from "../../lib/utils";

// Comment interface
interface Comment {
  _id: string;
  tutorialId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies?: Comment[];
}

export const TutorialWatch: React.FC = () => {
  const { tutorialId } = useParams<{ tutorialId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { tutorials } = useTutorials(); // For related tutorials
  const { tutorial, isLoading, error } = useTutorial(tutorialId); // For current tutorial

  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "comments" | "resources"
  >("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userNotes, setUserNotes] = useState("");
  const [watchProgress, setWatchProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  
  // Comment state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    // Load user progress and preferences
    if (tutorial && isAuthenticated) {
      // Load saved progress, bookmarks, notes from localStorage or API
      const savedProgress = localStorage.getItem(
        `tutorial_progress_${tutorialId}`
      );
      if (savedProgress) {
        setWatchProgress(parseFloat(savedProgress));
      }

      const savedNotes = localStorage.getItem(`tutorial_notes_${tutorialId}`);
      if (savedNotes) {
        setUserNotes(savedNotes);
      }

      const savedBookmark = localStorage.getItem(
        `tutorial_bookmark_${tutorialId}`
      );
      if (savedBookmark) {
        setIsBookmarked(JSON.parse(savedBookmark));
      }
    }
  }, [tutorial, tutorialId, isAuthenticated]);

  // Mock comments function
  const getMockComments = useCallback((): Comment[] => {
    return [
      {
        _id: '1',
        tutorialId: tutorialId || '',
        userId: 'user1',
        userName: 'John Doe',
        userAvatar: '/assets/student/default-avatar.png',
        content: 'Great tutorial! Very helpful and easy to follow. The examples were particularly useful.',
        createdAt: '2024-10-20T10:30:00Z',
        updatedAt: '2024-10-20T10:30:00Z',
        likes: 5
      },
      {
        _id: '2',
        tutorialId: tutorialId || '',
        userId: 'user2',
        userName: 'Sarah Smith',
        userAvatar: '/assets/student/default-avatar.png',
        content: 'Thanks for this tutorial. Could you please add more advanced examples in the next one?',
        createdAt: '2024-10-19T15:45:00Z',
        updatedAt: '2024-10-19T15:45:00Z',
        likes: 3
      },
      {
        _id: '3',
        tutorialId: tutorialId || '',
        userId: 'user3',
        userName: 'Mike Johnson',
        userAvatar: '/assets/student/default-avatar.png',
        content: 'Perfect explanation! I was struggling with this concept and now it makes perfect sense.',
        createdAt: '2024-10-18T09:15:00Z',
        updatedAt: '2024-10-18T09:15:00Z',
        likes: 8
      }
    ];
  }, [tutorialId]);

  // Load comments when tutorial changes
  useEffect(() => {
    const loadCommentsData = async () => {
      if (!tutorialId) return;
      
      setCommentsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/tutorials/${tutorialId}/comments`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setComments(result.data || result || []);
      } catch (error) {
        console.error('Error loading comments:', error);
        // For now, use mock comments if API fails
        setComments(getMockComments());
      } finally {
        setCommentsLoading(false);
      }
    };

    if (tutorialId) {
      loadCommentsData();
    }
  }, [tutorialId, getMockComments]);

  const toggleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    if (isAuthenticated && tutorialId) {
      localStorage.setItem(
        `tutorial_bookmark_${tutorialId}`,
        JSON.stringify(newBookmarkState)
      );
    }
  };

  const saveNotes = () => {
    if (isAuthenticated && tutorialId) {
      localStorage.setItem(`tutorial_notes_${tutorialId}`, userNotes);
      alert("Notes saved successfully!");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tutorial?.title || "Tutorial",
        text: tutorial?.shortDescription || tutorial?.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Tutorial link copied to clipboard!");
    }
  };

  const toggleLike = async () => {
    if (!tutorialId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/tutorials/${tutorialId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          action: isLiked ? 'unlike' : 'like'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Like API response:', result);
      
      // Update UI state
      setIsLiked(!isLiked);
      if (isDisliked) setIsDisliked(false);
      
      // Optionally show success message
      // alert(isLiked ? 'Tutorial unliked!' : 'Tutorial liked!');
      
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like status. Please try again.');
    }
  };

  const toggleDislike = async () => {
    if (!tutorialId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/tutorials/${tutorialId}/unlike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          action: isDisliked ? 'undislike' : 'dislike'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Dislike API response:', result);
      
      // Update UI state
      setIsDisliked(!isDisliked);
      if (isLiked) setIsLiked(false);
      
      // Optionally show success message
      // alert(isDisliked ? 'Tutorial undisliked!' : 'Tutorial disliked!');
      
    } catch (error) {
      console.error('Error toggling dislike:', error);
      alert('Failed to update dislike status. Please try again.');
    }
  };

  // Comment management functions
  const submitComment = async () => {
    if (!newComment.trim() || !tutorialId || !isAuthenticated) return;
    
    setIsSubmittingComment(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tutorials/${tutorialId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          content: newComment.trim(),
          userId: 'current-user-id', // Replace with actual user ID
          userName: 'Current User' // Replace with actual user name
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Add new comment to the list
      const newCommentObj: Comment = {
        _id: result._id || Date.now().toString(),
        tutorialId: tutorialId,
        userId: 'current-user-id',
        userName: 'Current User',
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      
      alert('Comment posted successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaQuestionCircle className="text-6xl text-red-300 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Error Loading Tutorial
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => navigate("/tutorial")}>
              Back to Tutorials
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaFileAlt className="text-6xl text-gray-300 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Tutorial Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The tutorial you're looking for doesn't exist or may have been
            removed.
          </p>
          <Button onClick={() => navigate("/tutorial")}>
            Back to Tutorials
          </Button>
        </div>
      </div>
    );
  }

  // Show loading while tutorial is being fetched
  if (isLoading || !tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="aspect-video">
                {tutorial.videoUrl ? (
                  <YouTubeEmbed
                    url={`https://www.youtube.com/watch?v=${tutorial.videoUrl}`}
                    width={"100%"}
                    height={540}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <div className="text-center">
                      <FaPlay className="text-6xl text-gray-400 mb-4 mx-auto" />
                      <p className="text-gray-500">
                        Video content not available
                      </p>
                      <p className="text-sm text-gray-400">
                        Check back later for video content
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Info */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {tutorial.title || "Tutorial"}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {tutorial.description || "No description available"}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaEye className="mr-2" />
                        {(tutorial.totalViews || 0).toLocaleString()} views
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2" />
                        {tutorial.duration || "15 min"}
                      </div>
                      <div className="flex items-center">
                        <FaStar className="mr-2 text-yellow-400" />
                        {tutorial.rating || 0} ratings
                      </div>
                      <button
                        onClick={toggleLike}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-lg border transition-colors",
                          isLiked
                            ? "bg-green-50 border-green-200 text-green-600"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <FaThumbsUp className="mr-2" />
                        Like
                      </button>

                      <button
                        onClick={toggleDislike}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-lg border transition-colors",
                          isDisliked
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <FaThumbsDown className="mr-2" />
                        Dislike
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/tutorial")}
                    >
                      <FaArrowLeft className="mr-2" />
                      Back to Tutorials
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Your Progress
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(watchProgress)}% complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${watchProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src="/assets/trainer/default-trainer.png"
                    alt={tutorial.author || "Instructor"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {tutorial.author || "Unknown Author"}
                    </h3>
                    <p className="text-sm text-gray-600">Expert Author</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <div className="border-b">
                <div className="flex space-x-8 px-6">
                  {[
                    { id: "overview", label: "Overview", icon: FaList },
                    { id: "notes", label: "My Notes", icon: FaFileAlt },
                    { id: "comments", label: "Comments", icon: FaComments },
                    { id: "resources", label: "Resources", icon: FaDownload },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() =>
                        setActiveTab(
                          id as "overview" | "notes" | "comments" | "resources"
                        )
                      }
                      className={cn(
                        "flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors",
                        activeTab === id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <Icon className="mr-2" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <CardContent className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        What You'll Learn
                      </h3>
                      <ul className="space-y-2">
                        {[
                          "Master the core concepts and fundamentals",
                          "Apply practical skills through hands-on exercises",
                          "Understand best practices and industry standards",
                          "Build confidence with real-world examples",
                        ].map((item, index) => (
                          <li key={index} className="flex items-start">
                            <FaLightbulb className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Prerequisites
                      </h3>
                      <p className="text-gray-700">
                        Basic understanding of programming concepts would be
                        helpful but not required. This tutorial is designed for
                        beginners and intermediate learners.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Tutorial Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-500">Level:</span>
                          <span className="ml-2 font-medium">
                            {tutorial.level || "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="ml-2 font-medium">
                            {tutorial.category || "General"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="ml-2 font-medium">
                            {tutorial.duration || "15 min"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Likes:</span>
                          <span className="ml-2 font-medium">
                            {(tutorial.totalLikes || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">My Notes</h3>
                      <Button
                        onClick={saveNotes}
                        size="sm"
                        disabled={!isAuthenticated}
                      >
                        Save Notes
                      </Button>
                    </div>

                    {isAuthenticated ? (
                      <textarea
                        value={userNotes}
                        onChange={(e) => setUserNotes(e.target.value)}
                        placeholder="Take notes while watching the tutorial..."
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="text-center py-8">
                        <FaUser className="text-4xl text-gray-300 mb-4 mx-auto" />
                        <p className="text-gray-500 mb-4">
                          Please log in to take notes
                        </p>
                        <Button onClick={() => navigate("/login")}>
                          Log In
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "comments" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
                    </div>

                    {/* Comment Form */}
                    {isAuthenticated ? (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="font-medium mb-3">Add a Comment</h4>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your thoughts about this tutorial..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-gray-500">
                            {newComment.length}/500 characters
                          </span>
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setNewComment('')}
                              disabled={!newComment.trim() || isSubmittingComment}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={submitComment}
                              disabled={!newComment.trim() || isSubmittingComment}
                            >
                              {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                        <FaUser className="text-2xl text-gray-400 mb-2 mx-auto" />
                        <p className="text-gray-600 mb-3">Please log in to post a comment</p>
                        <Button size="sm" onClick={() => navigate('/login')}>
                          Log In
                        </Button>
                      </div>
                    )}

                    {/* Comments List */}
                    {commentsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <div className="flex space-x-3">
                              <img
                                src={comment.userAvatar || '/assets/student/default-avatar.png'}
                                alt={comment.userName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h5 className="font-medium text-gray-900">{comment.userName}</h5>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                  {comment.content}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <button className="flex items-center hover:text-blue-600 transition-colors">
                                    <FaThumbsUp className="mr-1" />
                                    {comment.likes} likes
                                  </button>
                                  <button className="hover:text-gray-700 transition-colors">
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FaComments className="text-4xl text-gray-300 mb-4 mx-auto" />
                        <p className="text-gray-500 mb-2">
                          No comments yet
                        </p>
                        <p className="text-sm text-gray-400">
                          Be the first to share your thoughts about this tutorial!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "resources" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Tutorial Resources
                    </h3>
                    <div className="space-y-4">
                      {tutorial.downloadUrl ? (
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <FaDownload className="text-blue-600 mr-3" />
                            <div>
                              <h4 className="font-medium">
                                Tutorial Resources
                              </h4>
                              <p className="text-sm text-gray-500">
                                Download additional materials
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              window.open(tutorial.downloadUrl, "_blank")
                            }
                          >
                            Download
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FaFileAlt className="text-4xl text-gray-300 mb-4 mx-auto" />
                          <p className="text-gray-500">
                            No additional resources available for this tutorial
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Related Tutorials */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Related Tutorials</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tutorials
                      .filter(
                        (t) =>
                          t._id !== tutorialId &&
                          t.category === tutorial?.category
                      )
                      .slice(0, 3)
                      .map((relatedTutorial) => (
                        <Link
                          key={relatedTutorial._id}
                          to={`/tutorials/${relatedTutorial._id}`}
                          className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <img
                            src={
                              relatedTutorial.thumbnailUrl ||
                              "/assets/topics/default-tutorial.png"
                            }
                            alt={relatedTutorial.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-2 mb-1">
                              {relatedTutorial.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {relatedTutorial.author ||
                                "Unknown Author"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(relatedTutorial.totalViews || 0).toLocaleString()}{" "}
                              views
                            </p>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Quick Actions</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.print()}
                    >
                      <FaPrint className="mr-2" />
                      Print Tutorial
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleShare}
                    >
                      <FaShare className="mr-2" />
                      Share Tutorial
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={toggleBookmark}
                    >
                      {isBookmarked ? (
                        <FaBookmark className="mr-2" />
                      ) : (
                        <FaRegBookmark className="mr-2" />
                      )}
                      {isBookmarked ? "Remove Bookmark" : "Bookmark"}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs bg-blue-50 border-blue-200 text-blue-700"
                      onClick={async () => {
                        try {
                          const testTutorialId =
                            tutorialId || "507f1f77bcf86cd799439011";
                          const response = await fetch(
                            `http://localhost:5000/api/tutorials/${testTutorialId}`
                          );
                          const data = await response.json();
                          console.log("Tutorial API Test:", data);
                          alert(
                            `Tutorial API Status: ${
                              response.ok ? "Connected" : "Error"
                            } (${response.status})`
                          );
                        } catch (error) {
                          alert(
                            "Tutorial API Status: Disconnected - " +
                              (error as Error).message
                          );
                        }
                      }}
                    >
                      <FaQuestionCircle className="mr-2" />
                      Test Tutorial API
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialWatch;
