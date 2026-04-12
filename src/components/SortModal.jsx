import React, { useState, useEffect } from 'react';
import { X, Circle, CheckCircle2 } from 'lucide-react';
import './SortModal.css';

const OPTIONS = [
  'Popularity',
  'Distance From You',
  'Rating',
  'Number of Reviews'
];

const SortModal = ({ onClose, onApply, currentSort = 'Popularity' }) => {
  const [selectedSort, setSelectedSort] = useState(currentSort);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="sort-modal-overlay" onClick={onClose}>
      <div className="sort-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="sort-modal-header">
          <button className="close-action-btn" onClick={onClose}>
            <X size={20} />
          </button>
          <h2>Sort Results By</h2>
        </div>

        <div className="sort-modal-body">
          {OPTIONS.map((option) => (
            <div 
              key={option} 
              className="sort-option-row"
              onClick={() => setSelectedSort(option)}
            >
              <span className="sort-option-text">{option}</span>
              <div className={`sort-radio ${selectedSort === option ? 'selected' : ''}`}>
                {selectedSort === option ? (
                  <div className="radio-inner-dot" />
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="sort-modal-footer">
          <button 
            className="btn-primary apply-btn"
            onClick={() => {
              onApply(selectedSort);
              onClose();
            }}
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};

export default SortModal;
