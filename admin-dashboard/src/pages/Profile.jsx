import { useState, useEffect } from 'react';
import profileService from '../services/profileService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await profileService.getProfile();

      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E73E3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#000000] mb-6">Profile</h1>

      {profile && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {/* Display profile data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profile).map(([key, value]) => (
                <div key={key} className="border-b pb-3">
                  <p className="text-sm text-gray-500 capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-lg font-medium text-[#000000]">
                    {typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchProfile}
            className="mt-6 bg-[#2E73E3] text-white px-6 py-2 rounded-lg hover:bg-[#2563EB] transition-colors"
          >
            Refresh Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
