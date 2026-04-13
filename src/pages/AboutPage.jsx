import React from 'react';
import InfoLayout from '../components/InfoLayout';
import { Target, Users, Briefcase, Mail, MapPin, Globe } from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <InfoLayout 
      title="Adventure Starts Here" 
      subtitle="Connecting people to the places they'll love through unforgettable road trips."
    >
      <div className="info-section">
        <div className="about-hero-grid">
          <div className="about-text-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
              At RoadTrip Planner, we believe the journey is just as important as the destination. 
              Our mission is to empower travelers to explore the world with confidence, providing 
              AI-driven tools that discover hidden gems, scenic routes, and local favorites that 
              other planners might miss.
            </p>
            <p className="section-text">
              Founded in 2024, our platform has focused on bringing high-tech planning to the classic 
              experience of the open road, with a special emphasis on the breathtaking landscapes 
              of Central Asia and beyond.
            </p>
          </div>
          <div className="about-image-placeholder">
             <div className="placeholder-brand">RoadTrip Planner</div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">Our Core Values</h2>
        <div className="grid-3">
          <div className="info-card">
            <div className="card-icon"><Target size={24} /></div>
            <h3 className="card-title">Exploration</h3>
            <p className="card-desc">We foster a spirit of discovery, encouraging our users and our team to find beauty in the unexpected.</p>
          </div>
          <div className="info-card">
            <div className="card-icon"><Users size={24} /></div>
            <h3 className="card-title">Community</h3>
            <p className="card-desc">Road trips are better shared. We build tools that bring travelers together through reviews and shared itineraries.</p>
          </div>
          <div className="info-card">
            <div className="card-icon"><Globe size={24} /></div>
            <h3 className="card-title">Sustainability</h3>
            <p className="card-desc">We are committed to promoting responsible tourism to preserve the natural wonders our users love to visit.</p>
          </div>
        </div>
      </div>


      <div className="info-section contact-section" id="contact">
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <MapPin size={24} />
              <div>
                <h4>Our Headquarters</h4>
                <p>Abay Ave 10, Almaty, Kazakhstan</p>
              </div>
            </div>
            <div className="contact-item">
              <Mail size={24} />
              <div>
                <h4>Email Us</h4>
                <p>general@roadtripplanner.kz</p>
              </div>
            </div>
            <div className="contact-item">
              <Briefcase size={24} />
              <div>
                <h4>Partnerships</h4>
                <p>partners@roadtripplanner.kz</p>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Email Address" />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="How can we help?"></textarea>
            </div>
            <button className="btn-primary" type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </InfoLayout>
  );
};

export default AboutPage;
