import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import BlogyTech from "./assets/Blogy.tech.png";

function Navbar() {
    // Run your vanilla JS code after the component mounts
    useEffect(() => {
        // Copy your entire vanilla JS code from navbar.js here
        const links = document.querySelectorAll('.navbar .links a');
        const animation = document.querySelector('.navbar .animation');
        const initialLink = document.querySelector('.navbar .links a.select');

        function positionAnimation(element) {
            const linkRect = element.getBoundingClientRect();
            const navbarRect = animation.parentElement.getBoundingClientRect();
            animation.style.left = `${linkRect.left - navbarRect.left}px`;
            animation.style.width = `${linkRect.width}px`;
            animation.style.height = `${linkRect.height}px`;
            animation.style.top = `${linkRect.top - navbarRect.top}px`;
        }

        if (initialLink) {
            positionAnimation(initialLink);
        }

        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                positionAnimation(link);
            });
            link.addEventListener('mouseleave', () => {
                if (initialLink) {
                    positionAnimation(initialLink);
                }
            });
        });

        // Repeat for other animations as in your original navbar.js
    }, []);
    useEffect(() => {
        // Copy your entire vanilla JS code from navbar.js here
        const links = document.querySelectorAll('.navbar .links a');
        const animation = document.querySelector('.navbar .animation-blogs');
        const initialLink = document.querySelector('.navbar .links a.blogs-link');

        function positionAnimation(element) {
            const linkRect = element.getBoundingClientRect();
            const navbarRect = animation.parentElement.getBoundingClientRect();
            animation.style.left = `${linkRect.left - navbarRect.left}px`;
            animation.style.width = `${linkRect.width}px`;
            animation.style.height = `${linkRect.height}px`;
            animation.style.top = `${linkRect.top - navbarRect.top}px`;
        }

        if (initialLink) {
            positionAnimation(initialLink);
        }

        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                positionAnimation(link);
            });
            link.addEventListener('mouseleave', () => {
                if (initialLink) {
                    positionAnimation(initialLink);
                }
            });
        });

        // Repeat for other animations as in your original navbar.js
    }, []);
    useEffect(() => {
        // Copy your entire vanilla JS code from navbar.js here
        const links = document.querySelectorAll('.navbar .links a');
        const animation = document.querySelector('.navbar .animation-authors');
        const initialLink = document.querySelector('.navbar .links a.authors-link');

        function positionAnimation(element) {
            const linkRect = element.getBoundingClientRect();
            const navbarRect = animation.parentElement.getBoundingClientRect();
            animation.style.left = `${linkRect.left - navbarRect.left}px`;
            animation.style.width = `${linkRect.width}px`;
            animation.style.height = `${linkRect.height}px`;
            animation.style.top = `${linkRect.top - navbarRect.top}px`;
        }

        if (initialLink) {
            positionAnimation(initialLink);
        }

        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                positionAnimation(link);
            });
            link.addEventListener('mouseleave', () => {
                if (initialLink) {
                    positionAnimation(initialLink);
                }
            });
        });

        // Repeat for other animations as in your original navbar.js
    }, []);
    // Return the same HTML structure as in your components
    return (
        <div className="navbar">
            <div className="logo">
                <Link to="/">
                    <img src={BlogyTech} alt="Blogy.tech logo" />
                </Link>
            </div>
            <ul className="links">
                <li><Link to="/" className="select">HOME</Link></li>
                <li><Link to="/about" className="about-link">ABOUT US</Link></li>
                <li><Link to="/blogs" className="blogs-link">BLOGS</Link></li>
                <li><Link to="/authors" className="authors-link">AUTHORS</Link></li>
            </ul>
            <div className="animation"></div>
            <div className="animation-about"></div>
            <div className="animation-blogs"></div>
            <div className="animation-authors"></div>
            <Link to="/login" className="btn">Login or Signup</Link>
            <div className="toggle_btn">
                <i className="fa-solid fa-bars"></i>
            </div>
        </div>
    );
}

export default Navbar;