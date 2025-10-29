import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtestList from './pages/ProtestList';
import ProtestDetail from './pages/ProtestDetail';
import CreateProtest from './pages/CreateProtest';
import CreateBlogPost from './pages/CreateBlogPost';
import BlogList from './pages/BlogList';
import UserProfile from './pages/UserProfile';
import { authAPI } from './services/api';
import './index.css';




import BlogDetail from './pages/BlogDetail';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.getProfile();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={logout} />
        <main>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={!user ? <Login onLogin={login} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register onLogin={login} /> : <Navigate to="/" />} />
            <Route path="/protests" element={<ProtestList user={user} />} />
            <Route path="/protests/:id" element={<ProtestDetail user={user} />} />
            
            {/* Protest creation - only for organizers and admins */}
            <Route 
              path="/create-protest" 
              element={
                user && (user.role === 'organizer' || user.role === 'admin') 
                  ? <CreateProtest user={user} /> 
                  : <Navigate to="/protests" />
              } 
            />
            
            {/* Blog creation - for all authenticated users */}
            <Route 
              path="/create-blog" 
              element={user ? <CreateBlogPost user={user} /> : <Navigate to="/login" />} 
            />
            
<Route path="/awareness/:id" element={<BlogDetail user={user} />} />  
            <Route path="/awareness" element={<BlogList user={user} />} />
            <Route path="/profile" element={user ? <UserProfile user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;