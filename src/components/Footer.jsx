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
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">BUSINESS TOOLS</h4>
          <ul>
            <li><a href="#">Partnerships</a></li>
            <li><a href="#">Media Center</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">GET INSPIRED</h4>
          <ul>
            <li><a href="#">Road trip ideas by region</a></li>
            <li><a href="#">National Parks of Kazakhstan</a></li>
            <li><a href="#">Famous routes</a></li>
            <li><a href="#">Traveler Stories</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-logo">RoadTrip Planner</div>
        <div className="footer-legal">
          <div className="footer-legal-links">
            <a href="#">PRIVACY POLICY</a>
            <a href="#">TERMS OF SERVICE</a>
            <a href="#">COPYRIGHT</a>
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
