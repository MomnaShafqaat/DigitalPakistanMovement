import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { protestAPI } from '../services/api';

const CreateProtest = ({ user }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    cause: '',
    
    // Organizer Information
    organizer_contact: '',
    
    // Location Details
    city: '',
    specific_location: '',
    latitude: '',
    longitude: '',
    
    // Date & Time
    start_datetime: '',
    end_datetime: '',
    
    // Expected Participation
    expected_participants: 0,
    
    // Safety Information
    is_peaceful: true,
    safety_guidelines: '',
    
    // Media (you can add file uploads later)
    // poster: null,
    // supporting_documents: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        expected_participants: parseInt(formData.expected_participants) || 0
      };

      await protestAPI.createProtest(submitData);
      navigate('/protests', { state: { created: true } });
    } catch (error) {
      console.error('Error creating protest:', error);
      setError(error.response?.data?.message || 'Failed to create protest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    { value: '', label: 'Select City' },
    { value: 'islamabad', label: 'Islamabad' },
    { value: 'rawalpindi', label: 'Rawalpindi' },
    { value: 'karachi', label: 'Karachi' },
    { value: 'lahore', label: 'Lahore' },
    { value: 'faisalabad', label: 'Faisalabad' },
    { value: 'multan', label: 'Multan' },
    { value: 'peshawar', label: 'Peshawar' },
    { value: 'quetta', label: 'Quetta' },
    { value: 'sialkot', label: 'Sialkot' },
    { value: 'gujranwala', label: 'Gujranwala' },
    { value: 'bahawalpur', label: 'Bahawalpur' },
    { value: 'sargodha', label: 'Sargodha' },
    { value: 'sukkur', label: 'Sukkur' },
    { value: 'larkana', label: 'Larkana' },
    { value: 'hyderabad', label: 'Hyderabad' },
  ];

  const causes = [
    { value: '', label: 'Select Cause' },
    { value: 'education', label: 'Education Rights' },
    { value: 'healthcare', label: 'Healthcare Facilities' },
    { value: 'electricity', label: 'Electricity & Utilities' },
    { value: 'water', label: 'Water Shortage' },
    { value: 'employment', label: 'Employment & Jobs' },
    { value: 'human_rights', label: 'Human Rights' },
    { value: 'women_rights', label: "Women's Rights" },
    { value: 'minority_rights', label: 'Minority Rights' },
    { value: 'price_hike', label: 'Price Hike & Inflation' },
    { value: 'land_issues', label: 'Land & Property Issues' },
    { value: 'political', label: 'Political Issues' },
    { value: 'governance', label: 'Governance & Corruption' },
    { value: 'environment', label: 'Environmental Issues' },
    { value: 'other', label: 'Other Issues' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Peaceful Protest</h1>
          <p className="text-gray-600 mb-6">Organize a verified peaceful protest in Pakistan</p>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Protest Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Basic Protest Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Protest Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Education Rights March in Islamabad"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Describe the purpose, goals, demands, and details of the protest. Be specific about what you hope to achieve."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cause" className="block text-sm font-medium text-gray-700">
                      Primary Cause *
                    </label>
                    <select
                      id="cause"
                      name="cause"
                      required
                      value={formData.cause}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      {causes.map(cause => (
                        <option key={cause.value} value={cause.value}>
                          {cause.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="organizer_contact" className="block text-sm font-medium text-gray-700">
                      Organizer Contact Number
                    </label>
                    <input
                      type="tel"
                      id="organizer_contact"
                      name="organizer_contact"
                      value={formData.organizer_contact}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 0300-1234567"
                    />
                    <p className="mt-1 text-sm text-gray-500">This will be your public contact for the protest</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Location Details</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      {cities.map(city => (
                        <option key={city.value} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="specific_location" className="block text-sm font-medium text-gray-700">
                      Specific Location/Venue *
                    </label>
                    <input
                      type="text"
                      id="specific_location"
                      name="specific_location"
                      required
                      value={formData.specific_location}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., D-Chowk, Constitution Avenue, Islamabad"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                      Latitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 33.6844"
                    />
                  </div>

                  <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                      Longitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 73.0479"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="start_datetime"
                    name="start_datetime"
                    required
                    value={formData.start_datetime}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="end_datetime"
                    name="end_datetime"
                    required
                    value={formData.end_datetime}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Participation & Safety */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Participation & Safety</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="expected_participants" className="block text-sm font-medium text-gray-700">
                    Expected Number of Participants
                  </label>
                  <input
                    type="number"
                    id="expected_participants"
                    name="expected_participants"
                    min="0"
                    value={formData.expected_participants}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="100"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="is_peaceful"
                    name="is_peaceful"
                    type="checkbox"
                    checked={formData.is_peaceful}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_peaceful" className="block text-sm font-medium text-gray-700">
                    This is a peaceful protest
                  </label>
                </div>

                <div>
                  <label htmlFor="safety_guidelines" className="block text-sm font-medium text-gray-700">
                    Safety Guidelines & Instructions
                  </label>
                  <textarea
                    id="safety_guidelines"
                    name="safety_guidelines"
                    rows={4}
                    value={formData.safety_guidelines}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Important safety instructions for participants (e.g., bring water, wear masks, emergency contacts, etc.)"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 px-8 py-3"
              >
                {loading ? 'Creating Protest...' : 'Submit for Approval'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/protests')}
                className="btn border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
              >
                Cancel
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded text-sm">
              <p className="font-medium">Note:</p>
              <p>All protests are subject to admin approval to ensure compliance with platform guidelines and local laws.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProtest;