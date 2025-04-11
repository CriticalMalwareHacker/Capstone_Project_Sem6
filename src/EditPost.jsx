// EditPost.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!currentUser) {
            navigate('/signin');
            return;
        }

        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/id/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const post = response.data;
                setTitle(post.title);
                setContent(post.content);
                setCurrentImage(post.imagePath);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch post');
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, currentUser, navigate]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            const response = await axios.put(`http://localhost:5000/api/posts/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Update response:', response.data); // Debugging
            setSuccess('Post updated successfully!');
            setTimeout(() => navigate('/my-blogs'), 2000);
        } catch (err) {
            console.error('Error updating post:', err.response?.data || err.message); // Debugging
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };



    if (loading && !success) return <div>Loading post data...</div>;

    return (
        <div className="edit-post">
            <h2>Edit Post</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    {currentImage && (
                        <div className="current-image">
                            <p>Current image:</p>
                            <img
                                src={`http://localhost:5000${currentImage}`}
                                alt="Current post"
                                style={{ maxWidth: '200px' }}
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <small>Leave empty to keep current image</small>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Post'}
                </button>
            </form>
        </div>
    );
}

export default EditPost;
