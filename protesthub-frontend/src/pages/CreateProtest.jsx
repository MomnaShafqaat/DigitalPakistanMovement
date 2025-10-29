import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { protestAPI } from '../services/api';

const CreateProtest = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cause: '',
    city: '',
    specific_location: '',
    start_datetime: '',
    end_datetime: '',
    expected_participants: 0,
    safety_guidelines: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert expected_participants to number
      const submitData = {
        ...formData,
        expected_participants: parseInt(formData.expected_participants) || 0
      };

      await protestAPI.createProtest(submitData);
      navigate('/protests');
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
    { value: 'karachi', label: 'Karachi' },
    { value: 'lahore', label: 'Lahore' },
    { value: 'rawalpindi', label: 'Rawalpindi' },
    { value: 'faisalabad', label: 'Faisalabad' },
    { value: 'multan', label: 'Multan' },
    { value: 'peshawar', label: 'Peshawar' },
    { value: 'quetta', label: 'Quetta' },
  ];

  const causes = [
    { value: '', label: 'Select Cause' },
    { value: 'education', label: 'Education Rights' },
    { value: 'healthcare', label: 'Healthcare Facilities' },
    { value: 'human_rights', label: 'Human Rights' },
    { value: 'women_rights', label: "Women's Rights" },
    { value: 'price_hike', label: 'Price Hike & Inflation' },
    { value: 'employment', label: 'Employment & Jobs' },
    { value: 'electricity', label: 'Electricity & Utilities' },
    { value: 'water', label: 'Water Shortage' },
    { value: 'governance', label: 'Governance & Corruption' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Protest</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
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
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe the purpose, goals, and details of the protest..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cause" className="block text-sm font-medium text-gray-700">
                    Cause *
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
                  placeholder="e.g., D-Chowk, Constitution Avenue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label htmlFor="safety_guidelines" className="block text-sm font-medium text-gray-700">
                  Safety Guidelines & Instructions
                </label>
                <textarea
                  id="safety_guidelines"
                  name="safety_guidelines"
                  rows={3}
                  value={formData.safety_guidelines}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Important safety instructions for participants..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creating Protest...' : 'Create Protest'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/protests')}
                className="btn border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProtest;