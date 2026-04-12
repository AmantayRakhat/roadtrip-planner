import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X, MapPin, Home, Plus, Image as ImageIcon, GripVertical } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AutopilotWizard.css';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PREFERENCES = [
  "Roadside Attractions", "Offbeat Attractions", "Scenic Points",
  "Historic Sites", "World's Largest...", "Abandoned Sites", "Landmarks",
  "Museums", "Architecture", "Geographic Features", "National Parks",
  "State Parks", "Nature Reserves", "Parks and Gardens",
  "Cultural Interest", "Monuments", "Filming Locations"
];

const LOCATIONS_POOL = [
  { id: 1, name: "Charyn Canyon", location: "Almaty Region", img: "https://images.unsplash.com/photo-1520113526564-24223ca8601c?auto=format&fit=crop&w=400" },
  { id: 2, name: "Kolsay Lakes", location: "Almaty Region", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400" },
  { id: 3, name: "Kaindy Lake", location: "Almaty Region", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400" },
  { id: 4, name: "Big Almaty Lake", location: "Almaty Region", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400" },
  { id: 5, name: "Medeu Skating Rink", location: "Almaty", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400" },
  { id: 6, name: "Shymbulak Ski Resort", location: "Almaty", img: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400" },
  { id: 7, name: "Turkestan Mausoleum", location: "Turkestan", img: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=400" },
  { id: 8, name: "Bayterek Tower", location: "Astana", img: "https://images.unsplash.com/photo-1518391846015-55a9cc00bb01?auto=format&fit=crop&w=400" },
  { id: 9, name: "Khan Shatyr", location: "Astana", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400" },
  { id: 10, name: "Burabay Park", location: "Akmola", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400" },
  { id: 11, name: "Singing Dunes", location: "Altyn-Emel", img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400" },
  { id: 12, name: "Bektau-Ata", location: "Karaganda", img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=400" },
  { id: 13, name: "Caspian Sea", location: "Aktau", img: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=400" },
  { id: 14, name: "Aral Sea", location: "Kyzylorda", img: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&w=400" },
  { id: 15, name: "Lake Balkhash", location: "Balkhash", img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&w=400" }
];

import ConfirmModal from '../components/ConfirmModal';

// ─── Sortable stop card (used inside planned_stops step) ──────────────────────
const SortableStopItem = ({ stop, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0 : 1, // ghost card (DragOverlay) takes over visually
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="route-stop-item">
      <div className="stop-left-column">
        <div className="stop-number">{index + 1}</div>
      </div>
      <div className="stop-card">
        <div className="drag-handle-wizard" {...attributes} {...listeners}>
          <GripVertical size={14} color="#9ca3af" />
        </div>
        <div className="stop-img-mock">
          {stop.img ? (
            <img src={stop.img} alt={stop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            stop.type === 'home' ? <Home size={20} /> : <ImageIcon size={20} />
          )}
        </div>
        <div className="stop-card-info">
          <h5>{stop.name}</h5>
        </div>
        <button className="remove-stop" onClick={() => onRemove(stop.id)}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── Ghost card shown inside DragOverlay while dragging ───────────────────────
const WizardDragGhost = ({ stop }) => (
  <div
    className="route-stop-item"
    style={{
      opacity: 0.9,
      boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
      borderRadius: 12,
      background: 'white',
      transform: 'scale(1.02)',
      cursor: 'grabbing',
    }}
  >
    <div className="stop-left-column">
      <div className="stop-number">·</div>
    </div>
    <div className="stop-card">
      <div className="drag-handle-wizard">
        <GripVertical size={14} color="#1a365d" />
      </div>
      <div className="stop-img-mock">
        {stop.img ? (
          <img src={stop.img} alt={stop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          stop.type === 'home' ? <Home size={20} /> : <ImageIcon size={20} />
        )}
      </div>
      <div className="stop-card-info">
        <h5>{stop.name}</h5>
      </div>
    </div>
  </div>
);

const AutopilotWizard = () => {
  const navigate = useNavigate();

  // Step states: 'preferences' -> 'extra_preferences' -> 'planned_stops' -> 'loading' -> 'recommendations'
  const [step, setStep] = useState('preferences');
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [extraPrefs, setExtraPrefs] = useState('');
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
    { id: 'initial-1', name: 'Almaty, Kazakhstan', type: 'image', img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=400", distance: null, time: null },
    { id: 'initial-2', name: 'Astana, Kazakhstan', type: 'home', img: "https://images.unsplash.com/photo-1518391846015-55a9cc00bb01?auto=format&fit=crop&w=400", distance: '780 mi', time: '11h 20m' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  const [isRecalculating, setIsRecalculating] = useState(false);

  const [activeId, setActiveId] = useState(null); // id of card being dragged

  // distance:5 prevents accidental drags on a click
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const recalculateWaypoints = async (orderedWaypoints) => {
    setIsRecalculating(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const updated = orderedWaypoints.map((stop, i) => {
          if (i === 0) return { ...stop, distance: null, time: null };
          const distances = ["120 mi", "45 mi", "230 mi", "15 mi", "90 mi"];
          const times = ["2h 15m", "45m", "4h 10m", "22m", "1h 30m"];
          return {
            ...stop,
            distance: distances[i % distances.length],
            time: times[i % times.length]
          };
        });
        setIsRecalculating(false);
        resolve(updated);
      }, 500);
    });
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = plannedStops.findIndex(s => s.id === active.id);
    const newIndex = plannedStops.findIndex(s => s.id === over.id);
    const reordered = arrayMove(plannedStops, oldIndex, newIndex);
    setPlannedStops(reordered);
    recalculateWaypoints(reordered).then(updated => setPlannedStops(updated));
  };


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
      type: 'image',
      img: location.img
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
    if (step === 'preferences') setStep('extra_preferences');
    else if (step === 'extra_preferences') setStep('planned_stops');
    else if (step === 'planned_stops') setStep('loading');
  };

  const handleBack = () => {
    if (step === 'extra_preferences') setStep('preferences');
    else if (step === 'planned_stops') setStep('extra_preferences');
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
              {/* <div className="step-dot"></div>
              <div className="step-dot"></div> */}
            </div>
            <button className="btn-next" onClick={handleNext}>Next <ArrowRight size={18} /></button>
          </div>
        </div>
      )}

      {/* Step 2: Extra Preferences */}
      {step === 'extra_preferences' && (
        <div className="wizard-content-centered">
          <h1 className="wizard-title">Anything else we should<br />know about your trip?</h1>
          <p className="wizard-subtitle">Help our AI find the perfect stops by telling us more about your preferences.</p>

          <div className="extra-prefs-container">
            <textarea
              className="extra-prefs-textarea"
              placeholder="e.g., I want to visit scenic spots along the way, or find some nice local food..."
              value={extraPrefs}
              onChange={(e) => setExtraPrefs(e.target.value)}
            />
          </div>

          <div className="wizard-nav-bottom">
            <button className="btn-back" onClick={handleBack}><ArrowLeft size={18} /> Back</button>
            <div className="step-indicators">
              <div className="step-dot done"></div>
              <div className="step-dot active"></div>
              <div className="step-dot"></div>
              {/* <div className="step-dot"></div>
              <div className="step-dot"></div> */}
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

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={plannedStops.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className={`route-stops-list ${isRecalculating ? 'recalculating' : ''}`}>
                    {plannedStops.map((stop, i) => (
                      <SortableStopItem
                        key={stop.id}
                        stop={stop}
                        index={i}
                        onRemove={handleRemoveStop}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={{
                  duration: 200,
                  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}>
                  {activeId
                    ? <WizardDragGhost stop={plannedStops.find(s => s.id === activeId)} />
                    : null
                  }
                </DragOverlay>
              </DndContext>
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
                    <div className="rec-img">
                      <img src={rec.img} alt={rec.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
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
