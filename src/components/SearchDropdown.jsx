import { 
  Home, Camera, Truck, Palmtree, Coffee, Tent, 
  Map as MapIcon, Fuel, ParkingCircle, ShoppingBag, 
  Bookmark, Activity 
} from 'lucide-react';
import './SearchDropdown.css';

const CATEGORIES = [
  { icon: <Home size={16} />, name: "Hotels & Unique Stays" },
  { icon: <Camera size={16} />, name: "Sights & Attractions" },
  { icon: <Truck size={16} />, name: "Campendium" },
  { icon: <Palmtree size={16} />, name: "The Great Outdoors" },
  { icon: <Coffee size={16} />, name: "Bars & Restaurants" },
  { icon: <Tent size={16} />, name: "Places to Camp" },
  { icon: <MapIcon size={16} />, name: "Activities & Experiences" },
  { icon: <Fuel size={16} />, name: "Fuel & Rest Stops" },
  { icon: <ParkingCircle size={16} />, name: "Overnight RV Parking" },
  { icon: <ShoppingBag size={16} />, name: "Shopping" },
  { icon: <Activity size={16} />, name: "Sports & Wellness" },
  { icon: <Truck size={16} />, name: "Transportation Services" },
  { icon: <Bookmark size={16} />, name: "My Saved Places" }
];

const SearchDropdown = ({ onClose, onSelectCategory }) => {
  return (
    <div className="search-dropdown-overlay" onClick={onClose}>
      <div className="search-dropdown-card" onClick={e => e.stopPropagation()}>
        <h4 className="dropdown-title">Categories</h4>
        <div className="categories-grid">
          {CATEGORIES.map((cat, i) => (
            <button 
              key={i} 
              className="category-item-btn"
              onClick={() => onSelectCategory(cat.name)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
