import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Protected } from '../Protected';
import { useAuth } from '../../../hooks/useAuth';

export interface AuthLayoutProps {
  children?: React.ReactNode;
  forcePublic?: boolean;
  forceProtected?: boolean;
  loadingComponent?: React.ReactNode;
}

const DefaultLoadingComponent = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  loadingComponent = <DefaultLoadingComponent />
}) => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout properly
  const handleLogout = () => {
    try {
      logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/', { replace: true });
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // Force public layout (for login/register pages)
  /*if (forcePublic) {
    return (
      <Public>
        {children}
      </Public>
    );
  }*/

  // Force protected layout (for pages that require authentication)
  /*if (forceProtected && !isAuthenticated) {
    return (
      <Public>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Authentication Required
              </h2>
              <p className="mt-2 text-gray-600">
                You need to be logged in to access this page.
              </p>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </Public>
    );
  }*/

  // Automatically choose layout based on authentication status
  if (isAuthenticated && user) {
    return (
      <Protected
        userName={user.name}
        userEmail={user.email}
        onLogout={handleLogout}
      >
        {children}
      </Protected>
    );
  }

  // Default to public layout for non-authenticated users
  /*return (
    <Public>
      {children}
    </Public>
  );*/
};

export default AuthLayout;