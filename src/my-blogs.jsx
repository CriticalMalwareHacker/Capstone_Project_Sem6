import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function MyBlogs() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/signin');
            return;
        }

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
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPosts();
    }, [currentUser, navigate]);

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
                console.error(err);
            }
        }
    };

    if (isLoading) return <div>Loading your posts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="my-blogs-container">
            <h2>My Blog Posts</h2>
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
                                    />
                                </div>
                            )}
                            <div className="post-details">
                                <h3>{post.title}</h3>
                                <p>{post.content.substring(0, 100)}...</p>
                                <div className="post-meta">
                                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBlogs;
