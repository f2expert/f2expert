import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '../../atoms/Button';

export interface ErrorHandlerProps {
  className?: string;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ className = '' }) => {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorStatus: string | number = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'An error occurred';
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = 'Unknown error occurred';
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 ${className}`}>
      <div className="max-w-md w-full space-y-6 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {errorStatus || 'Error'}
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {errorMessage}
          </p>
        </div>
        
        <div className="space-y-4">
          <Button as={Link} to="/" className="w-full">
            Go Home
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
        
        {import.meta.env.DEV && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto text-red-600">
              {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorHandler;