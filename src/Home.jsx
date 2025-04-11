import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import hero from "./assets/hero-image.png";
import blogplacehold from "./assets/hero-image.png";
const API_URL = "http://localhost:5000/api/posts";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setPosts(data.posts);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Format date helper
    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            {/* Grid of Posts */}
            <h1>You are viewing {posts.length} blog posts</h1>
            <div className="grid-container">
                {posts.map((post, index) => (
                    <Link
                        className="grid-item-link"
                        to={`/blog/${post.slug}`}
                        key={post._id || index}
                    >
                        <div className="grid-1">
                            <img
                                className="img-grid"
                                src={post.imagePath ? `http://localhost:5000${post.imagePath}` : blogplacehold}
                                alt={post.title}
                            />
                            <p className="name">
                                {post.author?.username || 'Unknown Author'} •
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                            <h2 className="title">{post.title}</h2>
                            <p className="para-text">
                                {post.content.substring(0, 150)}...
                            </p>
                            <div className="tags">
                                <div className="tag-1">
                                    <p>Technology</p>
                                </div>
                                <div className="tag-1">
                                    <p>Blog</p>
                                </div>
                                <div className="tag-1">
                                    <p>Web</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer */}
        </>
    );
}
