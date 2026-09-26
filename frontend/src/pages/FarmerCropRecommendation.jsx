import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, FileText, BarChart2, Cloud, User, LogOut, Menu, X,
  Sprout, Search, Sparkles, Filter, ExternalLink, ArrowRight,
  Droplets, Thermometer, Calendar, TrendingUp, ShieldCheck, Bot
} from 'lucide-react';
import {
  KARNATAKA_CROPS,
  KARNATAKA_SEASONS,
  KARNATAKA_SOILS,
  getRecommendedCrops
} from '../services/karnatakaCropRecommendationService';

import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerCropRecommendation() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedSoil, setSelectedSoil] = useState('All');
  const [selectedWater, setSelectedWater] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Top navbar links with Profile replaced by Crop Recommendation
  const farmerName = localStorage.getItem('farmerName') || 'Ramesh Gowda';

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of Farmer Portal?")) {
      localStorage.removeItem('farmerName');
      localStorage.removeItem('farmerMobile');
      localStorage.removeItem('farmerCrop');
      localStorage.removeItem('farmerDistrict');
      localStorage.removeItem('agrichain_user');
      navigate('/');
    }
  };

  const navLinks = [
    { icon: Home, label: t('home', 'Home'), active: false, action: () => navigate('/farmer-dashboard') },
    { icon: Bot, label: t('aiAssistant', 'AI Assistant'), active: false, action: () => navigate('/farmer/ai') },
    { icon: FileText, label: t('schemes', 'Schemes'), active: false, action: () => navigate('/farmer/schemes') },
    { icon: BarChart2, label: t('market', 'Market'), active: false, action: () => navigate('/farmer/market') },
    { icon: Cloud, label: t('weather', 'Weather'), active: false, action: () => navigate('/farmer/weather') },
    { icon: Sprout, label: t('cropAdvisory', 'Crop Recommendation'), active: true, action: () => {} },
  ];

  const recommendations = useMemo(() => {
    return getRecommendedCrops({
      season: selectedSeason,
      soilType: selectedSoil,
      waterAvailability: selectedWater,
      searchQuery
    });
  }, [selectedSeason, selectedSoil, selectedWater, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 flex flex-col justify-between" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── TOP ENLARGED NAVIGATION BAR ── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 sm:px-10 lg:px-12 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex-shrink-0">
        <div className="flex items-center gap-3.5 sm:gap-4 cursor-pointer" onClick={() => navigate('/farmer-dashboard')}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center p-1 shadow-md border-2 border-emerald-200 flex-shrink-0">
            <img src="/logo.png" alt="AgriChain Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-black text-green-950 text-2xl sm:text-3xl tracking-tight leading-tight flex items-center gap-2">
              AgriChain
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold tracking-wide mt-0.5">
              Field to Fork Freshness
            </div>
          </div>
        </div>

        {/* Center Nav Pill Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 bg-gray-50/90 p-1 xl:p-1.5 rounded-full border border-gray-200/70 shadow-inner">
          {navLinks.map(({ icon: Icon, label, active, action }) => (
            <button
              key={label}
              onClick={action}
              className={`flex items-center gap-1.5 xl:gap-2 px-3 xl:px-5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                  : 'text-gray-700 hover:text-green-800 hover:bg-white'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Right Controls: Farmer Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Farmer Profile Pill */}
          <div
            onClick={() => navigate('/farmer-dashboard')}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300/80 px-2.5 sm:px-3 py-1.5 rounded-full cursor-pointer transition shadow-xs group"
            title="Farmer Dashboard"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-emerald-900">
              <User size={15} />
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                {t('farmer', 'Farmer')}
              </div>
              <div className="text-xs sm:text-sm font-black text-gray-900 truncate max-w-[85px] sm:max-w-[130px]">
                {farmerName}
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border-2 border-rose-300 text-rose-700 hover:text-rose-900 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Logout from Farmer Account"
          >
            <LogOut size={15} className="text-rose-600 flex-shrink-0" />
            <span className="font-black hidden sm:inline">{t('logout', 'Logout')}</span>
          </button>

          {/* Option in the right side top beside logout */}
          <LanguageSelector />

          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden text-gray-700 hover:text-green-800 p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
            title="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-xl px-4 py-3 flex flex-col gap-1 z-40">
          <div className="py-2 px-1 flex items-center justify-between border-b border-gray-100 mb-1">
            <span className="text-xs font-bold text-gray-500 uppercase">{t('selectLanguage', 'Language')}</span>
            <LanguageSelector />
          </div>
          {navLinks.map(({ icon: Icon, label, active, action }) => (
            <button
              key={label}
              onClick={() => { setMenuOpen(false); action(); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active ? 'bg-purple-100 text-purple-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-black text-rose-700 hover:bg-rose-50 border-t border-gray-100 mt-1"><LogOut size={16} /><span>Logout ({farmerName || 'Farmer'})</span></button>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">

        {/* ── 1. BANNER: KisanVani Karnataka Crop Intelligence ── */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border-2 border-purple-300 bg-gradient-to-r from-purple-100/90 via-indigo-50 to-emerald-100/70 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white text-purple-900 border border-purple-300 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
                KISANVANI CROP INTELLIGENCE
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-300">
                Karnataka Only Dataset
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight">
              Karnataka Crop Season-Wise Recommendations
            </h1>
            <p className="text-sm sm:text-base text-gray-700 mt-1 font-medium leading-relaxed">
              Agro-climatic crop suitability across Kharif (ಮುಂಗಾರು), Rabi (ಹಿಂಗಾರು), & Annual seasons with soil compatibility, water requirements, and market profitability scores.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="https://www.kisanvani.co.in/crop-recommendation"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-md hover:shadow-lg transition active:scale-95"
            >
              <span>KisanVani Official Feed</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>

        {/* ── 2. FILTER CONTROLS BAR ── */}
        <div className="bg-white rounded-3xl border-2 border-purple-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          {/* Season Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1 mr-1">
              <Calendar size={15} className="text-purple-700" />
              <span>Season:</span>
            </span>
            {KARNATAKA_SEASONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSeason(s.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition shadow-sm ${
                  selectedSeason === s.id
                    ? 'bg-purple-700 text-white shadow-purple-700/25 scale-[1.02]'
                    : 'bg-purple-50/70 text-gray-700 hover:bg-purple-100/80 border border-purple-200'
                }`}
              >
                <span>{s.label}</span>
                <span className="ml-1 opacity-80 font-normal">({s.kannada})</span>
              </button>
            ))}
          </div>

          {/* Secondary Controls: Soil, Water, Search */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Soil Filter */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Soil Type:
              </label>
              <select
                value={selectedSoil}
                onChange={(e) => setSelectedSoil(e.target.value)}
                className="w-full bg-slate-50 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-600 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                {KARNATAKA_SOILS.map((soil) => (
                  <option key={soil} value={soil}>
                    {soil === 'All' ? 'All Karnataka Soils' : soil}
                  </option>
                ))}
              </select>
            </div>

            {/* Water Availability */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Water Availability:
              </label>
              <select
                value={selectedWater}
                onChange={(e) => setSelectedWater(e.target.value)}
                className="w-full bg-slate-50 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-600 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Water Levels</option>
                <option value="low">Low (ಕಡಿಮೆ ನೀರು - Rain-fed / Dryland)</option>
                <option value="medium">Medium (ಮಧ್ಯಮ ನೀರು - Semi-irrigated)</option>
                <option value="high">High (ಹೆಚ್ಚು ನೀರು - Canal / Well Irrigated)</option>
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Search Crop Name:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Maize, ತೊಗರಿ, Onion, Cotton..."
                  className="w-full bg-slate-50 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-600 rounded-2xl px-4 py-2.5 pr-9 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                <Search size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. CROPS CARDS DIRECTORY ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">
              Showing <strong className="text-purple-900">{recommendations.length}</strong> Recommended Karnataka Crops
            </span>
            <span className="text-xs text-gray-500">
              Ranked by KisanVani Compatibility Score
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendations.map((crop) => {
              const seasonBadge =
                crop.season === 'kharif'
                  ? { text: 'Kharif (ಮುಂಗಾರು)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
                  : crop.season === 'rabi'
                  ? { text: 'Rabi (ಹಿಂಗಾರು)', color: 'bg-sky-100 text-sky-800 border-sky-300' }
                  : { text: 'Annual (ವಾರ್ಷಿಕ)', color: 'bg-amber-100 text-amber-900 border-amber-300' };

              const riskBadge =
                crop.riskLevel === 'low'
                  ? 'text-emerald-700 bg-emerald-50'
                  : crop.riskLevel === 'medium'
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-red-700 bg-red-50';

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl p-5 border-[3px] border-purple-200/80 hover:border-purple-600 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon + Name + Season */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 p-1 flex items-center justify-center border-2 border-purple-300 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative">
                          {crop.image ? (
                            <img
                              src={crop.image}
                              alt={crop.name}
                              className="w-full h-full object-cover rounded-xl"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display = 'block';
                                }
                              }}
                            />
                          ) : null}
                          <span className={`text-3xl ${crop.image ? 'hidden' : 'block'}`}>
                            {crop.icon}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base sm:text-lg text-gray-900 leading-tight group-hover:text-purple-800 transition-colors">
                            {crop.name}
                          </h3>
                          {crop.nameKn && (
                            <span className="text-xs font-bold text-purple-700 block mt-0.5">
                              {crop.nameKn}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${seasonBadge.color} whitespace-nowrap`}>
                        {seasonBadge.text}
                      </span>
                    </div>

                    {/* Compatibility Score Meter */}
                    <div className="mt-4 p-3 rounded-2xl bg-purple-50/80 border border-purple-100">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-purple-900 flex items-center gap-1">
                          <Sparkles size={13} className="text-purple-600" />
                          <span>Compatibility Score</span>
                        </span>
                        <span className="text-purple-800 font-mono font-black text-sm">
                          {crop.compatibilityScore}%
                        </span>
                      </div>
                      <div className="w-full bg-purple-200/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${crop.compatibilityScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Micro Metrics */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-gray-500 block">Duration</span>
                        <span className="font-bold text-gray-800">⏱️ {crop.growingPeriod} Days</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-gray-500 block">Water Need</span>
                        <span className="font-bold text-gray-800 capitalize">💧 {crop.waterRequirement}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-gray-500 block">Temperature</span>
                        <span className="font-bold text-gray-800">🌡️ {crop.tempMin}–{crop.tempMax}°C</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-gray-500 block">Rainfall</span>
                        <span className="font-bold text-gray-800">🌧️ {crop.rainMin}–{crop.rainMax}mm</span>
                      </div>
                    </div>

                    {/* Suitable Soils */}
                    <div className="mt-3">
                      <span className="text-[10px] text-gray-500 font-semibold block mb-1">
                        Suitable Karnataka Soils:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {crop.soilTypes.map((soil, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium bg-slate-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200"
                          >
                            {soil}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Demand & Risk */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-600">
                      Demand: <strong className="text-purple-800 uppercase">{crop.marketDemand}</strong>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full capitalize ${riskBadge}`}>
                      Risk: {crop.riskLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-white py-4 px-6 text-center text-xs text-gray-500 font-medium flex-shrink-0 mt-12">
        <div className="max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 AgriChain · Karnataka Crop Season-Wise Recommendation Engine · Powered by KisanVani Agriculture Intelligence
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.kisanvani.co.in/crop-recommendation"
              target="_blank"
              rel="noreferrer"
              className="text-purple-700 hover:underline font-bold"
            >
              KisanVani Feed
            </a>
            <span>•</span>
            <button
              onClick={() => navigate('/farmer-dashboard')}
              className="text-gray-600 hover:text-green-800 font-bold"
            >
              Farmer Dashboard
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
