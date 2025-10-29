import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { awarenessAPI } from '../services/api';

const CreateBlogPost = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'general'
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
      await awarenessAPI.createBlogPost(formData);
      navigate('/awareness');
    } catch (error) {
      console.error('Error creating blog post:', error);
      setError(error.response?.data?.message || 'Failed to create blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'legal_rights', label: '📚 Legal Rights' },
    { value: 'protest_safety', label: '🛡️ Protest Safety' },
    { value: 'laws', label: '⚖️ Laws & Regulations' },
    { value: 'guidelines', label: '📋 Protest Guidelines' },
    { value: 'success_stories', label: '🌟 Success Stories' },
    { value: 'general', label: '📢 General Awareness' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Awareness Post</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Post Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Your Constitutional Rights in Pakistan"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Short Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                value={formData.excerpt}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Brief summary of your post..."
                maxLength={300}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.excerpt.length}/300 characters
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Write your educational content about rights, safety, or awareness..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/awareness')}
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

export default CreateBlogPost;