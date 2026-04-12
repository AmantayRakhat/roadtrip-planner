import React from 'react';
import { X, Navigation, Home } from 'lucide-react';
import './AddWaypointModal.css';

const AddWaypointModal = ({ onClose, onUseAutopilot }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-waypoint-modal" onClick={e => e.stopPropagation()}>
        <div className="add-waypoint-header">
          <h3>Add a waypoint</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="add-waypoint-body">
          <label className="input-label-bold">Search for a location</label>
          <div className="search-input-wrapper">
            <input type="text" placeholder="Add stops" className="waypoint-input" />
            <div className="floating-blue-icon">
              <Home size={12} color="white" fill="white" />
            </div>
          </div>
          
          <div className="or-divider">
            <div className="line"></div>
            <span className="text">or</span>
            <div className="line"></div>
          </div>
          
          <label className="input-label-bold">Get recommendations with AI-powered Autopilot</label>
          <button className="btn-use-autopilot" onClick={onUseAutopilot}>
            Use Autopilot
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWaypointModal;
