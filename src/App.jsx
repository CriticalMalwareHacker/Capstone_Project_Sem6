import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider } from './AuthContext';
import Home from "./Home.jsx";
import SignIn from "./Signin.jsx";
import Signup from "./Signup.jsx";
import Blogs from "./blogs.jsx";
import Authors from "./authors.jsx";
import AboutUs from "./about_us.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Singlepost from "./Singlepost.jsx";
import CreatePost from "./CreatePost.jsx";
import MyBlogs from "./my-blogs.jsx";
import Profile from './Profile';
import EditPost from './EditPost';
import ViewProfile from './ViewProfile.jsx';
import React, { useState, useEffect } from 'react';


function App() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Router>
            <AuthProvider>
                <div className="app-container">
                    <Navbar onSearch={(query) => setSearchQuery(query)} />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/Signin" element={<SignIn />} />
                            <Route path="/Signup" element={<Signup />} />

                            {/* Blog routes */}
                            <Route path="/blogs" element={<Blogs searchQuery={searchQuery} />} />
                            <Route path="/blog/:slug" element={<Singlepost />} />
                            <Route path="/create" element={<CreatePost />} />

                            {/* Other routes */}
                            <Route path="/authors" element={<Authors />} />
                            <Route path="/about" element={<AboutUs />} />

                            {/* Redirects */}
                            <Route path="/blog" element={<Navigate to="/blogs" replace />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                            <Route path="/MyBlogs" element={<MyBlogs />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/edit-post/:id" element={<EditPost />} />
                            <Route path="/profile/:userId" element={<ViewProfile />} />
                            <Route path="/profile" element={<Profile />
                            } />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
