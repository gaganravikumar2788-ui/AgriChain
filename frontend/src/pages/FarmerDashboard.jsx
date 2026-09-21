import React, { useState, useEffect } from 'react';
import {
  KARNATAKA_DISTRICTS,
  fetchPlaceWeather,
  getAccuWeatherUrl
} from '../services/karnatakaWeatherService';

import CropSeasonModal from '../components/CropSeasonModal';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import {
  Home, FileText, BarChart2, Cloud, User, Menu, X,
  Zap, Leaf, MapPin, Droplets, Wind, Umbrella, ArrowRight,
  Calendar, CheckCircle, ExternalLink, ShieldCheck, TrendingUp, Sprout, LogOut
} from 'lucide-react';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [weather, setWeather] = useState({
    temp: 28,
    condition: 'Partly Cloudy',
    emoji: '🌤️',
    humidity: 68,
    windSpeed: 12,
    rainChance: 10
  });

  const [activeModal, setActiveModal] = useState(null);
  const [farmerName, setFarmerName] = useState(() => {
    return localStorage.getItem('farmerName') || 'Ramesh Gowda';
  });

  useEffect(() => {
    const t = setInterval(() => setSlideIndex(i => (i + 1) % 4), 3500);
    return () => clearInterval(t);
  }, []);

  const [selectedDistrictId, setSelectedDistrictId] = useState('mysuru');
  const [districtWeather, setDistrictWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Day-to-day automated real-time weather feed synchronized place-by-place
  useEffect(() => {
    let isMounted = true;
    setWeatherLoading(true);
    fetchPlaceWeather(selectedDistrictId).then((data) => {
      if (isMounted && data) {
        setDistrictWeather(data);
        setWeather({
          temp: data.temperature,
          condition: data.condition,
          emoji: data.icon,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          rainChance: data.precipitationProb
        });
        setWeatherLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedDistrictId]);

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
    { icon: Home, label: t('home', 'Home'), active: true, action: () => navigate('/farmer-dashboard') },
    { icon: FileText, label: t('schemes', 'Schemes'), active: false, action: () => navigate('/farmer/schemes') },
    { icon: BarChart2, label: t('market', 'Market'), active: false, action: () => navigate('/farmer/market') },
    { icon: Cloud, label: t('weather', 'Weather'), active: false, action: () => navigate('/farmer/weather') },
    { icon: Sprout, label: t('cropAdvisory', 'Crop Recommendation'), active: false, action: () => setActiveModal('cropSeason') },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 flex flex-col justify-between" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── TOP NAVIGATION BAR (Enlarged & Prominent) ── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 sm:px-10 lg:px-12 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex-shrink-0">
        {/* Logo & Subtitle */}
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
                  ? 'bg-green-700 text-white shadow-md shadow-green-700/20'
                  : 'text-gray-700 hover:text-green-800 hover:bg-white'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Right Controls: Farmer Profile, Logout & Language */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Farmer Profile Pill */}
          <div
            onClick={() => setActiveModal('profile')}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300/80 px-2.5 sm:px-3 py-1.5 rounded-full cursor-pointer transition shadow-xs group"
            title="Farmer Account"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-emerald-900">
              <User size={15} />
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                {t('farmer', 'Farmer')}
              </div>
              <div className="text-xs sm:text-sm font-black text-gray-900 truncate max-w-[85px] sm:max-w-[130px]">
                {farmerName || 'Ramesh Gowda'}
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
                active ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-black text-rose-700 hover:bg-rose-50 border-t border-gray-100 mt-1"><LogOut size={16} /><span>{t('logout', 'Logout')} ({farmerName || 'Farmer'})</span></button>
        </div>
      )}

      {/* ── MAIN DASHBOARD CONTENT AREA (fills viewport height gracefully) ── */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col justify-between gap-3 sm:gap-4">

        {/* ── 1. HERO BANNER ── */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border-2 border-emerald-700/35 bg-gradient-to-r from-emerald-100 via-green-100 to-emerald-50 min-h-[190px] sm:min-h-[220px] flex items-center flex-shrink-0">
          {/* Panoramic Lush Farm Background */}
          <div
            className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-25 pointer-events-none"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&auto=format&fit=crop&q=80')"
            }}
          />
          {/* Subtle radial sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/90 via-green-100/80 to-transparent pointer-events-none" />

          <div className="relative z-10 w-full px-6 sm:px-10 py-5 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left Content */}
            <div className="max-w-xl text-center md:text-left">
              <span className="text-xs sm:text-sm font-bold text-green-700 tracking-wide uppercase">
                {t('welcomeBack', 'Welcome Back,')}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-950 mt-0.5 tracking-tight">
                {t('happyFarming', 'Happy Farming!')}
              </h1>
              {/* Farmer Name Greeting & Quick Logout */}
              <div className="mt-2 mb-1 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 bg-emerald-800/15 border border-emerald-700/25 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs sm:text-sm lg:text-base font-black text-emerald-950 tracking-wider">
                    {t('welcomeFarmer', 'WELCOME')} {farmerName ? farmerName.toUpperCase() : 'FARMER'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-md transition active:scale-95 cursor-pointer"
                  title="Logout from Farmer Portal"
                >
                  <LogOut size={13} />
                  <span>{t('logout', 'Logout')}</span>
                </button>
              </div>
              <p className="text-green-900/80 text-xs sm:text-sm lg:text-base mt-2 font-medium leading-relaxed max-w-lg">
                {t('heroSubtitle', 'Access government schemes, check market prices, get weather updates and more – all in one place.')}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => navigate('/farmer/schemes')}
                  className="bg-green-800 hover:bg-green-900 active:scale-95 text-white px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-green-900/20 transition-all"
                >
                  <Leaf size={15} />
                  <span>{t('exploreServices', 'Explore Services')}</span>
                  <ArrowRight size={14} />
                </button>
                {/* Carousel indicator dots */}
                <div className="flex items-center gap-1.5 ml-2">
                  {[0, 1, 2, 3].map(i => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === slideIndex ? 'w-6 bg-green-800' : 'w-2 bg-green-600/30 hover:bg-green-600/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content: Farmer Graphic & Tagline */}
            <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
              <div className="hidden lg:block text-right">
                <div className="text-green-900 font-extrabold text-xl lg:text-2xl italic tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  Better Farming
                </div>
                <div className="text-green-900 font-extrabold text-xl lg:text-2xl italic tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  Brighter Future
                </div>
              </div>
              <div className="relative">
                <img
                  src="/farmer-hero.jpg"
                  alt="Happy Farmer"
                  className="h-36 sm:h-44 lg:h-48 w-auto object-cover object-top rounded-2xl shadow-lg border-2 border-white/80"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. THREE-COLUMN CARDS GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 flex-1 items-stretch">

          {/* ════ COLUMN 1: Schemes (top) + Quick Access (bottom) ════ */}
          <div className="flex flex-col gap-3.5 sm:gap-4 justify-between">

            {/* 1. Government Schemes Card */}
            <div
              onClick={() => navigate('/farmer/schemes')}
              className="flex-1 bg-[#edf9f2] rounded-3xl p-5 sm:p-6 border-2 border-emerald-500/50 shadow-md hover:shadow-xl hover:border-emerald-700 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                    🏛️
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                      Government Schemes
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed max-w-[260px]">
                      Find and apply for various central and state government schemes for farmers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Government Dome SVG Illustration */}
              <div className="absolute -right-3 -bottom-3 w-32 h-32 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 15L30 35H90L60 15Z" fill="#047857" />
                  <path d="M35 38H85V44H35V38Z" fill="#047857" />
                  <circle cx="60" cy="26" r="4" fill="#10B981" />
                  <rect x="38" y="47" width="7" height="38" rx="2" fill="#047857" />
                  <rect x="51" y="47" width="7" height="38" rx="2" fill="#047857" />
                  <rect x="64" y="47" width="7" height="38" rx="2" fill="#047857" />
                  <rect x="77" y="47" width="7" height="38" rx="2" fill="#047857" />
                  <path d="M30 87H90V95H30V87Z" fill="#047857" />
                  <path d="M25 97H95V105H25V97Z" fill="#065F46" />
                </svg>
              </div>

              <div className="mt-4 relative z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/farmer/schemes');
                  }}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all group-hover:shadow group-hover:translate-x-0.5"
                >
                  <span>View Schemes</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* 2. Quick Access Card */}
            <div className="flex-1 bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-300/80 shadow-md hover:shadow-xl hover:border-slate-400 transition-all flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">Quick Access</h3>
                  <p className="text-[11px] sm:text-xs text-gray-400">Explore essential services</p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-3 sm:pt-4">
                {[
                  { icon: '📋', label: 'Schemes', bg: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', action: () => navigate('/farmer/schemes') },
                  { icon: '₹', label: 'Market Price', bg: 'bg-rose-50 text-rose-700 hover:bg-rose-100', action: () => navigate('/farmer/market') },
                  { icon: '☁️', label: 'Weather', bg: 'bg-sky-50 text-sky-700 hover:bg-sky-100', action: () => navigate('/farmer/weather') },
                  { icon: '📄', label: 'Advisories', bg: 'bg-purple-50 text-purple-700 hover:bg-purple-100', action: () => setActiveModal('advisories') },
                  { icon: '👤', label: 'Profile', bg: 'bg-teal-50 text-teal-700 hover:bg-teal-100', action: () => setActiveModal('profile') },
                ].map(({ icon, label, bg, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center gap-1.5 p-1 rounded-2xl hover:scale-105 active:scale-95 transition-all text-center group"
                  >
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold shadow-sm ${bg} transition-colors`}>
                      {icon}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 leading-tight">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ════ COLUMN 2: Market Price (top) + Crop Season (bottom) ════ */}
          <div className="flex flex-col gap-3.5 sm:gap-4 justify-between">

            {/* 3. Market Price & Arrival Card */}
            <div
              onClick={() => navigate('/farmer/market')}
              className="flex-1 bg-[#fffbeb] rounded-3xl p-5 sm:p-6 border-[3px] border-amber-600/80 shadow-lg hover:shadow-2xl hover:border-amber-700 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                    📊
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-amber-800 transition-colors">
                      Market Price & Arrival
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed max-w-[260px]">
                      Check latest market prices and arrival of key commodities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Vegetables Basket Illustration */}
              <div className="absolute -right-2 -bottom-2 w-32 h-32 opacity-25 pointer-events-none group-hover:opacity-40 transition-opacity">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="60" cy="85" rx="38" ry="18" fill="#D97706" />
                  <path d="M25 80C25 65 95 65 95 80" stroke="#B45309" strokeWidth="4" />
                  <circle cx="50" cy="65" r="14" fill="#EF4444" />
                  <circle cx="70" cy="68" r="13" fill="#F59E0B" />
                  <circle cx="62" cy="55" r="12" fill="#10B981" />
                  <ellipse cx="80" cy="65" rx="8" ry="12" fill="#FBBF24" />
                  <circle cx="42" cy="74" r="9" fill="#84CC16" />
                </svg>
              </div>

              <div className="mt-4 relative z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/farmer/market');
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all group-hover:shadow group-hover:translate-x-0.5"
                >
                  <span>View Market</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* 4. Crop Season Wise Recommendation Card (KisanVani Karnataka Data) */}
            <div
              onClick={() => setActiveModal('cropSeason')}
              className="flex-1 bg-[#f5f3ff] rounded-3xl p-5 sm:p-6 border-[3px] border-purple-600/80 shadow-lg hover:shadow-2xl hover:border-purple-700 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                    🌱
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-purple-800 transition-colors leading-snug">
                        Crop Season Wise Recommendation
                      </h2>
                    </div>
                    <span className="inline-block text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-300 mb-1">
                      KisanVani Karnataka Agro Data
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-[260px]">
                      Discover optimal crops for Karnataka across Kharif (ಮುಂಗಾರು), Rabi (ಹಿಂಗಾರು), & Annual seasons with soil suitability and profitability scores.
                    </p>
                  </div>
                </div>

                {/* Popular Karnataka Season Chips */}
                <div className="flex flex-wrap gap-1.5 mt-3 relative z-10">
                  <span className="text-[11px] font-bold bg-white text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-lg shadow-xs">
                    🌽 Maize (Kharif)
                  </span>
                  <span className="text-[11px] font-bold bg-white text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-lg shadow-xs">
                    🧅 Onion (Rabi)
                  </span>
                  <span className="text-[11px] font-bold bg-white text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-lg shadow-xs">
                    🎋 Sugarcane (Annual)
                  </span>
                  <span className="text-[11px] font-bold bg-white text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-lg shadow-xs">
                    🌿 Cotton (Kharif)
                  </span>
                </div>
              </div>

              {/* Decorative Sprout & Sun Illustration */}
              <div className="absolute -right-2 -bottom-2 w-32 h-32 opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="85" cy="40" r="16" fill="#FBBF24" />
                  <path d="M20 95C45 92 75 92 100 95C70 102 40 102 20 95Z" fill="#78350F" />
                  <path d="M60 90V65" stroke="#15803D" strokeWidth="5" strokeLinecap="round" />
                  <path d="M60 70C50 60 40 65 42 75C48 78 58 75 60 70Z" fill="#22C55E" />
                  <path d="M60 65C70 55 80 60 78 70C72 73 62 70 60 65Z" fill="#16A34A" />
                </svg>
              </div>

              <div className="mt-4 relative z-10 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal('cropSeason');
                  }}
                  className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all group-hover:shadow group-hover:translate-x-0.5"
                >
                  <span>View Recommendations</span>
                  <ArrowRight size={14} />
                </button>
                <a
                  href="https://www.kisanvani.co.in/crop-recommendation"
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline"
                >
                  KisanVani Feed ↗
                </a>
              </div>
            </div>

          </div>

          {/* ════ COLUMN 3: Weather Update Card (spans 2 rows full height with thick border) ════ */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-[3px] border-sky-600/70 shadow-lg hover:shadow-2xl hover:border-sky-600 transition-all duration-300 md:row-span-2 flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Header with Live Sync & District Selector */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl shadow-sm">
                    {weather.emoji}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Weather Update</h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>AccuWeather Live Sync</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
                  Day-to-day Real-Time
                </span>
              </div>

              {/* District Dropdown for Karnataka */}
              <div className="mt-3">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Select Karnataka District:
                </label>
                <div className="relative">
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                    className="w-full bg-sky-50/70 border-2 border-sky-300/80 hover:border-sky-500 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition cursor-pointer"
                  >
                    {KARNATAKA_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.kannadaName}) • {d.region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Big Temp Hero Display */}
              <div className="my-4 flex items-center justify-between bg-gradient-to-br from-sky-50 via-emerald-50/40 to-sky-100/50 p-4 rounded-2xl border-2 border-sky-200/80 shadow-inner">
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                    {weather.temp}°<span className="text-xl text-sky-600 font-bold">C</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-sky-800 mt-1 flex items-center gap-1">
                    <span>{weather.condition}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {districtWeather ? `Feels like ${districtWeather.apparentTemperature}°C` : 'RealFeel Shade'}
                  </div>
                </div>
                <div className="text-5xl animate-bounce drop-shadow">
                  {weather.emoji}
                </div>
              </div>

              {/* Weather Stats List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/90 border border-gray-200/80 hover:bg-sky-50/60 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <Droplets size={15} className="text-sky-500" />
                    <span>Humidity</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{weather.humidity}%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/90 border border-gray-200/80 hover:bg-sky-50/60 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <Wind size={15} className="text-teal-500" />
                    <span>Wind Speed</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{weather.windSpeed} km/h</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/90 border border-gray-200/80 hover:bg-sky-50/60 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <Umbrella size={15} className="text-indigo-500" />
                    <span>Chance of Rain</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">{weather.rainChance}%</span>
                </div>
              </div>
            </div>

            {/* Bottom Button linking to /farmer/weather */}
            <div className="pt-4 space-y-2">
              <button
                onClick={() => navigate('/farmer/weather')}
                className="w-full bg-sky-600 hover:bg-sky-700 active:scale-98 text-white py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 transition-all"
              >
                <span>Full Karnataka Weather Hub (31 Districts)</span>
                <ArrowRight size={15} />
              </button>
              <a
                href={getAccuWeatherUrl(selectedDistrictId)}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-[11px] font-semibold text-sky-700 hover:text-sky-900 hover:underline pt-0.5"
              >
                View Live on AccuWeather ↗
              </a>
            </div>
          </div>

        </div>

        {/* ── 3. ALL STATES / UT PANNER (Fills the entire bottom width seamlessly) ── */}
        <div className="w-full rounded-3xl border-2 border-emerald-600/40 bg-gradient-to-r from-[#eef9f2] via-[#f1faf5] to-[#ebf7f5] p-4 sm:p-5 shadow-md hover:shadow-xl hover:border-emerald-600/60 transition-all relative overflow-hidden flex-shrink-0">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left Info with Calendar Icon */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                📅
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900">
                  All States/UT
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Data shown is for 3 days, and data is frozen up to{' '}
                  <span className="font-extrabold text-emerald-800">15 September 2026</span>
                </p>
              </div>
            </div>

            {/* Center Rural Village Panorama (Landscape) */}
            <div className="hidden lg:flex items-center gap-2 opacity-80 pointer-events-none">
              <span className="text-3xl">🏡</span>
              <span className="text-3xl">🌳</span>
              <span className="text-3xl">🌾</span>
              <span className="text-3xl">🚜</span>
              <span className="text-3xl">🌴</span>
            </div>

            {/* Right Action: Map Pin Icon + View All States Button */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm">
                <MapPin size={20} />
              </div>
              <button
                onClick={() => setActiveModal('states')}
                className="bg-white hover:bg-emerald-50 text-emerald-900 border-2 border-emerald-300 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow transition-all"
              >
                <span>View All States</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 bg-white py-2 px-4 text-center text-[11px] text-gray-400 font-medium flex-shrink-0">
        © 2026 AgriChain · Farmers • Markets • Freshness · Official Government Scheme Registry
      </footer>

      {/* ── MODALS (For Quick Details) ── */}
      <CropSeasonModal isOpen={activeModal === 'cropSeason'} onClose={() => setActiveModal(null)} />
      {activeModal && activeModal !== 'cropSeason' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            {activeModal === 'market' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">📊</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Live Mandi Prices</h3>
                    <p className="text-xs text-gray-500">Updated every 30 minutes from APMC markets</p>
                  </div>
                </div>
                <div className="space-y-2.5 my-4">
                  {[
                    { crop: 'Wheat (Sharbati)', mandi: 'Mysuru APMC', price: '₹2,450 / qtl', trend: '+2.4%' },
                    { crop: 'Paddy (Basmati)', mandi: 'Mandya Market', price: '₹3,820 / qtl', trend: '+1.1%' },
                    { crop: 'Tomato (Hybrid)', mandi: 'Kolar APMC', price: '₹1,600 / qtl', trend: '-0.8%' },
                    { crop: 'Onion (Red)', mandi: 'Hubballi Market', price: '₹2,200 / qtl', trend: '+4.5%' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                      <div>
                        <div className="text-sm font-bold text-gray-900">{item.crop}</div>
                        <div className="text-xs text-gray-500">{item.mandi}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-amber-800">{item.price}</div>
                        <span className={`text-[11px] font-bold ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{item.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-amber-700">
                  Close Preview
                </button>
              </div>
            )}

            {activeModal === 'weather' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center text-xl font-bold">🌤️</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">7-Day Farming Weather Forecast</h3>
                    <p className="text-xs text-gray-500">Mysuru, Karnataka Agromet Advisory</p>
                  </div>
                </div>
                <div className="space-y-2 my-4">
                  {[
                    { day: 'Today', temp: '28°C / 20°C', cond: 'Partly Cloudy', rain: '10%' },
                    { day: 'Tomorrow', temp: '29°C / 21°C', cond: 'Clear Sky', rain: '5%' },
                    { day: 'Sunday', temp: '27°C / 19°C', cond: 'Scattered Showers', rain: '45%' },
                    { day: 'Monday', temp: '26°C / 19°C', cond: 'Light Rain', rain: '60%' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-sky-50/60 border border-sky-100">
                      <div className="font-bold text-sm text-gray-800">{f.day}</div>
                      <div className="text-xs text-gray-600">{f.cond}</div>
                      <div className="text-xs font-bold text-sky-800">{f.temp}</div>
                      <div className="text-xs font-semibold text-blue-600">☔ {f.rain}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-sky-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-sky-700">
                  Close Forecast
                </button>
              </div>
            )}


            {activeModal === 'advisories' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl font-bold">📄</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Agricultural Advisories</h3>
                    <p className="text-xs text-gray-500">ICAR & State Agricultural Department Updates</p>
                  </div>
                </div>
                <div className="space-y-3 my-4">
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                    <div className="text-xs font-bold text-green-900">Pest Surveillance Notice: Fall Armyworm</div>
                    <p className="text-[11px] text-green-800 mt-1">Recommended pheromone traps for maize and sorghum crops in southern dry zones.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-xs font-bold text-blue-900">Soil Health Card Renewal</div>
                    <p className="text-[11px] text-blue-800 mt-1">Free soil testing camps operating at Taluk Raitha Samparka Kendras this week.</p>
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-gray-800 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-gray-900">
                  Close
                </button>
              </div>
            )}

            {activeModal === 'profile' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl font-bold">👤</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Farmer Profile</h3>
                    <p className="text-xs text-gray-500">AgriChain Verified Farmer Account</p>
                  </div>
                </div>
                <div className="space-y-2 my-4 text-xs">
                  <div className="flex justify-between p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">Farmer Name</span>
                    <span className="font-bold text-gray-800">{farmerName}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">Location</span>
                    <span className="font-bold text-gray-800">Mysuru, Karnataka</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">Land Holding</span>
                    <span className="font-bold text-gray-800">4.5 Acres (Small Farmer)</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">Kisan Credit Card</span>
                    <span className="font-bold text-green-700">Active (₹3,00,000 limit)</span>
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-teal-800">
                  Close Profile
                </button>
              </div>
            )}

            {activeModal === 'states' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">📅</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">All States & Union Territories</h3>
                    <p className="text-xs text-gray-500">National Market & Weather Aggregation (Frozen to 15 Sept 2026)</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 my-4 max-h-56 overflow-y-auto pr-1">
                  {['Karnataka', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Gujarat', 'Haryana', 'Rajasthan', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'West Bengal'].map(st => (
                    <div key={st} className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs flex items-center justify-between">
                      <span className="font-bold text-gray-800">{st}</span>
                      <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded-full font-bold">Active</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-emerald-800">
                  Close Summary
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
