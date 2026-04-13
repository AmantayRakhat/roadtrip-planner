import React from 'react';
import { useLocation } from 'react-router-dom';
import InfoLayout from '../components/InfoLayout';
import './LegalPage.css';

const LegalPage = () => {
  const location = useLocation();
  const path = location.pathname;

  const getContent = () => {
    if (path.includes('privacy')) {
      return {
        title: "Privacy Policy",
        subtitle: "Last updated: April 13, 2026",
        sections: [
          {
            h3: "1. Information We Collect",
            p: "We collect information you provide directly to us, such as when you create an account, plan a trip, or contact support. This includes your name, email address, locations, and travel preferences."
          },
          {
            h3: "2. How We Use Your Information",
            p: "We use your information to provide, maintain, and improve our services, including personalization of travel recommendations, processing transactions, and sending technical notices."
          },
          {
            h3: "3. Location Data",
            p: "RoadTrip Planner requires access to your location data to provide accurate mapping and navigation features. You can control location sharing through your device settings."
          },
          {
            h3: "4. Data Sharing",
            p: "We do not share your private location history with advertisers. We may share aggregated, non-identifying data with partners to improve regional tourism insights."
          }
        ]
      };
    } else if (path.includes('terms')) {
      return {
        title: "Terms of Service",
        subtitle: "Last updated: April 13, 2026",
        sections: [
          {
            h3: "1. Acceptance of Terms",
            p: "By using RoadTrip Planner, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application."
          },
          {
            h3: "2. User Accounts",
            p: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
          },
          {
            h3: "3. Prohibited Use",
            p: "Users may not use the service for any illegal purposes or to distribute harmful content. Automated scraping of our map data is strictly prohibited."
          },
          {
            h3: "4. Termination",
            p: "We reserve the right to suspend or terminate your access to the service at our sole discretion, without notice, for conduct that violates these terms."
          }
        ]
      };
    } else {
      return {
        title: "Copyright Notice",
        subtitle: "© 2026 RoadTrip Planner, LLC",
        sections: [
          {
            h3: "1. Intellectual Property",
            p: "All content, including text, graphics, logos, and software, is the property of RoadTrip Planner or its content suppliers and is protected by international copyright laws."
          },
          {
            h3: "2. Limited License",
            p: "Users are granted a limited, non-exclusive license to access and use the service for personal, non-commercial travel planning purposes."
          },
          {
            h3: "3. Trademarks",
            p: "RoadTrip Planner, the 'Autopilot' feature name, and our brand marks are trademarks of RoadTrip Planner, LLC. Use without permission is prohibited."
          }
        ]
      };
    }
  };

  const content = getContent();

  return (
    <InfoLayout title={content.title} subtitle={content.subtitle}>
      <div className="legal-content">
        {content.sections.map((section, index) => (
          <div key={index} className="legal-section">
            <h3 className="legal-h3">{section.h3}</h3>
            <p className="legal-p">{section.p}</p>
          </div>
        ))}
      </div>
    </InfoLayout>
  );
};

export default LegalPage;
