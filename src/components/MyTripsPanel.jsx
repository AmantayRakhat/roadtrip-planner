import React from 'react';
import { MoreHorizontal, Share2 } from 'lucide-react';
import './MyTripsPanel.css';

const MOCK_TRIPS = [
  { id: 1, title: "Almaty Adventure", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Charyn & Kolsay", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Astana Weekend", img: "https://images.unsplash.com/photo-1518005020251-582c7eb8d7fc?q=80&w=800&auto=format&fit=crop" },
  { id: 4, title: "Caspian Roadtrip", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" }
];

const MyTripsPanel = ({ hasTrips = false, onCreateTrip, onSelectTrip }) => {
  if (!hasTrips) {
    return (
      <div className="my-trips-panel empty">
        <div className="empty-trips-content">
          <div className="empty-illustration">
            <img 
              src="https://img.freepik.com/free-vector/traveling-concept-illustration_114360-1411.jpg" 
              alt="The road awaits" 
            />
          </div>
          <h3>The open road awaits. Create a new trip to get started.</h3>
          <button className="create-trip-btn-large" onClick={onCreateTrip}>Create a trip</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-trips-panel populated">
      <div className="trips-header">
        <h2>My trips</h2>
        <button className="create-link-btn" onClick={onCreateTrip}>Create new trip</button>
      </div>
      
      <div className="trips-grid">
        {MOCK_TRIPS.map(trip => (
          <div key={trip.id} className="trip-card-item" onClick={() => onSelectTrip(trip)}>

            <div className="trip-card-img" style={{ backgroundImage: `url(${trip.img})` }}>
              <div className="trip-card-overlay">
                <h4>{trip.title}</h4>
              </div>
              <div className="trip-card-top-btns">
                <button className="trip-action-btn"><MoreHorizontal size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="see-all-trips">See all trips</button>
    </div>
  );
};

export default MyTripsPanel;
