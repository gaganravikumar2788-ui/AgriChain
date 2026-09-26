import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, FileText, BarChart2, Cloud, User, LogOut, Menu, X,
  MapPin, Droplets, Wind, Umbrella, Sun, ArrowRight,
  ExternalLink, CheckCircle2, AlertTriangle, RefreshCw, Sprout, Bot
} from 'lucide-react';
import {
  KARNATAKA_DISTRICTS,
  fetchPlaceWeather,
  fetchAllKarnatakaWeather,
  getAccuWeatherUrl
} from '../services/karnatakaWeatherService';

import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import {
  translateWeatherCondition,
  translateDay,
  getLocalizedAgrometAdvisory
} from '../utils/translations';

export default function FarmerWeather() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState('mysuru');
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [allWeatherData, setAllWeatherData] = useState({});
  const [loadingSelected, setLoadingSelected] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [farmerName, setFarmerName] = useState(() => {
    return localStorage.getItem('farmerName') || 'Ramesh Gowda';
  });

  const regionLabels = {
    All: t('regionAll', 'All'),
    'South Interior': t('regionSouth', 'South Interior'),
    'Coastal & Malenadu': t('regionCoastal', 'Coastal & Malenadu'),
    'North Karnataka': t('regionNorth', 'North Karnataka')
  };

  // Standard navbar links matching FarmerDashboard, FarmerMarket, and FarmerSchemes
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
    { icon: Cloud, label: t('weather', 'Weather'), active: true, action: () => {} },
    { icon: Sprout, label: t('cropAdvisory', 'Crop Recommendation'), active: false, action: () => navigate('/farmer/crops') },
  ];

  // Fetch selected district weather
  const loadDistrictWeather = async (districtId) => {
    setLoadingSelected(true);
    const data = await fetchPlaceWeather(districtId);
    setSelectedWeather(data);
    setLoadingSelected(false);
  };

  // Fetch all districts for directory
  const loadAllWeather = async () => {
    setLoadingAll(true);
    const data = await fetchAllKarnatakaWeather();
    setAllWeatherData(data);
    setLoadingAll(false);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    loadDistrictWeather(selectedDistrictId);
  }, [selectedDistrictId]);

  useEffect(() => {
    loadAllWeather();
    // Automated background refresh every 10 minutes
    const interval = setInterval(() => {
      loadDistrictWeather(selectedDistrictId);
      loadAllWeather();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter districts by region and search query
  const filteredDistricts = KARNATAKA_DISTRICTS.filter((d) => {
    const matchesRegion = selectedRegion === 'All' || d.region === selectedRegion;
    const matchesSearch =
      !searchQuery.trim() ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      d.kannadaName.includes(searchQuery.trim());
    return matchesRegion && matchesSearch;
  });

  const regions = ['All', 'South Interior', 'Coastal & Malenadu', 'North Karnataka'];

  const advisory = getLocalizedAgrometAdvisory(selectedWeather, language);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 flex flex-col justify-between" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── TOP ENLARGED NAVIGATION BAR (Matching FarmerDashboard, FarmerMarket, FarmerSchemes) ── */}
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
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
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
                active ? 'bg-sky-100 text-sky-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-black text-rose-700 hover:bg-rose-50 border-t border-gray-100 mt-1"><LogOut size={16} /><span>{t('logout', 'Logout')} ({farmerName || 'Farmer'})</span></button>
        </div>
      )}

      {/* ── MAIN CONTENT AREA (Light Aesthetic with Fresh Accents) ── */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">

        {/* ── 1. LIGHT BANNER: AccuWeather Karnataka Live Sync ── */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border-2 border-sky-300 bg-gradient-to-r from-sky-100/90 via-blue-50 to-emerald-100/70 p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white text-sky-900 border border-sky-300 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
                {t('accuWeatherKarnatakaFeed', 'ACCUWEATHER LIVE KARNATAKA FEED')}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                {t('automatedRealTimeSync', 'Automated Day-to-Day Real-Time Sync')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight">
              {t('realTimePlaceWeather', 'Real-Time Karnataka Place-by-Place Weather')}
            </h1>
            <p className="text-sm sm:text-base text-gray-700 mt-1 font-medium leading-relaxed">
              {t('weatherHeroDesc', 'District-by-district meteorological observations across all 31 Karnataka districts for precision agriculture, crop protection, and daily farm operations.')}
            </p>
            <div className="mt-3 text-xs text-gray-600 flex flex-wrap items-center gap-3">
              <span>{t('autoSyncStatus', 'Automatic day-to-day sync: Active & Running')}</span>
              <span>•</span>
              <span>{t('lastUpdated', 'Last updated:')} <strong className="text-sky-800 font-mono">{lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <a
              href="https://www.accuweather.com/en/in/ka/karnataka-weather"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition active:scale-95"
            >
              <span>{t('accuWeatherFeedBtn', 'AccuWeather Karnataka Official Feed')}</span>
              <ExternalLink size={15} />
            </a>
            <button
              onClick={() => {
                loadDistrictWeather(selectedDistrictId);
                loadAllWeather();
              }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-sky-50 text-sky-800 border-2 border-sky-300 shadow-sm transition active:scale-95"
            >
              <RefreshCw size={15} />
              <span>{t('refreshNow', 'Refresh Now')}</span>
            </button>
          </div>
        </div>

        {/* ── 2. FEATURED SELECTED DISTRICT SHOWCASE & ADVISORY ── */}
        {loadingSelected && !selectedWeather ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 shadow-md">
            <div className="inline-block w-9 h-9 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600 font-semibold">{t('loadingWeather', 'Fetching live satellite and station data for district...')}</p>
          </div>
        ) : selectedWeather ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">

            {/* Left 2 Cols: Main Weather Metric & 7-Day Outlook */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border-[3px] border-sky-400/60 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                {/* Header with District Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        {language === 'kn' ? selectedWeather.kannadaName : selectedWeather.districtName}
                      </h2>
                      <span className="text-base text-gray-500 font-medium">
                        ({language === 'kn' ? selectedWeather.districtName : selectedWeather.kannadaName})
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 font-bold">
                        {regionLabels[selectedWeather.region] || selectedWeather.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                      <MapPin size={13} className="text-red-500" />
                      <span>{t('geoCoordinates', 'Geo Coordinates:')} {selectedWeather.lat.toFixed(2)}°N, {selectedWeather.lon.toFixed(2)}°E • {t('stationRadar', 'Station: Live Agromet Radar')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-600 hidden sm:inline">{t('district', 'District:')}</label>
                    <select
                      value={selectedDistrictId}
                      onChange={(e) => setSelectedDistrictId(e.target.value)}
                      className="bg-sky-50 border-2 border-sky-400 text-gray-900 font-bold rounded-2xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-sm"
                    >
                      {KARNATAKA_DISTRICTS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {language === 'kn' ? `${d.kannadaName} (${d.name})` : `${d.name} (${d.kannadaName})`} • {regionLabels[d.region] || d.region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Big Temperature Hero Banner */}
                <div className="my-5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-sky-50 via-blue-50/50 to-emerald-50/40 p-5 sm:p-6 rounded-2xl border-2 border-sky-200/80 shadow-inner">
                  <div className="flex items-center gap-5">
                    <span className="text-6xl sm:text-7xl drop-shadow">
                      {selectedWeather.icon}
                    </span>
                    <div>
                      <div className="text-5xl sm:text-6xl font-black text-gray-950 tracking-tight">
                        {selectedWeather.temperature}°<span className="text-2xl text-sky-600 font-bold">C</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold text-sky-900 mt-0.5">
                        {translateWeatherCondition(selectedWeather.condition, language)}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        {t('feelsLike', 'Feels like')} {selectedWeather.apparentTemperature}°C • {t('realFeelShade', 'RealFeel Shade')}
                      </div>
                    </div>
                  </div>

                  {/* 4 Micro Stats Cards in Light Pastels */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full sm:w-auto">
                    <div className="bg-white border-2 border-sky-200 rounded-2xl p-3 text-center min-w-[95px] shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-xs text-sky-700 font-bold">
                        <Droplets size={13} />
                        <span>{t('humidity', 'Humidity')}</span>
                      </div>
                      <span className="text-xl font-black text-gray-900 block mt-1">{selectedWeather.humidity}%</span>
                      <span className="text-[10px] text-gray-500 block">{t('atmospheric', 'Atmospheric')}</span>
                    </div>

                    <div className="bg-white border-2 border-teal-200 rounded-2xl p-3 text-center min-w-[95px] shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-xs text-teal-700 font-bold">
                        <Wind size={13} />
                        <span>{t('wind', 'Wind')}</span>
                      </div>
                      <span className="text-xl font-black text-gray-900 block mt-1">{selectedWeather.windSpeed}</span>
                      <span className="text-[10px] text-gray-500 block">{t('windSpeedUnit', 'km/h Speed')}</span>
                    </div>

                    <div className="bg-white border-2 border-emerald-200 rounded-2xl p-3 text-center min-w-[95px] shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-xs text-emerald-700 font-bold">
                        <Umbrella size={13} />
                        <span>{t('rainProb', 'Rain Prob')}</span>
                      </div>
                      <span className="text-xl font-black text-emerald-700 block mt-1">{selectedWeather.precipitationProb}%</span>
                      <span className="text-[10px] text-gray-500 block">{t('precipitation', 'Precipitation')}</span>
                    </div>

                    <div className="bg-white border-2 border-amber-200 rounded-2xl p-3 text-center min-w-[95px] shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-xs text-amber-700 font-bold">
                        <Sun size={13} />
                        <span>{t('uvIndex', 'UV Index')}</span>
                      </div>
                      <span className="text-xl font-black text-amber-700 block mt-1">{selectedWeather.uvIndex}</span>
                      <span className="text-[10px] text-gray-500 block">{t('solarRadiation', 'Solar Radiation')}</span>
                    </div>
                  </div>
                </div>

                {/* 7-Day Day-to-Day Outlook */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    {t('sevenDayForecast', 'Automated 7-Day Weather Forecast')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {selectedWeather.dailyForecast?.map((day, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border-2 text-center transition-all ${
                          idx === 0
                            ? 'bg-sky-100/90 border-sky-400 shadow-md scale-[1.02]'
                            : 'bg-white border-gray-200 hover:border-sky-300 hover:bg-sky-50/40'
                        }`}
                      >
                        <span className="text-xs font-bold text-gray-700 block">{translateDay(day.day, language)}</span>
                        <span className="text-2xl my-1 block">{day.icon}</span>
                        <div className="text-xs font-black text-gray-900">
                          {day.maxTemp}°<span className="text-[10px] text-gray-500 font-normal"> / {day.minTemp}°</span>
                        </div>
                        <span className="text-[10px] text-sky-700 font-bold block truncate mt-0.5">
                          {translateWeatherCondition(day.condition, language)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Agromet Farmer Advisory Card */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white rounded-3xl p-6 sm:p-7 border-[3px] border-emerald-400/80 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-emerald-200/80 pb-3">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <span>🌾</span>
                    <span>{t('agrometAdvisory', 'Agromet Farmer Advisory')}</span>
                  </h3>
                  {advisory && (
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${advisory.badgeColor}`}>
                      {advisory.type}
                    </span>
                  )}
                </div>

                {advisory && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-2xl border ${advisory.cardBg} shadow-sm`}>
                      <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">{advisory.icon}</span>
                        <div>
                          <h4 className="text-sm font-black text-gray-900 leading-snug">
                            {advisory.title}
                          </h4>
                          <p className="text-xs text-gray-700 mt-1 leading-relaxed font-medium">
                            {advisory.advice}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {t('farmAdviceToday', 'Operational Farm Advice for Today')}
                      </h4>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-gray-200 shadow-sm">
                          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-gray-900">{t('irrigation', 'Irrigation:')} </strong>
                            <span className="text-gray-700">{advisory.irrigation}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-gray-200 shadow-sm">
                          <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-gray-900">{t('spraying', 'Spraying:')} </strong>
                            <span className="text-gray-700">{advisory.spray}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-gray-200 shadow-sm">
                          <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-gray-900">{t('harvesting', 'Harvesting:')} </strong>
                            <span className="text-gray-700">{advisory.harvest}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-200/80">
                <a
                  href={getAccuWeatherUrl(selectedDistrictId)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-white hover:bg-sky-50 text-sky-800 border-2 border-sky-300 shadow-sm transition active:scale-95"
                >
                  <span>{t('openOnAccuWeather', 'Open on AccuWeather')} ({language === 'kn' ? selectedWeather.kannadaName : selectedWeather.districtName})</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

          </div>
        ) : null}

        {/* ── 3. PLACE-BY-PLACE KARNATAKA DISTRICTS DIRECTORY ── */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>📍</span>
                <span>{t('directoryTitle', 'Place-by-Place Karnataka Weather Directory (31 Districts)')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {t('directoryDesc', 'Click any district card to immediately inspect its local weather metrics and farm advisory.')}
              </p>
            </div>

            {/* Regional Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                    selectedRegion === region
                      ? 'bg-sky-600 text-white shadow-sky-600/20'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {regionLabels[region] || region}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchDistrictPlaceholder', 'Search district name in English or Kannada (e.g., Hassan, Mysuru, Belagavi, ಬೆಳಗಾವಿ)...')}
              className="w-full bg-white border-2 border-gray-300 hover:border-sky-400 focus:border-sky-600 rounded-2xl px-5 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition shadow-sm"
            />
            <span className="absolute right-5 top-3.5 text-gray-400 text-base">🔍</span>
          </div>

          {/* 31 Districts Grid with Light Background and Thick Borders */}
          {loadingAll && Object.keys(allWeatherData).length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-white border-2 border-gray-200 rounded-2xl animate-pulse shadow-sm"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDistricts.map((district) => {
                const w = allWeatherData[district.id];
                const isSelected = selectedDistrictId === district.id;

                return (
                  <div
                    key={district.id}
                    onClick={() => {
                      setSelectedDistrictId(district.id);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-sky-50/80 border-[3px] border-sky-600 shadow-lg scale-[1.01]'
                        : 'bg-white hover:bg-sky-50/40 border-2 border-slate-300 hover:border-sky-500 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-black text-gray-900 leading-tight">
                          {language === 'kn' ? district.kannadaName : district.name}
                        </h3>
                        <span className="text-xs text-gray-500 font-medium">
                          {language === 'kn' ? district.name : district.kannadaName} • {regionLabels[district.region] || district.region}
                        </span>
                      </div>
                      <span className="text-3xl">
                        {w ? w.icon : '⛅'}
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-black text-gray-900">
                          {w ? `${w.temperature}°C` : '--°C'}
                        </div>
                        <div className="text-xs font-bold text-sky-800">
                          {w ? translateWeatherCondition(w.condition, language) : t('loading', 'Loading...')}
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-gray-600 font-semibold space-y-0.5">
                        <div>💧 {w ? `${w.humidity}%` : '--'}</div>
                        <div>💨 {w ? `${w.windSpeed} km/h` : '--'}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-700">
                        {t('rainShort', 'Rain:')} {w ? `${w.precipitationProb}%` : '--'}
                      </span>
                      <span className="text-sky-700 hover:underline flex items-center gap-1">
                        <span>{t('selectBtn', 'Select')}</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-white py-4 px-6 text-center text-xs text-gray-500 font-medium flex-shrink-0 mt-12">
        <div className="max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 AgriChain · Karnataka Real-Time Agricultural Weather Portal · Powered by AccuWeather Synced Meteorological Stations
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.accuweather.com/en/in/ka/karnataka-weather"
              target="_blank"
              rel="noreferrer"
              className="text-sky-700 hover:underline font-bold"
            >
              AccuWeather Karnataka
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
