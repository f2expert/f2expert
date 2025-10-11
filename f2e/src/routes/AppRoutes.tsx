import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Public } from '../components/templates/Public';
//import { AuthLayout } from '../components/templates/AuthLayout';
import { ErrorHandler } from '../components/molecules/ErrorHandler';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Courses } from '../pages/Courses';
import { Tutorial } from '../pages/Tutorial';
import { Dashboard } from '../pages/Dashboard';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import Profile from '../pages/Profile';
import { FeeDetails } from '../pages/FeeDetails';
import { Notifications } from '../pages/Notifications';
import { useAuth } from '../hooks/useAuth';
import Topic from '../pages/Dashboard/Topic';
import { Protected } from '../components';

export default function AppRoutes() {
  const { isAuthenticated, logout } = useAuth();

  // Handle logout properly
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
        { path: "tutorial", element: <Tutorial /> },
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
      path: "/dashboard",
      element: <Protected />,//<AuthLayout forceProtected />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "profile", element: <Profile /> },
        { path: "fee-details", element: <FeeDetails /> },
        { path: "notifications", element: <Notifications /> },
        { path: ":lang/:topic", element: <Topic /> },
        { path: "*", element: <Topic /> }
      ],
      errorElement: <ErrorHandler />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}