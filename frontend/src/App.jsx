import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { FindParkingPage } from './pages/FindParkingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { WhyTenleaPage } from './pages/WhyTenleaPage';
import { BenefitsPage } from './pages/BenefitsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandownerDashboardPage } from './pages/LandownerDashboardPage';
import { VehicleOwnerDashboardPage } from './pages/VehicleOwnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AddLandPage } from './pages/AddLandPage';
import { AddParkingSpacePage } from './pages/AddParkingSpacePage';
import { MyVehiclesPage } from './pages/MyVehiclesPage';
import { AgreementGeneratorPage } from './pages/AgreementGeneratorPage';
import { SettingsPage } from './pages/SettingsPage';
import { ScrollToTop } from './components/common/ScrollToTop';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/find-parking" element={<FindParkingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/why-tenlea" element={<WhyTenleaPage />} />
          <Route path="/benefits" element={<BenefitsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/landowner" element={<LandownerDashboardPage />} />
          <Route path="/dashboard/vehicle-owner" element={<VehicleOwnerDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/add-land" element={<AddLandPage />} />
          <Route path="/add-parking" element={<AddParkingSpacePage />} />
          <Route path="/my-vehicles" element={<MyVehiclesPage />} />
          <Route path="/kyc" element={<AgreementGeneratorPage />} />
          <Route path="/agreement-generator" element={<AgreementGeneratorPage />} />
          <Route path="/agreements" element={<AgreementGeneratorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
