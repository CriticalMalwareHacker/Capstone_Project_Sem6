import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import RichTextEditor from './RichTextEditor';
import './CreatePost.css';

// Custom FileUpload component to fix the image upload issue
const FileUpload = ({ handleImageChange, imagePreview }) => {
    const inputRef = useRef(null);
    const [fileName, setFileName] = useState("No file chosen");

    const triggerFileInput = () => {
        inputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            handleImageChange(e);
        } else {
            setFileName("No file chosen");
        }
    };

    return (
        <div className="file-upload-container">
            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
                id="image-upload"
                style={{ display: 'none' }}
            />
            <label
                htmlFor="image-upload"
                className="custom-file-upload"
                onClick={triggerFileInput}
            >
                Choose File
            </label>
            <span className="file-name">{fileName}</span>

            {imagePreview && (
                <div className="image-preview-container">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                    />
                </div>
            )}
        </div>
    );
};

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { currentUser } = useAuth();

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const slug = generateSlug(title);
            // Create FormData object to handle file upload
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('slug', slug);
            if (image) {
                formData.append('image', image);
            }
            const response = await axios.post('http://localhost:5000/api/posts', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess('Post created successfully!');
            setTitle('');
            setContent('');
            setImage(null);
            setImagePreview(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-container">
            <h1>Create New Post</h1>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <form className="create-post-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="title-input"
                />

                <RichTextEditor
                    initialContent={content}
                    onChange={setContent}
                />

                <FileUpload
                    handleImageChange={handleImageChange}
                    imagePreview={imagePreview}
                />

                <button
                    type="submit"
                    className="publish-button"
                    disabled={loading}
                >
                    {loading ? 'Publishing...' : 'Publish Post'}
                </button>
            </form>
        </div>
    );
}

export default CreatePost;
