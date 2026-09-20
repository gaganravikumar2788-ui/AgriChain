import React from 'react';
import { Landmark, Truck, IndianRupee, Users } from 'lucide-react';
import { METRICS } from '../data/portalData';

const iconMap = {
  landmark: Landmark,
  truck: Truck,
  indianRupee: IndianRupee,
  users: Users,
};

export default function MetricCards({ metrics = METRICS, onMetricClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const IconComponent = iconMap[metric.iconType] || Landmark;
        return (
          <div
            key={metric.id}
            onClick={() => onMetricClick && onMetricClick(metric)}
            className="bg-white rounded-2xl p-5 border-2 border-slate-800 shadow-sm hover:shadow-md hover:border-slate-900 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-11 h-11 rounded-xl border-2 border-slate-800 flex items-center justify-center font-bold shadow-xs ${metric.bgIcon} group-hover:scale-105 transition-transform duration-200`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700">
                {metric.label}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {metric.value}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-slate-800 text-[12px]">
              <span className="text-slate-500 font-semibold">{metric.period}</span>
              <span className="font-extrabold text-emerald-700 flex items-center gap-0.5">
                {metric.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
