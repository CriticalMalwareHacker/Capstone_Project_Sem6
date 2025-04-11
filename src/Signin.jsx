import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './signup_signin.css';
import man from "./assets/man-writing.jpg";
import { useAuth } from './AuthContext';

const SignIn = () => {
    const navigate = useNavigate();
    const { login, currentUser } = useAuth();
    const [formData, setFormData] = useState({
        your_name: '',
        your_pass: ''
    });
    const [error, setError] = useState('');

    // Check if user is already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Call login function from AuthContext
        const result = await login(formData.your_name, formData.your_pass);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    // If already logged in, don't render the form
    if (currentUser) {
        return null;
    }

    return (
        <section className="sign-in">
            <div className="container">
                <div className="signin-content">
                    <div className="signin-image">
                        <figure><img src={man} alt="sign in" /></figure>
                        <Link to="/Signup" className="signup-image-link">Create an account</Link>
                    </div>

                    <div className="signin-form">
                        <h2 className="form-title">Sign in</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <form onSubmit={handleSubmit} className="register-form" id="login-form">
                            <div className="form-group">
                                <label htmlFor="your_name">
                                    <i className="zmdi zmdi-account material-icons-name"></i>
                                </label>
                                <input
                                    type="text"
                                    name="your_name"
                                    id="your_name"
                                    placeholder="Your Email"
                                    value={formData.your_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="your_pass">
                                    <i className="zmdi zmdi-lock"></i>
                                </label>
                                <input
                                    type="password"
                                    name="your_pass"
                                    id="your_pass"
                                    placeholder="Password"
                                    value={formData.your_pass}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input type="checkbox" name="remember-me" id="remember-me" className="agree-term" />
                                <label htmlFor="remember-me" className="label-agree-term">
                                    <span><span></span></span> Remember me
                                </label>
                            </div>
                            <div className="form-group form-button">
                                <input type="submit" name="signin" id="signin" className="form-submit" value="Log in" />
                            </div>
                        </form>
                        <div className="social-login">
                            <span className="social-label">Or login with</span>
                            <ul className="socials">
                                <li><a href="#"><i className="display-flex-center zmdi zmdi-facebook"></i></a></li>
                                <li><a href="#"><i className="display-flex-center zmdi zmdi-twitter"></i></a></li>
                                <li><a href="#"><i className="display-flex-center zmdi zmdi-google"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignIn;
