import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Bike, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  X, 
  ChevronRight, 
  Sparkles,
  Home
} from 'lucide-react';

const TRACKING_STAGES = [
  { id: 1, title: 'Order Confirmed', subtitle: 'AgriChain hub received order', icon: CheckCircle2 },
  { id: 2, title: 'Packing Farm Produce', subtitle: 'Freshly packed & quality checked', icon: Package },
  { id: 3, title: 'Out for Delivery', subtitle: 'Rider Ramesh K. is on the way (EV Scooter)', icon: Bike },
  { id: 4, title: 'Arrived at Doorstep', subtitle: 'Please collect your order', icon: Home }
];

export default function LiveDeliveryModal({ order, onClose, onContinueShopping }) {
  const [currentStage, setCurrentStage] = useState(1);

  // Stage progression simulation
  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStage(2), 3500);
    const t2 = setTimeout(() => setCurrentStage(3), 8500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0c831f] via-emerald-800 to-[#0c831f] text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Live Delivery Tracker</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                Fresh Delivery In Progress
              </h2>
              <p className="text-xs text-emerald-100 font-semibold mt-0.5">
                Order {order.id} • Direct from local farmer hub
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shrink-0">
              <Bike className="w-6 h-6 text-amber-300 animate-bounce" />
              <span className="text-[10px] font-black mt-0.5">En Route</span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Animated Mini Map Simulation */}
          <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
              alt="Live Delivery Map"
              className="w-full h-full object-cover filter saturate-150 contrast-105 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Dark Store Pin */}
            <div className="absolute top-6 left-10 bg-white/95 text-slate-900 px-2 py-1 rounded-xl shadow-md border border-slate-200 text-[10px] font-black flex items-center gap-1">
              <Package className="w-3 h-3 text-emerald-700" />
              <span>AgriChain Hub</span>
            </div>

            {/* Animated Moving Rider Pin */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 animate-bounce bg-[#0c831f] text-white p-2 rounded-full shadow-xl border-2 border-white ring-4 ring-emerald-500/30">
              <Bike className="w-5 h-5" />
            </div>

            {/* Destination Pin */}
            <div className="absolute bottom-4 right-8 bg-[#f8cb46] text-slate-950 px-2.5 py-1 rounded-xl shadow-md border border-amber-500 text-[10px] font-black flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-900" />
              <span>{order.deliveryAddress?.split(',')[0] || 'Your Home'}</span>
            </div>

            {/* Verification OTP Badge */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 shadow-md text-[11px] font-extrabold text-slate-900">
              Delivery OTP: <span className="text-emerald-700 font-mono tracking-widest text-xs">4921</span>
            </div>
          </div>

          {/* 4-Step Timeline */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3.5">
            {TRACKING_STAGES.map((stage) => {
              const Icon = stage.icon;
              const isCompleted = currentStage > stage.id;
              const isCurrent = currentStage === stage.id;
              return (
                <div key={stage.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isCompleted 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : isCurrent 
                        ? 'bg-white border-emerald-600 text-emerald-700 ring-4 ring-emerald-100 animate-pulse' 
                        : 'bg-white border-slate-300 text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-black leading-tight ${isCurrent ? 'text-emerald-900' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                      {stage.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {stage.subtitle}
                    </p>
                  </div>
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      Live
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Delivery Partner Contact Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center border border-emerald-300">
                RK
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Ramesh K. (Delivery Hero)</h4>
                <p className="text-[11px] text-slate-500 font-medium">EV Scooter • 4.9 ★ (1,840 deliveries)</p>
              </div>
            </div>

            <button
              onClick={() => alert("Calling Delivery Partner Ramesh K. (+91 98451 22334)...")}
              className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Call Delivery Hero"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>

          {/* Order Summary & Items List */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-black text-slate-900 uppercase tracking-wider">
              <span>Items in this delivery ({order.totalItems})</span>
              <span className="text-[#0c831f]">₹{order.grandTotal}</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto divide-y divide-slate-50 text-xs">
              {order.items?.map((item, idx) => (
                <div key={idx} className="pt-1.5 flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800 truncate">
                    {item.name} <strong className="font-bold text-slate-500">x{item.qty}</strong>
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center gap-3">
          <button
            onClick={onContinueShopping}
            className="flex-1 py-3 rounded-2xl bg-[#0c831f] hover:bg-[#0b741b] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
