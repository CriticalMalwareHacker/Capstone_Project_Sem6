import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import client from "../client.js";
import hero from "./assets/hero-image.png";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const postsPerPage = 6;

    useEffect(() => {
        client.fetch(
            `*[_type == "post"] | order(publishedAt desc) {
                title,
                slug,
                body,
                mainImage{
                    asset->{
                        _id,
                        url
                    },
                    alt   
                },
                "author": author->name,
                "authorSlug": author->slug,
                publishedAt
            }`
        ).then((data) => {
            setPosts(data);
            setIsLoading(false);
        }).catch((error) => {
            console.error("Error fetching posts:", error);
            setError(error);
            setIsLoading(false);
        });
    }, []);

    // Pagination calculations
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading posts: {error.message}</div>;
    const latestPost = posts[0]; // Hero post
    const remainingPosts = posts.slice(1); // Grid posts
    return (
        <>
            {/* Navbar would go here */}

            {/* Main Content */}
            <div className="main-title">
                <h1>Publishings from our team</h1>
                <h3>The latest tech news, interviews, technologies and much more</h3>
            </div>

            <Link to={`/blog/${latestPost.slug?.current}`} className="hero">
                <div className="hero-content">
                    <h2>{latestPost.title}</h2>
                    {/* Dynamic author and date */}
                    <h4 className="author-hero">
                        {latestPost.author} •
                        {new Date(latestPost.publishedAt).toLocaleDateString()}
                    </h4>
                    <div className="tags">
                        {/* Replace static tags with dynamic tags from your CMS */}
                        <div className="tags">
                            <p>AI</p>
                        </div>
                        <div className="tags">
                            <p>Generative AI</p>
                        </div>
                        <div className="tags">
                            <p>Deepseek</p>
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <img
                        src={latestPost.mainImage?.asset?.url}
                        alt={latestPost.mainImage?.alt}
                    />
                </div>
            </Link>
            {/* Hero Section */}


            <div className="grid-container">
                {currentPosts.map((post, index) => (
                    <Link
                        className="grid-item-link"
                        to={`/blog/${post.slug?.current}`}
                        key={post.slug?.current || index}
                    >
                        <div className="grid-1">
                            <img
                                className="img-grid"
                                src={post.mainImage?.asset?.url}
                                alt={post.mainImage?.alt || 'Blog post image'}
                            />
                            <p className="name">
                                {post.author || 'Unknown Author'} •
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                            <h2 className="title">{post.title}</h2>
                            <p className="para-text">
                                {/* You should use actual post content here */}
                                Technology is the application of conceptual knowledge to achieve practical goals...
                            </p>
                            <div className="tags">
                                {/* Replace static tags with dynamic tags from your CMS */}
                                <div className="tag-1">
                                    <p>AI</p>
                                </div>
                                <div className="tag-1">
                                    <p>Generative AI</p>
                                </div>
                                <div className="tag-1">
                                    <p>Deepseek</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Read More Section */}
            <div className="main-title1">
                <h3>
                    <Link to="/blogs" style={{ textDecoration: "none", color: "black" }}>
                        Read more blogs -&gt;
                    </Link>
                </h3>
            </div>

            {/* Footer */}
            <div className="footerbg">
                <div className="footer">
                    <div className="footerleft">
                        <div className="flexL">
                            <h1 className="footer-question">Do you have what it takes to be a blog writer?</h1>
                            <h1 className="footer-join">Join Us Today -&gt;</h1>
                        </div>
                        <h1 className="copyright">
                            2025 Blogy.tech © Tanay Urvaksh Monil
                        </h1>
                    </div>
                    <div className="footerright">
                        <div className="flexR">
                            <h3 className="footer-question1">Got any questions?</h3>
                            <h3 className="footer-join1">Contact Us -&gt;</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}