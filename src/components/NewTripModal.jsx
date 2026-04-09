import React, { useState } from 'react';
import { X, Sparkles, Navigation } from 'lucide-react';
import './NewTripModal.css';

const NewTripModal = ({ onClose, onCreateTrip }) => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-trip-modal" onClick={e => e.stopPropagation()}>
        <div className="new-trip-header">
          <h2>Where are you going?</h2>
          <button className="close-x" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="new-trip-body">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Starting point" 
              value={start}
              onChange={e => setStart(e.target.value)}
            />
            <label className="checkbox-label">
              <input type="checkbox" /> Save as home address
            </label>
          </div>

          <div className="input-group">
            <input 
              type="text" 
              placeholder="Destination" 
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
          </div>

          <button 
            className="btn-create-trip-large"
            onClick={() => onCreateTrip('autopilot')}
          >
            Create trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTripModal;
