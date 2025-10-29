import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-green-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <circle cx="12" cy="12" r="10" className="text-white/20" fill="currentColor"/>
                <path d="M12 6a6 6 0 100 12 6 6 0 000-12z" fill="#10B981"/>
              </svg>
              <span className="text-white font-bold text-xl">Digital Pakistan Movement</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/protests" 
              className={`nav-link ${location.pathname === '/protests' ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-700'}`}
            >
              Protests
            </Link>
            <Link 
              to="/awareness" 
              className={`nav-link ${location.pathname === '/awareness' ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-700'}`}
            >
              Awareness
            </Link>
            
            {/* Show Create buttons for authenticated users */}
            {user && (
              <>
                {/* All users can create blog posts */}
                <Link 
                  to="/create-blog" 
                  className={`nav-link ${location.pathname === '/create-blog' ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-700'}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                    Write Blog
                  </span>
                </Link>
                
                {/* Only organizers and admins can create protests */}
                {(user.role === 'organizer' || user.role === 'admin') && (
                  <Link 
                    to="/create-protest" 
                    className={`nav-link ${location.pathname === '/create-protest' ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-700'}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11V7a4 4 0 014-4h6"/><path d="M7 15h2"/><path d="M7 19h4"/><path d="M15 8h6v8a2 2 0 01-2 2h-4z"/></svg>
                      Create Protest
                    </span>
                  </Link>
                )}
              </>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`nav-link ${location.pathname === '/profile' ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-700'}`}
                >
                  profile {user.username} ({user.role})
                </Link>
                <button 
                  onClick={onLogout}
                  className="text-green-100 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-green-100 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-green-800 hover:bg-green-100 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-green-100 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-700">
              <Link 
                to="/protests" 
                className="text-green-100 hover:bg-green-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Protests
              </Link>
              <Link 
                to="/awareness" 
                className="text-green-100 hover:bg-green-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Awareness
              </Link>
              
              {/* Show Create buttons for authenticated users */}
              {user && (
                <>
                  {/* All users can create blog posts */}
                  <Link 
                    to="/create-blog" 
                    className="text-green-100 hover:bg-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    📝 Write Blog
                  </Link>
                  
                  {/* Only organizers and admins can create protests */}
                  {(user.role === 'organizer' || user.role === 'admin') && (
                    <Link 
                      to="/create-protest" 
                      className="text-green-100 hover:bg-green-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      🗣️ Create Protest
                    </Link>
                  )}
                </>
              )}
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-green-100 hover:bg-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    👤 {user.username} ({user.role})
                  </Link>
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="text-green-100 hover:bg-green-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-green-100 hover:bg-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-green-100 hover:bg-green-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;