import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Navigation,
  Truck,
  Clock,
  IndianRupee,
  Check,
  Package,
  ArrowRight,
  Phone,
  ShieldCheck,
  Star,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Fuel,
  Compass,
  FileCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { BUYER_PROFILE } from '../data/portalData';

// Predefined Logistics Agro Hubs for bulk buyer
const AGRO_HUBS = [
  { id: 'hosur', name: 'Ravi Traders Central Depot (Hosur Agro Corridor)', lat: 12.7409, lng: 77.8253, x: 260, y: 220 },
  { id: 'ecity', name: 'Electronic City Phase 2 Cold Chain Hub', lat: 12.8452, lng: 77.6602, x: 180, y: 180 },
  { id: 'kolar', name: 'Kolar APMC Aggregation Depot', lat: 13.1378, lng: 78.1299, x: 380, y: 90 },
  { id: 'malur', name: 'Malur Farm Logistics Station', lat: 12.9860, lng: 77.9380, x: 360, y: 140 },
];

// Fixed coordinate anchors for map representation
const FARMER_COORDS = {
  'farmer-1': { x: 340, y: 160, routeLeg: 'NH-44 North', highway: 'NH-44' },
  'farmer-2': { x: 310, y: 90, routeLeg: 'SH-17 Agro Link', highway: 'SH-17' },
  'farmer-3': { x: 440, y: 120, routeLeg: 'Malur Farm Expressway', highway: 'Malur Exp' },
  'farmer-4': { x: 370, y: 290, routeLeg: 'Berigai Valley Corridor', highway: 'SH-87' },
  'farmer-5': { x: 150, y: 140, routeLeg: 'Sarjapur Logistics Highway', highway: 'Sarjapur Rd' },
};

export default function AiRoutePlannerModal({ onClose, farmers = [] }) {
  // Strictly use registered farmers - zero mock or dummy data
  const allFarmers = useMemo(() => {
    return Array.isArray(farmers) ? farmers : [];
  }, [farmers]);

  const getFarmerCoords = (farmer, index = 0) => {
    if (farmer.coords) return farmer.coords;
    if (FARMER_COORDS[farmer.id]) return FARMER_COORDS[farmer.id];
    const angles = [0.5, 1.3, 2.2, 3.0, 3.9, 4.7, 5.4, 6.0];
    const angle = angles[index % angles.length];
    const radius = 95 + ((index * 25) % 60);
    return {
      x: Math.round(260 + Math.cos(angle) * radius),
      y: Math.round(180 + Math.sin(angle) * (radius * 0.7)),
      highway: 'Agro Link Road'
    };
  };

  // Buyer Location State
  const [currentHub, setCurrentHub] = useState(AGRO_HUBS[0]);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);

  // 1. Initial State: Empty selection (as requested by user)
  const [selectedFarmerIds, setSelectedFarmerIds] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState({}); // { [farmerId]: [cropName, ...] }

  // View state: 'map' or 'itinerary'
  const [viewMode, setViewMode] = useState('map');

  // Journey Simulation State (when buyer clicks "Dispatch Truck & Start Journey")
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0); // 0 = at hub, 1 = to stop 1, etc.
  const [journeyStatus, setJourneyStatus] = useState('idle'); // 'idle', 'in_transit', 'loading', 'completed'
  const [truckProgress, setTruckProgress] = useState(0); // 0 to 100% on current leg
  const journeyTimerRef = useRef(null);

  // Automatically request GPS location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetectingGps(false);
          setGpsDetected(true);
          // Set buyer location based on live GPS
          setCurrentHub(prev => ({
            ...prev,
            lat: parseFloat(pos.coords.latitude.toFixed(4)),
            lng: parseFloat(pos.coords.longitude.toFixed(4)),
            name: `Detected GPS Depot (${pos.coords.latitude.toFixed(3)}°N, ${pos.coords.longitude.toFixed(3)}°E)`
          }));
        },
        (err) => {
          setDetectingGps(false);
          setGpsDetected(false);
          // Graceful fallback to Hosur Agro Corridor hub
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Toggle Farmer Selection
  const toggleFarmer = (farmerId) => {
    setSelectedFarmerIds(prev => {
      const exists = prev.includes(farmerId);
      if (exists) {
        const next = prev.filter(id => id !== farmerId);
        const nextCrops = { ...selectedCrops };
        delete nextCrops[farmerId];
        setSelectedCrops(nextCrops);
        return next;
      } else {
        const farmer = allFarmers.find(f => f.id === farmerId);
        // By default select all available crops from this farmer
        const initialCropNames = farmer?.availableCrops?.map(c => c.name) || [farmer?.crops || 'Produce'];
        setSelectedCrops(prevC => ({
          ...prevC,
          [farmerId]: initialCropNames
        }));
        return [...prev, farmerId];
      }
    });
  };

  // Toggle specific crop from a farmer
  const toggleFarmerCrop = (farmerId, cropName, e) => {
    e?.stopPropagation();
    setSelectedCrops(prev => {
      const current = prev[farmerId] || [];
      const updated = current.includes(cropName)
        ? current.filter(c => c !== cropName)
        : [...current, cropName];
      return {
        ...prev,
        [farmerId]: updated
      };
    });
  };

  // Quick action helpers
  const handleSelectAll = () => {
    const allIds = allFarmers.map(f => f.id);
    setSelectedFarmerIds(allIds);
    const cropsMap = {};
    allFarmers.forEach(f => {
      cropsMap[f.id] = f.availableCrops?.map(c => c.name) || [f.crops];
    });
    setSelectedCrops(cropsMap);
  };

  const handleSelectTop3 = () => {
    const top3 = allFarmers.slice(0, 3).map(f => f.id);
    setSelectedFarmerIds(top3);
    const cropsMap = {};
    allFarmers.slice(0, 3).forEach(f => {
      cropsMap[f.id] = f.availableCrops?.map(c => c.name) || [f.crops];
    });
    setSelectedCrops(cropsMap);
  };

  const handleClear = () => {
    setSelectedFarmerIds([]);
    setSelectedCrops({});
    setIsJourneyActive(false);
    setJourneyStep(0);
    setJourneyStatus('idle');
  };

  // AI Route Optimization Calculation
  const optimizedRoute = useMemo(() => {
    if (selectedFarmerIds.length === 0) return null;

    const selectedFarmersList = selectedFarmerIds
      .map(id => allFarmers.find(f => f.id === id))
      .filter(Boolean);

    // AI TSP / Nearest Neighbor Sorting from Hub
    const sortedStops = [...selectedFarmersList].sort((a, b) => {
      const distA = parseFloat(a.distance) || 10;
      const distB = parseFloat(b.distance) || 10;
      return distA - distB;
    });

    let cumulativeDist = 0;
    let departureMinutes = 8 * 60; // 08:00 AM

    const stopsWithSchedule = sortedStops.map((farmer, idx) => {
      const legDist = parseFloat(farmer.distance) || (idx + 1) * 4.5;
      cumulativeDist += legDist;
      const travelMins = Math.round(legDist * 2.2);
      departureMinutes += travelMins;

      const hours = Math.floor(departureMinutes / 60);
      const mins = departureMinutes % 60;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : hours;
      const eta = `${displayHours}:${mins < 10 ? '0' : ''}${mins} ${ampm}`;

      // 30 min loading window at farm gate
      departureMinutes += 30;

      const farmerSelectedCrops = selectedCrops[farmer.id] || [];
      const coords = getFarmerCoords(farmer, idx);

      return {
        stopNum: idx + 1,
        farmer,
        legDist: legDist.toFixed(1),
        cumulativeDist: cumulativeDist.toFixed(1),
        eta,
        crops: farmerSelectedCrops,
        coords
      };
    });

    // Return leg to Hub
    const returnDist = Math.max(8, cumulativeDist * 0.35);
    cumulativeDist += returnDist;
    const finalMinutes = departureMinutes + Math.round(returnDist * 2.2);
    const fHours = Math.floor(finalMinutes / 60);
    const fMins = finalMinutes % 60;
    const returnEta = `${fHours > 12 ? fHours - 12 : fHours}:${fMins < 10 ? '0' : ''}${fMins} ${fHours >= 12 ? 'PM' : 'AM'}`;

    // Estimated Savings
    const unoptimizedDist = selectedFarmersList.reduce((acc, f) => acc + (parseFloat(f.distance) || 10) * 2, 0);
    const distanceSaved = Math.max(0, unoptimizedDist - cumulativeDist);
    const fuelSaved = Math.round(distanceSaved * 28.5); // ₹28.5 / km commercial diesel freight rate
    const travelTimeHours = (cumulativeDist / 28).toFixed(1); // 28 km/h loaded truck speed average

    // Total metric tons calculated
    let totalTons = 0;
    selectedFarmersList.forEach(farmer => {
      const activeC = selectedCrops[farmer.id] || [];
      farmer.availableCrops?.forEach(c => {
        if (activeC.includes(c.name)) {
          totalTons += parseFloat(c.qty) || 5;
        }
      });
    });
    if (totalTons === 0) totalTons = selectedFarmersList.length * 6;

    return {
      stops: stopsWithSchedule,
      totalDistance: cumulativeDist.toFixed(1),
      distanceSaved: distanceSaved.toFixed(1),
      fuelSaved,
      travelTimeHours,
      returnEta,
      totalTons: totalTons.toFixed(1),
      unoptimizedDist: unoptimizedDist.toFixed(1)
    };
  }, [selectedFarmerIds, selectedCrops, allFarmers, currentHub]);

  // Truck Journey Simulation Controller
  const handleStartDispatch = () => {
    if (!optimizedRoute || optimizedRoute.stops.length === 0) return;
    setIsJourneyActive(true);
    setJourneyStep(1);
    setJourneyStatus('in_transit');
    setTruckProgress(0);
  };

  // Step-by-step dispatch simulation timer
  useEffect(() => {
    if (!isJourneyActive) return;

    if (journeyTimerRef.current) clearInterval(journeyTimerRef.current);

    journeyTimerRef.current = setInterval(() => {
      setTruckProgress(prev => {
        if (prev < 100) {
          return prev + 20;
        } else {
          // Reached current stop
          setJourneyStatus(prevStatus => {
            if (prevStatus === 'in_transit') {
              return 'loading';
            } else if (prevStatus === 'loading') {
              // Move to next stop
              setJourneyStep(currStep => {
                if (currStep < (optimizedRoute?.stops.length || 0)) {
                  setJourneyStatus('in_transit');
                  return currStep + 1;
                } else {
                  // Journey completed
                  setJourneyStatus('completed');
                  return currStep + 1;
                }
              });
              return 'in_transit';
            }
            return prevStatus;
          });
          return 0;
        }
      });
    }, 1200);

    return () => {
      if (journeyTimerRef.current) clearInterval(journeyTimerRef.current);
    };
  }, [isJourneyActive, optimizedRoute]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl border-3 border-slate-900 max-h-[92vh] overflow-y-auto relative flex flex-col justify-between ring-4 ring-slate-900/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-600 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 rounded-full cursor-pointer transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-slate-900 flex items-center justify-center text-white shadow-md shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    AI Multi-Stop Farm Route Optimizer
                  </h3>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Dynamic AI Engine
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Select nearby farmers & crops to generate an AI-sequenced fuel-optimized procurement path.
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-center border-2 border-slate-800">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'map' ? 'bg-white text-slate-950 shadow-xs border border-slate-800 font-black' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Interactive Map
              </button>
              <button
                onClick={() => setViewMode('itinerary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'itinerary' ? 'bg-white text-slate-950 shadow-xs border border-slate-800 font-black' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Turn-by-Turn Route
              </button>
            </div>
          </div>

          {/* Automatic Buyer Location Detection Banner */}
          <div className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-emerald-50/50 to-teal-50/30 border-2 border-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <MapPin className="w-4 h-4 text-emerald-800" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-800">Buyer Warehouse Hub: </span>
                <span className="font-black text-emerald-950">{currentHub.name}</span>
                {gpsDetected && (
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold border border-emerald-900">
                    Live GPS Locked
                  </span>
                )}
              </div>
            </div>

            {/* Change Hub Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={currentHub.id}
                onChange={(e) => {
                  const found = AGRO_HUBS.find(h => h.id === e.target.value);
                  if (found) setCurrentHub(found);
                }}
                className="bg-white border-2 border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-800 focus:outline-hidden focus:border-emerald-700 cursor-pointer shadow-xs"
              >
                {AGRO_HUBS.map(hub => (
                  <option key={hub.id} value={hub.id}>{hub.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT: Farmer Selection Grid + Map / Journey Area ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* LEFT 5 COLS: Farmer & Crop Selector List */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Nearby Verified Farmers ({allFarmers.length})
                </h4>
                <p className="text-[11px] text-slate-600 font-medium">Check farmers to add to AI procurement route</p>
              </div>

              {/* Fast Selector Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSelectTop3}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-2 border-slate-800 cursor-pointer transition-colors"
                >
                  Top 3
                </button>
                <button
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 border-2 border-slate-800 cursor-pointer transition-colors"
                >
                  All
                </button>
                {selectedFarmerIds.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-700 hover:bg-rose-50 border-2 border-rose-800 cursor-pointer transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Farmer Selection Cards */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {allFarmers.length === 0 ? (
                <div className="py-10 px-4 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 shadow-2xs border-2 border-slate-800">
                    <Package className="w-5 h-5 stroke-emerald-900" />
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900">
                    No Registered Farmers in System
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-1.5 max-w-xs leading-relaxed font-medium">
                    Verified farmer listings will appear here automatically when local farmers register their produce. You can then select them directly for procurement and route dispatch.
                  </p>
                </div>
              ) : (
                allFarmers.map((farmer) => {
                  const isSelected = selectedFarmerIds.includes(farmer.id);
                  const activeCrops = selectedCrops[farmer.id] || [];

                  return (
                    <div
                      key={farmer.id}
                      onClick={() => toggleFarmer(farmer.id)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-emerald-50 border-slate-900 shadow-md ring-2 ring-emerald-600/30'
                          : 'bg-white border-slate-800 hover:border-slate-900 hover:bg-slate-50/90 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Real Produce Image Thumbnail */}
                          <div className="relative w-12 h-12 rounded-xl bg-white p-1 border-2 border-slate-800 shrink-0 overflow-hidden shadow-2xs">
                            <img
                              src={farmer.vegetableImage}
                              alt={farmer.crops}
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-tl-sm overflow-hidden border border-white">
                              <img src={farmer.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-bold text-xs text-slate-900 truncate">{farmer.name}</h5>
                              <span className="bg-emerald-100 text-emerald-900 border border-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-xs">
                                Live
                              </span>
                            </div>
                            <p className="text-[11px] font-bold text-emerald-800 truncate">
                              {farmer.crops}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mt-0.5 font-medium">
                              <MapPin className="w-2.5 h-2.5 text-slate-600" />
                              <span>{farmer.location || 'Agro Belt'}</span>
                              <span>•</span>
                              <span className="font-bold text-emerald-800">{farmer.distance}</span>
                            </div>
                          </div>
                        </div>

                        {/* Custom Checkbox */}
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 border-2 ${
                          isSelected ? 'bg-emerald-700 text-white border-slate-900' : 'border-slate-800 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Available Crops Checkbox Pill List (when selected) */}
                      {isSelected && (
                        <div className="pt-2 border-t-2 border-slate-800">
                          <span className="text-[10px] font-extrabold text-slate-900 block mb-1.5 uppercase tracking-wider">
                            Select Crops to Buy & Load:
                          </span>
                          <div className="space-y-1.5">
                            {farmer.availableCrops?.map((crop, cIdx) => {
                              const isCropChecked = activeCrops.includes(crop.name);
                              return (
                                <div
                                  key={cIdx}
                                  onClick={(e) => toggleFarmerCrop(farmer.id, crop.name, e)}
                                  className={`flex items-center justify-between p-1.5 px-2 rounded-lg text-xs transition-colors border-2 ${
                                    isCropChecked
                                      ? 'bg-white text-slate-950 border-slate-900 font-bold shadow-xs'
                                      : 'bg-slate-100 text-slate-400 border-slate-300 line-through'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                                    <input
                                      type="checkbox"
                                      checked={isCropChecked}
                                      onChange={() => {}}
                                      className="w-3.5 h-3.5 accent-emerald-600 shrink-0"
                                    />
                                    <span className="truncate">{crop.name}</span>
                                  </div>
                                  <div className="text-right shrink-0 ml-2">
                                    <span className="font-black text-emerald-900">{crop.price}</span>
                                    <span className="text-[10px] text-slate-600 font-semibold ml-1">({crop.qty})</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT 7 COLS: Interactive Visual Map & AI Calculations */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Top AI Metrics Bar (Dynamic based on selected farmers) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-slate-900 shadow-sm">
              <div className="text-center">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Stops</span>
                <span className="text-base sm:text-lg font-black text-emerald-950">
                  {selectedFarmerIds.length} <span className="text-xs font-semibold text-slate-600">Farms</span>
                </span>
                <span className="text-[9px] text-emerald-800 font-extrabold block">
                  {selectedFarmerIds.length > 0 ? 'AI Sequenced' : 'Empty'}
                </span>
              </div>

              <div className="text-center border-l-2 border-slate-900">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Total Dist</span>
                <span className="text-base sm:text-lg font-black text-emerald-950">
                  {optimizedRoute ? `${optimizedRoute.totalDistance} km` : '0.0 km'}
                </span>
                <span className="text-[9px] text-emerald-800 font-extrabold block">
                  {optimizedRoute ? `-${optimizedRoute.distanceSaved} km saved` : '0 km'}
                </span>
              </div>

              <div className="text-center border-l-2 border-slate-900">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Estimated Travel</span>
                <span className="text-base sm:text-lg font-black text-emerald-950">
                  {optimizedRoute ? `${optimizedRoute.travelTimeHours} hrs` : '0h 0m'}
                </span>
                <span className="text-[9px] text-emerald-800 font-extrabold block">
                  {optimizedRoute ? `Return by ${optimizedRoute.returnEta}` : 'Standby'}
                </span>
              </div>

              <div className="text-center border-l-2 border-slate-900 col-span-3 sm:col-span-1">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Fuel Saved</span>
                <span className="text-base sm:text-lg font-black text-emerald-900">
                  {optimizedRoute ? `₹ ${optimizedRoute.fuelSaved.toLocaleString('en-IN')}` : '₹ 0'}
                </span>
                <span className="text-[9px] text-emerald-700 font-extrabold block">
                  {optimizedRoute ? `Cargo: ${optimizedRoute.totalTons} MT` : 'No cargo'}
                </span>
              </div>
            </div>

            {/* VIEW 1: INTERACTIVE SVG ROAD MAP */}
            {viewMode === 'map' && (
              <div className="relative w-full h-[330px] rounded-2xl bg-[#0f172a] border-3 border-slate-900 overflow-hidden shadow-inner flex items-center justify-center select-none">
                {/* Visual Map Grid & Topographic lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#38bdf8" strokeWidth="0.6" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Road Network Lines & Connection Paths */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 360">
                  {/* Background Road Network (Dim corridors) */}
                  <path d="M 50 180 Q 200 170 360 140 T 480 120" stroke="#334155" strokeWidth="4" fill="none" />
                  <path d="M 260 220 Q 300 180 340 160 T 440 120" stroke="#334155" strokeWidth="3" fill="none" />
                  <path d="M 260 220 Q 310 260 370 290" stroke="#334155" strokeWidth="3" fill="none" />
                  <path d="M 260 220 Q 200 190 150 140" stroke="#334155" strokeWidth="3" fill="none" />
                  <path d="M 340 160 L 310 90" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" fill="none" />

                  {/* AI Optimized Route Highway Path (Drawn when farmers selected) */}
                  {optimizedRoute && optimizedRoute.stops.length > 0 && (
                    <g>
                      {/* Outer Glow Path */}
                      <path
                        d={optimizedRoute.svgPath}
                        stroke="#10b981"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.3"
                      />
                      {/* Animated Core Road Highway */}
                      <path
                        d={optimizedRoute.svgPath}
                        stroke="#34d399"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="8 4"
                        className="animate-pulse"
                      />
                    </g>
                  )}

                  {/* Central Buyer Depot / Warehouse Pin */}
                  <g transform={`translate(${currentHub.coords.x}, ${currentHub.coords.y})`}>
                    <circle r="22" fill="#0284c7" opacity="0.25" className="animate-ping" />
                    <circle r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                    <circle r="4.5" fill="#ffffff" />
                    <text x="0" y="27" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold">
                      {currentHub.name} (Hub)
                    </text>
                  </g>

                  {/* Farmer Farm Gate Nodes on Map */}
                  {allFarmers.map((farmer) => {
                    const isSelected = selectedFarmerIds.includes(farmer.id);
                    const stopIndex = optimizedRoute?.stops.findIndex(st => st.farmer.id === farmer.id);
                    const stopNum = stopIndex !== undefined && stopIndex !== -1 ? stopIndex + 1 : null;

                    return (
                      <g
                        key={farmer.id}
                        transform={`translate(${farmer.coords.x}, ${farmer.coords.y})`}
                        onClick={() => toggleFarmer(farmer.id)}
                        className="cursor-pointer"
                      >
                        {isSelected ? (
                          <>
                            <circle r="20" fill="#059669" opacity="0.3" className="animate-ping" />
                            <circle r="13" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
                              {stopNum || '•'}
                            </text>
                            <text x="0" y="24" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">
                              Stop {stopNum}: {farmer.name.split(' ')[0]}
                            </text>
                          </>
                        ) : (
                          <>
                            <circle r="9" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle r="3" fill="#cbd5e1" />
                            <text x="0" y="18" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="medium">
                              {farmer.name.split(' ')[0]}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Empty State Overlay when no farmers selected */}
                {selectedFarmerIds.length === 0 && (
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in duration-200">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mb-3">
                      <Compass className="w-6 h-6 animate-pulse" />
                    </div>
                    {allFarmers.length === 0 ? (
                      <>
                        <h4 className="font-extrabold text-white text-sm">
                          Awaiting Farmer Registrations
                        </h4>
                        <p className="text-xs text-slate-300 max-w-sm mt-1 font-medium leading-relaxed">
                          No active farmers are registered in your local procurement radius yet. Once farmers register their produce, their farm pickup gates will appear on this interactive route map automatically.
                        </p>
                      </>
                    ) : (
                      <>
                        <h4 className="font-extrabold text-white text-sm">
                          Route Planner is Waiting for Your Selection
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm mt-1">
                          Check 1 or more registered farmers from the left panel to automatically generate the optimal road path and distance savings.
                        </p>
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={handleSelectTop3}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-all border border-emerald-400"
                          >
                            Auto-Select First 3
                          </button>
                          <button
                            onClick={handleSelectAll}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer border border-slate-700 transition-all"
                          >
                            Select All Farmers
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Map Legend Overlay */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border-2 border-slate-800 text-[10px] text-slate-300 flex items-center gap-3 pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Selected Pickup Gate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
                    <span>Unselected Farmer</span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: TURN-BY-TURN ITINERARY */}
            {viewMode === 'itinerary' && (
              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-900 h-[330px] overflow-y-auto space-y-2.5 shadow-sm">
                {selectedFarmerIds.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <Info className="w-8 h-8 mb-2 stroke-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">No stops in itinerary</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Please check farmers on the left to compile sequence.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border-2 border-slate-800 text-xs shadow-xs">
                      <div className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center shrink-0">
                        0
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>Departure: {currentHub.name}</span>
                          <span className="text-emerald-800">08:00 AM</span>
                        </div>
                        <span className="text-[11px] text-slate-500">Dispatch empty 25 MT multi-axle freight truck</span>
                      </div>
                    </div>

                    {optimizedRoute?.stops.map((st) => (
                      <div key={st.stopNum} className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-slate-800 text-xs shadow-2xs">
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center shrink-0">
                          {st.stopNum}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 truncate">
                              {st.farmer.name} ({st.farmer.location})
                            </span>
                            <span className="font-black text-emerald-800 shrink-0 ml-2">{st.eta}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                            <span className="truncate">Loading: {st.crops.join(', ') || st.farmer.crops}</span>
                            <span className="text-slate-400 shrink-0">+{st.legDist} km</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border-2 border-slate-800 text-xs shadow-xs">
                      <div className="w-7 h-7 rounded-full bg-teal-800 text-white font-bold flex items-center justify-center shrink-0">
                        ✓
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>Return & Unload: {currentHub.name}</span>
                          <span className="text-teal-800">{optimizedRoute?.returnEta}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">Unload {optimizedRoute?.totalTons} MT total produce into cold sorting bays</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* LIVE JOURNEY SIMULATION DASHBOARD (When truck is dispatched) */}
            {isJourneyActive && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-2 border-slate-900 shadow-md animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-900 flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block leading-tight">
                        Live Freight Journey: Truck KA-51-TR-9042
                      </span>
                      <span className="text-[10px] text-emerald-300 font-medium">
                        {journeyStatus === 'in_transit' && `In Transit: En route to Stop ${journeyStep}`}
                        {journeyStatus === 'loading' && `Loading produce at Stop ${journeyStep}`}
                        {journeyStatus === 'completed' && 'Completed! Returned to Depot Hub'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setJourneyStep(s => Math.min(s + 1, (optimizedRoute?.stops.length || 1) + 1))}
                      className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold cursor-pointer border border-emerald-500"
                    >
                      Next Stop
                    </button>
                    <button
                      onClick={() => setIsJourneyActive(false)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer border border-slate-600"
                    >
                      Stop Simulation
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (journeyStep / ((optimizedRoute?.stops.length || 1) + 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-slate-900">
          <div className="text-xs text-slate-600 font-medium">
            {selectedFarmerIds.length === 0 ? (
              <span className="text-amber-800 font-bold">⚠️ Select 1 or more farmers to enable truck dispatch</span>
            ) : (
              <span>
                Ready to dispatch for <strong className="text-slate-900 font-extrabold">{selectedFarmerIds.length} farm pickups</strong> ({optimizedRoute?.totalTons} MT cargo)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-800 hover:bg-slate-100 border-2 border-slate-800 cursor-pointer transition-colors shadow-xs"
            >
              Close
            </button>

            <button
              onClick={handleStartDispatch}
              disabled={selectedFarmerIds.length === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-2 border-2 ${
                selectedFarmerIds.length === 0
                  ? 'bg-slate-200 text-slate-400 border-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white border-slate-900 cursor-pointer shadow-emerald-700/20 active:scale-98'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Dispatch Truck & Start Journey</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
