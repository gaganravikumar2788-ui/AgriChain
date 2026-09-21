import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  ShoppingCart, 
  User, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Package,
  LogOut,
  X
} from 'lucide-react';
import { DELIVERY_AREAS } from '../../data/consumerData';

const ROTATING_SEARCH_HINTS = [
  "Search 'fresh farm tomatoes'",
  "Search 'pure cow milk'",
  "Search 'sharbati atta'",
  "Search 'organic ragi flour'",
  "Search 'cold-pressed oils'",
  "Search 'red onions'"
];

export default function ConsumerHeader({ 
  searchQuery, 
  setSearchQuery, 
  cartItems = [], 
  onOpenCart, 
  onOpenOrders,
  selectedArea,
  setSelectedArea
}) {
  const [hintIndex, setHintIndex] = useState(0);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Rotating search placeholder like Blinkit
  useEffect(() => {
    const timer = setInterval(() => {
      setHintIndex(prev => (prev + 1) % ROTATING_SEARCH_HINTS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalCartAmount = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const storedUser = localStorage.getItem('agrichain_user');
  let userName = 'Customer';
  try {
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      userName = parsed.name || userName;
    }
  } catch (e) {}

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner (Farm-Gate Guarantee) */}
      <div className="bg-[#f8cb46] text-slate-900 text-xs font-black py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-amber-300">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-700 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-800"></span>
        </span>
        <span className="tracking-wide">
          ⚡ 100% DIRECT FARM-GATE HARVEST • PURE & FRESH PRODUCE DELIVERED TO YOUR DOORSTEP
        </span>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white border-2 border-emerald-600 p-0.5 sm:p-1 flex items-center justify-center shadow-xs">
            <img src="/logo.png" alt="AgriChain Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-[#0c831f]">
                AgriChain
              </span>
              <span className="bg-[#f8cb46] text-slate-900 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                Direct
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-500 font-bold tracking-wide">
              Field to Fork Direct
            </p>
          </div>
        </div>

        {/* Delivery Location Pill */}
        <div className="relative shrink-0 hidden md:block">
          <button
            onClick={() => setShowAreaDropdown(!showAreaDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl hover:bg-slate-50 border border-slate-200 transition-all text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-black text-slate-900 flex items-center gap-1">
                <span>Direct Doorstep Delivery</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 truncate max-w-[160px]">
                {selectedArea?.name || 'Indiranagar, Bengaluru'}
              </p>
            </div>
          </button>

          {/* Area Selector Dropdown */}
          {showAreaDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="font-extrabold text-xs text-slate-900">Select Delivery Location</span>
                <button onClick={() => setShowAreaDropdown(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto">
                {DELIVERY_AREAS.map(area => (
                  <button
                    key={area.id}
                    onClick={() => {
                      setSelectedArea(area);
                      setShowAreaDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2 ${
                      selectedArea?.id === area.id ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{area.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{area.city} • {area.pincode}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar (Centered, with rotating hint) */}
        <div className="flex-1 max-w-xl relative min-w-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ROTATING_SEARCH_HINTS[hintIndex]}
              className="w-full pl-8 sm:pl-10 pr-7 sm:pr-9 py-1.5 sm:py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-600 rounded-2xl text-[11px] sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Section: My Orders / Profile / Blinkit Green Cart Pill */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* My Orders Button */}
          <button
            onClick={onOpenOrders}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
            title="My Quick Commerce Orders"
          >
            <Package className="w-4 h-4 text-emerald-700" />
            <span>Orders</span>
          </button>

          {/* Profile Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-2 rounded-2xl hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:inline text-xs font-bold text-slate-800 truncate max-w-[100px]">
                {userName}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
                <div className="p-2 border-b border-slate-100 mb-1.5">
                  <p className="font-extrabold text-xs text-slate-900">{userName}</p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified AgriChain Consumer</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs font-medium">
                  <button
                    onClick={() => { setShowProfileMenu(false); onOpenOrders(); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-slate-500" />
                    <span>Order History & Invoices</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('consumerName');
                      localStorage.removeItem('consumerMobile');
                      window.location.reload();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Blinkit-Signature Green Floating Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#0c831f] hover:bg-[#0b741b] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
            {totalCartCount > 0 ? (
              <div className="text-left flex items-center gap-1.5 sm:gap-2">
                <span>{totalCartCount}</span>
                <span className="w-1 h-1 rounded-full bg-white/60"></span>
                <span>₹{totalCartAmount}</span>
              </div>
            ) : (
              <span className="hidden sm:inline">My Cart</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
