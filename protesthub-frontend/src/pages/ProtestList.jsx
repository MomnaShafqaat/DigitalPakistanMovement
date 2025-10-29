import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { protestAPI } from '../services/api';

const ProtestList = ({ user }) => {
  const [protests, setProtests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    cause: ''
  });
  const location = useLocation();
  const fetchProtests = async () => {
    try {
      const response = await protestAPI.getProtests(filters);
      setProtests(response.data);
    } catch (error) {
      console.error('Error fetching protests:', error);
    } finally {
      setLoading(false);
    }
  };
  
useEffect(() => {

  fetchProtests();
}, [filters]); // Remove fetchProtests from dependencies

  const supportProtest = async (protestId) => {
    if (!user) {
      alert('Please login to support protests');
      return;
    }

    try {
      await protestAPI.supportProtest(protestId);
      fetchProtests(); // Refresh list
    } catch (error) {
      console.error('Error supporting protest:', error);
    }
  };

  const cities = [
    { value: '', label: 'All Cities' },
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
    { value: '', label: 'All Causes' },
    { value: 'education', label: 'Education Rights' },
    { value: 'healthcare', label: 'Healthcare Facilities' },
    { value: 'human_rights', label: 'Human Rights' },
    { value: 'women_rights', label: "Women's Rights" },
    { value: 'price_hike', label: 'Price Hike & Inflation' },
    { value: 'employment', label: 'Employment & Jobs' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {location.state?.created && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
            Your protest has been submitted and is pending admin approval. It will appear here once approved.
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="card p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    {cities.map(city => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cause</label>
                  <select
                    value={filters.cause}
                    onChange={(e) => setFilters({...filters, cause: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    {causes.map(cause => (
                      <option key={cause.value} value={cause.value}>
                        {cause.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Protest List */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Peaceful Protests in Pakistan</h1>
              {user?.role === 'organizer' && (
                <Link
                  to="/create-protest"
                  className="btn bg-green-600 text-white hover:bg-green-700"
                >
                  Create New Protest
                </Link>
              )}
            </div>

            {protests.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No protests found</h3>
                <p className="text-gray-600 mb-4">
                  {filters.city || filters.cause 
                    ? 'Try changing your filters or check back later.'
                    : 'Be the first to organize a peaceful protest in your city!'
                  }
                </p>
                {user?.role === 'organizer' && (
                  <Link
                    to="/create-protest"
                    className="btn bg-green-600 text-white hover:bg-green-700"
                  >
                    Create First Protest
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {protests.map(protest => (
                  <div key={protest.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{protest.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {protest.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span className="capitalize">{protest.city.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        <span>{new Date(protest.start_datetime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><path d="M22 12H18"/><path d="M12 2v6"/></svg>
                        <span className="capitalize">{protest.cause.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M16 21v-2a4 4 0 00-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>{protest.supporter_count} supporters</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/protests/${protest.id}`}
                        className="btn btn-primary flex-1 text-center"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => supportProtest(protest.id)}
                        className={`btn flex-1 text-center ${
                          protest.is_supported 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                        }`}
                      >
                        {protest.is_supported ? '✅ Supported' : '🤝 Support'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtestList;