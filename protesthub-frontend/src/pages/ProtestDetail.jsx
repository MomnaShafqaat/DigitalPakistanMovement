import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { protestAPI } from '../services/api';

const ProtestDetail = ({ user }) => {
  const { id } = useParams();
  const [protest, setProtest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supporting, setSupporting] = useState(false);

  useEffect(() => {
    fetchProtest();
  }, [id]);

  const fetchProtest = async () => {
    try {
      const response = await protestAPI.getProtest(id);
      setProtest(response.data);
    } catch (error) {
      console.error('Error fetching protest:', error);
    } finally {
      setLoading(false);
    }
  };

  const supportProtest = async () => {
    if (!user) {
      alert('Please login to support this protest');
      return;
    }

    setSupporting(true);
    try {
      await protestAPI.supportProtest(id);
      fetchProtest(); // Refresh protest data
    } catch (error) {
      console.error('Error supporting protest:', error);
    } finally {
      setSupporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!protest) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Protest Not Found</h1>
            <p className="text-gray-600 mb-6">The protest you're looking for doesn't exist.</p>
            <Link to="/protests" className="btn btn-primary">
              ← Back to Protests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{protest.title}</h1>
              <p className="text-gray-600">Organized by {protest.organizer_name}</p>
            </div>
            <button
              onClick={supportProtest}
              disabled={supporting}
              className={`btn ${
                protest.is_supported 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
              } disabled:opacity-50`}
            >
              {supporting ? '...' : protest.is_supported ? 'Supported' : 'Support Protest'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2 inline-flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Location
                </h3>
                <p className="text-green-700 capitalize">{protest.city}</p>
                <p className="text-green-700">{protest.specific_location}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 inline-flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Date & Time
                </h3>
                <p className="text-blue-700">
                  {new Date(protest.start_datetime).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2 inline-flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M22 12H18"/><path d="M12 2v6"/></svg>
                  Cause
                </h3>
                <p className="text-purple-700 capitalize">{protest.cause.replace('_', ' ')}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2 inline-flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Participation
                </h3>
                <p className="text-orange-700">
                  {protest.supporter_count} supporters • {protest.expected_participants} expected
                </p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Protest</h2>
            <p className="text-gray-700 whitespace-pre-line">{protest.description}</p>
          </div>

          {protest.safety_guidelines && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3 inline-flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Safety Guidelines
              </h3>
              <p className="text-yellow-700 whitespace-pre-line">{protest.safety_guidelines}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link to="/protests" className="btn btn-primary">
              ← Back to Protests
            </Link>
            {user?.id === protest.organizer && (
              <button className="btn bg-blue-600 text-white hover:bg-blue-700">
                Edit Protest
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtestDetail;