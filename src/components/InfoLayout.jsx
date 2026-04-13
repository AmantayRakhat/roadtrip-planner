import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './InfoLayout.css';

const InfoLayout = ({ children, title, subtitle }) => {
  return (
    <div className="info-layout">
      <Navbar variant="landing" />
      
      <header className="info-header">
        <div className="container">
          <h1 className="info-title">{title}</h1>
          {subtitle && <p className="info-subtitle">{subtitle}</p>}
        </div>
      </header>

      <main className="info-main">
        <div className="container">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InfoLayout;
