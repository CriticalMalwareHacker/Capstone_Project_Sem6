import { Link, NavLink } from "react-router-dom"; // Optional: if using React Router for navigation
import BlogyTech from "./assets/Blogy.tech.png";
import hero from "./assets/hero-image.png";
import blogplacehold from "./assets/Rectangle.png";


export default function Home() {
    return (
        <>
            {/* NAVBAR */}
            {/* MAIN TITLE */}
            <div className="main-title">
                <h1>Publishings from our team</h1>
                <h3>The latest tech news, interviews, technologies and much more</h3>
            </div>

            {/* HERO SECTION */}
            <div className="hero">
                <div className="hero-content">
                    <h2>China’s Open Source AI rivals OpenAI’s Chatgpt</h2>
                    <h4 className="author-hero">Urvaksh Bhagwager•30th Jan 2025</h4>
                    <div className="ele">
                        <h4 className="tags">AI</h4>
                        <h4 className="tags">Generative AI</h4>
                        <h4 className="tags">Deepseek</h4>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={hero} alt="Hero" />
                </div>
            </div>

            {/* GRID CONTAINER */}
            <div className="grid-container">
                <div className="grid-1">
                    <img className="img-grid" src={blogplacehold} />
                    <p className="name">Tanay Kumar•30th Jan 2025</p>
                    <h2 className="title">Lorem Ipsum</h2>
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
                <div className="grid-1">
                    <img className="img-grid" src={blogplacehold} />
                    <p className="name">Tanay Kumar•30th Jan 2025</p>
                    <h2 className="title">Lorem Ipsum</h2>
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
                <div className="grid-1">
                    <img className="img-grid" src={blogplacehold} />
                    <p className="name">Tanay Kumar•30th Jan 2025</p>
                    <h2 className="title">Lorem Ipsum</h2>
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
                <div className="grid-1">
                    <img className="img-grid" src={blogplacehold} />
                    <p className="name">Tanay Kumar•30th Jan 2025</p>
                    <h2 className="title">Lorem Ipsum</h2>
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
                <div className="grid-1">
                    <img className="img-grid" src={blogplacehold} />
                    <p className="name">Tanay Kumar•30th Jan 2025</p>
                    <h2 className="title">Lorem Ipsum</h2>
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
                <div className="grid-1">
                    <img className="img-grid" src={blogplacehold} />
                    <p className="name">Tanay Kumar•30th Jan 2025</p>
                    <h2 className="title">Lorem Ipsum</h2>
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
            </div>

            {/* Read More Blogs */}
            <div className="main-title1">
                <h3>
                    <a style={{ textDecoration: "none", color: "black" }} href="blogs.html">
                        Read more blogs -&gt;
                    </a>
                </h3>
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
