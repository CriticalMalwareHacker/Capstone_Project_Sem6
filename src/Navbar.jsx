import React, { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import BlogyTech from "./assets/Blogy.tech.png";

function Navbar() {
    const animationRefs = useRef({
        home: useRef(null),
        about: useRef(null),
        blogs: useRef(null),
        authors: useRef(null)
    });

    useEffect(() => {
        const handleAnimation = (linkClass, animationRef) => {
            const links = document.querySelectorAll(`.navbar .links a.${linkClass}`);
            const animation = animationRef.current;
            const initialLink = document.querySelector(`.navbar .links a.${linkClass}.active`);

            const positionAnimation = (element) => {
                if (!element || !animation) return;

                const linkRect = element.getBoundingClientRect();
                const navbarRect = animation.parentElement.getBoundingClientRect();

                animation.style.left = `${linkRect.left - navbarRect.left}px`;
                animation.style.width = `${linkRect.width}px`;
                animation.style.height = `${linkRect.height}px`;
                animation.style.top = `${linkRect.top - navbarRect.top}px`;
            };

            if (initialLink) positionAnimation(initialLink);

            links.forEach(link => {
                link.addEventListener('mouseenter', () => positionAnimation(link));
                link.addEventListener('mouseleave', () => positionAnimation(initialLink));
            });
        };

        // Initialize animations for each section
        handleAnimation('home-link', animationRefs.current.home);
        handleAnimation('about-link', animationRefs.current.about);
        handleAnimation('blogs-link', animationRefs.current.blogs);
        handleAnimation('authors-link', animationRefs.current.authors);

        return () => {
            // Cleanup event listeners if needed
        };
    }, []);

    return (
        <div className="navbar">
            <div className="logo">
                <Link to="/">
                    <img src={BlogyTech} alt="Blogy.tech logo" />
                </Link>
            </div>

            <ul className="links">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `home-link ${isActive ? 'active' : ''}`
                        }
                    >
                        HOME
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `about-link ${isActive ? 'active' : ''}`
                        }
                    >
                        ABOUT US
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/blogs"
                        className={({ isActive }) =>
                            `blogs-link ${isActive ? 'active' : ''}`
                        }
                    >
                        BLOGS
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/authors"
                        className={({ isActive }) =>
                            `authors-link ${isActive ? 'active' : ''}`
                        }
                    >
                        AUTHORS
                    </NavLink>
                </li>
            </ul>

            {/* Animation elements */}
            <div className="animation" ref={animationRefs.current.home}></div>
            <div className="animation-about" ref={animationRefs.current.about}></div>
            <div className="animation-blogs" ref={animationRefs.current.blogs}></div>
            <div className="animation-authors" ref={animationRefs.current.authors}></div>

            <Link to="/login" className="btn">Login or Signup</Link>
            <div className="toggle_btn">
                <i className="fa-solid fa-bars"></i>
            </div>
        </div>
    );
}

export default Navbar;