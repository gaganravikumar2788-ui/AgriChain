import React from 'react';
import { Calendar, ArrowRight, MapPin, Globe } from 'lucide-react';

export default function StatesBanner({ onViewAllStates }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#eaf7ee] via-[#e2f3e8] to-[#d6efde] border border-emerald-200/80 shadow-xs p-5 sm:p-6">
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Info with Calendar */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              All States/UT
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Data shown is for 3 days, and data is frozen up to{' '}
              <span className="font-bold text-slate-800">15 September 2026</span>
            </p>
          </div>
        </div>

        {/* Right CTA Button & Map Graphic */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={onViewAllStates}
            className="px-4 py-2.5 rounded-full bg-white/95 hover:bg-white text-emerald-900 border border-emerald-300 font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer group"
          >
            <span>View All States</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* India Geographic Icon Circle */}
          <div className="w-10 h-10 rounded-full bg-emerald-700/10 border border-emerald-600/30 flex items-center justify-center text-emerald-800" title="Pan-India Mandi Coverage">
            <Globe className="w-5 h-5 text-emerald-700" />
          </div>
        </div>
      </div>

      {/* Decorative subtle landscape gradient line */}
      <div className="absolute -bottom-6 right-1/4 w-96 h-12 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
    </div>
  );
}
