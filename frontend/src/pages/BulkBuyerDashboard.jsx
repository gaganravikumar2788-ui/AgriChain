import React, { useState, useEffect } from 'react';
import { 
  Home, 
  LayoutGrid, 
  Package, 
  ClipboardList, 
  Users2, 
  User, 
  Settings,
  Leaf,
  Sprout,
  Search, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Landmark, 
  Truck, 
  IndianRupee, 
  Users,
  Zap, 
  FileText, 
  CloudSun, 
  TrendingUp,
  Sun,
  Calendar,
  Globe,
  Navigation, 
  MapPin, 
  Clock, 
  ArrowUpDown,
  PhoneCall,
  ChevronRight,
  X,
  Phone,
  Star,
  Send,
  Check,
  Menu,
  LogOut
} from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { 
  DEFAULT_BUYER_PROFILE, 
  METRICS, 
  CATEGORIES, 
  NEARBY_FARMERS, 
  CROP_SEASON_DATA, 
  NOTIFICATIONS 
} from '../data/bulkBuyerData';
import { subscribeRegisteredFarmers } from '../services/farmerService';
import { getDailyMarketPrices, COMMODITY_CATEGORIES } from '../services/marketPriceService';
import RouteOptimizationView from '../components/RouteOptimizationView';

export default function BulkBuyerDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('tab') === 'routes' || window.location.hash.includes('route') || window.location.pathname.includes('route')) {
          return 'routes';
        }
      }
    } catch {}
    return 'home';
  });
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic registered farmers from Firebase Firestore & Local Synchronizer
  const [registeredFarmers, setRegisteredFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.includes('route')) {
        setActiveTab('routes');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeRegisteredFarmers((list) => {
      setRegisteredFarmers(list || []);
      setLoadingFarmers(false);
    });
    return () => unsubscribe();
  }, []);

  // Dynamic user data from registration
  const [buyerProfile, setBuyerProfile] = useState(DEFAULT_BUYER_PROFILE);

  // Orders state - zero for new user
  const [buyerOrders, setBuyerOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('agrichain_buyer_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real-time synchronization when consumer orders are dispatched from Godown
  useEffect(() => {
    const syncOrders = () => {
      try {
        const saved = localStorage.getItem('agrichain_buyer_orders');
        if (saved) setBuyerOrders(JSON.parse(saved));
      } catch (e) {}
    };

    window.addEventListener('storage', syncOrders);
    window.addEventListener('agrichain_buyer_order_placed', syncOrders);

    let bc;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('agrichain_buyer_sync');
        bc.onmessage = () => syncOrders();
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('storage', syncOrders);
      window.removeEventListener('agrichain_buyer_order_placed', syncOrders);
      if (bc) bc.close();
    };
  }, []);

  useEffect(() => {
    try {
      const storedName = localStorage.getItem('buyerName');
      const storedMobile = localStorage.getItem('buyerMobile');
      const storedUserData = localStorage.getItem('agrichain_user');
      
      let parsed = {};
      if (storedUserData) {
        parsed = JSON.parse(storedUserData);
      }

      setBuyerProfile(prev => ({
        ...prev,
        name: parsed.businessName || storedName || prev.name,
        contactPerson: parsed.name || storedName || "Ravi Kumar",
        city: parsed.city ? `${parsed.city}, ${parsed.state || 'Karnataka'}` : prev.city,
        mobile: parsed.mobile || storedMobile || "+91 98450 98765"
      }));
    } catch (e) {
      console.warn("Could not read stored buyer profile:", e);
    }
  }, []);

  // Dynamic commodities for Browse & Bulk
  const [liveCommodities] = useState(() => getDailyMarketPrices());
  const [browseCategory, setBrowseCategory] = useState('All');
  const [browseSearch, setBrowseSearch] = useState('');

  const handleAddOrder = (newOrder) => {
    const updated = [newOrder, ...buyerOrders];
    setBuyerOrders(updated);
    try {
      localStorage.setItem('agrichain_buyer_orders', JSON.stringify(updated));
      window.dispatchEvent(new Event('agrichain_buyer_order_placed'));
    } catch (e) {}
  };

  // Modals state
  const [callingFarmer, setCallingFarmer] = useState(null);
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCropSeason, setShowCropSeason] = useState(false);
  const [showAllStates, setShowAllStates] = useState(false);
  const [selectedFarmerDetail, setSelectedFarmerDetail] = useState(null);
  const [sortBy, setSortBy] = useState('distance');

  // Sorted list of REAL registered farmers
  const sortedFarmers = [...registeredFarmers].sort((a, b) => {
    if (sortBy === 'distance') {
      return (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0);
    }
    return (b.rating || 5) - (a.rating || 5);
  });

  // Dynamic metrics with accurate registered farmer count
  const dynamicMetrics = METRICS.map(m => {
    if (m.id === 'farmers') {
      return {
        ...m,
        value: String(registeredFarmers.length),
        period: registeredFarmers.length === 1 ? '1 Verified Farmer' : `${registeredFarmers.length} Verified Farmers`,
        change: registeredFarmers.length > 0 ? `+${registeredFarmers.length}` : '0',
        changeType: registeredFarmers.length > 0 ? 'positive' : 'neutral'
      };
    }
    return m;
  });

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'routes', label: 'Route Optimization', icon: Navigation, badge: 'AI' },
    { id: 'browse', label: 'Browse Products', icon: LayoutGrid },
    { id: 'bulk', label: 'Buy in Bulk', icon: Package },
    { id: 'orders', label: 'My Orders', icon: ClipboardList },
    { id: 'suppliers', label: 'Suppliers', icon: Users2 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const quickServices = [
    { id: 'schemes', label: 'Schemes', icon: Leaf, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'market', label: 'Market Price', icon: IndianRupee, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'weather', label: 'Weather', icon: CloudSun, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { id: 'advisories', label: 'Advisories', icon: FileText, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  ];

  const iconMap = {
    landmark: Landmark,
    truck: Truck,
    indianRupee: IndianRupee,
    users: Users,
  };

  const getTraderName = () => {
    const raw = buyerProfile.name || localStorage.getItem('buyerName') || 'Ravi';
    if (/trader/i.test(raw)) {
      return raw;
    }
    return `${raw} Traders`;
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col font-sans text-slate-800">
      <div className="flex flex-1 min-h-screen">
        {/* Mobile Drawer Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Drawer Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div>
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-center p-1 shadow-xs shrink-0">
                  <img src="/logo.png" alt="AgriChain Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="font-extrabold text-lg leading-tight text-slate-900 tracking-tight">
                    AgriChain
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 tracking-wide uppercase">
                    Bulk Buyer Portal
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-3.5 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#dcfce7] text-[#15803d] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#15803d]' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className={`text-white text-[10px] font-black px-2 py-0.5 shadow-xs ${
                        item.badge === 'AI' ? 'bg-[#15803d] rounded-md' : 'bg-red-500 rounded-full text-[11px]'
                      }`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 pt-0 relative overflow-hidden">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-green-50/50 to-emerald-100/30 border border-emerald-100/80 relative">
              <div className="flex items-center gap-2 mb-1.5 text-emerald-700">
                <Sprout className="w-4 h-4 fill-emerald-600 stroke-emerald-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Verified Direct</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Direct farmer sourcing with automated mandi price indexing.
              </p>
            </div>
          </div>
        </aside>

        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/80 min-h-screen flex-col justify-between shrink-0 shadow-xs relative">
          <div>
            <div className="p-5 flex items-center gap-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-center p-1 shadow-xs shrink-0">
                <img src="/logo.png" alt="AgriChain Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-extrabold text-xl leading-tight text-slate-900 tracking-tight">
                  AgriChain
                </div>
                <div className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">
                  Bulk Buyer Portal
                </div>
              </div>
            </div>

            <nav className="p-3.5 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#dcfce7] text-[#15803d] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#15803d]' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className={`text-white text-[10px] font-black px-2 py-0.5 shadow-xs ${
                        item.badge === 'AI' ? 'bg-[#15803d] rounded-md' : 'bg-red-500 rounded-full text-[11px]'
                      }`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Branding Artwork */}
          <div className="p-5 pt-0 relative overflow-hidden">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-green-50/50 to-emerald-100/30 border border-emerald-100/80 relative">
              <div className="flex items-center gap-2 mb-2 text-emerald-700">
                <Sprout className="w-4 h-4 fill-emerald-600 stroke-emerald-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Verified Direct</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Direct farmer sourcing with automated mandi price indexing.
              </p>
              <div className="mt-3 text-[12px] font-semibold italic text-emerald-700/90 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 fill-emerald-600" />
                <span>Better Farming, Brighter Future</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= CENTER + RIGHT AREA ================= */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 sm:h-18 bg-white border-b border-slate-200/80 px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center flex-1 max-w-xl">
              {/* Mobile Sidebar Hamburger Toggle */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden mr-2 p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer flex-shrink-0"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="flex-1 relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products (Rice, Wheat...)"
                    className="w-full pl-9 sm:pl-11 pr-7 sm:pr-4 py-2 sm:py-2.5 bg-slate-50/90 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 rounded-full px-1.5 py-0.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Direct AI Route Optimization Shortcut in Header */}
            <button
              onClick={() => setActiveTab('routes')}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-sm hover:shadow-md cursor-pointer transition-all border border-emerald-500 shrink-0 mx-2"
              title="Open AI Route Optimization"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-100" />
              <span>AI Route Optimization</span>
              <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.5 rounded">AI</span>
            </button>

            {/* Welcome "Buyer_name" Traders Bar */}
            <div className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/60 border border-emerald-200/90 px-4 py-2 rounded-2xl text-emerald-950 font-bold text-sm shadow-2xs mx-2">
              <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">Welcome</span>
              <span className="text-emerald-950 font-black text-sm">"{getTraderName()}"</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    3
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">Notifications</span>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        3 New
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {NOTIFICATIONS.map((notif) => (
                        <div key={notif.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-slate-800">{notif.title}</h4>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Card (Using Farmer Photo as Profile) */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500/40 overflow-hidden bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-xs">
                    <img
                      src={buyerProfile.avatar}
                      alt="Farmer Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-bold text-sm text-slate-900 leading-tight flex items-center gap-1.5">
                      <span>{getTraderName()}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs font-semibold text-emerald-700">
                      {buyerProfile.role}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-1" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50">
                    <div className="p-2 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-900">{getTraderName()}</p>
                      <p className="text-[11px] text-slate-500">{buyerProfile.city}</p>
                      <p className="text-[11px] text-slate-500">Contact: {buyerProfile.mobile}</p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Bulk Buyer
                      </div>
                    </div>
                    <div className="pt-2 text-xs space-y-1">
                      <div 
                        onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer font-medium"
                      >
                        Company Profile & GST
                      </div>
                      <div 
                        onClick={() => { setActiveTab('orders'); setShowProfileMenu(false); }}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer font-medium"
                      >
                        Purchase Ledger
                      </div>
                      <div 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to log out of Bulk Buyer Portal?")) {
                            localStorage.removeItem('buyerName');
                            localStorage.removeItem('buyerMobile');
                            localStorage.removeItem('agrichain_user');
                            window.location.href = '/';
                          }
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer font-bold flex items-center gap-2 border-t border-slate-100 mt-1"
                      >
                        <LogOut size={14} />
                        <span>{t('logout', 'Logout')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout button */}
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to log out of Bulk Buyer Portal?")) {
                    localStorage.removeItem('buyerName');
                    localStorage.removeItem('buyerMobile');
                    localStorage.removeItem('agrichain_user');
                    window.location.href = '/';
                  }
                }}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border-2 border-rose-300 text-rose-700 hover:text-rose-900 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Logout from Buyer Account"
              >
                <LogOut size={15} className="text-rose-600 flex-shrink-0" />
                <span className="font-black hidden md:inline">{t('logout', 'Logout')}</span>
              </button>

              {/* Option in the right side top beside logout */}
              <LanguageSelector />
            </div>
          </header>

          {/* Main Workspace: Left content + Right sidebar */}
          <div className="flex-1 flex flex-col xl:flex-row min-w-0">
            <main className={`flex-1 p-3.5 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 min-w-0 w-full`}>
              {/* ROUTE OPTIMIZATION TAB */}
              {activeTab === 'routes' && (
                <RouteOptimizationView
                  registeredFarmers={registeredFarmers}
                  buyerProfile={buyerProfile}
                  onBackToDashboard={() => setActiveTab('home')}
                />
              )}

              {activeTab === 'home' && (
                <>
                  {/* Hero Banner with Vegetables Harvest Image */}
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#e7f6ed] via-[#dff4e8] to-[#d3efdf] border border-emerald-200/70 shadow-xs p-7 sm:p-9">
                    <div className="hidden lg:flex items-center gap-1.5 absolute top-6 right-8 text-emerald-800 font-serif italic text-lg font-bold tracking-wide">
                      <span>Better Margins</span>
                      <Leaf className="w-5 h-5 fill-emerald-600 stroke-emerald-800 rotate-12" />
                      <span>Brighter Future</span>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="max-w-xl text-left">
                        <span className="text-sm font-semibold text-slate-600 block mb-1">
                          Welcome Back,
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] tracking-tight mb-3">
                          {getTraderName()}!
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6 max-w-lg">
                          Access verified farmers, check market prices, and plan bulk purchases with ease.
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => setActiveTab('suppliers')}
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1b5e20] hover:bg-[#144919] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <Leaf className="w-4 h-4 fill-white" />
                            <span>Explore Farmers</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setActiveTab('routes')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 font-extrabold text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <Navigation className="w-4 h-4 text-emerald-700" />
                            <span>🗺️ Route Optimization</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Hero: Fresh Vegetables Harvest Image */}
                      <div className="relative shrink-0 flex items-center justify-center">
                        <div className="relative w-56 sm:w-64 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 group">
                          <img
                            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=700"
                            alt="Fresh Farm Vegetables"
                            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3 text-white text-[11px] font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                              Fresh Farm Vegetables
                            </span>
                            <span className="bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px]">
                              100% Direct
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Route Optimization Quick Launch Card */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-emerald-900">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                        <Truck className="w-6 h-6 text-emerald-200" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base sm:text-lg text-white">
                            AI Route Optimization (Live Google Map)
                          </h3>
                          <span className="bg-emerald-300 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Realtime
                          </span>
                        </div>
                        <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                          {registeredFarmers.length > 0
                            ? `Collection route planned for verified farmer ${registeredFarmers[0]?.name || 'Gagan'} in ${registeredFarmers[0]?.district || 'Mysuru'} • 18% fuel saved.`
                            : "Calculate shortest multi-stop pickup routes with real-time fuel and time savings."}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('routes')}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-emerald-300"
                    >
                      <Navigation className="w-4 h-4 text-emerald-700" />
                      <span>Open AI Route Map</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dynamicMetrics.map((metric) => {
                      const IconComponent = iconMap[metric.iconType] || Landmark;
                      return (
                        <div
                          key={metric.id}
                          onClick={() => {
                            if (metric.id === 'orders') setActiveTab('orders');
                            if (metric.id === 'farmers') setActiveTab('suppliers');
                          }}
                          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-xs ${metric.bgIcon} group-hover:scale-105 transition-transform duration-200`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-500">
                              {metric.label}
                            </span>
                          </div>
                          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            {metric.value}
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/80 text-[12px]">
                            <span className="text-slate-400 font-medium">{metric.period}</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                              {metric.change}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Product Categories */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                          <Leaf className="w-4 h-4 fill-emerald-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                          Product Categories
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab('browse')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer group"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                      {CATEGORIES.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setBrowseCategory(cat.name);
                            setActiveTab('browse');
                          }}
                          className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-400/80 transition-all duration-200 cursor-pointer flex flex-col group"
                        >
                          <div className="w-full h-24 rounded-xl overflow-hidden mb-2.5 bg-slate-100 flex items-center justify-center">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="mt-auto">
                            <h3 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">
                              {cat.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {cat.subtext}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Access & Crop Season Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
                          <Zap className="w-5 h-5 fill-purple-600 stroke-purple-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 leading-tight">Quick Access</h3>
                          <p className="text-xs text-slate-500 font-medium">Explore essential services</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
                        {quickServices.map((svc) => {
                          const Icon = svc.icon;
                          return (
                            <button
                              key={svc.id}
                              onClick={() => {
                                if (svc.id === 'market') setShowCropSeason(true);
                                else if (svc.id === 'profile') setActiveTab('profile');
                                else alert(`Opening ${svc.label} module for bulk buyers.`);
                              }}
                              className="flex flex-col items-center justify-center p-2.5 rounded-2xl border hover:shadow-xs hover:scale-102 transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
                            >
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 border ${svc.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-700 text-center line-clamp-1">
                                {svc.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white via-purple-50/20 to-emerald-50/30 rounded-3xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between relative overflow-hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-slate-900 leading-tight">Crop Season Wise Price & Arrival</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Get crop-wise seasonal data for better decision making.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4">
                        <button
                          onClick={() => setShowCropSeason(true)}
                          className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2 group"
                        >
                          <span>View Crop Data</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <div className="relative flex items-center justify-center pr-2">
                          <Sun className="w-7 h-7 text-amber-400 fill-amber-300 absolute -top-3 -right-1" />
                          <div className="w-12 h-12 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-600 border border-emerald-200">
                            <Leaf className="w-6 h-6 fill-emerald-500 stroke-emerald-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* All States/UT Banner */}
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#eaf7ee] via-[#e2f3e8] to-[#d6efde] border border-emerald-200/80 shadow-xs p-5 sm:p-6">
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs shrink-0">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug">All States/UT</h3>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            Data shown is for 3 days, and data is frozen up to{' '}
                            <span className="font-bold text-slate-800">15 September 2026</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={() => setShowAllStates(true)}
                          className="px-4 py-2.5 rounded-full bg-white/95 hover:bg-white text-emerald-900 border border-emerald-300 font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer group"
                        >
                          <span>View All States</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-emerald-700/10 border border-emerald-600/30 flex items-center justify-center text-emerald-800">
                          <Globe className="w-5 h-5 text-emerald-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* BROWSE TAB */}
              {activeTab === 'browse' && (() => {
                const filteredBrowseProducts = liveCommodities.filter(c => {
                  const matchesCategory = browseCategory === 'All' || c.category === browseCategory;
                  const q = browseSearch.toLowerCase().trim();
                  const matchesSearch = !q || 
                    c.name.toLowerCase().includes(q) ||
                    (c.variety && c.variety.toLowerCase().includes(q)) ||
                    (c.mandi && c.mandi.toLowerCase().includes(q)) ||
                    (c.state && c.state.toLowerCase().includes(q));
                  return matchesCategory && matchesSearch;
                });

                return (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 border-2 border-slate-800 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-slate-900">
                              Browse All Agricultural Commodities
                            </h2>
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                              AGMARKNET Live
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 font-medium">
                            Direct farm-gate wholesale procurement with real-time APMC Mandi prices & authentic vegetable photography.
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300 self-start md:self-auto">
                          Showing {filteredBrowseProducts.length} verified commodities
                        </span>
                      </div>

                      {/* Search & Category Filter Toolbar */}
                      <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col md:flex-row items-center gap-3">
                        <div className="relative w-full md:w-80">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={browseSearch}
                            onChange={(e) => setBrowseSearch(e.target.value)}
                            placeholder="Filter by crop, mandi, or state..."
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 shadow-2xs"
                          />
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
                          {COMMODITY_CATEGORIES.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setBrowseCategory(cat)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                browseCategory === cat
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Commodities Grid */}
                    {filteredBrowseProducts.length === 0 ? (
                      <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-800 shadow-sm">
                        <div className="text-4xl mb-2">🔍</div>
                        <h3 className="font-extrabold text-base text-slate-800">No commodities found</h3>
                        <p className="text-xs text-slate-500 mt-1">Try resetting the category or search keyword.</p>
                        <button
                          onClick={() => { setBrowseSearch(''); setBrowseCategory('All'); }}
                          className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBrowseProducts.map((crop) => (
                          <div
                            key={crop.id}
                            className="bg-white rounded-3xl p-5 border-2 border-slate-800 hover:border-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                          >
                            <div>
                              <div className="flex items-start gap-3.5 mb-3">
                                {/* Real product photo with fallback */}
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50/70 p-1.5 flex items-center justify-center border-2 border-slate-800 shadow-xs shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                                  <img
                                    src={crop.image}
                                    alt={crop.name}
                                    className="w-full h-full object-contain drop-shadow-xs"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      if (e.currentTarget.nextElementSibling) {
                                        e.currentTarget.nextElementSibling.style.display = 'block';
                                      }
                                    }}
                                  />
                                  <span className="text-2xl hidden">{crop.icon}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="text-[10px] uppercase font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-800 px-2 py-0.5 rounded-md">
                                      {crop.category}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-700">{crop.grade}</span>
                                  </div>
                                  <h3 className="font-black text-base text-slate-900 leading-tight group-hover:text-emerald-800 transition-colors">
                                    {crop.name}
                                  </h3>
                                  <p className="text-xs text-slate-600 font-semibold truncate">{crop.variety}</p>
                                </div>
                              </div>

                              {/* Mandi & Benchmark Details */}
                              <div className="bg-slate-50 p-2.5 rounded-xl border-2 border-slate-800 mb-3 space-y-1 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600 font-medium">Mandi Benchmark:</span>
                                  <span className="font-extrabold text-slate-900">{crop.mandi}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500">State / Region:</span>
                                  <span className="font-bold text-emerald-800">{crop.state}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] pt-1 border-t-2 border-slate-800">
                                  <span className="text-slate-500 font-medium">Range:</span>
                                  <span className="text-slate-800 font-bold">₹{crop.minPrice.toLocaleString('en-IN')} - ₹{crop.maxPrice.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="pt-2 border-t-2 border-slate-800 flex items-baseline justify-between mb-3">
                                <div>
                                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Live Mandi Price</div>
                                  <div className="font-black text-xl text-emerald-950">
                                    ₹ {crop.modalPrice.toLocaleString('en-IN')}
                                    <span className="text-xs font-semibold text-slate-600 ml-1">/ Qtl</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-800 px-2 py-0.5 rounded-md">
                                    ₹{crop.pricePerKg} / kg
                                  </span>
                                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{crop.arrival.toLocaleString('en-IN')} Qtl daily</div>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  const newOrder = {
                                    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                                    crop: `${crop.name} (${crop.variety})`,
                                    qty: "25 MT",
                                    farmer: registeredFarmers[0]?.name || `${crop.mandi} Farmer Producer Org`,
                                    total: `₹ ${(crop.modalPrice * 250).toLocaleString('en-IN')}`,
                                    status: "Confirmed & In Transit",
                                    eta: "Tomorrow, 2:00 PM"
                                  };
                                  handleAddOrder(newOrder);
                                  alert(`Purchase order ${newOrder.id} successfully created for ${crop.name} at verified mandi price ₹${crop.modalPrice.toLocaleString('en-IN')}/Qtl! Track it under 'My Orders'.`);
                                  setActiveTab('orders');
                                }}
                                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer border-2 border-slate-900"
                              >
                                <Package className="w-3.5 h-3.5" />
                                <span>Order Bulk at Mandi Price</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* BULK PURCHASE RFQ TAB */}
              {activeTab === 'bulk' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-white rounded-3xl p-7 border-2 border-slate-800 shadow-sm space-y-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-slate-900">Buy in Bulk - Request For Quotation (RFQ)</h2>
                        <span className="bg-amber-100 text-amber-900 border border-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          Direct Farm Sourcing
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">Submit wholesale commodity demand for fresh vegetables, pulses, and grains and receive instant competitive quotes from verified nearby farmers.</p>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target;
                      const commodity = form.commodity?.value || "Okra / Bhindi (Lady's Finger)";
                      const qtyVal = form.quantity?.value || 25;
                      const targetPrice = form.targetPrice?.value || "₹ 2,400";
                      const newOrder = {
                        id: `RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
                        crop: commodity,
                        qty: `${qtyVal} MT`,
                        farmer: registeredFarmers[0]?.name || "Verified Local Producer",
                        total: `Target ${targetPrice}/Qtl`,
                        status: "Pending Farmer Bids",
                        eta: "Bids opening in 2 hrs"
                      };
                      handleAddOrder(newOrder);
                      alert(`Your Bulk Procurement Order Request for ${commodity} (${qtyVal} MT) has been broadcasted to verified farmers! Track it under 'My Orders'.`);
                      setActiveTab('orders');
                    }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Select Commodity (Vegetables, Pulses, Grains)</label>
                        <select name="commodity" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-bold text-slate-800">
                          <optgroup label="Fresh Vegetables (Direct Harvest)">
                            <option>Okra / Bhindi (Lady's Finger - Grade A)</option>
                            <option>Bitter Gourd (Karela / Green)</option>
                            <option>Bottle Gourd (Lauki / Long Fresh)</option>
                            <option>Fresh Spinach (Palak / Green Leaves)</option>
                            <option>Ivy Gourd (Tindora / Kundru)</option>
                            <option>French Beans (Barbati / Green Pods)</option>
                            <option>Ash Gourd (Winter Melon / Wax Gourd)</option>
                            <option>Drumstick / Moringa (Tender Green)</option>
                            <option>Pumpkin (Kaddu / Sweet Golden)</option>
                            <option>Hybrid Red Tomato (Boxed / Fresh)</option>
                            <option>Nashik Red Onion (Mesh Bag)</option>
                            <option>Jyoti Potato (Cold Storage Grade A)</option>
                          </optgroup>
                          <optgroup label="Pulses & Grains">
                            <option>Toor Dal / Pigeon Pea (Gulbarga Bold)</option>
                            <option>Green Gram / Moong Dal (Shiny Green)</option>
                            <option>Black Gram / Urad Dal (Split & Whole)</option>
                            <option>Desi Chickpea / Chana (Bold A-Grade)</option>
                            <option>Red Lentil / Masoor Dal (Machine Cleaned)</option>
                            <option>Sona Masoori Rice (Grade A)</option>
                            <option>Sharbati Wheat (Premium Milling)</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Quantity Required (Metric Tons)</label>
                        <input name="quantity" type="number" defaultValue="25" min="1" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-bold text-slate-800" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Target Price (₹ per Quintal)</label>
                        <input name="targetPrice" type="text" defaultValue="₹ 2,400" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-bold text-slate-800" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Required Delivery Date</label>
                        <input name="deliveryDate" type="date" defaultValue="2026-09-25" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-bold text-slate-800" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-800 mb-1">Delivery Destination / Warehouse</label>
                        <input name="destination" type="text" defaultValue="Ravi Traders Wholesale Cold Hub, Plot 42, APMC Yard" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-medium text-slate-800" />
                      </div>

                      <div className="md:col-span-2 pt-2 flex flex-wrap items-center gap-3">
                        <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-sm transition-all cursor-pointer border-2 border-slate-900">
                          Broadcast Bulk Order Request →
                        </button>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          ⚡ Reaches {registeredFarmers.length > 0 ? registeredFarmers.length : 25} verified producer groups in real time
                        </span>
                      </div>
                    </form>
                  </div>

                  {/* Bulk Sourcing Highlights: Vegetables & Pulses */}
                  <div className="bg-white rounded-3xl p-6 border-2 border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-black text-slate-900">Immediate Bulk Spot Procurement</h3>
                        <p className="text-xs text-slate-600 font-medium">Ready farm inventories available for direct dispatch today.</p>
                      </div>
                      <button
                        onClick={() => { setBrowseCategory('Vegetables'); setActiveTab('browse'); }}
                        className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                      >
                        View All Fresh Vegetables →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {[
                        { name: "Okra / Bhindi", img: "/vegetables/okra-bhindi.webp", price: "₹2,650/Qtl", stock: "14 MT" },
                        { name: "Bitter Gourd", img: "/vegetables/bitter-gourd-karela.webp", price: "₹2,400/Qtl", stock: "10 MT" },
                        { name: "Bottle Gourd", img: "/vegetables/bottle-gourd-lauki.webp", price: "₹1,450/Qtl", stock: "22 MT" },
                        { name: "Spinach", img: "/vegetables/spinach-palak.webp", price: "₹1,800/Qtl", stock: "8 MT" },
                        { name: "French Beans", img: "/vegetables/french-beans.webp", price: "₹3,400/Qtl", stock: "12 MT" },
                        { name: "Toor Dal Bold", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300", price: "₹10,400/Qtl", stock: "45 MT" }
                      ].map((item, i) => (
                        <div key={i} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-600 transition-all text-center flex flex-col items-center">
                          <div className="w-14 h-14 rounded-xl overflow-hidden mb-2 bg-white border border-slate-200 p-1 flex items-center justify-center">
                            <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="font-bold text-xs text-slate-900 truncate w-full">{item.name}</span>
                          <span className="text-[11px] font-extrabold text-emerald-800 mt-0.5">{item.price}</span>
                          <span className="text-[10px] text-slate-500">{item.stock} ready</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MY ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">My Bulk Purchase Orders</h2>
                      <p className="text-xs text-slate-500 mt-1">Live tracking of ongoing farm-gate pickups and completed shipments.</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                      {buyerOrders.length} Total Orders
                    </span>
                  </div>

                  {buyerOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-200 text-center shadow-xs">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-3 border border-emerald-200 shadow-xs">
                        <ClipboardList className="w-7 h-7 text-emerald-800" />
                      </div>
                      <h3 className="font-bold text-base text-slate-900">No Purchase Orders Placed Yet</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                        You currently have 0 active or historical bulk orders. When you purchase commodities from the marketplace, your orders will appear here.
                      </p>
                      <button
                        onClick={() => setActiveTab('browse')}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-all inline-flex items-center gap-1.5"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Browse Commodities</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {buyerOrders.map((order, i) => (
                        <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-slate-700">{order.id}</span>
                              <span className="font-bold text-sm text-slate-900">• {order.crop} ({order.qty})</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Farmer: {order.farmer} • ETA: {order.eta}</p>
                          </div>
                          <div className="flex items-center gap-4 self-end sm:self-center">
                            <span className="font-extrabold text-sm text-slate-900">{order.total}</span>
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUPPLIERS TAB */}
              {activeTab === 'suppliers' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                    <h2 className="text-xl font-extrabold text-slate-900">Verified Producer Network</h2>
                    <p className="text-xs text-slate-500 mt-1">Directly vetted farmers with land ownership verification and quality compliance.</p>
                  </div>
                  
                  {sortedFarmers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-200 shadow-xs text-center">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200 shadow-2xs">
                        <Users2 className="w-8 h-8 text-emerald-700" />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900">No Registered Farmer Suppliers Yet</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                        There are currently no farmers registered on AgriChain. Once a farmer completes registration with their mobile and farmland photo, their verified profile and direct contact details will appear here immediately.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sortedFarmers.map((farmer) => (
                        <div key={farmer.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all">
                          <div className="flex items-center gap-3.5 mb-3">
                            <img src={farmer.avatar} alt={farmer.name} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500" />
                            <div>
                              <h3 className="font-extrabold text-base text-slate-900">{farmer.name}</h3>
                              <p className="text-xs text-emerald-700 font-bold">{farmer.crops}</p>
                              <p className="text-[11px] text-slate-500">{farmer.location} ({farmer.distance})</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 text-xs mb-3 space-y-1">
                            <div className="flex justify-between text-slate-600">
                              <span>Verified Status:</span>
                              <span className="font-bold text-emerald-700">✓ Indian Citizen Verified</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Contact:</span>
                              <span className="font-mono font-semibold">{farmer.phone}</span>
                            </div>
                            {farmer.quantity && (
                              <div className="flex justify-between text-slate-600">
                                <span>Harvest Qty:</span>
                                <span className="font-bold text-slate-800">{farmer.quantity}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCallingFarmer(farmer)}
                              className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5" /> Call / Contact
                            </button>
                            <button
                              onClick={() => setSelectedFarmerDetail(farmer)}
                              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                            >
                              View Stock
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center gap-4">
                    <img src={buyerProfile.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500" />
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900">{buyerProfile.name}</h2>
                      <p className="text-xs font-semibold text-emerald-700">Verified Bulk Buyer • GST: {DEFAULT_BUYER_PROFILE.gstin}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{buyerProfile.city} • Contact: {buyerProfile.mobile}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <span className="text-xs text-slate-500">Procurement Level</span>
                      <p className="text-lg font-extrabold text-emerald-900">Tier 1 Wholesale</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                      <span className="text-xs text-slate-500">Escrow Balance</span>
                      <p className="text-lg font-extrabold text-sky-900">₹ 8,50,000</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                      <span className="text-xs text-slate-500">Connected Farmers</span>
                      <p className="text-lg font-extrabold text-purple-900">{registeredFarmers.length} Active Direct</p>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Right Sidebar Panel: Nearby Farmers & AI Route */}
            {activeTab !== 'routes' && (
              <aside className="w-full xl:w-80 2xl:w-96 bg-white border-t xl:border-t-0 xl:border-l border-slate-200/80 p-4 sm:p-5 flex flex-col gap-4.5 shrink-0 shadow-xs">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                      <Users className="w-5 h-5 fill-emerald-600/20 stroke-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                        Nearby Farmers for Bulk Purchase
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Connect with verified farmers near you
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('routes')}
                    className="mt-3.5 w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/50 border border-emerald-200/70 hover:border-emerald-300 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 fill-emerald-200" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                          <span>AI Route Optimization</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Get the best route, save time & fuel.
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Available Farmers Section */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                    <span className="font-extrabold text-xs text-slate-900 tracking-tight uppercase">
                      Available Farmers (Nearby)
                    </span>
                    <button
                      onClick={() => setSortBy(sortBy === 'distance' ? 'rating' : 'distance')}
                      className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Sort by: {sortBy === 'distance' ? 'Distance' : 'Rating'}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Dynamic Farmer Cards List */}
                  <div className="space-y-2.5 overflow-y-auto max-h-[440px] pr-1">
                    {sortedFarmers.length === 0 ? (
                      <div className="py-8 px-4 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                          <Users className="w-5 h-5 stroke-emerald-700" />
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-900">No Farmers Registered Yet</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
                          When verified Indian farmers register their farmland & harvest, their real profiles and direct call options will appear here automatically.
                        </p>
                      </div>
                    ) : (
                      sortedFarmers.map((farmer) => (
                        <div
                          key={farmer.id}
                          className="p-3 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all duration-150 flex items-center justify-between gap-2.5 group"
                        >
                          <div
                            onClick={() => setSelectedFarmerDetail(farmer)}
                            className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                          >
                            <div className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                              <img
                                src={farmer.vegetableImage || farmer.avatar}
                                alt={farmer.crops}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-white overflow-hidden shadow-xs">
                                <img src={farmer.avatar} alt={farmer.name} className="w-full h-full object-cover" />
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-xs text-slate-900 truncate">
                                  {farmer.name}
                                </h4>
                                {farmer.verified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Indian Farmer" />
                                )}
                              </div>
                              <p className="text-[11px] font-semibold text-emerald-700 truncate">
                                {farmer.crops}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium">
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                  {farmer.distance}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                                  {farmer.travelTime}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setCallingFarmer(farmer)}
                            className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-emerald-200"
                            title={`Call ${farmer.name}`}
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Fresh Vegetable Stock Spotlight in Farmer Section Down */}
                <div className="p-3 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs overflow-hidden">
                  <div className="relative h-20 rounded-xl overflow-hidden mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600"
                      alt="Fresh Farm Vegetables"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2">
                      <span className="text-white text-[11px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" /> Fresh Harvest Available Today
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium leading-tight">
                    {sortedFarmers.length === 0 ? (
                      <span><strong className="font-bold text-slate-700">0 MT</strong> live produce • Awaiting farmer crop registrations.</span>
                    ) : (
                      <span><strong className="font-bold text-emerald-800">{sortedFarmers.length * 10} MT</strong> verified farm-gate vegetables ready for bulk dispatch.</span>
                    )}
                  </div>
                </div>

                {/* Bottom Promo: AI Route */}
                <div
                  onClick={() => setActiveTab('routes')}
                  className="mt-auto p-3.5 rounded-2xl bg-gradient-to-r from-emerald-100/90 to-green-100/80 border border-emerald-300/80 flex items-center justify-between gap-3 cursor-pointer hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">AI Route Optimization</div>
                      <div className="text-[11px] text-emerald-900/80 font-medium">Plan your route, reduce travel time & fuel cost.</div>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {callingFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button onClick={() => setCallingFarmer(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4 mb-5">
              <img src={callingFarmer.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500" />
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">{callingFarmer.name}</h3>
                <p className="text-xs text-slate-500">{callingFarmer.location} ({callingFarmer.distance})</p>
                <p className="text-xs text-amber-600 font-bold mt-1">★ {callingFarmer.rating} ({callingFarmer.reviewsCount} bulk sales)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <a href={`tel:${callingFarmer.phone}`} className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 fill-white" /> Dial {callingFarmer.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {showRoutePlanner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto bg-[#f4f7f4] rounded-3xl p-3 sm:p-6 shadow-2xl relative border-2 border-slate-800 my-4">
            <button
              onClick={() => setShowRoutePlanner(false)}
              className="absolute top-6 right-6 z-30 p-2 rounded-full bg-white text-slate-700 hover:text-slate-950 border border-slate-400 shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <RouteOptimizationView
              registeredFarmers={registeredFarmers}
              buyerProfile={buyerProfile}
              onBackToDashboard={() => setShowRoutePlanner(false)}
            />
          </div>
        </div>
      )}

      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
            <button onClick={() => setSelectedCategory(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-extrabold text-lg text-slate-900 mb-1">{selectedCategory.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedCategory.subtext}</p>
            <div className="space-y-2.5">
              {selectedCategory.crops?.map((crop, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{crop.name}</h5>
                    <p className="text-xs text-slate-500">Farmer: {crop.farmer} • Ready: {crop.available}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900 block">{crop.price}</span>
                    <button onClick={() => alert(`Order request sent for ${crop.name}`)} className="mt-1 px-3 py-1 rounded-lg bg-emerald-700 text-white font-bold text-xs cursor-pointer">
                      Order Bulk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCropSeason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowCropSeason(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900 mb-3">Crop Season Wise Price & Arrival Insights</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="p-2.5 font-bold">Crop</th>
                    <th className="p-2.5 font-bold">Season</th>
                    <th className="p-2.5 font-bold">Avg Price</th>
                    <th className="p-2.5 font-bold">Trend</th>
                    <th className="p-2.5 font-bold">Peak Arrival</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CROP_SEASON_DATA.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-slate-800">{item.crop}</td>
                      <td className="p-2.5 text-slate-600">{item.season}</td>
                      <td className="p-2.5 font-extrabold text-emerald-800">{item.avgPrice}</td>
                      <td className="p-2.5 font-semibold text-emerald-600">{item.trend}</td>
                      <td className="p-2.5 text-slate-500">{item.peakArrival}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showAllStates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowAllStates(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">All States / UT APMC Mandi Directory</h3>
            <p className="text-xs text-slate-500 mb-4">Frozen data up to 15 September 2026 across Indian APMC Mandis.</p>
            <div className="space-y-2">
              {[
                { name: "Karnataka", mandis: "154 Mandis", topCommodity: "Tomato, Maize, Ragi" },
                { name: "Maharashtra", mandis: "248 Mandis", topCommodity: "Onion, Soybean, Grapes" },
                { name: "Tamil Nadu", mandis: "128 Mandis", topCommodity: "Paddy, Coconut, Banana" },
                { name: "Andhra Pradesh", mandis: "172 Mandis", topCommodity: "Chilli, Rice, Groundnut" },
              ].map((st, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{st.name}</h4>
                    <p className="text-[11px] text-slate-500">{st.topCommodity}</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">{st.mandis}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
