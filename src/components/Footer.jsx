import React from 'react';
import { Smartphone, Download, Link, Share2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="social-icons" style={{ marginLeft: 'auto' }}>
          {/* using lucide icons as mock for simple representation */}
          <Share2 size={20} />
          <Link size={20} />
        </div>
      </div>

      <div className="footer-links-grid">
        <div className="footer-col">
          <h4 className="footer-col-title">ABOUT</h4>
          <ul>
            <li><a href="/about" target="_blank" rel="noopener noreferrer">About Us</a></li>
            <li><a href="/about#careers" target="_blank" rel="noopener noreferrer">Careers</a></li>
            <li><a href="/support" target="_blank" rel="noopener noreferrer">Support</a></li>
            <li><a href="/about#contact" target="_blank" rel="noopener noreferrer">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">BUSINESS TOOLS</h4>
          <ul>
            <li><a href="/business" target="_blank" rel="noopener noreferrer">Partnerships</a></li>
            <li><a href="/business#media" target="_blank" rel="noopener noreferrer">Media Center</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">GET INSPIRED</h4>
          <ul>
            <li><a href="/inspiration" target="_blank" rel="noopener noreferrer">Road trip ideas by region</a></li>
            <li><a href="/inspiration#parks" target="_blank" rel="noopener noreferrer">National Parks of Kazakhstan</a></li>
            <li><a href="/inspiration#routes" target="_blank" rel="noopener noreferrer">Famous routes</a></li>
            <li><a href="/inspiration#stories" target="_blank" rel="noopener noreferrer">Traveler Stories</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-logo">RoadTrip Planner</div>
        <div className="footer-legal">
          <div className="footer-legal-links">
            <a href="/privacy" target="_blank" rel="noopener noreferrer">PRIVACY POLICY</a>
            <a href="/terms" target="_blank" rel="noopener noreferrer">TERMS OF SERVICE</a>
            <a href="/copyright" target="_blank" rel="noopener noreferrer">COPYRIGHT</a>
          </div>
          <div className="footer-copyright">
            © RoadTrip Planner, LLC 2026
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
