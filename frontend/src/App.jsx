import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import FarmerRegistration from './pages/FarmerRegistration';
import BuyerRegistration from './pages/BuyerRegistration';
import ConsumerRegistration from './pages/ConsumerRegistration';
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerSchemes from './pages/FarmerSchemes';
import FarmerMarket from './pages/FarmerMarket';
import GovernmentSchemes from './pages/GovernmentSchemes';

import FarmerWeather from './pages/FarmerWeather';
import FarmerCropRecommendation from './pages/FarmerCropRecommendation';

/* Non-farmer pages keep the original background wrapper + top nav */
function AppWrapper() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-emerald-800/30 to-blue-900/40" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="bg-white/90 backdrop-blur-md shadow-lg p-3 border-b border-green-200">
          <div className="w-full px-4 flex justify-start items-center">
            <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="AgriChain Logo" className="h-24 w-auto object-contain rounded-full shadow-md" />
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600 tracking-tight drop-shadow-sm">
                AgriChain
              </span>
            </Link>
          </div>
        </nav>
        <main className="flex-1 p-4 flex items-center justify-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register/farmer" element={<FarmerRegistration />} />
            <Route path="/register/buyer" element={<BuyerRegistration />} />
            <Route path="/register/consumer" element={<ConsumerRegistration />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/schemes" element={<GovernmentSchemes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Farmer pages — full screen, no global wrapper or top nav */}
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/schemes" element={<FarmerSchemes />} />
        <Route path="/schemes" element={<FarmerSchemes />} />
        <Route path="/farmer/market" element={<FarmerMarket />} />
        <Route path="/market" element={<FarmerMarket />} />
        <Route path="/farmer/weather" element={<FarmerWeather />} />
        <Route path="/weather" element={<FarmerWeather />} />
        <Route path="/farmer/crops" element={<FarmerCropRecommendation />} />
        <Route path="/farmer/crop-recommendation" element={<FarmerCropRecommendation />} />
        {/* All other pages — use the background wrapper */}
        <Route path="/*" element={<AppWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
