import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useParams
} from "react-router-dom";
import { useState, useEffect } from "react";
import { sanityClient as client } from '../client';
import hero from "./assets/hero-image.png";
import Home from "./Home.jsx";
import Login from "./login.jsx";
import Blogs from "./blogs.jsx";
import Authors from "./authors.jsx";
import AboutUs from "./about_us.jsx";
import Navbar from "./Navbar.jsx";
import Singlepost from "./Singlepost.jsx";


function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />

                    {/* Blog routes */}
                    <Route path="/blogs" element={<Blogs />} />
                    <Route
                        path="/blog/:slug"
                        element={

                            <Singlepost />

                        }
                    />

                    {/* Other routes */}
                    <Route path="/authors" element={<Authors />} />
                    <Route path="/about" element={<AboutUs />} />

                    {/* Redirects */}
                    <Route path="/blog" element={<Navigate to="/blogs" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

// Separate error boundary for post content
function PostErrorBoundary({ children }) {
    return (
        <ErrorBoundary
            fallback={<div className="post-error">Error loading post content</div>}
        >
            {children}
        </ErrorBoundary>
    );
}

export default App;