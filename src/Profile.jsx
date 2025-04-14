import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Profile() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    // Removed cover image state and ref
    const avatarImageRef = useRef(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [postFormData, setPostFormData] = useState({
        title: '',
        content: ''
    });

    // State for profile editing
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        bio: currentUser?.bio || '',
        website: currentUser?.website || ''
    });

    // Handle avatar image upload
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:5000/api/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Update the current user's avatar URL
            currentUser.avatarUrl = response.data.avatarUrl;
        } catch (err) {
            setError('Failed to upload avatar');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle profile form input changes
    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData(prev => ({ ...prev, [name]: value }));
    };

    // Fixed: Removed the post parameter that was causing the error
    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put('http://localhost:5000/api/profile', profileFormData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Update the current user's profile info
            currentUser.bio = response.data.bio;
            currentUser.website = response.data.website;

            // Exit edit mode
            setIsEditingProfile(false);
        } catch (err) {
            setError('Failed to update profile');
        }
    };

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

    // Handle edit post button click
    const handleEditPost = (post) => {
        setEditingPostId(post._id);
        setPostFormData({
            title: post.title,
            content: post.content
        });
    };

    // Handle post form input changes
    const handlePostInputChange = (e) => {
        const { name, value } = e.target;
        setPostFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle post update submission
    const handleUpdatePost = async (postId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/posts/${postId}`, postFormData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Update the posts list with the updated post
            setPosts(posts.map(post => post._id === postId ? response.data : post));

            // Exit edit mode
            setEditingPostId(null);
        } catch (err) {
            setError('Failed to update post');
        }
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingPostId(null);
    };

    if (isLoading && !posts.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            {/* Removed cover image section */}

            <div className="profile-header">
                <div className="profile-avatar-container">
                    <div className="profile-avatar" onClick={() => avatarImageRef.current.click()}>
                        {currentUser?.avatarUrl ? (
                            <img src={`http://localhost:5000${currentUser.avatarUrl}`} alt="Profile" />
                        ) : (
                            <div className="avatar-initials">{currentUser?.username?.charAt(0)?.toUpperCase()}</div>
                        )}
                        <div className="avatar-upload-overlay">
                            📷 Change
                        </div>
                        <input
                            type="file"
                            ref={avatarImageRef}
                            onChange={handleAvatarUpload}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="profile-info">
                    <h1 className="profile-name">{currentUser?.username}</h1>
                    <div className="profile-follower-count">Member since {new Date(currentUser?.createdAt).toLocaleDateString()}</div>

                    {isEditingProfile ? (
                        <div>
                            <textarea
                                className="profile-bio-input"
                                name="bio"
                                value={profileFormData.bio}
                                onChange={handleProfileInputChange}
                                placeholder="Tell us about yourself..."
                            />
                            <input
                                type="text"
                                className="profile-website-input"
                                name="website"
                                value={profileFormData.website}
                                onChange={handleProfileInputChange}
                                placeholder="Your website (e.g., https://example.com)"
                            />
                            <div className="profile-edit-actions">
                                {/* Fixed: Removed post parameter from onClick handler */}
                                <button className="action-button edit-profile-button" onClick={handleUpdateProfile}>Save Changes</button>
                                <button className="action-button cancel-edit-button" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="profile-bio">{currentUser?.bio || 'No bio added yet.'}</p>
                            {currentUser?.website && (
                                <p className="profile-website">
                                    <a href={currentUser.website} target="_blank" rel="noopener noreferrer">
                                        {currentUser.website}
                                    </a>
                                </p>
                            )}
                            <button className="action-button edit-profile-button" onClick={() => setIsEditingProfile(true)}>
                                Edit Profile
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="profile-navigation">
                <ul className="nav-tabs">
                    <li className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                        Home
                    </li>
                    <li className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
                        Posts
                    </li>
                </ul>
            </div>

            <div className="profile-content">
                {activeTab === 'posts' && (
                    <div className="posts-list">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post._id} className="post-item">
                                    {editingPostId === post._id ? (
                                        <div>
                                            <input
                                                type="text"
                                                name="title"
                                                value={postFormData.title}
                                                onChange={handlePostInputChange}
                                                className="edit-post-title"
                                            />
                                            <textarea
                                                name="content"
                                                value={postFormData.content}
                                                onChange={handlePostInputChange}
                                                className="edit-post-content"
                                            />
                                            <div className="post-actions">
                                                <button className="action-button update-post-button" onClick={() => handleUpdatePost(post._id)}>
                                                    Update
                                                </button>
                                                <button className="action-button cancel-edit-button" onClick={cancelEditing}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="post-title">{post.title}</h2>
                                            <p className="post-excerpt"><div className="post-excerpt" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }} /></p>
                                            {post.imagePath && (
                                                <img src={`http://localhost:5000${post.imagePath}`} alt={post.title} className="post-image" />
                                            )}
                                            <div className="post-meta">
                                                Published on {new Date(post.publishedAt).toLocaleDateString()}
                                            </div>
                                            <div className="post-actions">
                                                <button className="action-button edit-post-button" onClick={() => handleEditPost(post)}>
                                                    Edit
                                                </button>
                                                <button className="action-button delete-post-button" onClick={() => handleDeletePost(post._id)}>
                                                    Delete
                                                </button>
                                                <Link to={`/blog/${post.slug}`} className="action-button view-post-button">
                                                    View
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p className="empty-state-message">You haven't created any posts yet.</p>
                                <Link to="/create-post" className="create-post-button">
                                    Create Your First Post
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'home' && (
                    <div>
                        <h2>Your lists will appear here.</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
