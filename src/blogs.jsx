import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import blogplacehold from "./assets/hero-image.png"; // Import your placeholder image

function Blogs() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts?page=${currentPage}&limit=6`);
                setPosts(response.data.posts);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                setError('Failed to fetch posts');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage]);

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handlePageChange = (event) => {
        setCurrentPage(event.selected + 1);
    };

    if (isLoading) return <div>Loading blog posts...</div>;
    if (error) return <div>Error loading blog posts: {error}</div>;
    if (!filteredPosts || filteredPosts.length === 0) return <div>No blogs found for "{searchQuery}".</div>;


    return (
        <>
            <h1>You are viewing {filteredPosts.length} blog posts</h1>
            <div className="grid-container">
                {filteredPosts.map((post, index) => (
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
                            <div className="like-count">
                                <span>❤️ {post.likes?.length || 0}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={totalPages}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                />
            )}
        </>
    );
}

export default Blogs;
