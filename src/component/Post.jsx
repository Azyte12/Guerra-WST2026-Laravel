
import React, { useState, useEffect } from 'react';
import { getPosts, storePost } from '../api/post';
import './styles/post.css';
import PostCard from './PostCard';

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        const data = response.data.data || response.data;
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load posts", err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (message.trim() && error === 'Post cannot be empty') {
      setError('');
    }
  }, [message, error]);

  const submit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Post cannot be empty');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await storePost({ message });

      const newPost = response.data.data || response.data;

      if (!newPost || typeof newPost !== 'object') {
        throw new Error('The server returned an invalid post.');
      }

      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setMessage('');

    } catch (err) {
      console.error('Failed to create post', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to create post. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="post-container">
      <div className="post-form-container">
        <form onSubmit={submit}>
          <div className="post-header">
            <h2>Create Post</h2>
          </div>

          <div className="post-body">
            <textarea
              className="post-input"
              placeholder="What's on your mind?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={processing}
              rows={4}
            />
          </div>

          {error && (
            <div className="post-error">
              {error}
            </div>
          )}

          <div className="post-footer">
            <button
              type="submit"
              className="post-submit-btn"
              disabled={processing || !message.trim()}
            >
              {processing ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      <div className="post-feed-list">
        {loading ? (
          <div className="post-loading-state">Loading posts...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id ?? post.uuid ?? post.created_at}
              post={post}
            />
          ))
        ) : (
          <div className="post-empty-state">
            No posts shared yet.
          </div>
        )}
      </div>
    </div>
  );
}
