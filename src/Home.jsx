import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "./assets/hero-image.png";

// For events data (keeping it static for now)
const eventsData = [
  {
    id: 1,
    title: "Social Conclave 2025: Chief Guest, Shri. Shripad Yesso Naik, Union Minister of State in the Ministry of Power; and Minister of State in the Ministry of New and Renewable Energy.",
    date: "2025-01-29"
  },
  {
    id: 2,
    title: "Wings and Roots organized by the 4C Marketing Cell of NMIMS MPSTME",
    date: "2025-01-27"
  },
  {
    id: 3,
    title: "Data-Driven Decision Making with Industry Expert Mr. Chinmaya Mohanty",
    description: "We are thrilled to announce an insightful session on Data-Driven Decision Making: The Key to Organizational Success, featuring Mr. Chinmaya Mohanty, Head Business HR at RPG Life Science.",
    date: "2025-01-11"
  }
];

// Fallback news data if API fails
const fallbackNews = [
  {
    id: 1,
    title: "Team M4 - DeepAirSight Wins 1st Prize at Applied AI Hackathon 2025!",
    description: "Our brilliant students developed an innovative drone-based air quality monitoring system that impressed the judges with its real-time analytics capabilities.",
    image: "https://picsum.photos/seed/news1/600/400",
    url: "#",
    source: "Campus News"
  },
  {
    id: 2,
    title: "Team Magnum Opus Triumphs at Bitathon 2025",
    description: "Five students from our Computer Science department created a blockchain solution for medical record management that earned them top honors at the national competition.",
    image: "https://picsum.photos/seed/news2/600/400",
    url: "#",
    source: "Tech Chronicle"
  },
  {
    id: 3,
    title: "Team Coding Crusaders Triumphs at IIT Bombay Event",
    description: "Our undergraduate programming team solved complex algorithmic challenges to win first place at the prestigious annual coding competition.",
    image: "https://picsum.photos/seed/news3/600/400",
    url: "#",
    source: "Education Times"
  }
];

export default function Home() {
  // State for achievements/news
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('en-US', { month: 'short' }),
      year: date.getFullYear()
    };
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log("Starting news fetch...");
        const API_KEY = "8df2a2aa3a924c5ba01a2c6e06f6ad81";
        
        // Using a CORS proxy to avoid CORS issues with NewsAPI
        const corsProxyUrl = "https://api.allorigins.win/raw?url=";
        const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
        const encodedUrl = encodeURIComponent(newsApiUrl);
        
        console.log("Making API request through CORS proxy...");
        const response = await fetch(`${corsProxyUrl}${encodedUrl}`);
        
        console.log("API Response Status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from API:", errorText);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response Data:", data);
        
        // Check if we have articles
        if (!data.articles || data.articles.length === 0) {
          console.warn("No articles found in API response");
          throw new Error("No articles found");
        }
        
        // Transform the API response to match your achievements data structure
        const formattedNews = data.articles.slice(0, 3).map((article, index) => ({
          id: index + 1,
          title: article.title || "No title available",
          description: article.description || "No description available",
          image: article.urlToImage || "https://picsum.photos/seed/placeholder/600/400",
          url: article.url || "#",
          source: article.source?.name || "Unknown source",
          publishedAt: article.publishedAt
        }));
        
        console.log("Formatted News:", formattedNews);
        setAchievements(formattedNews);
        setLoading(false);
      } catch (error) {
        console.error("Error in news fetch:", error);
        setError(`Failed to load latest news: ${error.message}. Using fallback data.`);
        
        // Use fallback data if API fails
        console.log("Using fallback news data");
        setAchievements(fallbackNews);
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Our Institution</h1>
          <p className="hero-description">Empowering students with cutting-edge technology and innovation</p>
          <Link to="/apply" className="apply-button">APPLY NOW</Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Campus Technology" />
        </div>
      </section>

      {/* News/Achievements Section */}
      <section className="achievements-section">
        <div className="section-header">
          <h2 className="section-title">Latest News</h2>
          <Link to="/news" className="view-all-link">View all</Link>
        </div>
        
        {loading ? (
          <div className="loading-indicator">Loading latest news...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="achievements-grid">
            {achievements.map((item) => (
              <div key={item.id} className="achievement-card">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="achievement-image" 
                  onError={(e) => {e.target.src = "https://picsum.photos/seed/fallback/600/400"}}
                />
                <div className="achievement-content">
                  <h3 className="achievement-title">{item.title}</h3>
                  {item.source && <p className="achievement-source">Source: {item.source}</p>}
                  {item.description && <p className="achievement-description">{item.description}</p>}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="read-more-link">
                      Read more
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Events Section */}
      <section className="events-section">
        <div className="section-header">
          <h2 className="section-title">Events</h2>
          <Link to="/events" className="view-all-link">View all</Link>
        </div>
        
        <div className="events-list">
          {eventsData.map((event) => {
            const { day, month, year } = formatDate(event.date);
            return (
              <div key={event.id} className="event-item">
                <div className="event-date-box">
                  <div className="date-month">{month}</div>
                  <div className="date-day">{day}</div>
                  <div className="date-year">{year}</div>
                </div>
                <div className="event-details">
                  <h3 className="event-title">{event.title}</h3>
                  {event.description && <p className="event-description">{event.description}</p>}
                </div>
                <div className="event-arrow">
                  <Link to={`/events/${event.id}`} className="event-link">
                    <span className="arrow-icon">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
