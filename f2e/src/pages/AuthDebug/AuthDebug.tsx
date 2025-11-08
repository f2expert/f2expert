import React, { useEffect, useState } from 'react';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { getAuthHeader, getAuthToken, setAuthTokens } from '../../utils/auth';
import { debugAuthState, setTestTokens, clearAllAuthData, diagnoseAuthIssue } from '../../utils/authDebug';

interface DebugResult {
  hasTokenInStorage: boolean;
  hasUserInStorage: boolean;
  isAuthenticated: boolean;
  hasToken: boolean;
  hasAuthHeader: boolean;
  tokenExpired: boolean;
}

const AuthDebugPage: React.FC = () => {
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Run initial debug check
    runDebugCheck();
  }, []);

  const runDebugCheck = () => {
    console.log('🔍 Running auth debug check...');
    
    const result = debugAuthState();
    setDebugResult(result);
    
    const currentToken = getAuthToken();
    setToken(currentToken);
    
    const currentAuthHeader = getAuthHeader();
    setAuthHeader(currentAuthHeader);
    
    console.log('Current token:', currentToken);
    console.log('Current auth header:', currentAuthHeader);
  };

  const handleSetTestTokens = () => {
    setTestTokens();
    runDebugCheck();
  };

  const handleClearTokens = () => {
    clearAllAuthData();
    runDebugCheck();
  };

  const handleRunDiagnosis = () => {
    const diagnosis = diagnoseAuthIssue();
    console.log('Full diagnosis:', diagnosis);
  };

  const handleSetRealTokens = () => {
    // Set tokens that match what might be in your Redux store
    const realTokens = {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      refreshToken: 'refresh_token_example',
      tokenType: 'Bearer',
      expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour from now
    };

    const userData = {
      id: 'user123',
      email: 'user@example.com',
      name: 'Test User',
      role: 'admin'
    };

    setAuthTokens(realTokens, userData);
    runDebugCheck();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Tool</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current State */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Current Auth State</h2>
          
          <div className="space-y-3">
            <div>
              <strong>Has Token:</strong> 
              <span className={token ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                {token ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div>
              <strong>Has Auth Header:</strong> 
              <span className={authHeader ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                {authHeader ? 'Yes' : 'No'}
              </span>
            </div>
            
            {token && (
              <div>
                <strong>Token Preview:</strong>
                <div className="text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                  {token.substring(0, 50)}...
                </div>
              </div>
            )}
            
            {authHeader && (
              <div>
                <strong>Auth Header:</strong>
                <div className="text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                  {authHeader}
                </div>
              </div>
            )}
            
            {debugResult && (
              <div className="mt-4">
                <strong>Debug Summary:</strong>
                <div className="text-xs bg-gray-100 p-2 rounded mt-1">
                  <div>Storage has tokens: {debugResult.hasTokenInStorage ? '✅' : '❌'}</div>
                  <div>Storage has user: {debugResult.hasUserInStorage ? '✅' : '❌'}</div>
                  <div>Is authenticated: {debugResult.isAuthenticated ? '✅' : '❌'}</div>
                  <div>Can get token: {debugResult.hasToken ? '✅' : '❌'}</div>
                  <div>Can get auth header: {debugResult.hasAuthHeader ? '✅' : '❌'}</div>
                  <div>Token expired: {debugResult.tokenExpired ? '❌' : '✅'}</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Debug Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Debug Actions</h2>
          
          <div className="space-y-3">
            <Button 
              onClick={runDebugCheck}
              className="w-full"
            >
              🔍 Run Debug Check
            </Button>
            
            <Button 
              onClick={handleRunDiagnosis}
              variant="outline"
              className="w-full"
            >
              🏥 Run Full Diagnosis
            </Button>
            
            <Button 
              onClick={handleSetTestTokens}
              variant="outline"
              className="w-full"
            >
              🧪 Set Test Tokens
            </Button>
            
            <Button 
              onClick={handleSetRealTokens}
              variant="outline"
              className="w-full"
            >
              🔑 Set Real-like Tokens
            </Button>
            
            <Button 
              onClick={handleClearTokens}
              variant="outline"
              className="w-full text-red-600 hover:text-red-700"
            >
              🧹 Clear All Tokens
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Open browser console (F12)</li>
              <li>2. Click "Run Full Diagnosis"</li>
              <li>3. Check console for detailed logs</li>
              <li>4. Use window.authDebug for manual testing</li>
            </ol>
          </div>
        </Card>
      </div>

      {/* Storage Contents */}
      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Storage Contents</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">LocalStorage</h3>
            <div className="text-xs bg-gray-100 p-3 rounded">
              <div><strong>auth_tokens:</strong></div>
              <div className="break-all">{localStorage.getItem('auth_tokens') || 'null'}</div>
              <div className="mt-2"><strong>user_data:</strong></div>
              <div className="break-all">{localStorage.getItem('user_data') || 'null'}</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">SessionStorage</h3>
            <div className="text-xs bg-gray-100 p-3 rounded">
              <div><strong>auth_tokens:</strong></div>
              <div className="break-all">{sessionStorage.getItem('auth_tokens') || 'null'}</div>
              <div className="mt-2"><strong>user_data:</strong></div>
              <div className="break-all">{sessionStorage.getItem('user_data') || 'null'}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthDebugPage;