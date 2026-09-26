import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, FileText, BarChart2, Cloud, User, LogOut, Menu, X,
  Search, ArrowLeft, TrendingUp, TrendingDown, Minus,
  ExternalLink, Filter, MapPin, RefreshCw, CheckCircle2,
  Calendar, Info, ArrowUpDown, ChevronRight, Bell, Sparkles, Scale, Sprout, Bot
} from 'lucide-react';
import {
  getDailyMarketPrices,
  getMarketStats,
  COMMODITY_CATEGORIES,
  STATES_LIST,
  getFormattedToday,
  getFormattedTime
} from '../services/marketPriceService';

import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerMarket() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(getFormattedTime());
  const farmerName = localStorage.getItem('farmerName') || 'Ramesh Gowda';

  // Load daily Agmarknet prices
  const [prices, setPrices] = useState(() => getDailyMarketPrices());
  const stats = useMemo(() => getMarketStats(prices), [prices]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPrices(getDailyMarketPrices());
      setLastRefreshed(getFormattedTime());
      setIsRefreshing(false);
    }, 600);
  };

  // Filtered commodities
  const filteredPrices = useMemo(() => {
    return prices.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.variety.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.mandi.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.state.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchState =
        selectedState === 'All' || item.state === selectedState;

      return matchSearch && matchCategory && matchState;
    });
  }, [prices, searchQuery, selectedCategory, selectedState]);

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
    { icon: BarChart2, label: t('market', 'Market'), active: true, action: () => { } },
    { icon: Cloud, label: t('weather', 'Weather'), active: false, action: () => navigate('/farmer/weather') },
    { icon: Sprout, label: t('cropAdvisory', 'Crop Recommendation'), active: false, action: () => navigate('/farmer/crops') },
  ];

  const popularChips = ['Tomato', 'Onion', 'Wheat', 'Paddy', 'Cotton', 'Soybean', 'Chana', 'Mustard', 'Turmeric', 'Banana'];

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
              className={`flex items-center gap-1.5 xl:gap-2 px-3 xl:px-5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${active
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
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

      {/* Mobile Drawer */}
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-black text-rose-700 hover:bg-rose-50 border-t border-gray-100 mt-1"><LogOut size={16} /><span>Logout ({farmerName || 'Farmer'})</span></button>
        </div>
      )}

      {/* ── HERO BANNER: AGMARKNET LIVE MANDI PRICE BULLETIN ── */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-700 text-white px-6 sm:px-10 lg:px-12 py-8 sm:py-10 shadow-sm relative overflow-hidden flex-shrink-0">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={() => navigate('/farmer-dashboard')}
            className="inline-flex items-center gap-2 text-amber-100 hover:text-white text-xs sm:text-sm font-bold mb-4 px-3.5 py-1.5 rounded-full bg-black/15 hover:bg-black/25 transition-all"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-white/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Agmarknet Sync
                </span>
                <span className="bg-black/20 text-amber-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Calendar size={13} /> {getFormattedToday()}
                </span>
                <span className="bg-black/20 text-amber-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ClockIcon /> Auto-refreshed {lastRefreshed}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                AGRICHAIN Live Mandi Prices
              </h1>
              {/* Farmer Name Greeting */}
              <div className="mt-2.5 mb-1.5 inline-flex items-center gap-2 bg-black/25 border-2 border-white/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">
                  WELCOME {farmerName ? farmerName.toUpperCase() : 'FARMER'}
                </span>
              </div>
              <p className="text-amber-100/90 text-xs sm:text-sm lg:text-base mt-1 max-w-2xl font-medium leading-relaxed">
                Daily agricultural commodity prices & arrivals across APMC mandis. Verified by the Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare, Govt of India.
              </p>
            </div>

            {/* Manual Refresh / Portal Link */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="bg-white text-amber-900 hover:bg-amber-50 active:scale-95 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all disabled:opacity-75"
              >
                <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh Live Rates'}</span>
              </button>
              <a
                href="https://agmarknet.gov.in/home"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/25 hover:bg-black/35 text-white border border-white/30 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <span>agmarknet.gov.in</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* ── STATS CARDS STRIP ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 border-t border-white/20">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-white/30 shadow-sm">
              <div className="text-[11px] sm:text-xs text-amber-200 font-semibold uppercase tracking-wider">Commodities</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">{stats.totalCommodities} Crops</div>
              <div className="text-[10px] sm:text-[11px] text-amber-100/80 mt-0.5">Across 7 Categories</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-white/30 shadow-sm">
              <div className="text-[11px] sm:text-xs text-amber-200 font-semibold uppercase tracking-wider">Active Mandis</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">{stats.uniqueMandis} APMCs</div>
              <div className="text-[10px] sm:text-[11px] text-amber-100/80 mt-0.5">Across {stats.uniqueStates} States</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-white/30 shadow-sm">
              <div className="text-[11px] sm:text-xs text-amber-200 font-semibold uppercase tracking-wider">Top Gainer Today</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-1">
                <span>{stats.topGainer?.name}</span>
                <span className="text-xs bg-emerald-400 text-emerald-950 px-1.5 py-0.5 rounded font-bold">
                  +{stats.topGainer?.changePct}%
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-amber-100/80 mt-0.5 truncate">{stats.topGainer?.mandi}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-white/30 shadow-sm">
              <div className="text-[11px] sm:text-xs text-amber-200 font-semibold uppercase tracking-wider">Total Daily Arrival</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">{stats.totalArrival.toLocaleString('en-IN')} Qtl</div>
              <div className="text-[10px] sm:text-[11px] text-amber-100/80 mt-0.5">Peak in {stats.topArrival?.mandi}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-gray-700/60 shadow-lg flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by crop, variety, or mandi name (e.g. Tomato, Wheat, Kolar, Mysuru)..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none text-sm font-medium transition-colors bg-gray-50 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* State Filter Dropdown */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none text-sm font-semibold bg-gray-50 focus:bg-white text-gray-700 appearance-none cursor-pointer"
                >
                  {STATES_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st === 'All' ? 'All States (National)' : st}
                    </option>
                  ))}
                </select>
                <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 flex-shrink-0 self-end md:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Cards View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Table View
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {COMMODITY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Popular Crop Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Popular:</span>
            {popularChips.map((crop) => (
              <button
                key={crop}
                onClick={() => setSearchQuery(crop)}
                className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all ${searchQuery.toLowerCase() === crop.toLowerCase()
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
                  }`}
              >
                {crop}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-red-500 hover:text-red-700 font-bold ml-2 underline"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* ── COMMODITIES LIST / RESULTS ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-gray-900">
                Found <span className="text-amber-700 font-extrabold">{filteredPrices.length}</span> Commodity Rates
              </span>
              <span className="text-xs text-gray-400">
                • Rates quoted in ₹ per Quintal (100 Kg)
              </span>
            </div>
            <div className="text-xs text-gray-400 font-medium hidden sm:block">
              Daily Auto-Updating Engine Active
            </div>
          </div>

          {filteredPrices.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm my-6">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-gray-800">No commodities match your filter</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                Try clearing your search query or selecting "All Categories" and "All States".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedState('All');
                }}
                className="mt-4 bg-amber-600 text-white font-bold px-5 py-2.5 rounded-full text-xs hover:bg-amber-700 transition-all shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* ════ CARDS GRID VIEW ════ */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {filteredPrices.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCommodity(item)}
                  className="bg-white rounded-3xl p-5 border-2 border-gray-700/70 shadow-md hover:shadow-2xl hover:border-amber-600 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50/70 p-1 flex items-center justify-center border-2 border-amber-300 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-xl drop-shadow-xs"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display = 'block';
                                }
                              }}
                            />
                          ) : null}
                          <span className={`text-2xl ${item.image ? 'hidden' : 'block'}`}>{item.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-amber-800 transition-colors leading-tight">
                            {item.name}
                          </h3>
                          <div className="text-xs text-gray-500 font-medium">
                            {item.variety}
                          </div>
                        </div>
                      </div>

                      {/* Trend Badge */}
                      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${item.trend === 'up'
                        ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300'
                        : item.trend === 'down'
                          ? 'bg-rose-50 text-rose-700 border-2 border-rose-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}>
                        {item.trend === 'up' && <TrendingUp size={13} />}
                        {item.trend === 'down' && <TrendingDown size={13} />}
                        {item.trend === 'stable' && <Minus size={13} />}
                        <span>
                          {item.trend === 'up' ? `+${item.changePct}%` : `${item.changePct}%`}
                        </span>
                      </div>
                    </div>

                    {/* Mandi & State */}
                    <div className="mt-3.5 flex items-center justify-between text-xs text-gray-700 bg-gray-100/90 border border-gray-300/80 px-3 py-2 rounded-xl">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-900 truncate">
                        <MapPin size={13} className="text-amber-600 flex-shrink-0" />
                        <span className="truncate">{item.mandi}</span>
                      </div>
                      <span className="text-[11px] bg-white border border-gray-300 px-2 py-0.5 rounded-full font-bold text-gray-700 flex-shrink-0">
                        {item.state}
                      </span>
                    </div>

                    {/* Modal Price Highlight */}
                    <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/60 border-2 border-amber-600/70 shadow-sm">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900/70">
                            Modal Rate (Mandi Price)
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-0.5">
                            ₹{item.modalPrice.toLocaleString('en-IN')}
                            <span className="text-xs font-semibold text-gray-500 ml-1">/ Quintal</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                            ₹{item.pricePerKg} / Kg
                          </div>
                        </div>
                      </div>

                      {/* Min - Max Range Bar */}
                      <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-xs text-gray-600">
                        <div>
                          <span className="text-gray-400">Min: </span>
                          <span className="font-bold text-gray-800">₹{item.minPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="h-1.5 flex-1 mx-3 bg-amber-200/80 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-600 rounded-full w-2/3" />
                        </div>
                        <div>
                          <span className="text-gray-400">Max: </span>
                          <span className="font-bold text-gray-800">₹{item.maxPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer Details */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="font-medium">
                      Arrival: <span className="font-bold text-gray-800">{item.arrival.toLocaleString('en-IN')} Qtl</span>
                    </div>
                    <span className="text-amber-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Details <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ════ DETAILED TABLE VIEW ════ */
            <div className="bg-white rounded-3xl border-2 border-gray-700/60 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-gray-500">
                      <th className="py-4 px-6">Commodity & Variety</th>
                      <th className="py-4 px-6">Mandi / Market</th>
                      <th className="py-4 px-6">State</th>
                      <th className="py-4 px-6 text-right">Min Price</th>
                      <th className="py-4 px-6 text-right">Max Price</th>
                      <th className="py-4 px-6 text-right">Modal Price (₹/Qtl)</th>
                      <th className="py-4 px-6 text-right">Per Kg Rate</th>
                      <th className="py-4 px-6 text-right">Daily Arrival</th>
                      <th className="py-4 px-6 text-center">Trend</th>
                      <th className="py-4 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                    {filteredPrices.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                        onClick={() => setSelectedCommodity(item)}
                      >
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50/70 p-1 flex items-center justify-center border border-amber-200 shrink-0 overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = 'block';
                                    }
                                  }}
                                />
                              ) : null}
                              <span className={`text-xl ${item.image ? 'hidden' : 'block'}`}>{item.icon}</span>
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{item.name}</div>
                              <div className="text-[11px] text-gray-400">{item.variety}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-semibold text-gray-700">
                          {item.mandi}
                        </td>
                        <td className="py-3.5 px-6">
                          <span className="bg-gray-100 text-gray-700 text-[11px] px-2.5 py-1 rounded-full font-bold">
                            {item.state}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right font-medium text-gray-600">
                          ₹{item.minPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-6 text-right font-medium text-gray-600">
                          ₹{item.maxPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span className="font-black text-amber-900 text-base">
                            ₹{item.modalPrice.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right font-bold text-emerald-700">
                          ₹{item.pricePerKg}
                        </td>
                        <td className="py-3.5 px-6 text-right font-semibold text-gray-800">
                          {item.arrival.toLocaleString('en-IN')} Qtl
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${item.trend === 'up'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.trend === 'down'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                            {item.trend === 'up' && '▲'}
                            {item.trend === 'down' && '▼'}
                            {item.changePct}%
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCommodity(item);
                            }}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-lg text-xs transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* ── COMMODITY DETAIL MODAL ── */}
      {selectedCommodity && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCommodity(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 p-1 flex items-center justify-center border-2 border-amber-300 shadow-sm flex-shrink-0 overflow-hidden relative">
                {selectedCommodity.image ? (
                  <img
                    src={selectedCommodity.image}
                    alt={selectedCommodity.name}
                    className="w-full h-full object-cover rounded-xl drop-shadow-xs"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <span className={`text-3xl ${selectedCommodity.image ? 'hidden' : 'block'}`}>{selectedCommodity.icon}</span>
              </div>
              <div>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedCommodity.category}
                </span>
                <h2 className="text-2xl font-black text-gray-900 mt-1">
                  {selectedCommodity.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {selectedCommodity.variety} • Grade: {selectedCommodity.grade}
                </p>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-2xl border border-amber-200/80 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Agmarknet Daily Modal Price
                </span>
                <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-md">
                  ₹{selectedCommodity.pricePerKg} / Kg
                </span>
              </div>
              <div className="text-4xl font-black text-amber-950">
                ₹{selectedCommodity.modalPrice.toLocaleString('en-IN')}
                <span className="text-sm font-semibold text-gray-500 ml-1.5">/ Quintal</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-amber-200/70 text-xs">
                <div>
                  <span className="text-gray-500">Minimum Rate: </span>
                  <span className="font-bold text-gray-800">₹{selectedCommodity.minPrice.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-gray-500">Maximum Rate: </span>
                  <span className="font-bold text-gray-800">₹{selectedCommodity.maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Mandi Details List */}
            <div className="space-y-2.5 text-xs sm:text-sm mb-6">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Regulated Mandi</span>
                <span className="font-bold text-gray-900">{selectedCommodity.mandi}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">District / State</span>
                <span className="font-bold text-gray-900">{selectedCommodity.district}, {selectedCommodity.state}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Daily Arrival Recorded</span>
                <span className="font-bold text-gray-900">{selectedCommodity.arrival.toLocaleString('en-IN')} Quintals</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Day-to-Day Fluctuation</span>
                <span className={`font-bold ${selectedCommodity.trend === 'up' ? 'text-green-600' : selectedCommodity.trend === 'down' ? 'text-red-500' : 'text-gray-600'}`}>
                  {selectedCommodity.trend === 'up' ? `+₹${selectedCommodity.changeAmount} (+${selectedCommodity.changePct}%)` : `₹${selectedCommodity.changeAmount} (${selectedCommodity.changePct}%)`}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Auction Record Date</span>
                <span className="font-bold text-emerald-800">{selectedCommodity.arrivalDate} (Today)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href="https://agmarknet.gov.in/home"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Verify on Agmarknet Portal</span>
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => setSelectedCommodity(null)}
                className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 text-xs sm:text-sm font-bold hover:bg-gray-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 bg-white py-3 px-6 text-center text-xs text-gray-400 font-medium flex-shrink-0">
        © 2026 AgriChain · Data sourced via Agricultural Marketing Information Network (AGMARKNET) ·{' '}
        <a href="https://agmarknet.gov.in/home" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
          agmarknet.gov.in
        </a>
      </footer>

    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
