import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import MetricCards from './components/MetricCards';
import ProductCategories from './components/ProductCategories';
import QuickAccessAndCropSeason from './components/QuickAccessAndCropSeason';
import StatesBanner from './components/StatesBanner';
import NearbyFarmersPanel from './components/NearbyFarmersPanel';
import RouteOptimizationView from './components/RouteOptimizationView';
import { 
  FarmerCallModal, 
  RoutePlannerModal, 
  CategoryDetailModal, 
  CropSeasonModal, 
  AllStatesModal 
} from './components/Modals';
import { CATEGORIES, NEARBY_FARMERS, BUYER_PROFILE, METRICS } from './data/portalData';
import { subscribeRegisteredFarmers } from './services/farmerService';
import { getDailyMarketPrices, COMMODITY_CATEGORIES } from './services/marketPriceService';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  FileText, 
  Phone, 
  Star, 
  Search, 
  Send,
  Building,
  ShieldCheck,
  ArrowRight,
  Users2,
  ClipboardList
} from 'lucide-react';

export default function App() {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [browseCategory, setBrowseCategory] = useState('All');
  const [browseSearch, setBrowseSearch] = useState('');
  const [liveCommodities] = useState(() => getDailyMarketPrices());
  
  // Real-time registered farmers state
  const [registeredFarmers, setRegisteredFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);

  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.includes('route')) {
        setActiveTab('routes');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Bulk buyer orders state - strictly ZERO for new user, saved locally
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('agrichain_buyer_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real-time synchronization when consumer orders are dispatched from Godown
  React.useEffect(() => {
    const syncOrders = () => {
      try {
        const saved = localStorage.getItem('agrichain_buyer_orders');
        if (saved) setOrders(JSON.parse(saved));
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

  const handleAddOrder = (newOrder) => {
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('agrichain_buyer_orders', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  React.useEffect(() => {
    const unsubscribe = subscribeRegisteredFarmers((list) => {
      setRegisteredFarmers(list || []);
      setLoadingFarmers(false);
    });
    return () => unsubscribe();
  }, []);

  // Modals state
  const [callingFarmer, setCallingFarmer] = useState(null);
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCropSeason, setShowCropSeason] = useState(false);
  const [showAllStates, setShowAllStates] = useState(false);
  const [selectedFarmerDetail, setSelectedFarmerDetail] = useState(null);

  // Dynamic metrics with accurate registered farmer & order count
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
    if (m.id === 'orders') {
      return {
        ...m,
        value: String(orders.length),
        period: orders.length === 0 ? "0 Orders Placed" : `${orders.length} Active Orders`,
        change: orders.length > 0 ? `+${orders.length}` : '0%',
        changeType: orders.length > 0 ? 'positive' : 'neutral'
      };
    }
    return m;
  });

  // Filtered categories/crops if search query entered
  const filteredCategories = CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.subtext.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col font-sans">
      {/* Outer Layout: Sidebar + Main Content Area */}
      <div className="flex flex-1 min-h-screen">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Center + Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <Header 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenRoutes={() => setActiveTab('routes')}
          />

          {/* Body Container */}
          <div className="flex-1 flex flex-col xl:flex-row min-w-0">
            {/* Main Central Content */}
            <main className={`flex-1 p-5 sm:p-7 overflow-y-auto space-y-6 ${activeTab === 'routes' ? 'w-full max-w-full' : 'max-w-6xl'}`}>
              {/* ROUTE OPTIMIZATION TAB (MATCHING USER REFERENCE DESIGN WITH GOOGLE MAPS TILES) */}
              {activeTab === 'routes' && (
                <RouteOptimizationView
                  registeredFarmers={registeredFarmers}
                  buyerProfile={BUYER_PROFILE}
                  onBackToDashboard={() => setActiveTab('home')}
                />
              )}

              {activeTab === 'home' && (
                <>
                  {/* Hero Banner */}
                  <HeroBanner 
                    onExploreFarmers={() => setActiveTab('suppliers')}
                    onOpenRoutes={() => setActiveTab('routes')}
                  />

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

                  {/* 4 KPI Metric Cards */}
                  <MetricCards 
                    metrics={dynamicMetrics}
                    onMetricClick={(metric) => {
                      if (metric.id === 'orders') setActiveTab('orders');
                      if (metric.id === 'farmers') setActiveTab('suppliers');
                    }}
                  />

                  {/* Product Categories Grid */}
                  <ProductCategories 
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                    onViewAll={() => setActiveTab('browse')}
                  />

                  {/* Quick Access & Crop Season Cards */}
                  <QuickAccessAndCropSeason 
                    onOpenService={(serviceId) => {
                      if (serviceId === 'schemes') alert('Opening AgriChain Bulk Buyer Subsidies & Cold Storage Schemes directory');
                      if (serviceId === 'market') setShowCropSeason(true);
                      if (serviceId === 'weather') alert('Hosur-Bangalore Agricultural Corridor Weather: 26°C, Clear Sky, Low humidity (Ideal for transport)');
                      if (serviceId === 'advisories') alert('Quality Advisory: Tomato shelf life test guidelines during monsoons published by CFTRI');
                      if (serviceId === 'profile') setActiveTab('profile');
                    }}
                    onOpenCropSeason={() => setShowCropSeason(true)}
                  />

                  {/* States / UT Banner */}
                  <StatesBanner 
                    onViewAllStates={() => setShowAllStates(true)}
                  />
                </>
              )}

              {/* BROWSE PRODUCTS TAB */}
              {activeTab === 'browse' && (() => {
                const effectiveQuery = (browseSearch || searchQuery).toLowerCase().trim();
                const filteredBrowseProducts = liveCommodities.filter(item => {
                  const matchSearch = !effectiveQuery ||
                    item.name.toLowerCase().includes(effectiveQuery) ||
                    item.variety.toLowerCase().includes(effectiveQuery) ||
                    item.mandi.toLowerCase().includes(effectiveQuery) ||
                    item.state.toLowerCase().includes(effectiveQuery);
                  const matchCat = browseCategory === 'All' || item.category === browseCategory;
                  return matchSearch && matchCat;
                });

                return (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-white via-emerald-50/40 to-white rounded-3xl p-6 sm:p-7 border border-emerald-200/70 shadow-xs">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Agmarknet Synchronized Mandi Rates</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                            Browse All Agricultural Commodities
                          </h2>
                          <p className="text-xs text-slate-500 mt-1">
                            Live mandi auction prices synchronized 1:1 with farmer portal rates. Real produce photos from visual agricultural library.
                          </p>
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl border border-emerald-200 shadow-2xs text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Active Commodities</span>
                          <span className="text-2xl font-black text-emerald-800">{filteredBrowseProducts.length}</span>
                          <span className="text-[11px] text-slate-500 font-medium ml-1.5">Listed</span>
                        </div>
                      </div>

                      {/* Search & Category Filter Toolbar */}
                      <div className="mt-5 pt-4 border-t border-emerald-100 flex flex-col md:flex-row items-center gap-3">
                        <div className="relative w-full md:w-80">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={browseSearch}
                            onChange={(e) => setBrowseSearch(e.target.value)}
                            placeholder="Filter by crop, mandi, or state..."
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
                          />
                        </div>

                        {/* Category Buttons */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
                          {COMMODITY_CATEGORIES.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setBrowseCategory(cat)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                browseCategory === cat
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
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
                      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
                        <div className="text-4xl mb-2">🔍</div>
                        <h3 className="font-extrabold text-base text-slate-800">No commodities found</h3>
                        <p className="text-xs text-slate-500 mt-1">Try resetting the category or search keyword.</p>
                        <button
                          onClick={() => { setBrowseSearch(''); setBrowseCategory('All'); }}
                          className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                        {filteredBrowseProducts.map((crop) => (
                          <div
                            key={crop.id}
                            className="bg-white rounded-3xl p-5 border-2 border-slate-800 hover:border-slate-900 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                          >
                            <div>
                              <div className="flex items-start gap-3.5 mb-3">
                                {/* Real product photo beside the product name */}
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

                              {/* Mandi & State Benchmark Tag */}
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

              {/* BUY IN BULK TAB */}
              {activeTab === 'bulk' && (
                <div className="bg-white rounded-3xl p-7 border-2 border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Buy in Bulk - Request For Quotation (RFQ)</h2>
                    <p className="text-xs text-slate-600 mt-1 font-medium">Submit your wholesale commodity demand and receive competitive quotes from nearby verified farmers.</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const commodity = form.commodity?.value || "Hybrid Red Tomato (Boxed)";
                    const qtyVal = form.quantity?.value || 25;
                    const targetPrice = form.targetPrice?.value || "₹ 1,400";
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
                      <label className="block text-xs font-bold text-slate-800 mb-1">Select Commodity</label>
                      <select name="commodity" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-bold text-slate-800">
                        <option>Hybrid Red Tomato (Boxed)</option>
                        <option>Nashik Red Onion (Mesh Bag)</option>
                        <option>Sona Masoori Rice (Grade A)</option>
                        <option>Byadagi Red Chilli</option>
                        <option>Bold Groundnut / Peanut</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Quantity Required (Metric Tons)</label>
                      <input name="quantity" type="number" defaultValue="25" min="1" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-bold text-slate-800" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Target Price (₹ per Quintal)</label>
                      <input name="targetPrice" type="text" defaultValue="₹ 1,400" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-bold text-slate-800" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Required Delivery Date</label>
                      <input name="deliveryDate" type="date" defaultValue="2026-09-25" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-bold text-slate-800" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 mb-1">Delivery Destination / Warehouse</label>
                      <input name="destination" type="text" defaultValue="Ravi Traders Wholesale Cold Hub, Plot 42, Electronic City Phase 2" className="w-full p-2.5 bg-slate-50 border-2 border-slate-800 rounded-xl text-xs font-medium text-slate-800" />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-sm transition-all cursor-pointer border-2 border-slate-900">
                        Broadcast Bulk Order Request →
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MY ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl p-7 border-2 border-slate-800 shadow-sm space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">My Bulk Purchase Orders</h2>
                      <p className="text-xs text-slate-600 mt-1 font-medium">Live tracking of ongoing farm-gate pickups and completed shipments.</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-900 text-xs font-black rounded-full border-2 border-slate-800">
                      {orders.length} Total Orders
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-800 text-center shadow-xs">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-3 border-2 border-slate-800 shadow-xs">
                        <ClipboardList className="w-7 h-7 text-emerald-800" />
                      </div>
                      <h3 className="font-black text-base text-slate-900">No Purchase Orders Placed Yet</h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed font-medium">
                        You currently have 0 active or historical bulk orders. When you order commodities from the live mandi catalog or broadcast bulk RFQs, your real orders and live tracking will appear here.
                      </p>
                      <button
                        onClick={() => setActiveTab('browse')}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold border-2 border-slate-900 shadow-xs cursor-pointer transition-all inline-flex items-center gap-1.5"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Browse Commodities to Place Order</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order, i) => (
                        <div key={i} className="p-4 rounded-2xl border-2 border-slate-800 hover:border-slate-900 bg-white hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-slate-700">{order.id}</span>
                              <span className="font-black text-sm text-slate-900">• {order.crop} ({order.qty})</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-1">Farmer: {order.farmer} • ETA: {order.eta}</p>
                          </div>
                          <div className="flex items-center gap-4 self-end sm:self-center">
                            <span className="font-black text-sm text-slate-900">{order.total}</span>
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border-2 border-slate-800 ${
                              order.status?.includes('Delivered') 
                                ? 'bg-emerald-100 text-emerald-900' 
                                : 'bg-amber-100 text-amber-900'
                            }`}>
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
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-white rounded-3xl p-6 border-2 border-slate-800 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900">Verified Producer Network</h2>
                    <p className="text-xs text-slate-600 mt-1 font-medium">Directly vetted farmers with land ownership verification, Aadhaar KYC, and quality compliance.</p>
                  </div>

                  {registeredFarmers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-slate-800 shadow-sm text-center">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-3 border-2 border-slate-800 shadow-xs">
                        <Users2 className="w-8 h-8 text-emerald-800" />
                      </div>
                      <h3 className="font-black text-base text-slate-900">No Registered Farmer Suppliers Yet</h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed font-medium">
                        There are currently no farmers registered on AgriChain. Once a farmer completes registration with their mobile and farmland photo, their verified profile and direct contact details will appear here immediately.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {registeredFarmers.map((farmer) => (
                        <div key={farmer.id} className="bg-white rounded-2xl p-5 border-2 border-slate-800 hover:border-slate-900 shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center gap-3.5 mb-3">
                            <img src={farmer.avatar} alt={farmer.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-900 shadow-xs" />
                            <div>
                              <h3 className="font-extrabold text-base text-slate-900">{farmer.name}</h3>
                              <p className="text-xs text-emerald-800 font-bold">{farmer.crops}</p>
                              <p className="text-[11px] text-slate-500 font-medium">{farmer.location} ({farmer.distance})</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 text-xs mb-3 space-y-1 border-2 border-slate-800">
                            <div className="flex justify-between text-slate-600">
                              <span className="font-medium">Verified Status:</span>
                              <span className="font-bold text-emerald-800">✓ Indian Citizen Verified</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span className="font-medium">Contact:</span>
                              <span className="font-mono font-bold text-slate-900">{farmer.phone}</span>
                            </div>
                            {farmer.quantity && (
                              <div className="flex justify-between text-slate-600">
                                <span className="font-medium">Harvest Qty:</span>
                                <span className="font-bold text-slate-900">{farmer.quantity}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCallingFarmer(farmer)}
                              className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border-2 border-slate-900 shadow-xs"
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

              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs animate-in fade-in duration-200">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-1">Direct Farmer Communications</h2>
                  <p className="text-xs text-slate-500 mb-4">Chat directly with farmers regarding pickup times, vehicle clearances, and weighment slips.</p>
                  
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-start gap-3">
                      <img 
                        src={registeredFarmers[0]?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'} 
                        alt="" 
                        className="w-9 h-9 rounded-full object-cover" 
                      />
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-2xs border border-slate-100 max-w-md">
                        <p className="text-xs font-bold text-slate-800">
                          {registeredFarmers[0]?.name || 'Registered Farmer'}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">Namaste Ravi Ji, 14 MT Tomato crates are harvested and packed. The loading dock is clear for your 10T truck at 9:30 AM.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">Today, 08:15 AM</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-emerald-700 text-white p-3 rounded-2xl rounded-tr-none shadow-2xs max-w-md">
                        <p className="text-xs font-bold">Ravi Traders (You)</p>
                        <p className="text-xs mt-0.5">Thank you Ramesh Ji. Truck KA-01-AB-4920 has departed our hub and will reach your farm in 20 minutes.</p>
                        <span className="text-[10px] text-emerald-200 mt-1 block text-right">Today, 08:24 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center gap-4">
                    <img src={BUYER_PROFILE.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500" />
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900">{BUYER_PROFILE.name}</h2>
                      <p className="text-xs font-semibold text-emerald-700">GSTIN: {BUYER_PROFILE.gstin} • Verified Bulk Buyer</p>
                      <p className="text-xs text-slate-500 mt-0.5">{BUYER_PROFILE.city}</p>
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

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <h2 className="text-xl font-extrabold text-slate-900">Portal Sourcing Preferences</h2>
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-xs text-slate-800">Automated AI Route Planning</p>
                        <p className="text-[11px] text-slate-500">Cluster multiple pickups for maximum fuel savings</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-xs text-slate-800">Mandi Price Surge Alerts</p>
                        <p className="text-[11px] text-slate-500">Notify when commodity prices drop &gt; 5%</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600" />
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Right Sidebar Panel: Nearby Farmers & Route Optimization */}
            {activeTab !== 'routes' && (
              <NearbyFarmersPanel
                farmers={registeredFarmers}
                onCallFarmer={(farmer) => setCallingFarmer(farmer)}
                onOpenRoutePlanner={() => setActiveTab('routes')}
                onSelectFarmer={(farmer) => setSelectedFarmerDetail(farmer)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      {callingFarmer && (
        <FarmerCallModal 
          farmer={callingFarmer}
          onClose={() => setCallingFarmer(null)}
        />
      )}

      {selectedFarmerDetail && (
        <FarmerCallModal 
          farmer={selectedFarmerDetail}
          onClose={() => setSelectedFarmerDetail(null)}
        />
      )}

      {showRoutePlanner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto bg-[#f4f7f4] rounded-3xl p-3 sm:p-6 shadow-2xl relative border-3 border-slate-900 my-4">
            <button
              onClick={() => setShowRoutePlanner(false)}
              className="absolute top-6 right-6 z-30 p-2 rounded-full bg-white text-slate-700 hover:text-slate-950 border-2 border-slate-800 shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <RouteOptimizationView 
              registeredFarmers={registeredFarmers} 
              buyerProfile={BUYER_PROFILE}
              onBackToDashboard={() => setShowRoutePlanner(false)} 
            />
          </div>
        </div>
      )}

      {selectedCategory && (
        <CategoryDetailModal 
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onOpenFarmerCall={(farmer) => setCallingFarmer(farmer)}
        />
      )}

      {showCropSeason && (
        <CropSeasonModal 
          onClose={() => setShowCropSeason(false)}
        />
      )}

      {showAllStates && (
        <AllStatesModal 
          onClose={() => setShowAllStates(false)}
        />
      )}
    </div>
  );
}
