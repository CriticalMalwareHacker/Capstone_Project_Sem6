import { Link, NavLink } from "react-router-dom"; // Optional: if using React Router for navigation
import BlogyTech from "./assets/Blogy.tech.png";
import { useState, useEffect } from "react"
import client from "../client.js"
import blogplacehold from "./assets/Rectangle.png";


export default function Blogs() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const postsPerPage = 6;
    useEffect(() => {
        client.fetch(
            `*[_type == "post"]|order(publishedAt desc){
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
            console.log("Fetched posts:", data); // Add this to debug
            setPosts(data);
            setIsLoading(false); // Added this line
        }).catch((error) => {
            console.error("Error fetching posts:", error); // Better error logging
            setError(error); // Added this line
            setIsLoading(false); // Added this line
        });
    }, []);
    const totalPages = Math.ceil(posts.length / postsPerPage);
    console.log("Total pages:", totalPages);

    // Function to handle page changes
    const paginate = (pageNumber) => {
        console.log("Paginating to page:", pageNumber);
        setCurrentPage(pageNumber);
    };
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    console.log("Current posts for page", currentPage, ":", currentPosts);

    if (isLoading) {
        return <div>Loading blog posts...</div>;
    }

    if (error) {
        return <div>Error loading blog posts: {error.message}</div>;
    }

    if (posts.length === 0) {
        return <div>No blog posts found. Please check your Sanity configuration.</div>;
    }
    return (
        <>
            {/* Navbar */}

            {/* Grid of Posts */}
            <h1>You are viewing {posts.length}blog posts</h1>
            <div className="grid-container">
                {currentPosts.map((post, index) => (
                    <Link className="grid-item-link"
                        to={`/blog/${post.slug?.current}`}
                        key={post.slug?.current || index}>
                        <div className="grid-1">
                            <img className="img-grid" src={post.mainImage?.asset?.url} />
                            <p className="name">{post.author || 'Unknown Author'}•{new Date(post.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            <h2 className="title">{post.title}</h2>
                            <p className="para-text">
                                Technology is the application of conceptual knowledge to achieve practical goals, especially in
                                a reproducible way.
                            </p>
                            <div className="tags">
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
            </div >
            {posts.length > postsPerPage && (
                <div className="pagination-container">
                    <button
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button pagination-prev"
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`pagination-button pagination-number ${currentPage === index + 1 ? 'pagination-active' : ''
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-button pagination-next"
                    >
                        Next
                    </button>
                </div>
            )}






            {/* Footer */}
            < div className="footerbg" >
                <div className="footer">
                    <div className="footerleft">
                        <div className="flexL">
                            <h1 className="footer-question">
                                Do you have what it takes to be a blog writer?
                            </h1>
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
            </div >
        </>
    );
}
