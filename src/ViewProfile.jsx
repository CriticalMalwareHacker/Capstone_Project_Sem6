// ViewProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

function ViewProfile() {
    const { userId } = useParams();
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    const isOwnProfile = currentUser && userId === currentUser._id;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!userId) {
                    setError('User ID is missing');
                    setIsLoading(false);
                    return;
                }

                // Get user profile
                const profileResponse = await axios.get(`http://localhost:5000/api/profile/${userId}`);
                setProfile(profileResponse.data);

                // Check if current user is following this profile
                if (currentUser && profileResponse.data.followers) {
                    setIsFollowing(profileResponse.data.followers.some(follower =>
                        follower._id === currentUser._id
                    ));
                }

                // Get user posts
                const postsResponse = await axios.get(`http://localhost:5000/api/posts/author/${userId}`);
                setPosts(postsResponse.data);
            } catch (err) {
                setError('Failed to load profile');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [userId, currentUser]);

    const handleFollow = async () => {
        if (!currentUser) return;

        try {
            const response = await axios.post(
                `http://localhost:5000/api/profile/follow/${userId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setIsFollowing(response.data.isFollowing);
            // Update follower count
            setProfile(prevProfile => ({
                ...prevProfile,
                followers: response.data.followers
            }));
        } catch (err) {
            setError('Failed to follow/unfollow user');
        }
    };

    if (isLoading) return <div className="loading-indicator">Loading profile...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!profile) return <div className="error-message">Profile not found</div>;

    return (
        <div className="profile-container">
            {/* Profile Cover */}
            <div className="profile-cover">
                {profile.coverImage && (
                    <img src={profile.coverImage} alt="Cover" />
                )}
            </div>

            {/* Profile Header */}
            <div className="profile-header">
                {/* Profile Avatar */}
                <div className="profile-avatar-container">
                    <div className="profile-avatar">
                        {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.username} />
                        ) : (
                            <div className="avatar-initials">
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="profile-info">
                    <h1 className="profile-name">{profile.username}</h1>
                    {profile.profession && <p className="profile-bio">{profile.profession}</p>}

                    <div className="profile-follower-count">
                        <span>{posts.length} Posts</span>
                        <span> · {profile.followers?.length || 0} Followers</span>
                        <span> · {profile.following?.length || 0} Following</span>
                    </div>

                    {!isOwnProfile && currentUser && (
                        <button
                            className={`action-button ${isFollowing ? 'cancel-edit-button' : 'edit-profile-button'}`}
                            onClick={handleFollow}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}

                    {isOwnProfile && (
                        <Link to="/profile/edit" className="action-button edit-profile-button">
                            Edit Profile
                        </Link>
                    )}

                    {profile.bio && <p className="profile-bio">{profile.bio}</p>}

                    {profile.location && (
                        <p className="profile-bio">
                            <strong>Location:</strong> {profile.location}
                        </p>
                    )}

                    {profile.website && (
                        <p className="profile-website">
                            <strong>Website:</strong>
                            <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                {profile.website}
                            </a>
                        </p>
                    )}
                </div>
            </div>

            {/* Profile Navigation */}
            <div className="profile-navigation">
                <ul className="nav-tabs">
                    <li
                        className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveTab('home')}
                    >
                        Home
                    </li>
                    <li
                        className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </li>
                </ul>
            </div>

            {/* Profile Content */}
            <div className="profile-content">
                <div className="posts-list">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} className="post-item">
                                <h2 className="post-title">{post.title}</h2>
                                <div
                                    className="post-excerpt"
                                    dangerouslySetInnerHTML={{
                                        __html: post.content.substring(0, 150) + '...'
                                    }}
                                />
                                {post.imagePath && (
                                    <div className="post-image-container">
                                        <img
                                            src={post.imagePath}
                                            alt={post.title}
                                            className="post-image"
                                            loading="lazy"
                                            onClick={() => window.open(post.imagePath, '_blank')}
                                            style={{ cursor: 'pointer' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="post-meta">
                                    <span>Published on {new Date(post.publishedAt).toLocaleDateString()}</span>
                                </div>
                                <Link to={`/blog/${post.slug}`} className="read-more-link">
                                    Read more
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-message">No posts yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewProfile;
