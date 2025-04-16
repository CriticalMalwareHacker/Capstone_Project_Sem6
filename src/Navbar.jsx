import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo from './assets/logo.png';
function Navbar({ onSearch }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkmode") === "true");
    const menuRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        onSearch(e.target.value); // Pass the search query to parent component
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Navigate to the blogs page with the search query
        navigate(`/blogs?search=${searchQuery}`);
    };
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        document.body.classList.toggle('dark', newDarkMode);
        localStorage.setItem("darkmode", newDarkMode);
    };
    useEffect(() => {
        if (localStorage.getItem("darkmode") === "true") {
            document.body.classList.add('dark');
        }
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <nav className="navbar">
            <div className="logo">
                <NavLink to="/">
                    <img src={logo} alt="BlogyTech Logo" />
                </NavLink>
            </div>

            <ul className="links">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/blogs">Blogs</NavLink></li>
            </ul>
            <form className="search-box" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder=" "
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button type="reset" onClick={() => setSearchQuery('')}></button>

            </form>
            <div className="mode-toggle">
                <h6 className={`label-light ${isDarkMode ? '' : 'noselect'}`} onClick={() => !isDarkMode && toggleDarkMode()}>Light</h6>
                <button className="toggle-switch" onClick={toggleDarkMode} title={isDarkMode ? "Go light" : "Go dark"}></button>
                <h6 className={`label-dark ${isDarkMode ? 'noselect' : ''}`} onClick={() => isDarkMode && toggleDarkMode()}>Dark</h6>
            </div>
            <div className="links">
                {currentUser ? (
                    <div className="profile-menu-container" ref={menuRef}>
                        <div
                            className="profile-trigger"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {currentUser.username ? (
                                <div className="user-avatar">
                                    {currentUser.username.charAt(0).toUpperCase()}
                                </div>
                            ) : (
                                <div className="user-avatar">U</div>
                            )}
                        </div>

                        {isMenuOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-header">
                                    <span className="username">{currentUser.username}</span>
                                    <span className="email">{currentUser.email}</span>
                                </div>
                                <ul className="profile-menu">
                                    <li>
                                        <NavLink to="/create" onClick={() => setIsMenuOpen(false)}>
                                            Create Post
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
                                            My Profile
                                        </NavLink>
                                    </li>
                                    <li className="divider"></li>
                                    <li>
                                        <button onClick={handleLogout} className="logout-button">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <NavLink to="/signin" className="signin-button">Sign In</NavLink>
                        <NavLink to="/signup" className="signup-button">Sign Up</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
