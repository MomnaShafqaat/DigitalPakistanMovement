import React from 'react';
import { Link } from 'react-router-dom';

const UserProfile = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800">
              User profile management is under development. You'll be able to edit your profile and see your activity here soon.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> <span className="capitalize">{user?.role}</span></p>
            <p><strong>City:</strong> {user?.city || 'Not specified'}</p>
          </div>
          <Link to="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;