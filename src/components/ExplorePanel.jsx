import React, { useState, useRef } from 'react';
import { Bookmark, Star, ChevronDown, ListFilter, MoreHorizontal, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import SortModal from './SortModal';
import RatingFilterModal from './RatingFilterModal';
import FilterYourResultsModal from './FilterYourResultsModal';
import './ExplorePanel.css';

const DEFAULT_PLACES = [
  {
    id: 1,
    title: 'Longwood Gardens',
    location: 'Kennett Square, PA',
    rating: 5.0,
    bgColor: '#ff7f7f', // Reddish
  },
  {
    id: 2,
    title: 'Joshua Tree National Park',
    location: 'Joshua Tree, CA',
    rating: 4.5,
    bgColor: '#d9b38c', // Brownish
  },
  {
    id: 3,
    title: 'Venice Beach',
    location: 'Los Angeles, CA',
    rating: 4.8,
    bgColor: '#ffcc66', // Yellowish
  },
  {
    id: 4,
    title: 'Padre Island National Seashore',
    location: 'Corpus Christi, TX',
    rating: 4.7,
    bgColor: '#00ccff', // Bluish
  }
];

const SEARCH_RESULTS = [
  {
    id: 11,
    title: 'Pine Country Restaurant',
    location: 'Williams, AZ',
    rating: 4.0,
    img: 'https://images.unsplash.com/photo-1555507036-ab1d4075cbf9?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 12,
    title: 'The Big Texan Steak Ranch',
    location: 'Amarillo, TX',
    rating: 3.5,
    img: 'https://images.unsplash.com/photo-1544025162-831e5f8f53a6?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 13,
    title: 'Cornerstone Deli & Frozen Custard',
    location: 'Oklahoma City, OK',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 14,
    title: 'Oatman Hotel Restaurant',
    location: 'Oatman, AZ',
    rating: 4.2,
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400&h=300'
  }
];

const ExplorePanel = ({ activeCategory, onAddPlace, isTripActive, onAddCurrentTripStop, savedPlaces = [], onToggleSavePlace }) => {
  const isSearchMode = !!activeCategory;
  const isSavedPlacesMode = activeCategory === 'My Saved Places';
  const scrollRef = useRef(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentSort, setCurrentSort] = useState('Popularity');
  const [filters, setFilters] = useState({ rating: 'Any' });
  const [activeMile, setActiveMile] = useState('30');

  // Filter logic
  const displayPlaces = isSavedPlacesMode ? savedPlaces : (isSearchMode ? SEARCH_RESULTS : DEFAULT_PLACES);

  const isSaved = (placeId) => savedPlaces.some(p => p.id === placeId);

  const scrollChips = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddClick = (e, place) => {
    e.stopPropagation();
    if (isTripActive && onAddCurrentTripStop) {
      onAddCurrentTripStop(place);
    } else if (onAddPlace) {
      onAddPlace(place.title);
    }
  };

  const handleSaveClick = (e, place) => {
    e.stopPropagation();
    if (onToggleSavePlace) {
      onToggleSavePlace(place);
    }
  };

  // Exclude Cuisine, Dietary Options, Business Type as requested.
  const getChipsForCategory = (cat) => {
    const base = ['Rating', 'Open Now', 'Has Photos', 'Has Reviews'];
    if (!cat) return base;
    const lower = cat.toLowerCase();
    if (lower.includes('rv') || lower.includes('camp')) {
      return ['RV Dump Station', 'Rating', 'RV Parking Available', 'Open Now', 'Has Reviews', 'Big Rig Accessible'];
    }
    return base;
  };
  
  const activeChips = getChipsForCategory(activeCategory);

  const renderDefaultGrid = () => (
    <div className="explore-panel default-mode">
      <div className="explore-header">
        <h2>{isSavedPlacesMode ? 'My Saved Places' : 'Must-See Extraordinary Places'}</h2>
        {!isSavedPlacesMode && <button className="see-all-btn">See all</button>}
      </div>

      <div className="explore-grid">
        {displayPlaces.map((place) => (
          <div key={place.id} className="explore-card">
            <div className="explore-card-graphic" style={{ backgroundColor: place.bgColor }}>
              <div className="card-actions">
                <button className="card-btn add-btn" onClick={(e) => handleAddClick(e, place)}>
                  <Plus size={18} strokeWidth={2} />
                </button>
                <button 
                  className={`card-btn bookmark-btn ${isSaved(place.id) ? 'saved' : ''}`}
                  onClick={(e) => handleSaveClick(e, place)}
                >
                  <Bookmark size={16} fill={isSaved(place.id) ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="graphic-placeholder">
                <div className="graphic-shape"></div>
              </div>
            </div>
            <div className="explore-card-info">
              <h4>{place.title}</h4>
              <p>{place.location}</p>
              <div className="rating">
                <Star size={14} className="star-icon" fill="currentColor" />
                <span>{place.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
        {isSavedPlacesMode && displayPlaces.length === 0 && (
          <div className="empty-saved-state">
            <Bookmark size={48} color="#d1d5db" />
            <p>You haven't saved any places yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSearchGrid = () => (
    <div className="explore-panel search-mode">
      <div className="explore-header sticky-header">
        <h1>{isSavedPlacesMode ? 'My Saved Places' : 'Explore'}</h1>
        
        <div className="distance-filter">
          <p>Search results within km of your route</p>
          <div className="miles-toggle-group">
            {['5', '10', '15', '20', '25', '30', '∞'].map((distance) => (
              <button 
                key={distance} 
                className={`mile-btn ${distance === activeMile ? 'active' : ''}`}
                onClick={() => setActiveMile(distance)}
              >
                {distance}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-sort-row">
          <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
            Filter <ListFilter size={16} />
          </button>
          <div className="sort-dropdown" onClick={() => setShowSortModal(true)}>
            Sort by: <strong>{currentSort}</strong> <ChevronDown size={14} />
          </div>
        </div>

        <div className="chips-row">
          <button className="scroll-arrow prev" onClick={() => scrollChips('left')}>
            <ChevronLeft size={16} />
          </button>
          <div className="chips-wrapper" ref={scrollRef}>
            {activeChips.map((chip, i) => (
              <button 
                key={i} 
                className="chip"
                onClick={() => {
                  if (chip === 'Rating') setShowRatingModal(true);
                  else if (chip === 'Has Photos' || chip === 'Open Now') {
                    // Just toggle
                    setFilters(prev => ({ ...prev, [chip]: !prev[chip] }));
                  }
                }}
                style={filters[chip] && filters[chip] !== 'Any' ? { borderColor: '#1a2e5a', backgroundColor: '#eef2ff' } : {}}
              >
                {chip}
              </button>
            ))}
          </div>
          <button className="scroll-arrow next" onClick={() => scrollChips('right')}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="explore-grid">
        {displayPlaces.map((place) => (
          <div key={place.id} className="explore-card realistic">
            <div className="explore-card-image">
              <img src={place.img || 'https://images.unsplash.com/photo-1555507036-ab1d4075cbf9?auto=format&fit=crop&q=80&w=400&h=300'} alt={place.title} />
              <div className="card-actions">
                <button className="card-btn add-btn" onClick={(e) => handleAddClick(e, place)}>
                  <Plus size={18} strokeWidth={2} />
                </button>
                <button 
                  className={`card-btn bookmark-btn ${isSaved(place.id) ? 'saved' : ''}`}
                  onClick={(e) => handleSaveClick(e, place)}
                >
                  <Bookmark size={16} fill={isSaved(place.id) ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
            <div className="explore-card-info">
              <h4>{place.title}</h4>
              <p>{place.location}</p>
              <div className="rating yelp">
                <div className="yelp-star-box">
                  <Star size={10} color="white" fill="white" />
                </div>
                <span>{place.rating.toFixed(1)} on Yelp</span>
              </div>
            </div>
          </div>
        ))}
        {isSavedPlacesMode && displayPlaces.length === 0 && (
          <div className="empty-saved-state">
            <Bookmark size={48} color="#d1d5db" />
            <p>You haven't saved any places yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="explore-panel-container">
      {isSearchMode ? renderSearchGrid() : renderDefaultGrid()}
      {showSortModal && (
        <SortModal 
          currentSort={currentSort}
          onClose={() => setShowSortModal(false)}
          onApply={setCurrentSort}
        />
      )}
      {showRatingModal && (
        <RatingFilterModal 
          currentRating={filters.rating}
          onClose={() => setShowRatingModal(false)}
          onApply={(rating) => setFilters(prev => ({ ...prev, rating }))}
        />
      )}
      {showFilterModal && (
        <FilterYourResultsModal 
          currentFilters={filters}
          categoryChips={activeChips}
          activeCategory={activeCategory}
          onClose={() => setShowFilterModal(false)}
          onApply={(newFilters) => setFilters(newFilters)}
        />
      )}
    </div>
  );
};

export default ExplorePanel;
