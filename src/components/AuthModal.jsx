import React, { useState } from 'react';
import { X, EyeOff, Eye, ArrowLeft } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ initialMode = 'login', onClose }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [authStep, setAuthStep] = useState(0); // 0: main, 1: sms otp, 2: password
  const [phoneNumber, setPhoneNumber] = useState('');

  const isLogin = mode === 'login';

  if (authStep === 1) {
    return (
      <div className="auth-modal-backdrop" onClick={onClose}>
        <div className="auth-modal step-modal" onClick={e => e.stopPropagation()}>
          <button className="auth-back" onClick={() => setAuthStep(0)}>
            <ArrowLeft size={20} />
          </button>
          <button className="auth-close" onClick={onClose}>
            <X size={20} />
          </button>

          <h2 className="step-title">Confirm it's you</h2>
          <p className="step-subtitle">We sent a code to {phoneNumber || 'your number'}.</p>

          <div className="otp-container">
            <input 
              type="text" 
              className="otp-input" 
              placeholder="- - - - - -" 
              maxLength={6} 
              onChange={(e) => {
                if (e.target.value.length === 6) setAuthStep(2);
              }}
            />
          </div>

          <p className="resend-text">
            Didn't receive code? <span>Get a new code</span>
          </p>

          <button className="secondary-btn" onClick={() => setAuthStep(0)}>
            Try another way
          </button>
        </div>
      </div>
    );
  }

  if (authStep === 2) {
    return (
      <div className="auth-modal-backdrop" onClick={onClose}>
        <div className="auth-modal step-modal" onClick={e => e.stopPropagation()}>
          <button className="auth-back" onClick={() => setAuthStep(1)}>
            <ArrowLeft size={20} />
          </button>
          <button className="auth-close" onClick={onClose}>
            <X size={20} />
          </button>

          <h2 className="step-title">Create Password</h2>
          <p className="step-subtitle">Set a password for your new account.</p>

          <form className="auth-form" onSubmit={e => e.preventDefault()}>
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                className="auth-input" 
                placeholder="Password" 
              />
              <button 
                type="button" 
                className="password-eye" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            
            <button type="submit" className="submit-btn" style={{ marginTop: '1.5rem' }} onClick={onClose}>
              Complete Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="auth-title">
          {isLogin ? 'Log in to your account' : 'Create an account'}
        </h2>

        <span className="auth-section-title">
          {isLogin ? 'Log in with' : 'Sign up with'}
        </span>

        <div className="oauth-buttons">
          <button className="oauth-btn">
            {/* Mocking Google G with generic text for simplicity */}
            <span style={{ color: '#4285F4', fontWeight: 'bold' }}>G</span> Google
          </button>
          <button className="oauth-btn">
            {/* Mocking Apple logo */}
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}></span> Apple
          </button>
        </div>

        <div className="auth-divider">or</div>

        {!isLogin && (
          <div className="auth-method-tabs">
            <button 
              className={`method-tab ${!usePhone ? 'active' : ''}`} 
              onClick={() => { setUsePhone(false); setSmsSent(false); }}
            >
              Email
            </button>
            <button 
              className={`method-tab ${usePhone ? 'active' : ''}`} 
              onClick={() => { setUsePhone(true); setSmsSent(false); }}
            >
              Phone Number
            </button>
          </div>
        )}

        {(isLogin || !usePhone) ? (
          <form className="auth-form" onSubmit={e => e.preventDefault()}>
            <div className="input-group">
              <input 
                type="text" 
                className="auth-input" 
                placeholder={isLogin ? "Email or Phone number" : "Username"} 
              />
            </div>
            
            {!isLogin && (
              <div className="input-group">
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="Email Address" 
                />
              </div>
            )}

            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                className="auth-input" 
                placeholder={isLogin ? "Password" : "Create Password"} 
              />
              <button 
                type="button" 
                className="password-eye" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {isLogin && (
              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            )}

            <button type="submit" className="submit-btn" onClick={onClose}>
              {isLogin ? 'Log in' : 'Sign up'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={e => { e.preventDefault(); setAuthStep(1); }}>
            <div className="input-group">
              <input 
                type="tel" 
                className="auth-input" 
                placeholder="Phone Number" 
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Continue
            </button>
          </form>
        )}

        <div className="auth-switch">
          {isLogin ? (
            <>New to RoadTrip Planner? <span onClick={() => { setMode('signup'); setAuthStep(0); }}>Create an account</span></>
          ) : (
            <>Already have an account? <span onClick={() => { setMode('login'); setAuthStep(0); }}>Log in</span></>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
