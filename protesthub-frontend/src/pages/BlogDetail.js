import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { awarenessAPI } from '../services/api';

const BlogDetail = ({ user }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchBlogPost();
    fetchComments();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const response = await awarenessAPI.getBlogPost(id);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await awarenessAPI.getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const likeBlogPost = async () => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    try {
      await awarenessAPI.likeBlogPost(id);
      fetchBlogPost(); // Refresh post data
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }

    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      await awarenessAPI.createComment(id, { content: newComment });
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setCommentLoading(false);
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link to="/awareness" className="btn btn-primary">
              ← Back to Awareness
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="card p-8">
          {/* Post Header */}
          <header className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>By {post.author_name}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="capitalize">{post.category.replace('_', ' ')}</span>
                </div>
              </div>
              <button
                onClick={likeBlogPost}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  post.is_liked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>❤️</span>
                <span>{post.like_count} likes</span>
              </button>
            </div>

            {post.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-700 italic">{post.excerpt}</p>
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Comments Section */}
          <section className="border-t pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              💬 Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            {user && (
              <form onSubmit={submitComment} className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={commentLoading}
                    className="btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{comment.user_name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Back Button */}
          <div className="mt-8">
            <Link to="/awareness" className="btn btn-primary">
              ← Back to Awareness Posts
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;