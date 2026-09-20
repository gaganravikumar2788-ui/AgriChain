import React from 'react';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';

export default function HeroBanner({ onExploreFarmers, onOpenRoutes }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#e7f6ed] via-[#dff4e8] to-[#d3efdf] border border-emerald-200/70 shadow-sm p-7 sm:p-9">
      {/* Background decorative elements */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Tagline: Better Margins Brighter Future */}
      <div className="hidden lg:flex items-center gap-1.5 absolute top-6 right-8 text-emerald-800 font-serif italic text-lg font-bold tracking-wide">
        <span>Better Margins</span>
        <Leaf className="w-5 h-5 fill-emerald-600 stroke-emerald-800 rotate-12" />
        <span>Brighter Future</span>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Text & CTA */}
        <div className="max-w-xl text-left">
          <span className="text-sm font-semibold text-slate-600 block mb-1">
            Welcome Back,
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] tracking-tight mb-3">
            Ravi Traders!
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6 max-w-lg">
            Access verified farmers, check market prices, and plan bulk purchases with ease.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreFarmers}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1b5e20] hover:bg-[#144919] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Leaf className="w-4 h-4 fill-white" />
              <span>Explore Farmers</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenRoutes && (
              <button
                onClick={onOpenRoutes}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 font-extrabold text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🗺️ Route Optimization</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Fresh Vegetables Harvest Image */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="relative w-56 sm:w-64 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 group">
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=700"
              alt="Fresh Farm Vegetables"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3 right-3 text-white text-[11px] font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                Fresh Farm Vegetables
              </span>
              <span className="bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px]">
                100% Direct
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
