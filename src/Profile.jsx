// Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Profile() {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPosts(response.data);
            } catch (err) {
                setError('Failed to fetch your posts');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    const handleDeletePost = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPosts(posts.filter(post => post._id !== id));
            } catch (err) {
                setError('Failed to delete post');
            }
        }
    };

    if (isLoading) return <div>Loading your profile...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profile</h2>
                <div className="user-info">
                    <p><strong>Username:</strong> {currentUser.username}</p>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                </div>
            </div>

            <div className="my-posts-section">
                <h3>My Blog Posts</h3>
                {posts.length === 0 ? (
                    <div className="no-posts">
                        <p>You haven't created any posts yet.</p>
                        <Link to="/create" className="create-post-btn">Create Your First Post</Link>
                    </div>
                ) : (
                    <div className="posts-list">
                        {posts.map(post => (
                            <div key={post._id} className="post-item">
                                {post.imagePath && (
                                    <div className="post-thumbnail">
                                        <img
                                            src={`http://localhost:5000${post.imagePath}`}
                                            alt={post.title}
                                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                                        />
                                    </div>
                                )}
                                <div className="post-details">
                                    <h4>{post.title}</h4>
                                    <p className="post-date">
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="post-actions">
                                    <Link to={`/blog/${post.slug}`} className="view-btn">
                                        View
                                    </Link>
                                    <Link to={`/edit-post/${post._id}`} className="edit-btn">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDeletePost(post._id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
