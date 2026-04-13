import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, User, X, Crown, LogOut, Settings, HelpCircle, FileText, Heart, Map as MapIcon, User as UserIcon, Bookmark } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ variant = 'landing', onOpenAuth, onSearchFocus, onSearchBlur, activeExploreCategory, onClearExploreCategory, onSelectCategory }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const isApp = variant === 'app';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSavedPlacesClick = () => {
    if (onSelectCategory) {
      onSelectCategory('My Saved Places');
    }
    setIsProfileOpen(false);
  };

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
              value={activeExploreCategory || ''}
              readOnly={!!activeExploreCategory}
              onChange={() => {}}
              onFocus={onSearchFocus}
              onBlur={(e) => {
                setTimeout(onSearchBlur, 200);
              }}
            />
            {activeExploreCategory && (
              <button 
                className="clear-search-btn"
                onClick={onClearExploreCategory}
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}
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
            <div className="profile-menu-wrapper" ref={profileRef}>
              <div 
                className="profile-icon" 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <User size={20} />
              </div>

              {isProfileOpen && (
                <div className="profile-dropdown-v2">
                  <button className="dropdown-close" onClick={() => setIsProfileOpen(false)}>
                    <X size={24} />
                  </button>
                  
                  <div className="dropdown-header-v2">
                    <div className="avatar-section">
                      <div className="header-avatar-v2">
                        <User size={40} color="white" />
                      </div>
                      <div className="premium-badge-v2">
                        <Crown size={10} fill="currentColor" />
                        PREMIUM
                      </div>
                    </div>
                    <h3 className="username-v2">roadtripper7752242</h3>
                  </div>

                  <div className="dropdown-menu-list">
                    <Link to="/profile" className="menu-list-item" onClick={() => setIsProfileOpen(false)}>
                      Profile
                    </Link>
                    <Link to="/profile" className="menu-list-item" onClick={() => setIsProfileOpen(false)}>
                      My Trips
                    </Link>
                    <div className="menu-list-item active" onClick={handleSavedPlacesClick}>
                      My Saved Places
                    </div>
                    <div className="menu-list-item">
                      My Reviews
                    </div>
                    <div className="menu-list-item">
                      Settings
                    </div>
                    <div className="menu-list-item">
                      Support
                    </div>
                    <div className="menu-list-item sign-out">
                      Sign Out
                    </div>
                  </div>
                </div>
              )}
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
