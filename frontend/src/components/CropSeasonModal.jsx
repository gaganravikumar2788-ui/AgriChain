import React, { useState, useMemo } from 'react';
import {
  X, Search, Sparkles, Filter, ExternalLink, ArrowRight,
  Droplets, Thermometer, Calendar, TrendingUp, AlertCircle, ShieldCheck
} from 'lucide-react';
import {
  KARNATAKA_CROPS,
  KARNATAKA_SEASONS,
  KARNATAKA_SOILS,
  getRecommendedCrops
} from '../services/karnatakaCropRecommendationService';

export default function CropSeasonModal({ isOpen, onClose }) {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedSoil, setSelectedSoil] = useState('All');
  const [selectedWater, setSelectedWater] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Compute recommended crops dynamically
  const recommendations = useMemo(() => {
    return getRecommendedCrops({
      season: selectedSeason,
      soilType: selectedSoil,
      waterAvailability: selectedWater,
      searchQuery
    });
  }, [selectedSeason, selectedSoil, selectedWater, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-purple-300 relative overflow-hidden my-auto">

        {/* ── Modal Header ── */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-5 sm:p-6 flex items-center justify-between relative flex-shrink-0">
          <div className="flex items-start gap-3.5 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-700/80 border border-purple-400/40 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Karnataka Crop Season-Wise Recommendations
                </h3>
                <span className="text-[11px] font-bold bg-purple-800 text-purple-200 border border-purple-400/50 px-2.5 py-0.5 rounded-full">
                  Karnataka Only Dataset
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200 mt-1">
                Curated meteorological and agro-climatic crop suitability data sourced exclusively from{' '}
                <a
                  href="https://www.kisanvani.co.in/crop-recommendation"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-300 underline font-bold hover:text-amber-200 inline-flex items-center gap-0.5"
                >
                  <span>KisanVani Agriculture Intelligence</span>
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition p-1 flex-shrink-0"
            title="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* ── Filter Controls Bar ── */}
        <div className="bg-purple-50/70 border-b border-purple-100 p-4 sm:p-5 flex flex-col gap-3 flex-shrink-0">
          {/* Season Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1 mr-1">
              <Calendar size={14} className="text-purple-700" />
              <span>Season:</span>
            </span>
            {KARNATAKA_SEASONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSeason(s.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                  selectedSeason === s.id
                    ? 'bg-purple-700 text-white shadow-purple-700/30'
                    : 'bg-white text-gray-700 hover:bg-purple-100/60 border border-purple-200'
                }`}
              >
                <span>{s.label}</span>
                <span className="ml-1 opacity-75 font-normal">({s.kannada})</span>
              </button>
            ))}
          </div>

          {/* Secondary Controls: Soil, Water, Search */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Soil Filter */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Soil Type:
              </label>
              <select
                value={selectedSoil}
                onChange={(e) => setSelectedSoil(e.target.value)}
                className="w-full bg-white border-2 border-purple-200 focus:border-purple-600 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none shadow-sm cursor-pointer"
              >
                {KARNATAKA_SOILS.map((soil) => (
                  <option key={soil} value={soil}>
                    {soil === 'All' ? 'All Karnataka Soils' : soil}
                  </option>
                ))}
              </select>
            </div>

            {/* Water Availability */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Water Availability:
              </label>
              <select
                value={selectedWater}
                onChange={(e) => setSelectedWater(e.target.value)}
                className="w-full bg-white border-2 border-purple-200 focus:border-purple-600 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="All">All Water Levels</option>
                <option value="low">Low (ಕಡಿಮೆ ನೀರು - Rain-fed / Dryland)</option>
                <option value="medium">Medium (ಮಧ್ಯಮ ನೀರು - Semi-irrigated)</option>
                <option value="high">High (ಹೆಚ್ಚು ನೀರು - Canal / Well Irrigated)</option>
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Search Crop:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Maize, ರಾಗಿ, Onion, Cotton..."
                  className="w-full bg-white border-2 border-purple-200 focus:border-purple-600 rounded-xl px-3 py-2 pr-8 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none shadow-sm"
                />
                <Search size={15} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Crops Grid / Content (Scrollable) ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-600">
              Showing <strong className="text-purple-900">{recommendations.length}</strong> recommended crops for Karnataka
            </span>
            <span className="text-[11px] text-gray-500">
              Sorted by KisanVani Compatibility & Profitability Score
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <div className="text-4xl mb-2">🌾</div>
              <h4 className="text-base font-bold text-gray-800">No matching Karnataka crops found</h4>
              <p className="text-xs text-gray-500 mt-1">
                Try switching the season to "All Seasons" or changing the soil type.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((crop) => {
                const seasonBadge =
                  crop.season === 'kharif'
                    ? { text: 'Kharif (ಮುಂಗಾರು)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
                    : crop.season === 'rabi'
                    ? { text: 'Rabi (ಹಿಂಗಾರು)', color: 'bg-sky-100 text-sky-800 border-sky-300' }
                    : { text: 'Annual (ವಾರ್ಷಿಕ)', color: 'bg-amber-100 text-amber-900 border-amber-300' };

                const riskBadge =
                  crop.riskLevel === 'low'
                    ? 'text-emerald-700 bg-emerald-50'
                    : crop.riskLevel === 'medium'
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-red-700 bg-red-50';

                return (
                  <div
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop)}
                    className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-purple-200/80 hover:border-purple-600 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:scale-[1.01]"
                  >
                    <div>
                      {/* Top Bar: Icon + Names + Season Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                            {crop.icon}
                          </span>
                          <div>
                            <h4 className="text-base sm:text-lg font-black text-gray-900 leading-snug group-hover:text-purple-800 transition-colors">
                              {crop.name}
                            </h4>
                            {crop.nameKn && (
                              <span className="text-xs font-bold text-purple-700">
                                {crop.nameKn}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${seasonBadge.color} whitespace-nowrap`}>
                          {seasonBadge.text}
                        </span>
                      </div>

                      {/* Profitability & Compatibility Meter */}
                      <div className="mt-3.5 p-2.5 rounded-xl bg-purple-50/80 border border-purple-100">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-purple-900 flex items-center gap-1">
                            <Sparkles size={12} className="text-purple-600" />
                            <span>Compatibility Score</span>
                          </span>
                          <span className="text-purple-800 font-mono font-black text-sm">
                            {crop.compatibilityScore}%
                          </span>
                        </div>
                        <div className="w-full bg-purple-200/60 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${crop.compatibilityScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Micro Metric Grid */}
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="text-[10px] text-gray-500 block">Duration</span>
                          <span className="font-bold text-gray-800">⏱️ {crop.growingPeriod} Days</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="text-[10px] text-gray-500 block">Water Need</span>
                          <span className="font-bold text-gray-800 capitalize">💧 {crop.waterRequirement}</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="text-[10px] text-gray-500 block">Temp Range</span>
                          <span className="font-bold text-gray-800">🌡️ {crop.tempMin}° – {crop.tempMax}°C</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="text-[10px] text-gray-500 block">Rainfall</span>
                          <span className="font-bold text-gray-800">🌧️ {crop.rainMin}–{crop.rainMax}mm</span>
                        </div>
                      </div>

                      {/* Suitable Soils Pills */}
                      <div className="mt-3">
                        <span className="text-[10px] text-gray-500 font-semibold block mb-1">
                          Ideal Soils in Karnataka:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {crop.soilTypes.map((soil, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-slate-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200"
                            >
                              {soil}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Market Demand & Risk */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-gray-600">
                        Demand: <strong className="text-purple-800 uppercase">{crop.marketDemand}</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full capitalize ${riskBadge}`}>
                        Risk: {crop.riskLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="bg-white border-t border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>KisanVani Agricultural Intelligence Engine • Real-Time Karnataka Agro-Climatic Match</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.kisanvani.co.in/crop-recommendation"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1"
            >
              <span>Verify on KisanVani ↗</span>
            </a>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
