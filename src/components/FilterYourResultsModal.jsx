import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import RatingSlider from './RatingSlider';
import './FilterYourResultsModal.css';

const FilterYourResultsModal = ({ onClose, currentFilters, onApply, categoryChips, activeCategory }) => {
  const [filters, setFilters] = useState(currentFilters || { rating: 'Any' });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCheckboxChange = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isFuelRow = activeCategory === 'Fuel & Rest Stops';

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="results-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="results-modal-header">
          <h3>Filter Your Results</h3>
          <button className="close-action-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="results-modal-body custom-scroll">
          
          {isFuelRow ? (
            <>
              <div className="filter-section">
                <h4 className="section-title">Types of Places</h4>
                <div className="checkbox-list">
                  {['EV Charging', 'Gas & Fuel Stations', 'Parking', 'Public Restrooms & Showers', 'Rest Areas'].map(chip => (
                    <label key={chip} className="filter-checkbox-row">
                      <span>{chip}</span>
                      <input 
                        type="checkbox" 
                        className="custom-checkbox"
                        checked={!!filters[chip]}
                        onChange={() => handleCheckboxChange(chip)}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="filter-section">
                <h4 className="section-title">General</h4>
                <div className="checkbox-list">
                  <label className="filter-checkbox-row">
                    <span>Has Photos</span>
                    <input 
                      type="checkbox" 
                      className="custom-checkbox"
                      checked={!!filters['Has Photos']}
                      onChange={() => handleCheckboxChange('Has Photos')}
                    />
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="filter-section">
                <div className="checkbox-list">
                  {categoryChips.filter(c => c !== 'Rating' && c !== 'RV Dump Station').map(chip => (
                    <label key={chip} className="filter-checkbox-row">
                      <span>{chip}</span>
                      <input 
                        type="checkbox" 
                        className="custom-checkbox"
                        checked={!!filters[chip]}
                        onChange={() => handleCheckboxChange(chip)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {categoryChips.includes('Rating') && (
                <div className="filter-section">
                  <h4 className="section-title">Rating</h4>
                  <RatingSlider 
                    value={filters.rating || 'Any'} 
                    onChange={(val) => setFilters(prev => ({ ...prev, rating: val }))} 
                  />
                </div>
              )}
            </>
          )}

        </div>

        <div className="results-modal-footer">
          <button 
            className="btn-reset-filters"
            onClick={() => setFilters({ rating: 'Any' })}
          >
            Reset Filters
          </button>
          <button 
            className="btn-view-places"
            onClick={() => {
              onApply(filters);
              onClose();
            }}
          >
            View 200+ Places
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterYourResultsModal;
