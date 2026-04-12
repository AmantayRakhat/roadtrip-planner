import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import RatingSlider from './RatingSlider';
import './RatingFilterModal.css';

const RatingFilterModal = ({ onClose, onApply, currentRating = 'Any' }) => {
  const [rating, setRating] = useState(currentRating);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="rating-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="rating-modal-header">
          <h3>Filter by Rating</h3>
          <button className="close-action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="rating-modal-body">
          <RatingSlider value={rating} onChange={setRating} />
        </div>

        <div className="rating-modal-footer">
          <button 
            className="btn-apply-small"
            onClick={() => {
              onApply(rating);
              onClose();
            }}
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingFilterModal;
