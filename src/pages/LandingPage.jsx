import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import NewTripModal from '../components/NewTripModal';
import './LandingPage.css';

const LandingPage = () => {
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup' | null
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateTrip = (method) => {
    if (method === 'autopilot') {
      navigate('/autopilot');
    } else {
      navigate('/app');
    }
  };

  return (
    <div className="landing-page">
      {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />}
      
      {showNewTripModal && (
        <NewTripModal 
          onClose={() => setShowNewTripModal(false)}
          onCreateTrip={handleCreateTrip}
        />
      )}
      
      <Navbar variant="landing" onOpenAuth={setAuthMode} />

      <main className="hero-section">
        <svg className="hero-waves" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,160 C320,300 420,-80 740,100 C1060,280 1280,20 1440,80" />
          <path d="M0,220 C280,60 520,300 840,140 C1160,-20 1320,200 1440,120" style={{ strokeWidth: 1}}/>
        </svg>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Take unforgettable<br/>road trips</h1>
            <p>Get AI-powered recommendations for places worth a detour.</p>
            
            <div className="search-widget">
              <div className="search-inputs">
                <div className="search-input-wrapper">
                  <input type="text" placeholder="Starting Point" />
                </div>
                <div className="search-input-wrapper">
                  <input type="text" placeholder="Destination" />
                </div>
                <button className="go-button" onClick={() => handleCreateTrip('autopilot')}>Go</button>
              </div>
            </div>
            
            <div className="explore-link">
              Not sure where to go? <Link to="/app">Explore the map &rarr;</Link>
            </div>
          </div>
          <div className="hero-image-container">
            <svg className="hero-decorator" viewBox="0 0 100 100">
              <path fill="none" stroke="#38E597" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M50 5 L55 15 L66 12 L68 23 L79 23 L78 34 L88 38 L84 48 L93 54 L86 62 L93 70 L83 75 L86 85 L75 87 L74 97 L63 94 L58 103 L48 97 L40 104 L34 94 L23 93 L22 82 L12 78 L16 68 L6 61 L14 53 L6 44 L16 40 L14 29 L25 28 L28 17 L38 20 L44 10 Z"/>
            </svg>
            <img  
              src="https://a.d-cd.net/ebbe39ds-960.jpg" 
              alt="Road Trip Mountains" 
              className="hero-image"
            />
          </div>
        </div>  
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;