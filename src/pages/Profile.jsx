
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, updateProfile, changePassword } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  
  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    
    try {
      const result = updateProfile(profileForm);
      if (result.success) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setProfileMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'An error occurred' });
      console.error(error);
    }
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    
    try {
      const result = changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      if (result.success) {
        setPasswordMessage({ type: 'success', text: result.message });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An error occurred' });
      console.error(error);
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="p-4 md:p-8 sm:ml-64 pt-20">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600">Manage your account details and password</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6 flex items-center">
                <User className="mr-2" size={20} />
                Profile Information
              </h2>
              
              {profileMessage.text && (
                <div className={`mb-4 p-3 rounded-md ${
                  profileMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {profileMessage.type === 'success' ? (
                    <CheckCircle2 className="inline-block mr-2" size={18} />
                  ) : (
                    <AlertCircle className="inline-block mr-2" size={18} />
                  )}
                  {profileMessage.text}
                </div>
              )}
              
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={profileForm.role}
                    onChange={handleProfileChange}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <button
                  type="submit"
                  className="mt-2 w-full py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
          
          {/* User Avatar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="mb-4">
                <img
                  src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2E7D32&color=fff&size=128`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto"
                />
              </div>
              <h3 className="text-lg font-medium">{user?.name}</h3>
              <p className="text-gray-500">{user?.email}</p>
              <p className="text-sm mt-1 bg-gray-100 inline-block px-3 py-1 rounded-full">
                {user?.role}
              </p>
              
              <button
                className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                Change Avatar
              </button>
            </div>
          </div>
        </div>
        
        {/* Change Password */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6 flex items-center">
              <Lock className="mr-2" size={20} />
              Change Password
            </h2>
            
            {passwordMessage.text && (
              <div className={`mb-4 p-3 rounded-md ${
                passwordMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {passwordMessage.type === 'success' ? (
                  <CheckCircle2 className="inline-block mr-2" size={18} />
                ) : (
                  <AlertCircle className="inline-block mr-2" size={18} />
                )}
                {passwordMessage.text}
              </div>
            )}
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4 text-right">
                <button
                  type="submit"
                  className="py-2 px-6 bg-primary text-white font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Update Password
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-sm text-gray-500">
              <p><strong>Note:</strong> For this demo, the current password is "password"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
