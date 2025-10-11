import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../atoms/Button';

export const AuthStatus: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, clearError } = useAuth();

  const handleLogin = async () => {
    try {
      await login('john@example.com', 'password123');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-100 rounded">
        <p>Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">Redux Auth Status</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <Button onClick={clearError} className="mt-2 text-sm">
            Clear Error
          </Button>
        </div>
      )}

      {isAuthenticated ? (
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-800 mb-2">✅ User is authenticated</p>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>ID:</strong> {user?.id}</p>
          <Button onClick={handleLogout} className="mt-3">
            Logout
          </Button>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-800 mb-2">❌ User is not authenticated</p>
          <Button onClick={handleLogin}>
            Login (Demo)
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthStatus;