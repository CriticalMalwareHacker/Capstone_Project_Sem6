import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import blogplacehold from "./assets/Rectangle.png";
import Home from "./Home.jsx";
import Login from "./login.jsx";
import Blogs from "./blogs.jsx";
import Authors from "./authors.jsx";
import AboutUs from "./about_us.jsx";
import Navbar from "./Navbar.jsx";
function App() {
    return (
        <Router>
            <div className="app-container">
                {/* Shared Navbar across pages */}
                <Navbar />

                {/* Define routes for your pages */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/authors" element={<Authors />} />
                    <Route path="/about" element={<AboutUs />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
