import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Edit2, MoreVertical, Crown, MessageSquare, Map as MapIcon, Copy, Trash2, Camera, Star, Car, Settings, HelpCircle, Mail, DollarSign, LogOut, ChevronRight, Globe, Maximize, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProfilePage.css';

const MOCK_PROFILE_TRIPS = [
  {
    id: 1,
    title: 'Los Angeles Trip',
    dates: 'MAR 14 – MAR 20, 2026',
    image: '/trip_la.png'
  },
  {
    id: 2,
    title: 'New York Trip',
    dates: 'APR 4 – APR 10, 2026',
    image: '/trip_ny.png'
  },
  {
    id: 3,
    title: 'California Adventure',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    title: 'Grand Canyon Route',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 5,
    title: 'Pacific Coast Highway',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 6,
    title: 'Zion National Park Trip',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
  }
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('trips');
  const [trips, setTrips] = useState(MOCK_PROFILE_TRIPS);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [emailPrefs, setEmailPrefs] = useState({
    financial: true,
    promotions: true,
    newsletters: true,
    insurance: true,
    other: true,
    updates: true,
    campendium: true,
    smsAccount: false,
    smsOffers: false,
    smsUpdates: false
  });

  const toggleEmailPref = (key) => {
    setEmailPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMenu = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setTrips(trips.filter(t => t.id !== id));
    setActiveMenuId(null);
  };

  const handleDuplicate = (e, trip) => {
    e.preventDefault();
    e.stopPropagation();
    const newTrip = {
      ...trip,
      id: Date.now(),
      title: `${trip.title} (Copy)`
    };
    const index = trips.findIndex(t => t.id === trip.id);
    const newTrips = [...trips];
    newTrips.splice(index + 1, 0, newTrip);
    setTrips(newTrips);
    setActiveMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const renderProfileMain = () => (
    <div className="profile-content-wrapper">
      <div className="breadcrumb">
        <Link to="/app">BACK TO MAP</Link> | <span>ROADTRIPPER7752242'S TRIPS</span>
      </div>

      <div className="profile-hero">
        <img 
          src="/profile_banner.png" 
          alt="Profile Banner" 
          className="hero-banner-img"
        />
        <div className="premium-badge-overlay">
          <Crown size={12} fill="currentColor" />
          PREMIUM
        </div>
      </div>

      <div className="profile-user-info">
        <div className="user-avatar-container">
          <div className="user-avatar-large">
            <User size={64} color="white" />
          </div>
        </div>
        
        <h1 className="profile-username">roadtripper7752242</h1>

        <div className="profile-actions-bar">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
              onClick={() => setActiveTab('trips')}
            >
              Trips
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          <button className="edit-profile-btn" onClick={() => {
            setIsSettingsMode(true);
            setActiveSettingsTab('profile');
          }}>
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-main-content">
        {activeTab === 'trips' ? (
          <div className="profile-trips-grid">
            {trips.map(trip => (
              <Link to="/app" key={trip.id} className="profile-trip-card">
                <img src={trip.image} alt={trip.title} className="profile-trip-card-img" />
                <div className="profile-trip-card-overlay">
                  <div className="profile-trip-card-content">
                    {trip.dates && <span className="profile-trip-card-dates">{trip.dates}</span>}
                    <h3 className="profile-trip-card-title">{trip.title}</h3>
                  </div>
                  
                  <div className="profile-card-top-btns">
                    <button 
                      className={`profile-action-btn ${activeMenuId === trip.id ? 'active' : ''}`}
                      onClick={(e) => toggleMenu(e, trip.id)}
                    >
                      <MoreVertical size={20} color="white" />
                    </button>

                    {activeMenuId === trip.id && (
                      <div className="profile-dropdown-menu">
                        <button className="profile-dropdown-item" onClick={(e) => handleDuplicate(e, trip)}>
                          <Copy size={16} />
                          Duplicate Trip
                        </button>
                        <button className="profile-dropdown-item delete" onClick={(e) => handleDelete(e, trip.id)}>
                          <Trash2 size={16} />
                          Delete Trip
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="profile-empty-state">
            <MessageSquare size={48} color="#d1d5db" />
            <p>No reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="profile-content-wrapper">
      <div className="breadcrumbb">
        {/* <button className="breadcrumb-link-match" onClick={() => setIsSettingsMode(false)}>BACK TO MAP</button> */}
        <Link to="/app">BACK TO MAP</Link>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <h2 className="settings-sidebar-title">Account Settings</h2>
          <p className="settings-sidebar-username">roadtripper7752242</p>

          <nav className="settings-nav">
            <button 
              className={`settings-nav-item ${activeSettingsTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('profile')}
            >
              <User size={18} /> Profile
            </button>
            {/* <button className="settings-nav-item disabled">
              <Globe size={18} /> Social media
            </button>
            <button className="settings-nav-item disabled">
              <Car size={18} /> My vehicles
            </button> */}
            <button 
              className={`settings-nav-item ${activeSettingsTab === 'subscription' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('subscription')}
            >
              <DollarSign size={18} /> Subscription details
            </button>
            <button 
              className={`settings-nav-item ${activeSettingsTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('account')}
            >
              <Settings size={18} /> Account
            </button>
            <button 
              className={`settings-nav-item ${activeSettingsTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('email')}
            >
              <Mail size={18} /> Email preferences
            </button>
            <button className="settings-nav-item">
              <HelpCircle size={18} /> Help & support
            </button>
          </nav>

          <button className="sign-out-link">Sign out</button>
        </aside>

        <section className="settings-main">
          {activeSettingsTab === 'profile' && (
            <div className="settings-section">
              <h2 className="section-title">Profile</h2>
              <p className="section-desc">Edit the information that appears on your profile.</p>

              <div className="image-edit-row">
                <div className="image-edit-group">
                  <label>Profile Image</label>
                  <div className="profile-img-preview">
                    <div className="avatar-silhouette">
                      <User size={60} color="#000" strokeWidth={1} />
                    </div>
                    <div className="camera-overlay">
                      <Maximize size={20} className="viewfinder-frame" />
                      <Camera size={12} className="inner-camera" />
                    </div>
                  </div>
                </div>
                <div className="image-edit-group banner">
                  <label>Banner Image</label>
                  <div className="banner-img-preview">
                    <div className="camera-overlay">
                      <Maximize size={22} className="viewfinder-frame" />
                      <Camera size={13} className="inner-camera" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="input-field">
                <label>Name</label>
                <input type="text" placeholder="Name" />
              </div>

              <div className="input-field">
                <label>Bio</label>
                <textarea placeholder="Tell us about yourself"></textarea>
              </div>

              <div className="input-field">
                <label>Home Address</label>
                <input type="text" placeholder="Home Address" />
                <p className="field-hint">Your new trips will automatically start from your home address</p>
              </div>

              <div className="input-field">
                <label>Phone Number</label>
                <input type="text" placeholder="Phone Number" />
                <p className="field-hint">You'll be eligible to receive membership discounts</p>
              </div>

              <div className="settings-footer">
                <button className="save-settings-btn">Save</button>
              </div>
            </div>
          )}

          {activeSettingsTab === 'subscription' && (
            <div className="settings-section">
              <div className="subscription-header">
                <h3>Subscription</h3>
                <button className="manage-link">Manage</button>
              </div>

              <div className="subscription-card">
                <div className="sub-card-info">
                  <p className="renews-text">Renews on</p>
                  <h4 className="renews-date">May 11, 2026</h4>
                  <div className="premium-badge-v2">
                    <Crown size={14} fill="white" />
                    PREMIUM
                    <span className="plus-symbol">+</span>
                  </div>
                  <p className="sub-price">$59.99 per year.</p>
                </div>
                <div className="sub-card-graphic">
                  <div className="graphic-petal p1"></div>
                  <div className="graphic-petal p2"></div>
                </div>
              </div>

              <div className="subscription-renewal">
                <h3>Renewal</h3>
                <p className="renewal-desc">You will be automatically charged for renewal when your subscription ends.</p>
                <button className="disable-renewal-btn">Disable Renewal</button>
              </div>

              <div className="member-deals">
                <h3>Member Deals</h3>
                <div className="member-deals-link">
                  <div className="deals-logos">
                    <div className="deal-logo rv">V</div>
                    <div className="deal-logo camp">C</div>
                    <div className="deal-logo road">R</div>
                  </div>
                  <span className="deals-text">See your discounts as a premium member</span>
                  <ChevronRight size={20} className="deals-arrow" />
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'email' && (
            <div className="settings-section">
              <h2 className="section-title">Set your communication preferences</h2>
              <p className="section-desc">Personalize your communication preferences to get the content that suits you best.</p>

              <div className="email-prefs-list">
                {[
                  { id: 'financial', title: 'Financial Products/Services', desc: 'Optimize your travel budget by exploring our range of Financial Services.' },
                  { id: 'promotions', title: 'Promotions, Offers, & Deals', desc: 'Discover exclusive offers customized for you.' },
                  { id: 'newsletters', title: 'Newsletters', desc: 'Explore new adventures with weekly road trip inspiration.' },
                  { id: 'insurance', title: 'Insurance Products/Services', desc: 'Stay protected on the road with our selection of Insurance Products.' },
                  { id: 'other', title: 'Other Products/Services', desc: 'Keep yourself updated on the latest offerings from RoadTrip Planner!' },
                  { id: 'updates', title: 'New Feature & Product Updates', desc: 'Receive updates on our latest product features as we roll them out!' },
                  { id: 'campendium', title: 'Campendium Newsletter', desc: 'Discover weekly featured campgrounds on Campendium!' }
                ].map(item => (
                  <div key={item.id} className="email-pref-item" onClick={() => toggleEmailPref(item.id)}>
                    <div className={`custom-checkbox-large ${emailPrefs[item.id] ? 'checked' : ''}`}>
                      {emailPrefs[item.id] && <Check size={16} color="white" strokeWidth={3} />}
                    </div>
                    <div className="email-pref-text">
                      <span className="email-pref-title">{item.title}</span>
                      <p className="email-pref-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sms-prefs-section">
                {[
                  { id: 'smsAccount', title: 'Account Changes - SMS' },
                  { id: 'smsOffers', title: 'Offers & Deals - SMS' },
                  { id: 'smsUpdates', title: 'Product Updates - SMS' }
                ].map(item => (
                  <div key={item.id} className="sms-pref-item" onClick={() => toggleEmailPref(item.id)}>
                    <div className={`custom-checkbox-simple ${emailPrefs[item.id] ? 'checked' : ''}`}></div>
                    <span className="sms-pref-title">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="settings-footer email">
                <button className="save-settings-btn">Save</button>
                <button className="unsubscribe-all-link">Unsubscribe from all</button>
              </div>
            </div>
          )}

          {activeSettingsTab === 'account' && (
            <div className="settings-section">
              <h2 className="section-title">Account</h2>
              <p className="section-desc">Your RoadTrip Planner account info.</p>

              <div className="account-subsection">
                <h3>General</h3>
                <div className="input-field">
                  <label>Username</label>
                  <input type="text" defaultValue="roadtripper7752242" />
                </div>
                <div className="input-field">
                  <label>Email</label>
                  <input type="email" defaultValue="rahat090804@gmail.com" />
                </div>
                <div className="input-field">
                  <label>Units of Measure</label>
                  <div className="select-wrapper">
                    <select>
                      <option>Imperial</option>
                      <option>Metric</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="account-subsection password">
                <h3>Update Password</h3>
                <div className="input-field">
                  <label>Old Password</label>
                  <input type="password" placeholder="Old Password" />
                </div>
                <div className="input-field">
                  <label>Password</label>
                  <input type="password" placeholder="Password" />
                </div>
                <div className="input-field">
                  <label>Confirm new password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>
              </div>

              <div className="settings-footer">
                <button className="save-settings-btn">Save</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <Navbar variant="app" />
      
      <main className="profile-container">
        {isSettingsMode ? renderSettings() : renderProfileMain()}
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
