'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/UserLayout';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    updateUser({
      name: formData.name,
      phone: formData.phone,
    });

    setIsSaving(false);
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="purple-gradient text-white px-6 py-2 rounded-full hover:opacity-90 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50">
              <p className="text-green-300 text-center">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Picture */}
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 purple-gradient rounded-full flex items-center justify-center text-white text-5xl font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 glass-dark p-2 rounded-full hover:bg-white/20 transition"
                      title="Change picture (coming soon)"
                    >
                      📷
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-purple-300 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-purple-200 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 purple-gradient text-white px-8 py-3 rounded-full hover:opacity-90 transition font-semibold disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 glass text-purple-200 hover:bg-white/20 px-8 py-3 rounded-full transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Account Info */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-purple-500/20">
              <span className="text-purple-200">User ID</span>
              <span className="text-white font-mono text-sm">{user?.id}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-purple-500/20">
              <span className="text-purple-200">Account Type</span>
              <span className="text-white capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-purple-500/20">
              <span className="text-purple-200">Member Since</span>
              <span className="text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-purple-200">Last Updated</span>
              <span className="text-white">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Security</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">Password</p>
                <p className="text-sm text-purple-300">••••••••</p>
              </div>
              <button className="purple-gradient text-white px-6 py-2 rounded-full hover:opacity-90 transition text-sm">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
