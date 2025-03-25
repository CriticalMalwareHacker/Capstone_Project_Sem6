import "./login.css";
export default function Login() {
    return (
        <>
            {/* NAVBAR */}
        
            {/* LOGIN FORM */}
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">Login Form</div>
                    <div className="title signup">Signup Form</div>
                </div>
                <div className="form-container">
                    <div className="slide-controls">
                        <input type="radio" name="slide" id="login" defaultChecked />
                        <input type="radio" name="slide" id="signup" />
                        <label htmlFor="login" className="slide login">Login</label>
                        <label htmlFor="signup" className="slide signup">Signup</label>
                        <div className="slider-tab"></div>
                    </div>
                    <div className="form-inner">
                        <form action="#" className="login">
                            <div className="field">
                                <input type="text" placeholder="Email Address" required />
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Password" required />
                            </div>
                            <div className="pass-link">
                                <a href="#">Forgot password?</a>
                            </div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" value="Login" />
                            </div>
                            <div className="signup-link">
                                Not a member? <a href="">Signup now</a>
                            </div>
                        </form>

                        <form action="#" className="signup">
                            <div className="field">
                                <input type="text" placeholder="Email Address" required />
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Password" required />
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Confirm password" required />
                            </div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" value="Signup" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="footerbg">
                <div className="footer">
                    <div className="footerleft">
                        <div className="flexL">
                            <h1 className="footer-question">Do you have what it takes to be a blog writer?</h1>
                            <h1 className="footer-join">Join Us Today -&gt;</h1>
                        </div>
                        <h1 className="copyright">
                            2025 Blogy.tech  Tanay Urvaksh Monil
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
