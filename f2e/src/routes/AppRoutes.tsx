import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Public } from '../components/templates/Public';
import { ErrorHandler } from '../components/molecules/ErrorHandler';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Courses } from '../pages/Courses';
import { Tutorial, TutorialWatch } from '../pages/Tutorial';
import { Dashboard, Topic, TopicDetails, CreateCourse, CreateTutorial, EnrolledCourses, StudentManagement, TrainerManagement, CourseManagement, SalaryManagement } from '../pages/Dashboard';
import { ClassManagement } from '../pages';
import { CourseDetails } from '../pages/Courses';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import Profile from '../pages/Profile';
import { FeeDetails } from '../pages/FeeDetails';
import { Notifications } from '../pages/Notifications';
import { useAuth } from '../hooks/useAuth';
import { Protected } from '../components';

export default function AppRoutes() {
  const { isAuthenticated, logout } = useAuth();

  // Handle logout properly - use window.location for navigation outside router context
  const handleLogout = () => {
    try {
      logout();
      window.location.href = '/'; // Full page reload to ensure clean state
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/'; // Still redirect even if logout fails
    }
  };

  // Dynamic menu items based on authentication status
  const getPublicMenuItems = () => {
    const baseItems = [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact Us" },
      { to: "/courses", label: "Courses" },
      { to: "/tutorial", label: "Tutorial" },
    ];

    if (isAuthenticated) {
      return [
        ...baseItems,
        { to: "/dashboard", label: "Dashboard" },
        { 
          to: "#", 
          label: "Logout", 
          onClick: handleLogout
        },
      ];
    } else {
      return [
        ...baseItems,
        { to: "/login", label: "Login" },
      ];
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Public menuItems={getPublicMenuItems()} />,
      errorElement: <ErrorHandler />,
      children: [
        { index: true, element: <Home /> },
        { path: "home", element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "courses", element: <Courses /> },
        { path: "courses/:courseId", element: <CourseDetails /> },
        { path: "tutorial", element: <Tutorial /> },
        { path: "tutorials/:tutorialId", element: <TutorialWatch /> },
      ],
    },
    {
      path: "/login",
      element: (
          <Login />
      ),
      errorElement: <ErrorHandler />,
    },
    {
      path: "/register",
      element: (
          <Register />
      ),
      errorElement: <ErrorHandler />,
    },
    {
      path: "/forgot-password",
      element: (
          <ForgotPassword />
      ),
      errorElement: <ErrorHandler />,
    },
    {
      path: "/dashboard",
      element: <>{isAuthenticated ? <Protected onLogout={handleLogout} /> : <Navigate to="/login" />}</>,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "create-course", element: <CreateCourse /> },
        { path: "create-tutorial", element: <CreateTutorial /> },
        { path: "profile", element: <Profile /> },
        { path: "fee-details", element: <FeeDetails /> },
        { path: "notifications", element: <Notifications /> },
        { path: "enrolled-courses", element: <EnrolledCourses /> },
        { path: "student-management", element: <StudentManagement /> },
        { path: "trainer-management", element: <TrainerManagement /> },
        { path: "course-management", element: <CourseManagement /> },
        { path: "class-management", element: <ClassManagement /> },
        { path: "salary-management", element: <SalaryManagement /> },
        { path: ":lang/", element: <Topic /> },
        { path: ":lang/:topic", element: <TopicDetails /> }
      ],
      errorElement: <ErrorHandler />
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}