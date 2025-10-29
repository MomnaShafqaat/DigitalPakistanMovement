import React from 'react';
import { Link } from 'react-router-dom';

const ProfileView = ({ user }) => {
  const cities = [
    { value: 'islamabad', label: 'Islamabad' },
    { value: 'karachi', label: 'Karachi' },
    { value: 'lahore', label: 'Lahore' },
    { value: 'rawalpindi', label: 'Rawalpindi' },
    { value: 'faisalabad', label: 'Faisalabad' },
    { value: 'multan', label: 'Multan' },
    { value: 'peshawar', label: 'Peshawar' },
    { value: 'quetta', label: 'Quetta' },
  ];

  const roleTypes = [
    { value: 'organizer', label: 'Organizer' },
    { value: 'volunteer_team', label: 'Volunteer Team' },
    { value: 'awareness_group', label: 'Awareness Group' },
  ];

  const getCityLabel = (cityValue) => {
    const city = cities.find(c => c.value === cityValue);
    return city ? city.label : cityValue;
  };

  const getRoleTypeLabel = (roleValue) => {
    const role = roleTypes.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-0 overflow-hidden">
          {/* Banner */}
          <div className="relative h-40 bg-gray-200">
            {user?.banner_image && (
              <img src={user.banner_image} alt="Banner" className="w-full h-40 object-cover" />
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4 -mt-16">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-gray-200">
                  {user?.profile_image && (
                    <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
                  <p className="text-gray-600">{user?.email} • <span className="capitalize">{user?.role}</span></p>
                </div>
              </div>
              <Link
                to="/profile/edit"
                className="btn bg-green-600 text-white hover:bg-green-700"
              >
                Edit Profile
              </Link>
            </div>

            {/* Profile Information Sections */}
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Group Name</label>
                    <p className="text-gray-900">{user?.organization_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organizer's Name</label>
                    <p className="text-gray-900">{user?.contact_person || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-gray-900">{user?.phone_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City / Area</label>
                    <p className="text-gray-900">{getCityLabel(user?.city) || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Purpose and Focus */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Purpose and Focus</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cause / Focus Area</label>
                    <p className="text-gray-900">{user?.cause_focus || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description / Mission</label>
                    <p className="text-gray-900 whitespace-pre-line">{user?.mission || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Protest or Event Role */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Protest or Event Role</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
                    <p className="text-gray-900">{getRoleTypeLabel(user?.organization_role_type) || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous Activities</label>
                    <p className="text-gray-900 whitespace-pre-line">{user?.previous_activities || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Media & Communication */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Media and Communication</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <p className="text-gray-900">
                      {user?.facebook_url ? (
                        <a href={user.facebook_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                          {user.facebook_url}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">X (Twitter)</label>
                    <p className="text-gray-900">
                      {user?.twitter_url ? (
                        <a href={user.twitter_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                          {user.twitter_url}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <p className="text-gray-900">
                      {user?.instagram_url ? (
                        <a href={user.instagram_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                          {user.instagram_url}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <p className="text-gray-900">
                      {user?.website_url ? (
                        <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                          {user.website_url}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety and Conduct */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Safety and Conduct</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsible Person</label>
                    <p className="text-gray-900">{user?.responsible_person || 'Not provided'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border ${user?.undertaking_agreed ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-300'}`}></div>
                    <label className="text-sm text-gray-700">We agree to follow peaceful and lawful conduct during protests.</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;