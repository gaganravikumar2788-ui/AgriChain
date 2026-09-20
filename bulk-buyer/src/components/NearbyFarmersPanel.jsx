import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  PhoneCall, 
  ChevronRight, 
  Navigation, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Clock,
  ArrowUpDown
} from 'lucide-react';
export default function NearbyFarmersPanel({ farmers = [], onCallFarmer, onOpenRoutePlanner, onSelectFarmer }) {
  const [sortBy, setSortBy] = useState('distance'); // 'distance' or 'rating'

  const sortedFarmers = [...farmers].sort((a, b) => {
    if (sortBy === 'distance') {
      return (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0);
    }
    return (b.rating || 5) - (a.rating || 5);
  });

  return (
    <aside className="w-full xl:w-96 bg-white border-l-2 border-slate-800 p-5 flex flex-col gap-4.5 shrink-0 shadow-sm">
      {/* Panel Top Header */}
      <div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-slate-800 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
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

        {/* AI Route Optimization Banner Card */}
        <button
          onClick={onOpenRoutePlanner}
          className="mt-3.5 w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/50 border-2 border-slate-800 hover:border-slate-900 transition-all text-left flex items-center justify-between group cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs border border-emerald-700">
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
        <div className="flex items-center justify-between pb-2 border-b-2 border-slate-800 mb-2.5">
          <span className="font-extrabold text-xs text-slate-900 tracking-tight uppercase">
            Available Farmers (Nearby)
          </span>
          <button
            onClick={() => setSortBy(sortBy === 'distance' ? 'rating' : 'distance')}
            className="text-[11px] font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-slate-50 px-2 py-0.5 rounded-md border border-slate-800"
          >
            <span>Sort by: {sortBy === 'distance' ? 'Distance' : 'Rating'}</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>

        {/* Farmer Cards List */}
        <div className="space-y-2.5 overflow-y-auto max-h-[440px] pr-1">
          {sortedFarmers.length === 0 ? (
            <div className="py-8 px-4 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2.5 shadow-2xs border-2 border-slate-800">
                <Users className="w-5 h-5 stroke-emerald-700" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">No Farmers Registered Yet</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">
                When verified Indian farmers register their farmland & harvest, their real profiles and direct call options will appear here automatically.
              </p>
            </div>
          ) : (
            sortedFarmers.map((farmer) => (
              <div
                key={farmer.id}
                className="p-3 rounded-2xl bg-white hover:bg-slate-50/90 border-2 border-slate-800 hover:border-slate-900 hover:shadow-md transition-all duration-150 flex items-center justify-between gap-2.5 group shadow-xs"
              >
                {/* Vegetable Produce Image with Farmer Avatar Pin */}
                <div
                  onClick={() => onSelectFarmer(farmer)}
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                >
                  <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 border-slate-800 shadow-xs group-hover:border-slate-900 transition-colors">
                    <img
                      src={farmer.vegetableImage}
                      alt={farmer.crops}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-tl-md overflow-hidden border-t-2 border-l-2 border-slate-800 shadow-2xs">
                      <img
                        src={farmer.avatar}
                        alt={farmer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                        {farmer.name}
                      </h4>
                      {farmer.registeredAt && (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-xs">
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-emerald-700 truncate">
                      {farmer.crops}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
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
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {farmer.phone}
                    </div>
                  </div>
                </div>

                {/* Call Button */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCallFarmer(farmer);
                    }}
                    className="px-2.5 py-1.5 rounded-full bg-[#1b5e20] hover:bg-[#144919] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:shadow-sm transition-all cursor-pointer border-2 border-slate-900"
                  >
                    <PhoneCall className="w-3 h-3 fill-white" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => onSelectFarmer(farmer)}
                    className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fresh Vegetable Stock Spotlight in Farmer Section Down */}
      <div className="p-3 rounded-2xl bg-white border-2 border-slate-800 shadow-xs overflow-hidden">
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

      {/* Bottom Promo: AI Route Optimization Plan */}
      <div
        onClick={onOpenRoutePlanner}
        className="mt-auto p-3.5 rounded-2xl bg-gradient-to-r from-emerald-100/90 to-green-100/80 border border-emerald-300/80 flex items-center justify-between gap-3 cursor-pointer hover:shadow-sm transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950">
              AI Route Optimization
            </div>
            <div className="text-[11px] text-emerald-900/80 font-medium">
              Plan your route, reduce travel time & fuel cost.
            </div>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </aside>
  );
}
