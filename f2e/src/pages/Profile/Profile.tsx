import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '../../components/atoms';
import { Separator } from '../../components/atoms/Separator';
import { GearIcon, CameraIcon } from '@radix-ui/react-icons';
import { useAuth } from '../../hooks/useAuth';
import { authApiService, type UpdateProfileData } from '../../services/authApi';
import { useAppDispatch } from '../../store/hooks';
import { updateUser } from '../../store/slices/authSlice';

interface ProfileData {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  photo: string;
  bio: string;
  joinDate: string;
  level: string;
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  certificates: number;
  skills: string[];
  preferences: {
    emailNotifications: boolean;
    publicProfile: boolean;
    darkMode: boolean;
  };
}

export const Profile: React.FC = () => {
  const { user: authUser, token } = useAuth();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Initialize with stable data to prevent re-renders
  const initialProfileData: ProfileData = React.useMemo(() => {
    const fullName = authUser?.name || 'John Doe';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || 'John';
    const lastName = nameParts.slice(1).join(' ') || 'Doe';
    
    return {
      firstName,
      lastName,
      name: fullName,
      email: authUser?.email || 'john.doe@email.com',
      phone: authUser?.phone || '',
      dateOfBirth: authUser?.dateOfBirth || '',
      gender: authUser?.gender || '',
      address: {
        street: authUser?.address?.street || '',
        city: authUser?.address?.city || '',
        state: authUser?.address?.state || '',
        country: 'India',
        zipCode: ''
      },
      photo: authUser?.photo || '/assets/profile.png',
      bio: authUser?.bio || 'Full-stack developer passionate about creating innovative web solutions. Always eager to learn new technologies and share knowledge with the community.',
      joinDate: '2024-01-15',
      level: 'Intermediate Developer',
      totalCourses: 8,
      completedCourses: 5,
      totalHours: 236,
      certificates: 3,
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
      preferences: {
        emailNotifications: true,
        publicProfile: true,
        darkMode: false,
      }
    };
  }, [authUser?.name, authUser?.email, authUser?.photo]);

  // Mock profile data - in a real app, this would come from an API
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  const [editFormData, setEditFormData] = useState(() => ({
    firstName: initialProfileData.firstName,
    lastName: initialProfileData.lastName,
    email: initialProfileData.email,
    phone: initialProfileData.phone,
    dateOfBirth: initialProfileData.dateOfBirth,
    gender: initialProfileData.gender,
    address: { ...initialProfileData.address },
    bio: initialProfileData.bio,
    skills: initialProfileData.skills.join(', ')
  }));

  const handleSaveProfile = async () => {
    if (!authUser?.id || !token) {
      alert('Missing user ID or token');
      return;
    }

    setIsUpdatingProfile(true);
    
    try {
      // Prepare profile update data
      const updateData: UpdateProfileData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        phone: editFormData.phone,
        dateOfBirth: editFormData.dateOfBirth,
        gender: editFormData.gender,
        address: editFormData.address,
        bio: editFormData.bio
      };

      console.log('Updating profile...', updateData);
      
      const updatedUser = await authApiService.updateProfile(authUser.id, updateData, token);
      
      console.log('Profile update successful:', updatedUser);
      
      // Update local profile data
      setProfileData(prev => ({
        ...prev,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        name: `${editFormData.firstName} ${editFormData.lastName}`.trim(),
        email: editFormData.email,
        phone: editFormData.phone,
        dateOfBirth: editFormData.dateOfBirth,
        gender: editFormData.gender,
        address: { ...editFormData.address },
        bio: editFormData.bio,
        skills: editFormData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      }));
      
      // Update auth store with new user data
      dispatch(updateUser({
        name: `${editFormData.firstName} ${editFormData.lastName}`.trim(),
        email: editFormData.email
      }));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Profile update failed:', error);
      alert(`Profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFormData({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
      dateOfBirth: profileData.dateOfBirth,
      gender: profileData.gender,
      address: { ...profileData.address },
      bio: profileData.bio,
      skills: profileData.skills.join(', ')
    });
    setIsEditing(false);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !authUser?.id || !token) {
      console.error('Missing file, user ID, or token for photo upload');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploadingPhoto(true);
    
    try {
      console.log('Uploading photo...', { userId: authUser.id, fileName: file.name });
      
      const result = await authApiService.uploadPhoto(authUser.id, file, token);
      
      console.log('Photo upload successful:', result);
      
      // Update profile data
      setProfileData(prev => ({
        ...prev,
        photo: result.photoUrl
      }));
      
      // Update auth store with new photo
      dispatch(updateUser({ photo: result.photoUrl }));
      
      alert('Photo uploaded successfully!');
      
    } catch (error) {
      console.error('Photo upload failed:', error);
      alert(`Photo upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploadingPhoto(false);
      // Clear the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="space-y-6 pt-4">
          <div className="flex items-start gap-6">
            <div className="relative">
              <img 
                src={profileData.photo} 
                alt={profileData.name}
                className="w-24 h-24 rounded-full bg-gray-200 object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploadingPhoto}
                  className="hidden"
                />
                {isUploadingPhoto ? (
                  <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                ) : (
                  <CameraIcon className="h-3 w-3" />
                )}
              </label>
            </div>
            
            <div className="flex-1 space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <h3 className="text-xl font-semibold">{profileData.name}</h3>
                    <p className="text-gray-600">{profileData.email}</p>
                    <p className="text-sm text-gray-500">Member since {new Date(profileData.joinDate).toLocaleDateString()}</p>
                  </div>
                  <p className="text-gray-700">{profileData.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <Input
                        value={editFormData.firstName}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={isUpdatingProfile}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <Input
                        value={editFormData.lastName}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={isUpdatingProfile}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={isUpdatingProfile}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date of Birth</label>
                      <Input
                        type="date"
                        value={editFormData.dateOfBirth}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        disabled={isUpdatingProfile}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <select
                        value={editFormData.gender}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, gender: e.target.value }))}
                        disabled={isUpdatingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Street</label>
                      <Input
                        value={editFormData.address.street}
                        onChange={(e) => setEditFormData(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, street: e.target.value }
                        }))}
                        disabled={isUpdatingProfile}
                        placeholder="Enter street address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <Input
                          value={editFormData.address.city}
                          onChange={(e) => setEditFormData(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, city: e.target.value }
                          }))}
                          disabled={isUpdatingProfile}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <Input
                          value={editFormData.address.state}
                          onChange={(e) => setEditFormData(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, state: e.target.value }
                          }))}
                          disabled={isUpdatingProfile}
                          placeholder="Enter state"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Country</label>
                        <Input
                          value={editFormData.address.country}
                          onChange={(e) => setEditFormData(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, country: e.target.value }
                          }))}
                          disabled={isUpdatingProfile}
                          placeholder="Enter country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ZIP Code</label>
                        <Input
                          value={editFormData.address.zipCode}
                          onChange={(e) => setEditFormData(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, zipCode: e.target.value }
                          }))}
                          disabled={isUpdatingProfile}
                          placeholder="Enter ZIP code"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={isUpdatingProfile}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
                    <Input
                      value={editFormData.skills}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, skills: e.target.value }))}
                      disabled={isUpdatingProfile}
                      placeholder="React, TypeScript, Node.js"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      disabled={isUpdatingProfile}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profileData.totalCourses}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profileData.completedCourses}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profileData.totalHours}</div>
              <div className="text-sm text-gray-600">Learning Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{profileData.certificates}</div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GearIcon className="h-5 w-5" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your account preferences and privacy settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates about your courses and achievements</p>
            </div>
            <input 
              type="checkbox" 
              checked={profileData.preferences.emailNotifications}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, emailNotifications: e.target.checked }
              }))}
              className="toggle"
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Public Profile</h4>
              <p className="text-sm text-gray-600">Make your learning progress visible to others</p>
            </div>
            <input 
              type="checkbox" 
              checked={profileData.preferences.publicProfile}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, publicProfile: e.target.checked }
              }))}
              className="toggle"
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <input 
              type="checkbox" 
              checked={profileData.preferences.darkMode}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, darkMode: e.target.checked }
              }))}
              className="toggle"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Change Password</h4>
            <div className="space-y-3 max-w-md">
              <Input type="password" placeholder="Current Password" />
              <Input type="password" placeholder="New Password" />
              <Input type="password" placeholder="Confirm New Password" />
              <Button>Update Password</Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Login Sessions</h4>
            <p className="text-sm text-gray-600 mb-3">Manage your active login sessions</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-gray-600">Windows • Chrome • Active now</p>
                </div>
                <Badge variant="secondary">Current</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'profile' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'settings' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'security' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Security
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'settings' && renderSettingsTab()}
      {activeTab === 'security' && renderSecurityTab()}
    </div>
  );
};

export default Profile;