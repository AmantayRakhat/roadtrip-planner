import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X, MapPin, Home, Plus, Image as ImageIcon } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AutopilotWizard.css';

const PREFERENCES = [
  "Roadside Attractions", "Offbeat Attractions", "Scenic Points",
  "Historic Sites", "World's Largest...", "Abandoned Sites", "Landmarks",
  "Museums", "Architecture", "Geographic Features", "National Parks",
  "State Parks", "Nature Reserves", "Parks and Gardens",
  "Cultural Interest", "Monuments", "Filming Locations"
];

const LOCATIONS_POOL = [
  { id: 1, name: "Charyn Canyon", location: "Almaty Region", color: "#fbbf24" },
  { id: 2, name: "Kolsay Lakes", location: "Almaty Region", color: "#64748b" },
  { id: 3, name: "Kaindy Lake", location: "Almaty Region", color: "#0ea5e9" },
  { id: 4, name: "Big Almaty Lake", location: "Almaty Region", color: "#10b981" },
  { id: 5, name: "Medeu Skating Rink", location: "Almaty", color: "#3b82f6" },
  { id: 6, name: "Shymbulak Ski Resort", location: "Almaty", color: "#8b5cf6" },
  { id: 7, name: "Turkestan Mausoleum", location: "Turkestan Region", color: "#f97316" },
  { id: 8, name: "Bayterek Tower", location: "Astana", color: "#06b6d4" },
  { id: 9, name: "Khan Shatyr", location: "Astana", color: "#ec4899" },
  { id: 10, name: "Burabay National Park", location: "Akmola Region", color: "#14b8a6" },
  { id: 11, name: "Singing Dunes", location: "Altyn-Emel", color: "#eab308" },
  { id: 12, name: "Bektau-Ata", location: "Karaganda Region", color: "#d946ef" },
  { id: 13, name: "Caspian Sea", location: "Aktau", color: "#0ea5e9" },
  { id: 14, name: "Aral Sea Ship Graveyard", location: "Kyzylorda Region", color: "#475569" },
  { id: 15, name: "Lake Balkhash", location: "Balkhash", color: "#3b82f6" }
];

import ConfirmModal from '../components/ConfirmModal';

const AutopilotWizard = () => {
  const navigate = useNavigate();

  // Step states: 'preferences' -> 'planned_stops' -> 'loading' -> 'recommendations'
  const [step, setStep] = useState('preferences');
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Recommendations state: 5 visible, rest hidden
  const [visibleRecs, setVisibleRecs] = useState(LOCATIONS_POOL.slice(0, 5));
  const [remainingRecs, setRemainingRecs] = useState(LOCATIONS_POOL.slice(5));

  // Loading step logic
  const [loadingStage, setLoadingStage] = useState(0);

  // Recommendations cumulative state
  const [addedRecs, setAddedRecs] = useState(0);
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  // Dynamic Planned Stops State
  const [plannedStops, setPlannedStops] = useState([
    { id: 'initial-1', name: 'Almaty, Kazakhstan', type: 'image' },
    { id: 'initial-2', name: 'Astana, Kazakhstan', type: 'home' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleRemoveStop = (id) => {
    setPlannedStops(prev => prev.filter(stop => stop.id !== id));
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      const filtered = LOCATIONS_POOL.filter(loc => 
        loc.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddStop = (location) => {
    const newStop = {
      id: `stop-${Date.now()}`,
      name: `${location.name}, ${location.location}`,
      type: 'image' // Default for new stops
    };
    setPlannedStops(prev => [...prev, newStop]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleAddRec = (id) => {
    setAddedRecs(prev => prev + 1);
    
    // Replace the added item with a new one from the pool
    setVisibleRecs(prevVisible => {
      const newVisible = [...prevVisible];
      const index = newVisible.findIndex(item => item.id === id);
      
      if (remainingRecs.length > 0) {
        const nextInPool = remainingRecs[0];
        newVisible[index] = nextInPool;
        setRemainingRecs(prevRemaining => prevRemaining.slice(1));
      } else {
        // If pool is empty, just remove the item
        newVisible.splice(index, 1);
      }
      return newVisible;
    });
  };

  useEffect(() => {
    if (step === 'loading') {
      const t1 = setTimeout(() => setLoadingStage(1), 2000);
      const t2 = setTimeout(() => setLoadingStage(2), 4000);
      const t3 = setTimeout(() => setStep('recommendations'), 6000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [step]);

  const togglePref = (pref) => {
    setSelectedPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleNext = () => {
    if (step === 'preferences') setStep('planned_stops');
    else if (step === 'planned_stops') setStep('loading');
  };

  const handleBack = () => {
    if (step === 'planned_stops') setStep('preferences');
    else if (step === 'preferences') navigate(-1);
    else if (step === 'recommendations') setStep('planned_stops');
  };

  const handleLaunch = () => {
    if (addedRecs === 0) {
      setShowLaunchModal(true);
    } else {
      localStorage.setItem('activeTrip', 'true');
      navigate('/app');
    }
  };

  const polylinePositions = [
    [43.2389, 76.8897], // Almaty
    [44.8528, 75.4851], // Balkhash
    [46.7995, 74.8312], // Saryshagan
    [49.8019, 73.1021], // Karaganda
    [51.1605, 71.4272]  // Astana
  ];

  return (
    <div className="autopilot-wizard">
      {showExitConfirm && (
        <ConfirmModal 
          isOpen={true}
          message="Are you sure you want to exit?"
          confirmText="YES, EXIT"
          cancelText="CANCEL"
          variant="navy"
          onConfirm={() => navigate(-1)}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}

      {/* Header */}
      <div className="wizard-header">
        <div className="wizard-logo">
          RoadTrip Planner
        </div>
        <div className="wizard-exit" onClick={() => setShowExitConfirm(true)}>Exit</div>
      </div>

      {/* Step 1: Preferences */}
      {step === 'preferences' && (
        <div className="wizard-content-centered">
          <h1 className="wizard-title">What type of stops are<br />you interested in?</h1>

          <div className="preferences-grid">
            {PREFERENCES.map(pref => (
              <div
                key={pref}
                className={`preference-tag ${selectedPrefs.includes(pref) ? 'selected' : ''}`}
                onClick={() => togglePref(pref)}
              >
                {pref}
                <div className="preference-checkbox">
                  {selectedPrefs.includes(pref) && <Check size={14} color="white" />}
                </div>
              </div>
            ))}
          </div>

          <div className="wizard-nav-bottom">
            <button className="btn-back" onClick={handleBack}><ArrowLeft size={18} /> Back</button>
            <div className="step-indicators">
              <div className="step-dot active"></div>
              <div className="step-dot"></div>
              <div className="step-dot"></div>
              <div className="step-dot"></div>
            </div>
            <button className="btn-next" onClick={handleNext}>Next <ArrowRight size={18} /></button>
          </div>
        </div>
      )}

      {/* Step 2: Planned Stops Split View */}
      {step === 'planned_stops' && (
        <div className="wizard-splitview">
          <div className="wizard-sidebar">
            <div className="sidebar-header">
              <h2 className="sidebar-title">Do you have any places you already plan to visit?</h2>
              <p className="sidebar-desc">Start planning your route. If you're not sure where to stop, you can skip this step. You'll be able to add more stops later.</p>
            </div>

            <div className="sidebar-content">
              <div className="search-container">
                <input 
                  type="text" 
                  className="add-stops-input" 
                  placeholder="Add stops" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchResults.length > 0 && (
                  <div className="search-results-dropdown">
                    {searchResults.map(result => (
                      <div 
                        key={result.id} 
                        className="search-result-item"
                        onClick={() => handleAddStop(result)}
                      >
                        <MapPin size={16} />
                        <div>
                          <div className="result-name">{result.name}</div>
                          <div className="result-location">{result.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <label className="avoid-highways">
                <input type="checkbox" />
                I want to avoid highways
              </label>

              <div className="route-stops-list">
                {plannedStops.map((stop, index) => (
                  <div key={stop.id} className="route-stop-item">
                    <div className="stop-number">{index + 1}</div>
                    <div className="stop-card">
                      <div className={`stop-img-mock ${stop.type === 'home' ? 'green' : ''}`}>
                        {stop.type === 'home' ? <Home size={24} /> : <ImageIcon size={20} />}
                      </div>
                      <div className="stop-card-info">
                        <h5>{stop.name}</h5>
                      </div>
                      <button className="remove-stop" onClick={() => handleRemoveStop(stop.id)}><X size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-footer">
              <button className="btn-back" onClick={handleBack}><ArrowLeft size={18} /> Back</button>
              <button 
                className="btn-next" 
                onClick={handleNext}
                disabled={plannedStops.length < 2}
                style={{ opacity: plannedStops.length < 2 ? 0.5 : 1, cursor: plannedStops.length < 2 ? 'not-allowed' : 'pointer' }}
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="wizard-map-area">
            <MapContainer center={[48.0196, 66.9237]} zoom={5} style={{ width: '100%', height: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Polyline positions={polylinePositions} color="var(--primary-blue)" weight={4} />
              <Marker position={[43.2389, 76.8897]}><Popup>Almaty (Point A)</Popup></Marker>
              <Marker position={[51.1605, 71.4272]}><Popup>Astana (Point B)</Popup></Marker>
            </MapContainer>
          </div>
        </div>
      )}

      {/* Step 3: Loading / Analysis */}
      {step === 'loading' && (
        <div className="loading-container">
          <div className="loading-logo"></div>
          <h1 className="loading-title">Hang tight while we<br />find the best stops</h1>

          <div className="loading-steps-card">
            <div className="loading-step">
              <div className={`status-icon ${loadingStage >= 1 ? 'done' : 'active'}`}>
                {loadingStage >= 1 && <Check size={14} />}
              </div>
              <div className="loading-step-text">
                <h4>Analyzing your route</h4>
                <p>Discovering hidden gems and roadside classics</p>
              </div>
            </div>

            <div className="loading-step">
              <div className={`status-icon ${loadingStage >= 2 ? 'done' : (loadingStage === 1 ? 'active' : 'pending')}`}>
                {loadingStage >= 2 && <Check size={14} />}
              </div>
              <div className="loading-step-text">
                <h4>Cross-referencing over 38 million trips</h4>
                <p>Finding the best stops for you</p>
              </div>
            </div>

            <div className="loading-step">
              <div className={`status-icon ${loadingStage === 2 ? 'active' : 'pending'}`}></div>
              <div className="loading-step-text">
                <h4>Matching results to your preferences</h4>
                <p>Filtering out anything that isn't your kind of thing</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Recommendations */}
      {step === 'recommendations' && (
        <div className="wizard-splitview">
          <div className="wizard-sidebar">
            <div className="sidebar-header">
              <h2 className="sidebar-title" style={{ marginBottom: "0.5rem" }}>We've found your must-see stops.</h2>
              <p className="sidebar-desc">Add these unmissable locations to your itinerary, then kick off your trip to see what else you can find.</p>
            </div>

            <div className="sidebar-content scrollable-sidebar">
              <h3 style={{ fontSize: '1rem', color: 'var(--text-gray)', marginBottom: '1rem' }}>AI RECOMMENDATIONS</h3>

              {visibleRecs.map(rec => (
                <div key={rec.id} className="rec-card">
                  <div className="rec-card-body">
                    <div className="rec-img" style={{ backgroundColor: rec.color }}></div>
                    <div className="rec-info">
                      <button className="remove-stop"><X size={16} /></button>
                      <h4>{rec.name}</h4>
                      <div className="rec-location"><MapPin size={14} /> {rec.location}</div>
                      <button className="btn-add" onClick={() => handleAddRec(rec.id)}>
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-footer">
              <button className="btn-back" onClick={handleBack}><ArrowLeft size={18} /> Back</button>
              <button className="btn-launch" onClick={handleLaunch}>
                Launch trip {addedRecs > 0 ? ` (+${addedRecs} added)` : ''}
              </button>
            </div>
          </div>
          <div className="wizard-map-area">
            <MapContainer center={[48.0196, 66.9237]} zoom={5} style={{ width: '100%', height: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Polyline positions={polylinePositions} color="var(--primary-blue)" weight={4} />
              <Marker position={[43.2389, 76.8897]}><Popup>Almaty (Start)</Popup></Marker>
              <Marker position={[51.1605, 71.4272]}><Popup>Astana (End)</Popup></Marker>
            </MapContainer>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showLaunchModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to launch without adding any suggestions?</h3>
            <div className="modal-actions">
              <button className="btn-modal-primary" onClick={() => { localStorage.setItem('activeTrip', 'true'); navigate('/app'); }}>Yes, launch trip</button>
              <button className="btn-modal-secondary" onClick={() => setShowLaunchModal(false)}>No, I'll add more stops</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutopilotWizard;
