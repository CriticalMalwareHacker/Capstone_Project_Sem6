import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useParams
} from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./login.jsx";
import Blogs from "./blogs.jsx";
import Authors from "./authors.jsx";
import AboutUs from "./about_us.jsx";
import Navbar from "./Navbar.jsx";
import Singlepost from "./Singlepost.jsx";

// Add error boundary component
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className="error-fallback">Something went wrong. Please try again later.</div>;
        }
        return this.props.children;
    }
}

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
                            <PostErrorBoundary>
                                <Singlepost />
                            </PostErrorBoundary>
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