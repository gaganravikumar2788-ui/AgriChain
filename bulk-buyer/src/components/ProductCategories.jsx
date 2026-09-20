import React from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/portalData';

export default function ProductCategories({ onSelectCategory, onViewAll }) {
  return (
    <div className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700">
            <Leaf className="w-4 h-4 fill-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Product Categories
          </h2>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Categories Grid (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-400/80 transition-all duration-200 cursor-pointer flex flex-col group"
          >
            {/* Produce Image */}
            <div className="w-full h-24 rounded-xl overflow-hidden mb-2.5 bg-slate-100 flex items-center justify-center">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Category Title & Summary */}
            <div className="mt-auto">
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {cat.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
