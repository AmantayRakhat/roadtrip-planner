import React from 'react';
import InfoLayout from '../components/InfoLayout';
import { Compass, Map, Star, Camera, ChevronRight } from 'lucide-react';
import './InspirationPage.css';

const INSPIRATION_ITEMS = [
  {
    title: "The Golden Circle of Kazakhstan",
    region: "Almaty Region",
    desc: "A breathtaking journey through Charyn Canyon, Kolsay Lakes, and Kaindy Lake. Experience the diverse landscapes of the south.",
    image: "https://images.unsplash.com/photo-1549421263-54948efadbc3?auto=format&fit=crop&w=800&q=80",
    duration: "4-5 Days"
  },
  {
    title: "Steppes of Saryarka",
    region: "Central Kazakhstan",
    desc: "Explore the vast grasslands, ancient mausoleums, and the futuristic capital of Astana.",
    image: "https://images.unsplash.com/photo-1518391846015-55a9cc00bb01?auto=format&fit=crop&w=800&q=80",
    duration: "7 Days"
  },
  {
    title: "Caspian Coastal Route",
    region: "Western Kazakhstan",
    desc: "Drive through the otherworldly landscapes of Mangystau, featuring the Valley of Balls and the Ustyurt Plateau.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    duration: "6 Days"
  }
];

const NATIONAL_PARKS = [
  {
    name: "Charyn Canyon",
    highlight: "Valley of Castles",
    desc: "Often referred to as the Grand Canyon's little brother, Charyn Canyon features stunning rock formations that resemble ancient castles."
  },
  {
    name: "Altyn-Emel",
    highlight: "Singing Dunes",
    desc: "Famous for the 'Singing Sand', which produces a low-pitched hum in dry weather. The park also features the colorful Aktau Mountains."
  },
  {
    name: "Kolsay Lakes",
    highlight: "Pearls of the Tien Shan",
    desc: "Three incredibly clear, mountain-fringed lakes located in the northern Tien Shan mountains. A paradise for hikers and nature lovers."
  }
];

const InspirationPage = () => {
  return (
    <InfoLayout 
      title="Get Inspired" 
      subtitle="Discover the hidden gems of Central Asia and plan your next great adventure."
    >
      <div className="info-section">
        <h2 className="section-title">Popular Road Trip Routes</h2>
        <div className="inspiration-grid">
          {INSPIRATION_ITEMS.map((item, index) => (
            <div key={index} className="inspiration-card">
              <div className="ins-card-image">
                <img src={item.image} alt={item.title} />
                <div className="ins-card-duration">{item.duration}</div>
              </div>
              <div className="ins-card-content">
                <span className="ins-card-region">{item.region}</span>
                <h3 className="ins-card-title">{item.title}</h3>
                <p className="ins-card-desc">{item.desc}</p>
                <button className="ins-card-link">View Route <ChevronRight size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section national-parks-banner">
        <div className="parks-banner-header">
          <h2 className="section-title">National Parks of Kazakhstan</h2>
          <p className="section-text">Kazakhstan is home to diverse ecosystems, from high-altitude lakes to desert canyons.</p>
        </div>
        <div className="parks-grid">
          {NATIONAL_PARKS.map((park, index) => (
            <div key={index} className="park-card">
              <div className="park-number">0{index + 1}</div>
              <h3 className="park-name">{park.name}</h3>
              <div className="park-highlight">
                <Star size={14} fill="currentColor" />
                {park.highlight}
              </div>
              <p className="park-desc">{park.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section traveler-stories">
        <div className="stories-header">
          <h2 className="section-title">Traveler Stories</h2>
          <button className="btn-secondary">View All Stories</button>
        </div>
        <div className="stories-grid">
          <div className="story-card">
            <div className="story-quote">"The Autopilot found a small guesthouse in the middle of the Altyn-Emel desert that we would have never found on our own. Truly magical!"</div>
            <div className="story-author">
              <div className="author-avatar">A</div>
              <div className="author-info">
                <strong>Alina S.</strong>
                <span>Traveling since 2021</span>
              </div>
            </div>
          </div>
          <div className="story-card">
            <div className="story-quote">"RoadTrip Planner made our cross-country trip so much easier. The offline map feature was a lifesaver in the remote areas."</div>
            <div className="story-author">
              <div className="author-avatar">M</div>
              <div className="author-info">
                <strong>Maxim K.</strong>
                <span>Adventure Blogger</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InfoLayout>
  );
};

export default InspirationPage;
