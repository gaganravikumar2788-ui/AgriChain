import React, { useState } from 'react';
import { Search, Bell, ChevronDown, CheckCircle2, ShieldCheck, Navigation } from 'lucide-react';
import { BUYER_PROFILE, NOTIFICATIONS } from '../data/portalData';

export default function Header({ searchQuery, setSearchQuery, onOpenNotifications, onSelectCategory, onOpenRoutes }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products (e.g., Rice, Wheat, Onion...)"
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50/90 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 rounded-full px-1.5 py-0.5 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Direct AI Route Optimization Shortcut in Header */}
      <button
        onClick={onOpenRoutes}
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
        <span className="text-emerald-950 font-black text-sm">"{BUYER_PROFILE.name}"</span>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-4 ml-4">
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

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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

        {/* User Profile Card (With Farmer Photo as Profile Avatar) */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500/40 overflow-hidden bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-xs">
              <img
                src={BUYER_PROFILE.avatar}
                alt="Farmer Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-bold text-sm text-slate-900 leading-tight flex items-center gap-1.5">
                <span>{BUYER_PROFILE.name}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xs font-semibold text-emerald-700">
                {BUYER_PROFILE.role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-1" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50">
              <div className="p-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{BUYER_PROFILE.name}</p>
                <p className="text-[11px] text-slate-500">GST: {BUYER_PROFILE.gstin}</p>
                <p className="text-[11px] text-slate-500">{BUYER_PROFILE.city}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Bulk Buyer
                </div>
              </div>
              <div className="pt-2 text-xs space-y-1">
                <div className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer font-medium">
                  Trading License & GST Certificate
                </div>
                <div className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer font-medium">
                  Bank Settlement Accounts
                </div>
                <div className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer font-medium">
                  Sign Out
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
