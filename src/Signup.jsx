import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './signup_signin.css';
import man1 from "./assets/man-sign.png";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        re_password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password matching validation
        if (formData.password !== formData.re_password) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and redirect to signin
                localStorage.setItem("token", data.token);
                navigate('/Signin');
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <section className="signup">
            <div className="container">
                <div className="signup-content">
                    <div className="signup-form">
                        <h2 className="form-title">Sign up</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <form onSubmit={handleSubmit} className="register-form" id="register-form">
                            <div className="form-group">
                                <label htmlFor="username"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Your Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><i className="zmdi zmdi-lock"></i></label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="re_password"><i className="zmdi zmdi-lock-outline"></i></label>
                                <input
                                    type="password"
                                    name="re_password"
                                    id="re_password"
                                    placeholder="Repeat your password"
                                    value={formData.re_password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input type="checkbox" name="agree-term" id="agree-term" className="agree-term" required />
                                <label htmlFor="agree-term" className="label-agree-term">
                                    <span><span></span></span>
                                    I agree all statements in <a href="#" className="term-service">Terms of service</a>
                                </label>
                            </div>
                            <div className="form-group form-button">
                                <input type="submit" name="signup" id="signup" className="form-submit" value="Register" />
                            </div>
                        </form>
                    </div>
                    <div className="signup-image">
                        <figure><img src={man1} alt="sign up image" /></figure>
                        <Link to="/Signin" className="signup-image-link">I am already member</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
