import React from 'react';
import { 
  Zap, 
  FileText, 
  IndianRupee, 
  CloudSun, 
  User, 
  Leaf, 
  ArrowRight,
  TrendingUp,
  Sun
} from 'lucide-react';

export default function QuickAccessAndCropSeason({ onOpenService, onOpenCropSeason }) {
  const quickServices = [
    { id: 'schemes', label: 'Schemes', icon: Leaf, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'market', label: 'Market Price', icon: IndianRupee, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'weather', label: 'Weather', icon: CloudSun, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { id: 'advisories', label: 'Advisories', icon: FileText, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Quick Access Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
            <Zap className="w-5 h-5 fill-purple-600 stroke-purple-700" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight">
              Quick Access
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Explore essential services
            </p>
          </div>
        </div>

        {/* 5 Service Buttons */}
        <div className="grid grid-cols-5 gap-2.5 pt-1">
          {quickServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.id}
                onClick={() => onOpenService(svc.id)}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl border hover:shadow-sm hover:scale-102 transition-all duration-150 cursor-pointer group bg-slate-50/50 hover:bg-white"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 border ${svc.color} group-hover:scale-108 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 text-center line-clamp-1">
                  {svc.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Crop Season Wise Price & Arrival Card */}
      <div className="bg-gradient-to-br from-white via-purple-50/20 to-emerald-50/30 rounded-3xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                Crop Season Wise Price & Arrival
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Get crop-wise seasonal data for better decision making.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4">
          <button
            onClick={onOpenCropSeason}
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 group"
          >
            <span>View Crop Data</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Sprout & Sun Illustration */}
          <div className="relative flex items-center justify-center pr-2">
            <Sun className="w-7 h-7 text-amber-400 fill-amber-300 absolute -top-3 -right-1 animate-pulse-subtle" />
            <div className="w-12 h-12 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-600 border border-emerald-200">
              <Leaf className="w-6 h-6 fill-emerald-500 stroke-emerald-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
