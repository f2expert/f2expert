import React from 'react';

export const Profile: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Page</h1>
        <p className="text-gray-600 mt-2">This is a minimal profile page for testing navigation.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Profile loaded successfully!</h2>
        <p>If you can see this message, the profile navigation is working correctly.</p>
      </div>
    </div>
  );
};

export default Profile;