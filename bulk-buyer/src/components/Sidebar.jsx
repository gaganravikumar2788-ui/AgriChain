import React from 'react';
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
  Navigation
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
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

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between shrink-0 shadow-sm relative">
      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-center p-1 shadow-xs shrink-0">
            <img src="/logo.png" alt="AgriChain Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-xl leading-tight text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>AgriChain</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">
              Bulk Buyer Portal
            </div>
          </div>
        </div>

        {/* Navigation Links */}
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
                  <span className="bg-[#15803d] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Decorative Bottom Slogan & Illustrated Greenery */}
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
  );
}
