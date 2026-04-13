import React, { useState } from 'react';
import InfoLayout from '../components/InfoLayout';
import { Search, Book, Shield, CreditCard, Smartphone, MessageCircle, Mail, Phone, ChevronRight } from 'lucide-react';
import './SupportPage.css';

const FAQ_ITEMS = [
  { q: "How do I create a new trip?", a: "To create a trip, click the '+' icon on the sidebar if you're on the map, or 'Start Trip' from the landing page. You can choose to enter a destination manually or use our AI Autopilot." },
  { q: "Can I use RoadTrip Planner offline?", a: "While viewing existing trips works partially offline, we recommend a stable internet connection for searching new stops and using the Autopilot features." },
  { q: "How do I share my itinerary?", a: "Open your trip, go to the share icon at the top right, and copy the link. You can also send it directly via email or message." },
  { q: "Is there a mobile app?", a: "Yes! RoadTrip Planner is available on both iOS and Android. You can download it from the App Store or Google Play Store." }
];

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <InfoLayout 
      title="Help Center" 
      subtitle="Find answers, explore tutorials, and get in touch with our support team."
    >
      <div className="support-search-container">
        <div className="support-search-bar">
          <Search size={22} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for answers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">Browse Categories</h2>
        <div className="grid-3">
          <div className="info-card">
            <div className="card-icon"><Book size={24} /></div>
            <h3 className="card-title">Getting Started</h3>
            <p className="card-desc">New to RoadTrip Planner? Learn the basics of planning your first adventure.</p>
          </div>
          <div className="info-card">
            <div className="card-icon"><Smartphone size={24} /></div>
            <h3 className="card-title">Mobile App</h3>
            <p className="card-desc">Tips and tricks for using RoadTrip Planner on the go with your smartphone.</p>
          </div>
          <div className="info-card">
            <div className="card-icon"><CreditCard size={24} /></div>
            <h3 className="card-title">Subscriptions</h3>
            <p className="card-desc">Manage your Premium membership, payments, and billing preferences.</p>
          </div>
          <div className="info-card">
            <div className="card-icon"><Shield size={24} /></div>
            <h3 className="card-title">Privacy & Safety</h3>
            <p className="card-desc">How we protect your data and tips for staying safe while traveling.</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="faq-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{item.q}</h3>
                <p className="faq-answer">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="info-section support-contact-banner">
        <div className="contact-banner-content">
          <h2 className="section-title">Still need help?</h2>
          <p className="section-text">Our support team is available 24/7 to assist you with any questions.</p>
          <div className="contact-options">
            <div className="contact-method">
              <Mail size={20} />
              <span>support@roadtripplanner.com</span>
            </div>
            <div className="contact-method">
              <Phone size={20} />
              <span>+7 (777) 123-4567</span>
            </div>
            <div className="contact-method">
              <MessageCircle size={20} />
              <span>Live Chat</span>
            </div>
          </div>
        </div>
      </div>
    </InfoLayout>
  );
};

export default SupportPage;
