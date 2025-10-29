import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-green-800">Digital Pakistan Movement</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Peaceful Protest & Rights Awareness Hub - Empowering citizens through verified information and organized activism
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Protest Card */}
            <div className="card p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">🗣️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Peaceful Protests</h3>
              <p className="text-gray-600 mb-4">
                Find and organize verified protests across Pakistan. Stay informed about peaceful demonstrations in your city.
              </p>
              <Link 
                to="/protests" 
                className="btn btn-primary inline-block"
              >
                Browse Protests
              </Link>
            </div>

            {/* Awareness Card */}
            <div className="card p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Rights Awareness</h3>
              <p className="text-gray-600 mb-4">
                Learn about your constitutional rights, protest laws, and safety guidelines. Knowledge is power.
              </p>
              <Link 
                to="/awareness" 
                className="btn btn-primary inline-block"
              >
                Learn More
              </Link>
            </div>

            {/* Verified Info Card */}
            <div className="card p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Information</h3>
              <p className="text-gray-600 mb-4">
                Trusted and authentic content only. All protests are verified to ensure safety and reliability.
              </p>
              {!user && (
                <Link 
                  to="/register" 
                  className="btn btn-primary inline-block"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
          
          {user ? (
            <div className="card p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Welcome back, {user.username}! 👋</h2>
              <p className="text-gray-600 mb-6">
                You're logged in as <span className="font-semibold capitalize text-green-700">{user.role}</span>
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/protests" className="btn btn-primary">
                  Browse Protests
                </Link>
                <Link to="/awareness" className="btn btn-outline border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                  Read Articles
                </Link>
                {user.role === 'organizer' && (
                  <Link to="/create-protest" className="btn bg-green-600 text-white hover:bg-green-700">
                    Create Protest
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of Pakistanis who are using their voice for positive change through peaceful protests and awareness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="btn btn-primary text-center"
                >
                  Sign Up Free
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-outline border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-center"
                >
                  Login to Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;