import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import NewTripModal from '../components/NewTripModal';
import ConfirmModal from '../components/ConfirmModal';
import AddStopsAutopilotModal from '../components/AddStopsAutopilotModal';
import AddWaypointModal from '../components/AddWaypointModal';
import {
  Compass, List, MapPin, Plus, ArrowLeft,
  Layers, Navigation2, Search, MessageSquare, ChevronRight, Home, Image as ImageIcon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import SearchDropdown from '../components/SearchDropdown';
import ItineraryPanel from '../components/ItineraryPanel';
import ExplorePanel from '../components/ExplorePanel';
import MyTripsPanel from '../components/MyTripsPanel';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './AppPage.css';

const INITIAL_STOPS = [
  { id: 1, name: "Almaty, Kazakhstan", type: "city", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=400&q=80", distance: null, time: null, isVisible: true },
  { id: 2, name: "Charyn Canyon National Park", type: "nature", img: "https://images.unsplash.com/photo-1549421263-54948efadbc3?auto=format&fit=crop&w=400&q=80", distance: "416 mi", time: "9h 41m", isVisible: true },
  { id: 3, name: "Kolsay Lakes State Park", type: "nature", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", distance: "20 mi", time: "34m", isVisible: true },
  { id: 4, name: "Astana, Kazakhstan", type: "city", img: "https://images.unsplash.com/photo-1518391846015-55a9cc00bb01?auto=format&fit=crop&w=400&q=80", distance: "780 mi", time: "11h 20m", isVisible: true }
];

const recalculateWaypoints = async (orderedWaypoints) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const distances = ["120 mi", "45 mi", "230 mi", "15 mi", "90 mi"];
      const times = ["2h 15m", "45m", "4h 10m", "22m", "1h 30m"];
      const updated = orderedWaypoints.map((stop, i) => {
        if (i === 0) return { ...stop, distance: null, time: null };
        return {
          ...stop,
          distance: distances[i % distances.length],
          time: times[i % times.length],
        };
      });
      resolve(updated);
    }, 600);
  });
};

const AppPage = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isTripActive, setIsTripActive] = useState(localStorage.getItem('activeTrip') === 'true');
  const [hasTrips, setHasTrips] = useState(true);

  // Modal states
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [showAddWaypointModal, setShowAddWaypointModal] = useState(false);
  const [showAddStopsAutopilotModal, setShowAddStopsAutopilotModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [initialTripDestination, setInitialTripDestination] = useState('');
  const [itineraryStops, setItineraryStops] = useState(INITIAL_STOPS);
  const [activeExploreCategory, setActiveExploreCategory] = useState(null);

  const handleUpdateStops = async (newStops) => {
    const recalculated = await recalculateWaypoints(newStops);
    setItineraryStops(recalculated);
  };

  const handleAddStopToTrip = async (place) => {
    const stopName = place.title || place.name || "Unknown Place";
    const stopImg = place.img || 'https://images.unsplash.com/photo-1555507036-ab1d4075cbf9?auto=format&fit=crop&q=80&w=400&h=300';

    if (itineraryStops.length < 2) {
      setItineraryStops([...itineraryStops, { 
        id: Date.now(), 
        name: stopName, 
        img: stopImg,
        type: 'nature'
      }]);
      return;
    }

    // Insert before the last stop
    const newStops = [...itineraryStops];
    const insertIndex = newStops.length - 1;
    newStops.splice(insertIndex, 0, {
      id: Date.now(),
      name: stopName,
      img: stopImg,
      type: 'nature'
    });

    const recalculated = await recalculateWaypoints(newStops);
    setItineraryStops(recalculated);
    setActiveTab('itinerary'); // Switch to itinerary to show the result
  };

  const handleCreateTrip = (method) => {
    if (method === 'autopilot') {
      navigate('/autopilot');
    } else {
      setIsTripActive(true);
      localStorage.setItem('activeTrip', 'true');
      setActiveTab('itinerary');
      setShowNewTripModal(false);
    }
  };

  const position = [48.0196, 66.9237];

  return (
    <div className="app-page">
      {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />}

      {searchOpen && (
        <SearchDropdown 
          onClose={() => setSearchOpen(false)} 
          onSelectCategory={(cat) => {
            setActiveExploreCategory(cat);
            setActiveTab('explore');
            setSearchOpen(false);
          }}
        />
      )}

      {showNewTripModal && (
        <NewTripModal 
          onClose={() => {
            setShowNewTripModal(false);
            setInitialTripDestination(''); 
          }} 
          onCreateTrip={handleCreateTrip}
          initialDestination={initialTripDestination}
        />
      )}

      {showAddWaypointModal && (
        <AddWaypointModal 
          onClose={() => setShowAddWaypointModal(false)}
          onUseAutopilot={() => {
            setShowAddWaypointModal(false);
            setShowAddStopsAutopilotModal(true);
          }}
        />
      )}

      {showAddStopsAutopilotModal && (
        <AddStopsAutopilotModal 
          key="autopilot-modal-main"
          onClose={() => setShowAddStopsAutopilotModal(false)} 
          onAddStop={handleAddStopToTrip}
          onBackToWaypoint={() => {
            setShowAddStopsAutopilotModal(false);
            setShowAddWaypointModal(true);
          }}
        />
      )}

      {showCancelModal && (
        <ConfirmModal 
          isOpen={true}
          message="Are you sure you want to cancel this trip?"
          confirmText="YES, CANCEL TRIP"
          cancelText="CANCEL"
          variant="navy"
          onConfirm={() => { 
            setIsTripActive(false); 
            localStorage.removeItem('activeTrip');
            setShowCancelModal(false); 
            setShowNewTripModal(false); 
          }}
          onCancel={() => setShowCancelModal(false)}
        />
      )}


      <Navbar
        variant="app"
        onOpenAuth={setAuthMode}
        onSearchFocus={() => setSearchOpen(true)}
        onSearchBlur={() => setSearchOpen(false)}
        activeExploreCategory={activeExploreCategory}
        onClearExploreCategory={() => setActiveExploreCategory(null)}
      />

      <div className="app-content">
        <div className="app-sidebar">
          <div className={`sidebar-item ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>
            <Compass size={24} />
            <span>Explore</span>
          </div>
          <div className={`sidebar-item ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => setActiveTab('itinerary')}>
            <List size={24} />
            <span>Itinerary</span>
          </div>
          <div className={`sidebar-item ${activeTab === 'my-trips' ? 'active' : ''}`} onClick={() => setActiveTab('my-trips')}>
            <MapPin size={24} />
            <span>My trips</span>
          </div>
          <div className={`sidebar-item ${isTripActive ? 'add-to-trip' : ''}`} onClick={() => isTripActive ? setShowAddWaypointModal(true) : setShowNewTripModal(true)}>
            <div className={`start-trip-circle-icon ${isTripActive ? 'blue-icon' : ''}`}><Plus size={16} color="white" /></div>
            <span>{isTripActive ? 'Add to Trip' : 'Start Trip'}</span>
          </div>
        </div>

        <div className="app-panel-container">
          {/* ... (panels remain the same) */}
          {activeTab === 'itinerary' && isTripActive && (
            <ItineraryPanel 
              onClose={() => setShowCancelModal(true)} 
              onFindStops={() => setShowAddWaypointModal(true)}
              stops={itineraryStops}
              onUpdateStops={setItineraryStops}
              onRecalculate={handleUpdateStops}
            />
          )}

          {activeTab === 'itinerary' && !isTripActive && (
            <div className="itinerary-empty-panel">
              <div className="empty-panel-graphic">
                <img src="/roadtothesky.png" alt="Mountain Road Map" />
              </div>
              <p className="empty-panel-text">Adventure is on the horizon. <br /> Create your itinerary.</p>
              <button className="create-trip-btn-large" onClick={() => setShowNewTripModal(true)}>Create a trip</button>
            </div>
          )}

          {activeTab === 'my-trips' && (
            <MyTripsPanel
              hasTrips={hasTrips}
              onCreateTrip={() => setShowNewTripModal(true)}
              onSelectTrip={(trip) => {
                setIsTripActive(true);
                localStorage.setItem('activeTrip', 'true');
                setActiveTab('itinerary');
              }}
            />
          )}

          {activeTab === 'explore' && (
            <ExplorePanel 
              activeCategory={activeExploreCategory} 
              onAddPlace={(placeName) => {
                setInitialTripDestination(placeName);
                setShowNewTripModal(true);
              }}
              isTripActive={isTripActive}
              onAddCurrentTripStop={handleAddStopToTrip}
            />
          )}
        </div>

        {/* Map Area */}
        <div className="app-map-container">
          <div className="map-controls-right">
            <button className="map-btn"><Layers size={20} /></button>
            <button className="map-btn"><Navigation2 size={20} /></button>
          </div>

          <div className="chat-bubble">
            <MessageSquare size={24} />
          </div>

          <MapContainer center={[48.0196, 66.9237]} zoom={5} style={{ width: '100%', height: '100%' }} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {/* Markers */}
            <Marker position={[43.2389, 76.8897]}><Popup>Almaty</Popup></Marker>
            <Marker position={[51.1605, 71.4272]}><Popup>Astana</Popup></Marker>
            <Marker position={[43.35, 79.08]}><Popup>Charyn Canyon</Popup></Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
