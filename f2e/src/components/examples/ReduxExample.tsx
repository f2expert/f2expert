import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  loginUser, 
  logoutUser, 
  checkAuthStatus, 
  clearError 
} from '../../store/slices/authSlice';
import { 
  fetchCourses, 
  enrollInCourse 
} from '../../store/slices/coursesSlice';
import { 
  fetchUserProfile, 
  fetchUserAchievements 
} from '../../store/slices/userSlice';

// Example component showing Redux Toolkit usage
export const ReduxExample: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Select state from different slices
  const { user, isAuthenticated, isLoading: authLoading, error: authError } = useAppSelector(state => state.auth);
  const { courses, isLoading: coursesLoading } = useAppSelector(state => state.courses);
  const { profile, achievements, isLoading: userLoading } = useAppSelector(state => state.user);

  // Check auth status on component mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Fetch courses when component mounts
  useEffect(() => {
    dispatch(fetchCourses({}));
  }, [dispatch]);

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchUserProfile(user.id));
      dispatch(fetchUserAchievements(user.id));
    }
  }, [dispatch, isAuthenticated, user]);

  // Handle login
  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ 
        email: 'john@example.com', 
        password: 'password123' 
      })).unwrap();
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      console.log('Logout successful!');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle course enrollment
  const handleEnrollCourse = async (courseId: string) => {
    try {
      await dispatch(enrollInCourse(courseId)).unwrap();
      console.log('Enrolled successfully!');
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  // Clear auth error
  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Redux Toolkit with Async Thunks Example</h1>

      {/* Auth Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {authError}
            <button 
              onClick={handleClearError}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {authLoading ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <div>
            <p className="mb-2">Welcome, {user?.name}!</p>
            <p className="mb-4 text-gray-600">{user?.email}</p>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login (Demo)
          </button>
        )}
      </div>

      {/* User Profile Section */}
      {isAuthenticated && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          
          {userLoading ? (
            <p>Loading profile...</p>
          ) : profile ? (
            <div>
              <p><strong>Level:</strong> {profile.level}</p>
              <p><strong>Total Courses:</strong> {profile.totalCourses}</p>
              <p><strong>Completed:</strong> {profile.completedCourses}</p>
              <p><strong>Learning Hours:</strong> {profile.totalHours}</p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="border rounded p-3 text-center">
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No profile data</p>
          )}
        </div>
      )}

      {/* Courses Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
        
        {coursesLoading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course._id} className="border rounded p-4">
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                <p className="text-sm"><strong>Instructor:</strong> {course.instructor}</p>
                <p className="text-sm"><strong>Level:</strong> {course.level}</p>
                <p className="text-sm"><strong>Duration:</strong> {course.duration}</p>
                <p className="text-sm"><strong>Price:</strong> {course.currency}{course.price}</p>
                
                {isAuthenticated && (
                  <button 
                    onClick={() => handleEnrollCourse(course._id)}
                    className="mt-3 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Enroll
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReduxExample;