import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS IMPORT
import { authAPI } from '../services/api';

// UPDATE THE COMPONENT SIGNATURE TO INCLUDE setUser
const ProfileEdit = ({ user, setUser }) => { // ADD setUser prop here
  const [formData, setFormData] = useState({});
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ADD useNavigate HOOK
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        city: user.city || '',
        phone_number: user.phone_number || '',
        bio: user.bio || '',
        organization_name: user.organization_name || '',
        contact_person: user.contact_person || '',
        cause_focus: user.cause_focus || '',
        mission: user.mission || '',
        organization_role_type: user.organization_role_type || '',
        previous_activities: user.previous_activities || '',
        facebook_url: user.facebook_url || '',
        twitter_url: user.twitter_url || '',
        instagram_url: user.instagram_url || '',
        website_url: user.website_url || '',
        responsible_person: user.responsible_person || '',
        undertaking_agreed: Boolean(user.undertaking_agreed) || false,
      });
    }
  }, [user]);

  const cities = [
    { value: '', label: 'Select your city' },
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
    { value: '', label: 'Select role type' },
    { value: 'organizer', label: 'Organizer' },
    { value: 'volunteer_team', label: 'Volunteer Team' },
    { value: 'awareness_group', label: 'Awareness Group' },
  ];

  const bannerPreview = useMemo(() => {
    if (bannerImageFile) return URL.createObjectURL(bannerImageFile);
    return user?.banner_image || '';
  }, [bannerImageFile, user]);

  const profilePreview = useMemo(() => {
    if (profileImageFile) return URL.createObjectURL(profileImageFile);
    return user?.profile_image || '';
  }, [profileImageFile, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // CORRECTED handleSubmit FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value);
        }
      });
      if (profileImageFile) data.append('profile_image', profileImageFile);
      if (bannerImageFile) data.append('banner_image', bannerImageFile);

      const response = await authAPI.updateProfile(data);
      setSuccess('Profile updated successfully');

      // Update parent state immediately using the setUser prop
      if (setUser) { // Use setUser directly, not props.setUser
        setUser(response.data);
      }

      // Also update localStorage
      localStorage.setItem('user', JSON.stringify(response.data));

      // Trigger storage event to notify other components
      window.dispatchEvent(new Event('storage'));

      // Redirect after successful update
      setTimeout(() => {
        navigate('/create-protest');
      }, 1500);

    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === 'string' ? msg : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-0 overflow-hidden">
          {/* Banner */}
          <div className="relative h-40 bg-gray-200">
            {bannerPreview && (
              <img src={bannerPreview} alt="Banner" className="w-full h-40 object-cover" />)
            }
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 -mt-16 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-gray-200">
                {profilePreview && (
                  <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
                <p className="text-gray-600">{user?.email} • <span className="capitalize">{user?.role}</span></p>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{error}</div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setBannerImageFile(e.target.files?.[0] || null)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo / Profile Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)} />
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organization / Group Name</label>
                    <input type="text" name="organization_name" value={formData.organization_name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organizer's Name</label>
                    <input type="text" name="contact_person" value={formData.contact_person || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>

                  {/* Add this Bio section */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h2>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bio *</label>
                        <textarea
                          name="bio"
                          rows={4}
                          value={formData.bio || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Tell us about yourself, your organization, and your mission..."
                          required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          This bio is required to create protests. Share your background and purpose.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City / Area</label>
                    <select name="city" value={formData.city || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      {cities.map(c => (<option key={c.value} value={c.value}>{c.label}</option>))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Purpose and Focus */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Purpose and Focus</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cause / Focus Area</label>
                    <input type="text" name="cause_focus" value={formData.cause_focus || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Short Description / Mission</label>
                    <textarea name="mission" rows={3} value={formData.mission || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                </div>
              </div>

              {/* Protest or Event Role */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Protest or Event Role</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role Type</label>
                    <select name="organization_role_type" value={formData.organization_role_type || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      {roleTypes.map(rt => (<option key={rt.value} value={rt.value}>{rt.label}</option>))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Previous Activities (optional)</label>
                    <textarea name="previous_activities" rows={3} value={formData.previous_activities || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                </div>
              </div>

              {/* Media & Communication */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Media and Communication</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facebook</label>
                    <input type="url" name="facebook_url" value={formData.facebook_url || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">X (Twitter)</label>
                    <input type="url" name="twitter_url" value={formData.twitter_url || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram</label>
                    <input type="url" name="instagram_url" value={formData.instagram_url || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input type="url" name="website_url" value={formData.website_url || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                </div>
              </div>

              {/* Safety and Conduct */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Safety and Conduct</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Responsible Person</label>
                    <input type="text" name="responsible_person" value={formData.responsible_person || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input id="undertaking_agreed" name="undertaking_agreed" type="checkbox" checked={!!formData.undertaking_agreed} onChange={handleChange} />
                    <label htmlFor="undertaking_agreed" className="text-sm text-gray-700">We agree to follow peaceful and lawful conduct during protests.</label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={saving} className="btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;