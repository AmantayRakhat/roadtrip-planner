import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import AutopilotWizard from './pages/AutopilotWizard';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import AboutPage from './pages/AboutPage';
import InspirationPage from './pages/InspirationPage';
import BusinessPage from './pages/BusinessPage';
import LegalPage from './pages/LegalPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/autopilot" element={<AutopilotWizard />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/inspiration" element={<InspirationPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/privacy" element={<LegalPage />} />
        <Route path="/terms" element={<LegalPage />} />
        <Route path="/copyright" element={<LegalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
