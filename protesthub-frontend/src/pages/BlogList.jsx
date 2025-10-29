import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { awarenessAPI } from '../services/api';

const BlogList = ({ user }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await awarenessAPI.getBlogPosts();
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const likeBlogPost = async (postId) => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    try {
      await awarenessAPI.likeBlogPost(postId);
      fetchBlogPosts(); // Refresh to update like counts
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'legal_rights', label: '📚 Legal Rights' },
    { value: 'protest_safety', label: '🛡️ Protest Safety' },
    { value: 'laws', label: '⚖️ Laws & Regulations' },
    { value: 'guidelines', label: '📋 Protest Guidelines' },
    { value: 'success_stories', label: '🌟 Success Stories' },
    { value: 'general', label: '📢 General Awareness' },
  ];

  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="card p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Rights Awareness & Education</h1>
                <p className="text-gray-600 mt-2">
                  Learn about your rights, protest safety, and legal guidelines
                </p>
              </div>
              {user && (
                <Link
                  to="/create-blog"
                  className="btn bg-green-600 text-white hover:bg-green-700"
                >
                  📝 Write New Post
                </Link>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
                <p className="text-gray-600 mb-4">
                  {selectedCategory 
                    ? `No posts in ${categories.find(c => c.value === selectedCategory)?.label} category`
                    : 'Be the first to share educational content about rights and awareness!'
                  }
                </p>
                {user && (
                  <Link
                    to="/create-blog"
                    className="btn bg-green-600 text-white hover:bg-green-700"
                  >
                    Write First Post
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <div key={post.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {post.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>By {post.author_name}</span>
                          <span>•</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="capitalize">{post.category.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => likeBlogPost(post.id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                          post.is_liked
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span>❤️</span>
                        <span>{post.like_count}</span>
                      </button>
                    </div>

                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <Link
                        to={`/awareness/${post.id}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Read More →
                      </Link>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>💬 {post.comment_count} comments</span>
                      </div>
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

export default BlogList;