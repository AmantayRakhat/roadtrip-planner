import React from 'react';
import InfoLayout from '../components/InfoLayout';
import { Briefcase, BarChart, Globe, Award, Download, Image, FileText } from 'lucide-react';
import './BusinessPage.css';

const BusinessPage = () => {
  return (
    <InfoLayout 
      title="Business Solutions" 
      subtitle="Partner with the world's most advanced road trip planning platform."
    >
      <div className="info-section">
        <h2 className="section-title">Why Partner with Us?</h2>
        <div className="grid-3">
          <div className="info-card">
            <div className="card-icon"><BarChart size={24} /></div>
            <h3 className="card-title">Data Insights</h3>
            <p className="card-desc">Gain access to anonymized traveler data to understand popular routes and emerging destinations.</p>
          </div>
          <div className="info-card">
            <div className="card-icon"><Globe size={24} /></div>
            <h3 className="card-title">Brand Exposure</h3>
            <p className="card-desc">Put your business on the map for millions of road trippers actively planning their next stop.</p>
          </div>
          <div className="info-card">
            <div className="card-icon"><Award size={24} /></div>
            <h3 className="card-title">Quality Assurance</h3>
            <p className="card-desc">We highlight high-quality local businesses, helping travelers find the best experiences.</p>
          </div>
        </div>
      </div>

      <div className="info-section business-tools-section">
        <div className="business-tools-content">
          <h2 className="section-title">Tools for Every Business</h2>
          <div className="tools-grid">
            <div className="tool-item">
              <div className="tool-header">
                <div className="tool-icon-circle"><BarChart size={20} /></div>
                <h3>Tourism Boards</h3>
              </div>
              <p>Promote your region's scenic routes and natural wonders to a targeted audience of adventure seekers.</p>
            </div>
            <div className="tool-item">
              <div className="tool-header">
                <div className="tool-icon-circle"><Briefcase size={20} /></div>
                <h3>Rentals & Gear</h3>
              </div>
              <p>Connect with travelers who need vehicles, camping equipment, and outdoor gear for their journeys.</p>
            </div>
            <div className="tool-item">
              <div className="tool-header">
                <div className="tool-icon-circle"><Award size={20} /></div>
                <h3>Hospitality</h3>
              </div>
              <p>Showcase your hotels, campsites, and restaurants as recommended stops on popular road trip routes.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section media-center">
        <h2 className="section-title">Media Center</h2>
        <p className="section-text">Download official brand assets, press releases, and high-resolution images of Kazakhstan's landscapes.</p>
        <div className="media-assets-grid">
          <div className="asset-card">
            <div className="asset-type"><Image size={24} /></div>
            <div className="asset-info">
              <h4>Brand Kit</h4>
              <span>Logos, Colors, Typography (12.4 MB)</span>
            </div>
            <button className="asset-download"><Download size={20} /></button>
          </div>
          <div className="asset-card">
            <div className="asset-type"><FileText size={24} /></div>
            <div className="asset-info">
              <h4>Press Release - April 2026</h4>
              <span>New AI Autopilot Launch (0.8 MB)</span>
            </div>
            <button className="asset-download"><Download size={20} /></button>
          </div>
          <div className="asset-card">
            <div className="asset-type"><Image size={24} /></div>
            <div className="asset-info">
              <h4>Photography Pack</h4>
              <span>Kazakhstan Landscapes (45.2 MB)</span>
            </div>
            <button className="asset-download"><Download size={20} /></button>
          </div>
        </div>
      </div>

      <div className="info-section business-cta">
        <div className="cta-box">
          <h2>Ready to get started?</h2>
          <p>Contact our partnership team to explore custom solutions for your business.</p>
          <button className="btn-primary">Become a Partner</button>
        </div>
      </div>
    </InfoLayout>
  );
};

export default BusinessPage;
