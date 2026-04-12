import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import './AddStopsAutopilotModal.css';

const SUBTYPE_OPTIONS = {
  'Activities and Experiences': [
    'Most Popular Activities', 'Family-Friendly', 
    'Art, Offbeat, & Pop Culture', 'Outdoors & Adventures', 'Adult(ish)'
  ],
  'Places to Eat': [
    'Most Popular Places', 'Diners & Burger Spots', 'Restaurants', 'Quick Bites'
  ],
  'Places to Stay': [
    'Most Popular Places', 'Hotels & Motels', 'RV-Friendly', 
    'Boutique Stays', 'Cabins & Cottages', 'Tent Camping'
  ]
};

const AddStopsAutopilotModal = ({ onClose, onAddStop, onBackToWaypoint }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [budget, setBudget] = useState(2);
  const [isSearching, setIsSearching] = useState(false);
  const [addedNotice, setAddedNotice] = useState('');
  const [addedIds, setAddedIds] = useState([]);

  // Set default subtype when category changes or step 2 opens
  useEffect(() => {
    if (step === 2 && category && SUBTYPE_OPTIONS[category]) {
      setSubType(SUBTYPE_OPTIONS[category][0]);
    }
  }, [step, category]);

  // Handle Search transition
  const startSearch = () => {
    setStep(3);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1800);
  };

  const handleAdd = (place) => {
    if (addedIds.includes(place.id)) return;
    if (onAddStop) {
      onAddStop({
        id: `ap-${Date.now()}-${place.id}`,
        name: place.title,
        location: place.location,
        img: place.img,
        type: 'attraction'
      });
    }
    setAddedIds(prev => [...prev, place.id]);
    setAddedNotice(`${place.title} added`);
    setTimeout(() => setAddedNotice(''), 3000);
  };

  const RECOMMENDATIONS = [
    { id: 1, title: "Fremont Street Experience", location: "Las Vegas, NV", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Fair Oaks Pharmacy and Soda", location: "South Pasadena, CA", img: "https://images.unsplash.com/photo-1470333738041-3444a7c35bd2?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "The Wellesbourne", location: "Los Angeles, CA", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "The Comedy Store", location: "West Hollywood, CA", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80" }
  ];

  const renderStep1 = () => (
    <div className="autopilot-step-container">
      <h2 className="autopilot-modal-title">What are you looking for?</h2>
      <div className="autopilot-options-list">
        {['Activities and Experiences', 'Places to Eat', 'Places to Stay'].map(cat => (
          <label key={cat} className={`autopilot-radio-card ${category === cat ? 'selected' : ''}`}>
            <span>{cat}</span>
            <div className={`radio-circle ${category === cat ? 'active' : ''}`}>
              {category === cat && <div className="radio-inner" />}
            </div>
            <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} className="hidden-radio" />
          </label>
        ))}
      </div>
      <div className="autopilot-footer">
        <button className="autopilot-back-btn" onClick={onBackToWaypoint || onClose}><ArrowLeft size={18} /> Back</button>
        <button className="autopilot-next-btn active blue" onClick={() => category && setStep(2)} disabled={!category}>Next <ArrowRight size={18} /></button>
      </div>
    </div>
  );

  const getStep2Title = () => {
    if (category === 'Activities and Experiences') return "What type of activities and experiences would you like on your trip?";
    if (category === 'Places to Stay') return "What types of places do you want to stay at on your trip?";
    return "What type of places would you like to eat on your trip?";
  };

  const renderStep2 = () => (
    <div className="autopilot-step-container">
      <h2 className="autopilot-modal-title">{getStep2Title()}</h2>
      <p className="autopilot-modal-subtitle">Choose your preferred type of place and budget range</p>
      
      <div className="autopilot-grid-options">
        {(SUBTYPE_OPTIONS[category] || []).slice(0, 4).map(type => (
          <label key={type} className={`autopilot-radio-card small ${subType === type ? 'selected' : ''}`}>
            <span>{type}</span>
            <div className={`radio-circle ${subType === type ? 'active' : ''}`}>
              {subType === type && <div className="radio-inner" />}
            </div>
            <input type="radio" name="subtype" checked={subType === type} onChange={() => setSubType(type)} className="hidden-radio" />
          </label>
        ))}
      </div>

      <div className="budget-section">
        <h4 className="budget-title">Budget</h4>
        <input type="range" min="1" max="4" value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="budget-slider" />
        <div className="budget-labels">
          <span>$</span><span>$$</span><span>$$$</span><span>$$$$</span>
        </div>
      </div>

      <div className="autopilot-footer">
        <button className="autopilot-back-btn" onClick={() => setStep(1)}><ArrowLeft size={18} /> Back</button>
        <button className="autopilot-next-btn active blue" onClick={startSearch}>Next <ArrowRight size={18} /></button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="autopilot-step-container">
      <div className="recommendations-grid">
        {isSearching ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="skeleton-card" />)
        ) : (
          RECOMMENDATIONS.map(place => (
            <div key={place.id} className="recommendation-card">
              <button className="rec-close-btn" onClick={() => {}}><X size={14} /></button>
              <div className="rec-img"><img src={place.img} alt={place.title} /></div>
              <div className="rec-info">
                <h4>{place.title}</h4>
                <p><MapPin size={12} /> {place.location}</p>
                <button className={`btn-add-rec ${addedIds.includes(place.id) ? 'added' : ''}`} onClick={() => handleAdd(place)}>
                  {addedIds.includes(place.id) ? 'Added' : <><span className="add-icon">+</span> Add</>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="autopilot-footer-notice">{addedNotice && addedNotice}</div>
      <div className="autopilot-footer">
        <button className="autopilot-back-btn" onClick={() => setStep(2)}><ArrowLeft size={18} /> Back</button>
        <button className="autopilot-done-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-stops-autopilot-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="autopilot-brand">
            <h2 className="brand-title">autopilot</h2>
            <span className="brand-subtitle">AI-powered</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="autopilot-content">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};


export default AddStopsAutopilotModal;
