import React, { useState, useEffect } from 'react';
import { 
  MoreHorizontal, Share2, Printer, FileText, 
  Users, ChevronRight, Eye, Image as ImageIcon,
  Home, MapPin, Trash2
} from 'lucide-react';
import './ItineraryPanel.css';

const INITIAL_STOPS = [
  { id: 1, name: "Almaty, Kazakhstan", type: "city", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=200&auto=format&fit=crop" },
  { id: 2, name: "Charyn Canyon National Park", type: "nature", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop" },
  { id: 3, name: "Kolsay Lakes State Park", type: "nature", img: "https://images.unsplash.com/photo-1518005020251-582c7eb8d7fc?q=80&w=200&auto=format&fit=crop" },
  { id: 4, name: "Astana, Kazakhstan", type: "city", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop" }
];

const ItineraryPanel = ({ onClose }) => {
  const [itineraryStops, setItineraryStops] = useState(INITIAL_STOPS);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleRemoveStop = (id) => {
    setItineraryStops(prev => prev.filter(stop => stop.id !== id));
    setActiveMenuId(null);
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Close menu when clicking anywhere else
  useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="itinerary-panel">
      {/* Header Image & Title Area */}
      <div className="itinerary-header">
        <div className="header-actions-top">
          <button className="close-trip-btn" onClick={onClose}>Close trip</button>
          <button className="invite-btn"><Users size={16} /> Invite</button>
        </div>
        <div className="header-image-bg" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop")'}}></div>
      </div>

      <div className="itinerary-body">
        <div className="itinerary-title-card">
          <h1>Kazakhstan Grand Tour</h1>
          <div className="title-action-icons">
            <Share2 size={20} />
            <Printer size={20} />
            <FileText size={20} />
          </div>
        </div>

        <div className="itinerary-options-grid">
          <button className="opt-btn">Trip settings</button>
          <button className="opt-btn">Routing options</button>
          <button className="opt-btn">Measure tool</button>
          <button className="opt-btn">Add dates</button>
        </div>

        <div className="itinerary-stops-list">
          {itineraryStops.map((stop, i) => (
            <div key={stop.id} className="itinerary-stop-container">
              <div className="stop-left-track">
                <div className="stop-number-circle">{i + 1}</div>
              </div>
              <div className="stop-main-card">
                <div className="stop-card-inner">
                  <div className="stop-thumbnail">
                    {stop.type === 'city' ? <Home size={20} /> : <ImageIcon size={20} />}
                    <img src={stop.img} alt={stop.name} />
                  </div>
                  <div className="stop-details">
                    <h4>{stop.name}</h4>
                  </div>
                  <div className="stop-actions-right">
                    <div className="more-menu-container">
                      <button 
                        className={`action-icon-btn ${activeMenuId === stop.id ? 'active' : ''}`}
                        onClick={(e) => toggleMenu(e, stop.id)}
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      
                      {activeMenuId === stop.id && (
                        <div className="stop-action-dropdown">
                          <button 
                            className="dropdown-item delete"
                            onClick={() => handleRemoveStop(stop.id)}
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <button className="action-icon-btn">
                      <Eye size={18} color="#9ca3af" />
                    </button>
                  </div>
                </div>
                {i < itineraryStops.length - 1 && (
                  <div className="find-stops-link">
                    <ChevronRight size={14} /> Find stops here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryPanel;
