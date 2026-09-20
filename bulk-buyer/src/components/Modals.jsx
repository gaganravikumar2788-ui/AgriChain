import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Navigation, 
  Truck, 
  Fuel, 
  Clock, 
  Calendar, 
  IndianRupee, 
  ArrowRight, 
  Check, 
  Package, 
  TrendingUp, 
  Send,
  Sparkles
} from 'lucide-react';
import { CROP_SEASON_DATA } from '../data/portalData';

/* 1. Farmer Call & Direct Connect Modal */
export function FarmerCallModal({ farmer, onClose, onOrderDirect }) {
  const [copied, setCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  if (!farmer) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(farmer.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Farmer Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
            />
            <span className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-1 border-2 border-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-slate-900">{farmer.name}</h3>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Farmer
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {farmer.location} ({farmer.distance} away)
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              <span>{farmer.rating}</span>
              <span className="text-slate-400 font-normal">({farmer.reviewsCount} bulk sales)</span>
            </div>
          </div>
        </div>

        {/* Available Bulk Stock */}
        <div className="bg-emerald-50/60 rounded-2xl p-3.5 border border-emerald-100 mb-4">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ready Harvest for Bulk Pickup</span>
          </div>
          <div className="space-y-1.5">
            {farmer.availableCrops?.map((crop, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-xl border border-emerald-100">
                <span className="font-semibold text-slate-800">{crop.name}</span>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-700">{crop.price}</span>
                  <span className="text-slate-400 ml-2">({crop.qty} stock)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Dial / Copy Action */}
        <div className="flex items-center gap-3 mb-5">
          <a
            href={`tel:${farmer.phone}`}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>Dial {farmer.phone}</span>
          </a>
          <button
            onClick={handleCopyPhone}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Direct RFQ form */}
        <form onSubmit={handleSendInquiry} className="space-y-3 border-t border-slate-100 pt-4">
          <label className="block text-xs font-bold text-slate-700">
            Request Bulk Quotation / Booking Inquiry:
          </label>
          <input
            type="text"
            required
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="e.g., Need 10 MT Tomato delivery by Wednesday"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={inquirySent}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {inquirySent ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Inquiry Sent to {farmer.name}!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Direct Request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

import AiRoutePlannerModal from './AiRoutePlannerModal';
export { AiRoutePlannerModal as RoutePlannerModal, AiRoutePlannerModal };

/* 3. Product Category Detail Modal */
export function CategoryDetailModal({ category, onClose, onOpenFarmerCall }) {
  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">{category.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{category.subtext}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Verified Farmer Listings In Sourcing Region
          </h4>
          {category.crops?.map((crop, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-300 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {crop.image && (
                  <div className="w-13 h-13 rounded-xl bg-emerald-50/70 p-1 border border-emerald-200 shrink-0 overflow-hidden">
                    <img src={crop.image} alt={crop.name} className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-sm text-slate-900 truncate">{crop.name}</h5>
                    <span className="bg-slate-200/70 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0">
                      {crop.grade}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 truncate">
                    Farmer: <span className="font-semibold text-slate-700">{crop.farmer}</span> • Available: <span className="font-semibold text-emerald-700">{crop.available}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-extrabold text-base text-slate-900">{crop.price}</div>
                <button
                  onClick={() => {
                    alert(`Request for ${crop.name} added to Bulk Quotation cart!`);
                  }}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Order Bulk
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 4. Crop Season Wise Price & Arrival Modal */
export function CropSeasonModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Crop Season Wise Price & Arrival Insights
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time AGMARKNET aggregated mandi arrival cycles and seasonal forecasts.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="p-3 font-bold">Crop / Variety</th>
                <th className="p-3 font-bold">Season Type</th>
                <th className="p-3 font-bold">Current Avg Price</th>
                <th className="p-3 font-bold">30-Day Trend</th>
                <th className="p-3 font-bold">Peak Arrival Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CROP_SEASON_DATA.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-800">{item.crop}</td>
                  <td className="p-3 text-slate-600">{item.season}</td>
                  <td className="p-3 font-extrabold text-emerald-800">{item.avgPrice}</td>
                  <td className="p-3 font-semibold text-emerald-600">{item.trend}</td>
                  <td className="p-3 text-slate-500 font-medium">{item.peakArrival}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
          <div className="text-xs text-purple-900 font-medium">
            <strong>Procurement Tip:</strong> Peak tomato and onion harvest arrivals in Kolar & Nashik reduce wholesale rates by 14% over the next 3 weeks.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-colors cursor-pointer shrink-0 ml-3"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

/* 5. All States Mandi Coverage Modal */
export function AllStatesModal({ onClose }) {
  const states = [
    { name: "Karnataka", mandis: "154 Mandis", topCommodity: "Tomato, Maize, Ragi, Groundnut", status: "Active Real-time" },
    { name: "Maharashtra", mandis: "248 Mandis", topCommodity: "Onion, Soybean, Cotton, Grapes", status: "Active Real-time" },
    { name: "Tamil Nadu", mandis: "128 Mandis", topCommodity: "Paddy, Coconut, Banana, Turmeric", status: "Active Real-time" },
    { name: "Andhra Pradesh", mandis: "172 Mandis", topCommodity: "Chilli, Rice, Tobacco, Groundnut", status: "Active Real-time" },
    { name: "Madhya Pradesh", mandis: "210 Mandis", topCommodity: "Wheat, Soybean, Garlic, Gram", status: "Active Real-time" },
    { name: "Punjab & Haryana", mandis: "196 Mandis", topCommodity: "Basmati Rice, Wheat, Mustard", status: "Active Real-time" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              All States / UT Data Directory
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Frozen data up to 15 September 2026 across Indian APMC Mandis.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {states.map((st, i) => (
            <div key={i} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-300 transition-all flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">{st.name}</h4>
                <p className="text-[11px] text-slate-500">{st.topCommodity}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-700 block">{st.mandis}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{st.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
