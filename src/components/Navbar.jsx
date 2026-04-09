import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ variant = 'landing', onOpenAuth, onSearchFocus, onSearchBlur }) => {
  const isApp = variant === 'app';

  return (
    <nav className={`navbar-container ${isApp ? 'app-variant' : 'landing-variant'}`}>
      <div className="navbar-left">
        <Link to="/" className="logo">RoadTrip Planner</Link>
        
        {isApp && (
          <div className="search-bar">
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              placeholder="Search and Explore" 
              onFocus={onSearchFocus}
              onBlur={(e) => {
                // Delay blur to allow clicking dropdown items
                setTimeout(onSearchBlur, 200);
              }}
            />
          </div>
        )}
      </div>

      <div className="navbar-links">
        {isApp ? (
          <>
            <span className="nav-link">Membership <ChevronDown size={14} /></span>
            <span className="nav-link">For RVers <ChevronDown size={14} /></span>
            <span className="nav-link">Trip Ideas <ChevronDown size={14} /></span>
            <span className="nav-link">Trip Planner</span>
            <div className="profile-icon">
              <User size={20} />
            </div>
          </>
        ) : (
          <>
            <div className="navbar-auth">
              <button className="login-btn" onClick={() => onOpenAuth('login')}>Log In</button>
              <button className="signup-btn" onClick={() => onOpenAuth('signup')}>Sign Up</button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
