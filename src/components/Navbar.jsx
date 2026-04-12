import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, User, X, Crown, LogOut, Settings, HelpCircle, FileText, Heart, Map as MapIcon, User as UserIcon, Bookmark } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ variant = 'landing', onOpenAuth, onSearchFocus, onSearchBlur, activeExploreCategory, onClearExploreCategory }) => {
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
                <div className="profile-dropdown">
                  <button className="dropdown-close" onClick={() => setIsProfileOpen(false)}>
                    <X size={20} />
                  </button>
                  
                  <div className="dropdown-header">
                    <div className="header-avatar">
                      <User size={32} />
                      <div className="premium-badge">
                        <Crown size={10} fill="currentColor" />
                        PREMIUM
                      </div>
                    </div>
                    <h3 className="username">roadtripper7752242</h3>
                  </div>

                  <div className="dropdown-menu">
                    <div className="menu-item">
                      <UserIcon size={18} />
                      <span>Profile</span>
                    </div>
                    <div className="menu-item">
                      <MapIcon size={18} />
                      <span>My Trips</span>
                    </div>
                    <div className="menu-item">
                      <Bookmark size={18} />
                      <span>My Saved Places</span>
                    </div>
                    <div className="menu-item">
                      <FileText size={18} />
                      <span>My Reviews</span>
                    </div>
                    <div className="menu-divider"></div>
                    <div className="menu-item">
                      <Settings size={18} />
                      <span>Settings</span>
                    </div>
                    <div className="menu-item">
                      <HelpCircle size={18} />
                      <span>Support</span>
                    </div>
                    <div className="menu-item sign-out">
                      <LogOut size={18} />
                      <span>Sign Out</span>
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
