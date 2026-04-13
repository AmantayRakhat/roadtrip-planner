import React from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Share2, Copy, Trash2 } from 'lucide-react';
import './MyTripsPanel.css';

const MOCK_TRIPS_DATA = [
  { id: 1, title: "Almaty Adventure", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Charyn & Kolsay", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Astana Weekend", img: "https://images.unsplash.com/photo-1518005020251-582c7eb8d7fc?q=80&w=800&auto=format&fit=crop" },
  { id: 4, title: "Caspian Roadtrip", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" }
];

const MyTripsPanel = ({ hasTrips = false, onCreateTrip, onSelectTrip }) => {
  const [trips, setTrips] = React.useState(MOCK_TRIPS_DATA);
  const [activeMenuId, setActiveMenuId] = React.useState(null);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setTrips(trips.filter(t => t.id !== id));
    setActiveMenuId(null);
  };

  const handleDuplicate = (e, trip) => {
    e.stopPropagation();
    const newTrip = {
      ...trip,
      id: Date.now(),
      title: `${trip.title} (Copy)`
    };
    const index = trips.findIndex(t => t.id === trip.id);
    const newTrips = [...trips];
    newTrips.splice(index + 1, 0, newTrip);
    setTrips(newTrips);
    setActiveMenuId(null);
  };

  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!hasTrips || trips.length === 0) {
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
        {trips.map(trip => (
          <div key={trip.id} className="trip-card-item" onClick={() => onSelectTrip(trip)}>
            <div className="trip-card-img" style={{ backgroundImage: `url(${trip.img})` }}>
              <div className="trip-card-overlay">
                <h4>{trip.title}</h4>
              </div>
              <div className="trip-card-top-btns">
                <button 
                  className={`trip-action-btn ${activeMenuId === trip.id ? 'active' : ''}`}
                  onClick={(e) => toggleMenu(e, trip.id)}
                >
                  <MoreHorizontal size={16} />
                </button>

                {activeMenuId === trip.id && (
                  <div className="trip-dropdown-menu">
                    <button className="dropdown-item" onClick={(e) => handleDuplicate(e, trip)}>
                      <Copy size={16} />
                      Duplicate Trip
                    </button>
                    <button className="dropdown-item delete" onClick={(e) => handleDelete(e, trip.id)}>
                      <Trash2 size={16} />
                      Delete Trip
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Link to="/profile" className="see-all-trips-btn">See all trips</Link>
    </div>
  );
};

export default MyTripsPanel;
