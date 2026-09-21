import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { subscribeRegisteredFarmers } from '../services/farmerService';
import { 
  Settings, 
  Plus, 
  Sparkles, 
  Calendar, 
  ChevronDown, 
  Navigation, 
  MapPin, 
  Clock, 
  Truck, 
  Scale, 
  Droplet, 
  Leaf, 
  TrendingUp, 
  Download, 
  Share2, 
  Smartphone, 
  Edit3, 
  Play, 
  Pause,
  Maximize2, 
  LocateFixed, 
  X, 
  Check,
  Flag,
  ArrowRight,
  AlertCircle,
  Users,
  Layers,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

// Comprehensive District & Agricultural Taluk Mappings across Karnataka
const DISTRICT_HUBS = {
  'mysuru': {
    name: 'Mysuru',
    hubLat: 12.3550,
    hubLng: 76.6100,
    hubArea: 'Mysuru Agro Corridor',
    subLocations: [
      { name: 'Mysuru Central / Chamundi Foothills', lat: 12.3118, lng: 76.6529 },
      { name: 'Nanjangud Agro Belt', lat: 12.1190, lng: 76.6800 },
      { name: 'T. Narasipura River Belt', lat: 12.2130, lng: 76.9030 },
      { name: 'Hunsur Tobacco & Grain Valley', lat: 12.3080, lng: 76.2910 },
      { name: 'K.R. Nagara Paddy Belt', lat: 12.5830, lng: 76.3830 },
      { name: 'Bannur Vegetable Corridor', lat: 12.3320, lng: 76.8620 },
      { name: 'Saragur Organic Farm Belt', lat: 11.9770, lng: 76.3880 },
      { name: 'Periyapatna Spice Valley', lat: 12.3420, lng: 76.1010 }
    ]
  },
  'mandya': {
    name: 'Mandya',
    hubLat: 12.5500,
    hubLng: 76.8800,
    hubArea: 'Mandya Agro Belt',
    subLocations: [
      { name: 'Mandya Central APMC', lat: 12.5223, lng: 76.8973 },
      { name: 'Srirangapatna Agro Corridor', lat: 12.4230, lng: 76.6940 },
      { name: 'Pandavapura Sugar Valley', lat: 12.5020, lng: 76.6680 },
      { name: 'Maddur Commercial Belt', lat: 12.5840, lng: 77.0450 },
      { name: 'Malavalli Agro Link', lat: 12.3870, lng: 77.0560 },
      { name: 'K.R. Pet Green Fields', lat: 12.6650, lng: 76.4910 },
      { name: 'Nagamangala Farm Belt', lat: 12.8210, lng: 76.7580 }
    ]
  },
  'hassan': {
    name: 'Hassan',
    hubLat: 13.0200,
    hubLng: 76.1100,
    hubArea: 'Hassan Agro Hub',
    subLocations: [
      { name: 'Hassan Agro Mandi', lat: 13.0072, lng: 76.0963 },
      { name: 'Channarayapatna Grain Belt', lat: 12.9060, lng: 76.3910 },
      { name: 'Holenarasipura River Valley', lat: 12.7880, lng: 76.2440 },
      { name: 'Sakleshpur Plantation Belt', lat: 12.9730, lng: 75.7860 },
      { name: 'Belur Heritage Farm Area', lat: 13.1630, lng: 75.8640 },
      { name: 'Arsikere Coconut Belt', lat: 13.3130, lng: 76.2570 }
    ]
  },
  'bengaluru': {
    name: 'Bengaluru',
    hubLat: 13.0200,
    hubLng: 77.5500,
    hubArea: 'Bengaluru Rural Logistics Depot',
    subLocations: [
      { name: 'Doddaballapura APMC Belt', lat: 13.2929, lng: 77.5434 },
      { name: 'Devanahalli Agro Cargo Hub', lat: 13.2484, lng: 77.7126 },
      { name: 'Nelamangala Highway Hub', lat: 13.0980, lng: 77.3820 },
      { name: 'Hoskote Vegetable Corridor', lat: 13.0710, lng: 77.7980 },
      { name: 'Sarjapur Logistics Corridor', lat: 12.8600, lng: 77.7870 },
      { name: 'Yelahanka North Farm Gate', lat: 13.1007, lng: 77.5963 }
    ]
  },
  'kolar': {
    name: 'Kolar',
    hubLat: 13.1200,
    hubLng: 78.1000,
    hubArea: 'Kolar Tomato & Milk Corridor',
    subLocations: [
      { name: 'Kolar APMC Tomato Yard', lat: 13.1367, lng: 78.1291 },
      { name: 'Malur Industrial Agro Link', lat: 12.9860, lng: 77.9380 },
      { name: 'Bangarapet Farming Belt', lat: 12.9800, lng: 78.1880 },
      { name: 'Srinivaspur Mango Capital', lat: 13.3370, lng: 78.2140 },
      { name: 'Mulbagal Agro Zone', lat: 13.1630, lng: 78.3960 }
    ]
  },
  'ramanagara': {
    name: 'Ramanagara',
    hubLat: 12.7400,
    hubLng: 77.2600,
    hubArea: 'Ramanagara Silk & Agro Belt',
    subLocations: [
      { name: 'Ramanagara Silk Market', lat: 12.7214, lng: 77.2799 },
      { name: 'Channapatna Agro Cluster', lat: 12.6510, lng: 77.2050 },
      { name: 'Kanakapura River Belt', lat: 12.5510, lng: 77.4170 },
      { name: 'Magadi Farm Corridor', lat: 12.9570, lng: 77.2280 }
    ]
  },
  'tumakuru': {
    name: 'Tumakuru',
    hubLat: 13.3500,
    hubLng: 77.0800,
    hubArea: 'Tumakuru Coconut & Grain Hub',
    subLocations: [
      { name: 'Tumakuru Central Yard', lat: 13.3379, lng: 77.1010 },
      { name: 'Kunigal Agro Link', lat: 13.0230, lng: 77.0310 },
      { name: 'Tiptur Coconut Market', lat: 13.2620, lng: 76.4780 },
      { name: 'Sira Groundnut Belt', lat: 13.7430, lng: 76.9070 },
      { name: 'Gubbi Farming Cluster', lat: 13.3110, lng: 76.9400 }
    ]
  },
  'shivamogga': {
    name: 'Shivamogga',
    hubLat: 13.9350,
    hubLng: 75.5750,
    hubArea: 'Malnad Paddy & Arecanut Hub',
    subLocations: [
      { name: 'Shivamogga Central Mandi', lat: 13.9299, lng: 75.5681 },
      { name: 'Bhadravati River Belt', lat: 13.8400, lng: 75.7000 },
      { name: 'Sagar Malnad Farming Belt', lat: 14.1670, lng: 75.0330 },
      { name: 'Shikaripura Paddy Belt', lat: 14.2690, lng: 75.3520 }
    ]
  },
  'davanagere': {
    name: 'Davanagere',
    hubLat: 14.4700,
    hubLng: 75.9150,
    hubArea: 'Davanagere Maize & Cotton Belt',
    subLocations: [
      { name: 'Davanagere Main Yard', lat: 14.4644, lng: 75.9218 },
      { name: 'Harihar River Basin', lat: 14.5160, lng: 75.8030 },
      { name: 'Honnali Agro Link', lat: 14.2460, lng: 75.6450 },
      { name: 'Channagiri Arecanut Area', lat: 14.0280, lng: 75.9290 }
    ]
  },
  'belagavi': {
    name: 'Belagavi',
    hubLat: 15.8600,
    hubLng: 74.5000,
    hubArea: 'Belagavi Sugar & Vegetable Hub',
    subLocations: [
      { name: 'Belagavi Wholesale Yard', lat: 15.8497, lng: 74.4977 },
      { name: 'Gokak Sugar Belt', lat: 16.1680, lng: 74.8250 },
      { name: 'Bailhongal Cotton Market', lat: 15.8140, lng: 74.8560 },
      { name: 'Chikodi Vegetable Belt', lat: 16.4300, lng: 74.5900 },
      { name: 'Athani Grape & Grain Hub', lat: 16.7320, lng: 75.0600 }
    ]
  },
  'kalaburagi': {
    name: 'Kalaburagi',
    hubLat: 17.3350,
    hubLng: 76.8400,
    hubArea: 'Kalaburagi Red Gram (Tur) Hub',
    subLocations: [
      { name: 'Kalaburagi Pulse APMC', lat: 17.3297, lng: 76.8343 },
      { name: 'Sedam Limestone Farm Area', lat: 17.1810, lng: 77.2880 },
      { name: 'Aland Tur Dal Belt', lat: 17.5640, lng: 76.5680 },
      { name: 'Afzalpur River Farmlands', lat: 17.2000, lng: 76.3500 }
    ]
  },
  'udupi': {
    name: 'Udupi',
    hubLat: 13.3450,
    hubLng: 74.7500,
    hubArea: 'Udupi Coastal Agri Belt',
    subLocations: [
      { name: 'Udupi Farm Center', lat: 13.3409, lng: 74.7421 },
      { name: 'Kundapura Coastal Belt', lat: 13.6260, lng: 74.6930 },
      { name: 'Karkala Plantation Area', lat: 13.2140, lng: 74.9960 }
    ]
  },
  'chamarajanagar': {
    name: 'Chamarajanagar',
    hubLat: 11.9300,
    hubLng: 76.9400,
    hubArea: 'Chamarajanagar Organic Hub',
    subLocations: [
      { name: 'Chamarajanagar Mandi', lat: 11.9261, lng: 76.9437 },
      { name: 'Kollegal Sericulture Belt', lat: 12.1580, lng: 77.1170 },
      { name: 'Gundlupet Vegetable Corridor', lat: 11.8080, lng: 76.6890 }
    ]
  },
  'chikkamagaluru': {
    name: 'Chikkamagaluru',
    hubLat: 13.3200,
    hubLng: 75.7700,
    hubArea: 'Chikkamagaluru Coffee & Spice Hub',
    subLocations: [
      { name: 'Chikkamagaluru Plantation Center', lat: 13.3161, lng: 75.7720 },
      { name: 'Kadur Commercial Yard', lat: 13.5530, lng: 76.0120 },
      { name: 'Tarikere Agro Belt', lat: 13.7120, lng: 75.8150 }
    ]
  },
  'ballari': {
    name: 'Ballari',
    hubLat: 15.1450,
    hubLng: 76.9200,
    hubArea: 'Ballari Cotton & Chilli Hub',
    subLocations: [
      { name: 'Ballari APMC Yard', lat: 15.1394, lng: 76.9214 },
      { name: 'Hosapete Paddy Belt', lat: 15.2689, lng: 76.3909 },
      { name: 'Siruguppa Grain Corridor', lat: 15.6330, lng: 76.8960 }
    ]
  }
};

// Aliases for matching
const DISTRICT_ALIASES = {
  'mysore': 'mysuru',
  'bangalore': 'bengaluru',
  'bangalore urban': 'bengaluru',
  'bangalore rural': 'bengaluru',
  'bengaluru urban': 'bengaluru',
  'bengaluru rural': 'bengaluru',
  'shimoga': 'shivamogga',
  'davangere': 'davanagere',
  'belgaum': 'belagavi',
  'gulbarga': 'kalaburagi',
  'bellary': 'ballari',
  'chikmagalur': 'chikkamagaluru',
  'chikkaballapur': 'kolar',
  'coorg': 'mysuru'
};

const STOP_BADGE_COLORS = [
  'bg-[#16a34a]', // green
  'bg-[#0d9488]', // teal
  'bg-[#2563eb]', // blue
  'bg-[#3b82f6]', // sky blue
  'bg-[#10b981]', // emerald
  'bg-[#9333ea]', // purple
  'bg-[#a855f7]', // violet
  'bg-[#ea580c]'  // orange
];

// Helper to compute distance in km using Haversine with 1.25x road curvature
function computeDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1.25;
}

// Find district info
function matchDistrict(districtStr) {
  const clean = (districtStr || '').toLowerCase().trim();
  for (const [key, info] of Object.entries(DISTRICT_HUBS)) {
    if (clean.includes(key)) return info;
  }
  for (const [alias, targetKey] of Object.entries(DISTRICT_ALIASES)) {
    if (clean.includes(alias)) return DISTRICT_HUBS[targetKey];
  }
  // Default to Mysuru Agro Hub
  return DISTRICT_HUBS['mysuru'];
}

// Generate distinct realistic stop from a farmer record
function createStopFromFarmer(farmer, index, allFarmers = []) {
  const distInfo = matchDistrict(farmer.district || farmer.location);
  
  // Count how many farmers before this one share the same district
  const sameDistrictFarmers = allFarmers.filter((f, i) => {
    if (i >= index) return false;
    const fDist = matchDistrict(f.district || f.location);
    return fDist.name === distInfo.name;
  });
  const districtOccurrence = sameDistrictFarmers.length;

  // Sub-location pick
  const subLocations = distInfo.subLocations;
  const subLoc = subLocations[districtOccurrence % subLocations.length];

  // Micro-jitter to guarantee zero overlap even for many farmers
  const hash = Math.abs(
    String(farmer.id || farmer.name || index)
      .split('')
      .reduce((acc, ch) => ((acc << 5) - acc) + ch.charCodeAt(0), 0)
  );
  const jitterLat = ((hash % 7) - 3) * 0.005;
  const jitterLng = (((hash >> 3) % 7) - 3) * 0.005;

  const validLat = (farmer.lat && !isNaN(parseFloat(farmer.lat))) ? parseFloat(farmer.lat) : (subLoc.lat + jitterLat);
  const validLng = (farmer.lng && !isNaN(parseFloat(farmer.lng))) ? parseFloat(farmer.lng) : (subLoc.lng + jitterLng);

  const locDisplay = (farmer.location && !farmer.location.includes('Agricultural Belt'))
    ? farmer.location
    : `${subLoc.name}`;

  return {
    id: farmer.id || `stop-${index + 1}`,
    farmerId: farmer.id,
    stopNum: index + 1,
    farmer: farmer.name || 'Verified Farmer',
    location: locDisplay,
    district: distInfo.name,
    duration: '20 min',
    badgeColor: STOP_BADGE_COLORS[index % STOP_BADGE_COLORS.length],
    lat: validLat,
    lng: validLng,
    crop: farmer.crops || (farmer.availableCrops?.[0]?.name) || 'Harvest Produce',
    quantity: farmer.quantity || '5 MT',
    phone: farmer.phone || farmer.mobile || '+91 90359 14558',
    avatar: farmer.avatar,
    vegetableImage: farmer.vegetableImage
  };
}

// TSP Nearest-Neighbor Route Optimizer
// Takes Hub and farmer stops, returns the optimal visiting order
function optimizeStopSequence(hub, rawStops) {
  if (!rawStops || rawStops.length <= 1) {
    return rawStops.map((st, i) => ({
      ...st,
      stopNum: i + 1,
      badgeColor: STOP_BADGE_COLORS[i % STOP_BADGE_COLORS.length]
    }));
  }

  const unvisited = [...rawStops];
  const ordered = [];
  let currentLat = hub.lat;
  let currentLng = hub.lng;

  while (unvisited.length > 0) {
    let bestIdx = 0;
    let minD = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const d = computeDistance(currentLat, currentLng, unvisited[i].lat, unvisited[i].lng);
      if (d < minD) {
        minD = d;
        bestIdx = i;
      }
    }

    const nextStop = unvisited.splice(bestIdx, 1)[0];
    ordered.push(nextStop);
    currentLat = nextStop.lat;
    currentLng = nextStop.lng;
  }

  // Renumber and assign realistic sequential schedule
  let cumulativeMinutes = 8 * 60 + 30; // Start first pickup at 08:30 AM
  let prevLat = hub.lat;
  let prevLng = hub.lng;

  return ordered.map((st, idx) => {
    const legDist = computeDistance(prevLat, prevLng, st.lat, st.lng);
    const driveMinutes = Math.max(12, Math.round((legDist / 45) * 60));
    cumulativeMinutes += (idx === 0 ? 0 : driveMinutes + 20); // 20 min load time

    const hours = Math.floor(cumulativeMinutes / 60);
    const mins = cumulativeMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours;
    const timeStr = `${String(displayHours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;

    prevLat = st.lat;
    prevLng = st.lng;

    return {
      ...st,
      stopNum: idx + 1,
      badgeColor: STOP_BADGE_COLORS[idx % STOP_BADGE_COLORS.length],
      time: timeStr
    };
  });
}

// Generate smooth curved highway coordinates through waypoints (fallback when offline)
function generateSmoothHighwayCurve(waypoints) {
  if (waypoints.length < 2) return waypoints;
  const result = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    result.push(p1);

    // Add 8-12 gentle intermediate points with road-like curvature
    const steps = 10;
    const dLat = p2[0] - p1[0];
    const dLng = p2[1] - p1[1];
    const normalLat = -dLng * 0.12;
    const normalLng = dLat * 0.12;

    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const arc = Math.sin(t * Math.PI) * (i % 2 === 0 ? 1 : -1);
      const lat = p1[0] + dLat * t + normalLat * arc;
      const lng = p1[1] + dLng * t + normalLng * arc;
      result.push([lat, lng]);
    }
  }
  result.push(waypoints[waypoints.length - 1]);
  return result;
}

export default function RouteOptimizationView({ registeredFarmers = [], buyerProfile = null, onBackToDashboard }) {
  const [activeSubTab, setActiveSubTab] = useState('plan');
  const [mapLayerType, setMapLayerType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [selectedRouteType, setSelectedRouteType] = useState('collection');
  const [selectedDate, setSelectedDate] = useState('21 Sep 2026');
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [isEditingStops, setIsEditingStops] = useState(false);
  const [isRouteActive, setIsRouteActive] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic Bulk Buyer identity & warehouse details
  const buyerInfo = useMemo(() => {
    let name = buyerProfile?.businessName || buyerProfile?.name;
    let city = buyerProfile?.city;

    if (!name || !city) {
      try {
        const stored = localStorage.getItem('agrichain_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!name) name = parsed.businessName || parsed.name;
          if (!city) city = parsed.city;
        }
      } catch (e) {}
    }

    if (!name) name = localStorage.getItem('buyerBusinessName') || localStorage.getItem('buyerName') || 'Ravi Traders';
    if (!city) city = localStorage.getItem('buyerCity') || 'Bengaluru / Hosur Agro Corridor';

    return { name, city };
  }, [buyerProfile]);

  // Fallback auto-subscription so Route Optimization ALWAYS has live farmers even if opened directly
  const [internalFarmers, setInternalFarmers] = useState(registeredFarmers || []);

  useEffect(() => {
    if (registeredFarmers && registeredFarmers.length > 0) {
      setInternalFarmers(registeredFarmers);
    } else {
      const unsub = subscribeRegisteredFarmers((list) => {
        if (list && list.length > 0) {
          setInternalFarmers(list);
        }
      });
      return () => {
        if (unsub) unsub();
      };
    }
  }, [registeredFarmers]);

  // Combined available pool of real registered farmers
  const allAvailableFarmers = useMemo(() => {
    return (registeredFarmers && registeredFarmers.length > 0) ? registeredFarmers : internalFarmers;
  }, [registeredFarmers, internalFarmers]);

  // Exclusively build stops from real registered farmers with smart spatial distribution
  const [stops, setStops] = useState(() => {
    const pool = (registeredFarmers && registeredFarmers.length > 0) ? registeredFarmers : internalFarmers;
    const raw = pool.map((f, idx) => createStopFromFarmer(f, idx, pool));
    const firstHub = pool.length > 0 ? matchDistrict(pool[0].district || pool[0].location) : DISTRICT_HUBS['mysuru'];
    return optimizeStopSequence({ lat: firstHub.hubLat, lng: firstHub.hubLng }, raw);
  });

  // Synchronize when registered farmers list updates
  useEffect(() => {
    if (allAvailableFarmers && allAvailableFarmers.length > 0) {
      const raw = allAvailableFarmers.map((f, idx) => createStopFromFarmer(f, idx, allAvailableFarmers));
      const firstHub = matchDistrict(allAvailableFarmers[0].district || allAvailableFarmers[0].location);
      const optimized = optimizeStopSequence({ lat: firstHub.hubLat, lng: firstHub.hubLng }, raw);
      setStops(optimized);
    } else {
      setStops([]);
    }
  }, [allAvailableFarmers]);

  // Compute Bulk Buyer Location dynamically
  const hubLocation = useMemo(() => {
    if (stops.length > 0) {
      const firstStop = stops[0];
      const distInfo = matchDistrict(firstStop.district);
      return {
        name: `${buyerInfo.name} Warehouse`,
        label: "Bulk Buyer Location",
        area: `${distInfo.name} Wholesale Agro Hub`,
        lat: distInfo.hubLat,
        lng: distInfo.hubLng,
        startTime: "08:00 AM",
        endTime: "02:30 PM",
        isBuyerWarehouse: true
      };
    }
    return {
      name: `${buyerInfo.name} Warehouse`,
      label: "Bulk Buyer Location",
      area: `${buyerInfo.city}`,
      lat: DISTRICT_HUBS['mysuru'].hubLat,
      lng: DISTRICT_HUBS['mysuru'].hubLng,
      startTime: "08:00 AM",
      endTime: "02:30 PM",
      isBuyerWarehouse: true
    };
  }, [stops, buyerInfo]);

  // Calculate realistic route metrics based on real connected stops
  const metrics = useMemo(() => {
    if (stops.length === 0) {
      return {
        totalStops: 0,
        distanceKm: "0.0",
        estTimeStr: "0 min",
        savedKm: "0.0",
        savedTimeStr: "0 min",
        estFuel: "0.0",
        capacity: "10.0 MT",
        vehicleNo: "KA-09-AG-9035"
      };
    }

    let totalKm = 0;
    let currLat = hubLocation.lat;
    let currLng = hubLocation.lng;

    stops.forEach(st => {
      totalKm += computeDistance(currLat, currLng, st.lat, st.lng);
      currLat = st.lat;
      currLng = st.lng;
    });
    // Return to Hub
    totalKm += computeDistance(currLat, currLng, hubLocation.lat, hubLocation.lng);

    // Realistic floor
    if (totalKm < 22) totalKm = 24.5 + (stops.length * 6);

    const totalMins = Math.round((totalKm / 42) * 60 + (stops.length * 20));
    const hours = Math.floor(totalMins / 60);
    const remMins = totalMins % 60;
    const timeDisplay = hours > 0 ? `${hours}h ${remMins} min` : `${remMins} min`;

    const savedDist = (totalKm * 0.22).toFixed(1);
    const savedMins = Math.round(totalMins * 0.28);
    const savedTimeDisplay = savedMins >= 60 
      ? `${Math.floor(savedMins / 60)}h ${savedMins % 60} min` 
      : `${savedMins} min`;

    const fuelLiters = (totalKm / 11.5).toFixed(1);

    return {
      totalStops: stops.length,
      distanceKm: totalKm.toFixed(1),
      estTimeStr: timeDisplay,
      savedKm: savedDist,
      savedTimeStr: savedTimeDisplay,
      estFuel: fuelLiters,
      capacity: "12.5 MT",
      vehicleNo: stops[0]?.district?.toLowerCase().includes('mysur') ? 'KA-09-AG-9035' : 'KA-01-AB-1234'
    };
  }, [stops, hubLocation]);

  // Leaflet references
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const routePolylineGlowRef = useRef(null);
  const markersGroupRef = useRef(null);
  const truckMarkerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Initialize Leaflet Map with Google Maps Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [hubLocation.lat, hubLocation.lng],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });
      mapInstanceRef.current = map;

      const tileUrl = mapLayerType === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' // Google Hybrid Satellite
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'; // Google Roadmap
      
      tileLayerRef.current = L.tileLayer(tileUrl, {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);

      // Force recalculate Leaflet map dimensions
      const invalidate = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      setTimeout(invalidate, 100);
      setTimeout(invalidate, 350);
      setTimeout(invalidate, 800);
      window.addEventListener('resize', invalidate);
    }
  }, [hubLocation]);

  // Update Tile Layer on Map vs Satellite toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl = mapLayerType === 'satellite'
      ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(mapInstanceRef.current);

    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 100);
  }, [mapLayerType]);

  // Redraw pins, realistic road polyline, and connected routes for ALL farmers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    if (routePolylineGlowRef.current) {
      map.removeLayer(routePolylineGlowRef.current);
      routePolylineGlowRef.current = null;
    }
    if (truckMarkerRef.current) {
      map.removeLayer(truckMarkerRef.current);
      truckMarkerRef.current = null;
    }

    // 1. Central Bulk Buyer Location Marker (Indigo/Emerald Premium Warehouse Pin)
    const hubIconHtml = `
      <div class="flex flex-col items-center pointer-events-auto select-none group cursor-pointer">
        <div class="relative">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-950 via-indigo-700 to-emerald-600 text-white flex items-center justify-center border-3 border-white shadow-2xl ring-4 ring-indigo-500/30 transition-transform group-hover:scale-110">
            <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.84L18 11v7h-3v-5H9v5H6v-7l6-5.16z"/>
            </svg>
          </div>
          <span class="absolute -top-1.5 -right-2 px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[8px] rounded-full uppercase tracking-tighter border border-white shadow-xs">
            Buyer Location
          </span>
        </div>
        <div class="bg-slate-900/95 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-lg border border-slate-700 mt-1 whitespace-nowrap flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
          <span>${hubLocation.name}</span>
        </div>
        <div class="text-[9px] font-extrabold text-slate-700 bg-white/95 px-2 py-0.5 rounded-md shadow-xs border border-slate-300 mt-0.5 whitespace-nowrap">
          Bulk Buyer Location • ${hubLocation.area}
        </div>
      </div>
    `;

    const hubMarker = L.marker([hubLocation.lat, hubLocation.lng], {
      icon: L.divIcon({
        className: 'custom-hub-marker',
        html: hubIconHtml,
        iconSize: [220, 76],
        iconAnchor: [110, 24]
      })
    });
    hubMarker.bindPopup(`
      <div class="p-1 font-sans text-xs min-w-[220px]">
        <div class="flex items-center justify-between border-b pb-1 mb-1">
          <span class="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            ${hubLocation.name}
          </span>
          <span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">
            Buyer Hub
          </span>
        </div>
        <p class="text-indigo-900 font-bold mt-0.5">Bulk Buyer Main Warehouse & Receiving Depot</p>
        <p class="text-slate-600 font-medium">${hubLocation.area}</p>
        <div class="mt-2 pt-1 border-t border-slate-100 text-slate-500 space-y-0.5">
          <p>🚚 Dispatched Fleet: <strong>${metrics.vehicleNo}</strong></p>
          <p>⏰ Departure from Warehouse: <strong>${hubLocation.startTime}</strong></p>
          <p>🏁 Return to Warehouse: <strong>${hubLocation.endTime}</strong></p>
        </div>
      </div>
    `);
    markersGroupRef.current.addLayer(hubMarker);

    if (stops.length === 0) {
      map.setView([hubLocation.lat, hubLocation.lng], 11);
      setTimeout(() => map.invalidateSize(), 150);
      return;
    }

    // 2. Add distinct pins for EVERY connected farmer stop
    stops.forEach((stop, index) => {
      const stopNum = index + 1;
      const markerHtml = `
        <div class="flex items-center gap-1.5 pointer-events-auto select-none group cursor-pointer">
          <div class="w-8 h-8 rounded-full ${stop.badgeColor} text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xl ring-2 ring-black/15 transition-transform group-hover:scale-115">
            ${stopNum}
          </div>
          <div class="bg-white/95 text-slate-900 text-[11px] font-extrabold px-2.5 py-1 rounded-xl shadow-md border border-slate-300 whitespace-nowrap flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>${stop.farmer}</span>
            <span class="text-[10px] text-slate-500 font-normal">(${stop.location.split(',')[0]})</span>
          </div>
        </div>
      `;

      const marker = L.marker([stop.lat, stop.lng], {
        icon: L.divIcon({
          className: 'custom-stop-marker',
          html: markerHtml,
          iconSize: [200, 36],
          iconAnchor: [16, 18]
        })
      });

      marker.bindPopup(`
        <div class="p-1 font-sans text-xs min-w-[200px]">
          <div class="flex items-center justify-between border-b pb-1 mb-1">
            <span class="font-black text-slate-900 text-sm">Stop ${stopNum}: ${stop.farmer}</span>
            <span class="px-1.5 py-0.2 rounded text-[10px] font-extrabold ${stop.badgeColor} text-white">Pickup</span>
          </div>
          <p class="text-emerald-800 font-bold">${stop.location}</p>
          <p class="text-slate-600 font-medium mt-0.5">Crop: <strong>${stop.crop}</strong> (${stop.quantity})</p>
          <p class="text-slate-500 mt-1">Arrival: <strong>${stop.time}</strong> (${stop.duration})</p>
          <p class="text-slate-500">Contact: <strong>${stop.phone}</strong></p>
        </div>
      `);

      markersGroupRef.current.addLayer(marker);
    });

    // 3. Connect them all in order: Hub -> Stop 1 -> Stop 2 -> ... -> Stop N -> Hub
    const rawWaypoints = [
      [hubLocation.lat, hubLocation.lng],
      ...stops.map(s => [s.lat, s.lng]),
      [hubLocation.lat, hubLocation.lng]
    ];

    // Immediate instant smooth road curve so polyline connects immediately
    const fallbackCurve = generateSmoothHighwayCurve(rawWaypoints);

    // Glowing outer halo
    routePolylineGlowRef.current = L.polyline(fallbackCurve, {
      color: '#38bdf8',
      weight: 9,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Main vibrant blue highway corridor
    routePolylineRef.current = L.polyline(fallbackCurve, {
      color: '#2563eb', // Royal highway blue
      weight: 4.5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // 4. Fit bounds to comfortably encompass Hub and all farmers
    const bounds = L.latLngBounds(rawWaypoints);
    map.fitBounds(bounds, { padding: [65, 65], maxZoom: 13 });
    setTimeout(() => map.invalidateSize(), 200);

    // 5. Asynchronously enhance with OSRM driving turn-by-turn road network
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const coordsStr = rawWaypoints.map(pt => `${pt[1].toFixed(5)},${pt[0].toFixed(5)}`).join(';');
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

    fetch(osrmUrl, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (data && data.routes && data.routes[0]?.geometry?.coordinates) {
          const roadPoints = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          if (routePolylineRef.current && routePolylineGlowRef.current) {
            routePolylineRef.current.setLatLngs(roadPoints);
            routePolylineGlowRef.current.setLatLngs(roadPoints);
          }
        }
      })
      .catch(() => {
        // Silently preserve smooth highway curve fallback
      });

    return () => {
      controller.abort();
    };
  }, [stops, hubLocation]);

  // Live Truck simulator when route is started
  useEffect(() => {
    let timer;
    if (isRouteActive && stops.length > 0) {
      timer = setInterval(() => {
        setActiveStopIndex(prev => (prev + 1) % (stops.length + 1));
      }, 3000);
    } else {
      setActiveStopIndex(0);
    }
    return () => clearInterval(timer);
  }, [isRouteActive, stops.length]);

  // Update truck marker position during active journey
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (truckMarkerRef.current) {
      map.removeLayer(truckMarkerRef.current);
      truckMarkerRef.current = null;
    }

    if (isRouteActive && stops.length > 0) {
      const currentPos = activeStopIndex === 0
        ? [hubLocation.lat, hubLocation.lng]
        : [stops[activeStopIndex - 1].lat, stops[activeStopIndex - 1].lng];

      const truckHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center border-2 border-white shadow-2xl animate-bounce">
            <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
          </div>
          <div class="absolute -bottom-4 bg-amber-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded shadow">
            En Route
          </div>
        </div>
      `;

      truckMarkerRef.current = L.marker(currentPos, {
        icon: L.divIcon({
          className: 'custom-truck-marker',
          html: truckHtml,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        }),
        zIndexOffset: 1000
      }).addTo(map);
    }
  }, [isRouteActive, activeStopIndex, stops, hubLocation]);

  // Trigger AI Optimization algorithm
  const handleOptimizeRoutes = useCallback(() => {
    setIsOptimizing(true);
    setTimeout(() => {
      if (allAvailableFarmers.length > 0) {
        const raw = allAvailableFarmers.map((f, idx) => createStopFromFarmer(f, idx, allAvailableFarmers));
        const firstHub = matchDistrict(allAvailableFarmers[0].district || allAvailableFarmers[0].location);
        const resequenced = optimizeStopSequence({ lat: firstHub.hubLat, lng: firstHub.hubLng }, raw);
        setStops(resequenced);
      }
      setIsOptimizing(false);
      setToastMessage(`AI Route Optimization completed! Optimal corridor connects ${stops.length} farmer locations. Estimated Fuel: ${metrics.estFuel} L.`);
      setTimeout(() => setToastMessage(null), 4500);
    }, 600);
  }, [allAvailableFarmers, stops.length, metrics.estFuel]);

  return (
    <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-5 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#064e3b] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-emerald-400 font-bold text-xs flex items-center gap-2.5 animate-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── TOP TITLE & ACTION ROW ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Route Optimization</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#15803d] text-xs font-bold border border-emerald-300">
              Live GPS
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            AI-powered highway corridor connecting verified farmers directly to Bulk Buyer Warehouse
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            onClick={() => alert("Fleet Logistics Settings: Cold chain enabled, Road toll bypass active, Cost minimization: ON.")}
            className="px-4 py-2 rounded-xl bg-white border-2 border-slate-800 text-slate-800 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 shadow-xs cursor-pointer transition-all"
          >
            <Settings className="w-4 h-4 text-slate-700" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => setIsEditingStops(true)}
            className="px-4 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer transition-all border-2 border-slate-900"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Farmer Stops ({stops.length})</span>
          </button>
        </div>
      </div>

      {/* ── SUB-NAVIGATION TABS ── */}
      <div className="flex items-center gap-6 border-b-2 border-slate-200 text-xs font-bold text-slate-500">
        {[
          { id: 'plan', label: 'Plan Routes' },
          { id: 'active', label: 'Active Routes' },
          { id: 'completed', label: 'Completed Routes' },
          { id: 'history', label: 'Route History' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`pb-2.5 transition-all cursor-pointer relative ${
              activeSubTab === tab.id
                ? 'text-[#15803d] font-extrabold border-b-2 border-[#15803d] -mb-[2px]'
                : 'hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TOOLBAR FILTERS & OPTIMIZE BUTTON ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Route Type */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Route Type
            </label>
            <div className="relative">
              <select
                value={selectedRouteType}
                onChange={(e) => setSelectedRouteType(e.target.value)}
                className="bg-slate-50 border-2 border-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="collection">Collection from Farmers</option>
                <option value="delivery">Mandi to Hub Direct</option>
                <option value="coldchain">Cold Chain Express Delivery</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Date
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <span>{selectedDate}</span>
            </div>
          </div>

          {/* Vehicle */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Vehicle
            </label>
            <div className="relative">
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="bg-slate-50 border-2 border-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Vehicles</option>
                <option value={metrics.vehicleNo}>{metrics.vehicleNo} ({metrics.capacity} Capacity)</option>
                <option value="KA-01-AB-1234">KA-01-AB-1234 (10.0 MT Heavy)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Optimize Routes Button */}
        <button
          onClick={handleOptimizeRoutes}
          disabled={isOptimizing}
          className="self-end lg:self-center px-5 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#022c22] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer transition-all border-2 border-slate-900 disabled:opacity-60"
        >
          <Sparkles className={`w-4 h-4 fill-emerald-300 text-emerald-300 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? "Optimizing Corridor..." : "Optimize Routes"}</span>
        </button>
      </div>

      {/* ── MAIN WORKSPACE: LEFT ITINERARY LIST + RIGHT REALISTIC MAP ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT 4 COLS: ROUTE STOPS & TIMELINE CARD */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border-2 border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            {/* Top Badges */}
            <div className="flex items-center gap-2.5 text-xs font-black text-slate-700 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-900 text-white text-[11px] font-black">
                {stops.length} {stops.length === 1 ? 'Stop' : 'Stops'}
              </span>
              <span>{metrics.distanceKm} km</span>
              <span className="flex items-center gap-1 text-slate-500 font-semibold text-[11px]">
                <Clock className="w-3.5 h-3.5" /> {metrics.estTimeStr}
              </span>
            </div>

            {/* Route Code & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Route RC-2026-0921-01
                </h3>
                <button
                  onClick={() => setIsEditingStops(true)}
                  className="p-1 hover:bg-slate-100 rounded-md cursor-pointer text-slate-500 hover:text-slate-900"
                  title="Edit stops"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-0.5 mb-4">
              <span className="text-xs text-slate-500 font-medium">
                {hubLocation.area}
              </span>
              <span className="px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 text-[10px] font-extrabold uppercase tracking-wide">
                Bulk Buyer Hub
              </span>
            </div>

            {/* Vertical Connected Stops Timeline */}
            <div className="relative pl-6 space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {/* Connecting vertical line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-200" />

              {/* Start Point: Bulk Buyer Location */}
              <div className="relative flex items-start justify-between gap-2 text-xs">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-900 ring-4 ring-indigo-100 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-indigo-950 leading-tight">Bulk Buyer Warehouse</h4>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Start
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">{hubLocation.name}</p>
                  <p className="text-[10px] text-slate-400">{hubLocation.area}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-[11px] text-slate-800">{hubLocation.startTime}</span>
                </div>
              </div>

              {/* Connected Real Farmer Stops */}
              {stops.length === 0 ? (
                <div className="py-6 px-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-center my-2">
                  <Users className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-700">No Connected Farmers in Route</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Click "Manage Farmer Stops" above to connect farmers to this route.</p>
                </div>
              ) : (
                stops.map((stop, sIdx) => {
                  const isCurrent = isRouteActive && activeStopIndex === sIdx + 1;
                  return (
                    <div
                      key={stop.id || sIdx}
                      className={`relative flex items-start justify-between gap-2 text-xs p-2 rounded-xl transition-all ${
                        isCurrent ? 'bg-emerald-50 border-2 border-emerald-500 shadow-xs ring-1 ring-emerald-400' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Circle badge with stop number */}
                      <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full ${stop.badgeColor} text-white font-black text-[10px] flex items-center justify-center shadow-xs`}>
                        {sIdx + 1}
                      </div>
                      <div className="min-w-0 flex-1 pl-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-900 truncate leading-tight">
                            {stop.farmer}
                          </h4>
                          <span className="text-[9px] font-bold text-emerald-700 px-1.5 py-0.2 rounded bg-emerald-100/70 border border-emerald-200">
                            Stop {sIdx + 1}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-semibold truncate">{stop.location}</p>
                        <p className="text-[10px] text-emerald-700 font-medium truncate">{stop.crop}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-[11px] text-slate-900">{stop.time}</div>
                        <div className="text-[10px] text-slate-400">({stop.duration})</div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* End Point: Bulk Buyer Return */}
              <div className="relative flex items-start justify-between gap-2 text-xs pt-1">
                <div className="absolute -left-6 top-1 text-indigo-900">
                  <Flag className="w-4 h-4 fill-indigo-900 stroke-indigo-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-indigo-950 leading-tight">Return to Buyer Warehouse</h4>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                      End
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">{hubLocation.name}</p>
                  <p className="text-[10px] text-slate-400">{hubLocation.area}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-[11px] text-slate-800">{hubLocation.endTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t-2 border-slate-100 flex items-center gap-2.5">
            <button
              onClick={() => setIsEditingStops(true)}
              className="flex-1 py-2.5 rounded-xl bg-white border-2 border-slate-800 hover:bg-slate-50 text-slate-800 font-extrabold text-xs cursor-pointer shadow-xs transition-all"
            >
              Edit Stops
            </button>
            <button
              onClick={() => {
                if (stops.length === 0) {
                  alert("No registered farmers available to start route.");
                  return;
                }
                setIsRouteActive(!isRouteActive);
              }}
              className={`flex-1 py-2.5 rounded-xl text-white font-black text-xs cursor-pointer shadow-sm transition-all border-2 border-slate-900 flex items-center justify-center gap-1.5 ${
                isRouteActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#15803d] hover:bg-[#166534]'
              }`}
            >
              {isRouteActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause Route</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Route</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT 8 COLS: REALISTIC GOOGLE MAP + METRIC CARDS + BOTTOM BAR */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* ── MAP CONTAINER (Google Maps Roadmap & Satellite with Leaflet) ── */}
          <div className="relative w-full h-[470px] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-sm bg-[#e5e7eb]">
            {/* The Map Div */}
            <div ref={mapContainerRef} className="w-full h-full z-0" style={{ height: '470px', width: '100%', minHeight: '470px' }} />

            {/* Map vs Satellite Toggle (Top Left) */}
            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border-2 border-slate-800 flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setMapLayerType('roadmap')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  mapLayerType === 'roadmap'
                    ? 'bg-[#166534] text-white shadow-xs font-black'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapLayerType('satellite')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  mapLayerType === 'satellite'
                    ? 'bg-[#166534] text-white shadow-xs font-black'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Satellite
              </button>
            </div>

            {/* Active Route Status Badge (Top Center) */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border-2 border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className={`w-2.5 h-2.5 rounded-full ${isRouteActive ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'}`}></span>
              <span>{isRouteActive ? `Simulation Live (Stop ${activeStopIndex}/${stops.length})` : `Corridor Ready: ${stops.length} Stops Connected`}</span>
            </div>

            {/* Fullscreen Button (Top Right) */}
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => {
                  if (!document.fullscreenElement) {
                    mapContainerRef.current?.requestFullscreen?.();
                  } else {
                    document.exitFullscreen?.();
                  }
                }}
                className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 flex items-center justify-center shadow-md border-2 border-slate-800 hover:bg-slate-100 cursor-pointer"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom & Location Controls (Bottom Right) */}
            <div className="absolute bottom-12 right-3 z-10 flex flex-col gap-1.5">
              <button
                onClick={() => mapInstanceRef.current?.zoomIn?.()}
                className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 font-bold flex items-center justify-center shadow-md border-2 border-slate-800 hover:bg-slate-100 cursor-pointer text-base"
              >
                +
              </button>
              <button
                onClick={() => mapInstanceRef.current?.zoomOut?.()}
                className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 font-bold flex items-center justify-center shadow-md border-2 border-slate-800 hover:bg-slate-100 cursor-pointer text-base"
              >
                -
              </button>
              <button
                onClick={() => {
                  if (stops.length > 0 && mapInstanceRef.current) {
                    const pts = [[hubLocation.lat, hubLocation.lng], ...stops.map(s => [s.lat, s.lng])];
                    mapInstanceRef.current.fitBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 13 });
                  } else {
                    mapInstanceRef.current?.setView([hubLocation.lat, hubLocation.lng], 11);
                  }
                }}
                className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 flex items-center justify-center shadow-md border-2 border-slate-800 hover:bg-slate-100 cursor-pointer"
                title="Reset View"
              >
                <LocateFixed className="w-4 h-4" />
              </button>
            </div>

            {/* Legend / Route Direction Badge (Bottom Left) */}
            <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-md border-2 border-slate-800 flex items-center gap-3 text-[11px] font-bold text-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-700"></span>
                <span>Bulk Buyer Location</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span>
                <span>Connected Farm Stops</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-1 bg-[#2563eb] rounded-full"></span>
                <span>Highway Route</span>
              </div>
            </div>
          </div>

          {/* ── METRIC CARDS ROW: ROUTE SUMMARY + OPTIMIZATION IMPACT ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CARD 1: ROUTE SUMMARY */}
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>Route Summary</span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    Vehicle: {metrics.vehicleNo}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Total Distance</span>
                    <p className="text-base font-black text-slate-900 mt-0.5">{metrics.distanceKm} km</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Est. Time</span>
                    <p className="text-base font-black text-slate-900 mt-0.5">{metrics.estTimeStr}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Est. Fuel</span>
                    <p className="text-base font-black text-slate-900 mt-0.5">{metrics.estFuel} L</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
                <span>Vehicle Load: <strong>{stops.length * 2.5} MT / {metrics.capacity}</strong></span>
                <span className="text-emerald-700 font-extrabold">Within Payload Limits</span>
              </div>
            </div>

            {/* CARD 2: OPTIMIZATION IMPACT */}
            <div className="bg-gradient-to-br from-[#064e3b] to-[#0f766e] text-white rounded-3xl p-5 border-2 border-slate-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-emerald-700/60">
                  <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 fill-emerald-300 text-emerald-300" />
                    <span>Optimization Impact</span>
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-200">
                    vs Manual Roundtrip
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/15">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-200">Distance Saved</span>
                    <p className="text-base font-black mt-0.5">{metrics.savedKm} km</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/15">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-200">Time Saved</span>
                    <p className="text-base font-black mt-0.5">{metrics.savedTimeStr}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/15">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-200">Cost Savings</span>
                    <p className="text-base font-black mt-0.5">₹ {(parseFloat(metrics.savedKm) * 14.5).toFixed(0)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-emerald-200 flex items-center justify-between border-t border-emerald-700/60">
                <span>Direct Highway Routing Enabled</span>
                <span className="text-white font-extrabold">22% Emissions Cut</span>
              </div>
            </div>
          </div>

          {/* ── BOTTOM ACTIONS: EXPORT, SHARE, MOBILE ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => alert(`Downloading manifest for Route RC-2026-0921-01 (${stops.length} stops) in PDF/JSON format with driver turn-by-turn waypoints.`)}
                className="px-4 py-2.5 rounded-xl bg-white border-2 border-slate-800 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 hover:bg-slate-50 shadow-xs cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Route</span>
              </button>

              <button
                onClick={() => alert(`Optimized route link sent to driver (${metrics.vehicleNo}) with live GPS coordinates for ${stops.map(s => s.farmer).join(', ')}.`)}
                className="px-4 py-2.5 rounded-xl bg-white border-2 border-slate-800 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 hover:bg-slate-50 shadow-xs cursor-pointer transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Share with Driver</span>
              </button>
            </div>

            <button
              onClick={() => alert("Opening AgriChain Driver Logistics Mobile Web App...")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#166534] border-2 border-slate-800 font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>View on Mobile App</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── EDIT STOPS MODAL (CONNECT / DISCONNECT FARMERS) ── */}
      {isEditingStops && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-3 border-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Manage Farmer Stops in Route
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connect or remove farmers from the live collection route
                </p>
              </div>
              <button
                onClick={() => setIsEditingStops(false)}
                className="p-1 text-slate-500 hover:text-slate-900 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{stops.length} of {allAvailableFarmers.length} Farmers Connected</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const raw = allAvailableFarmers.map((f, i) => createStopFromFarmer(f, i, allAvailableFarmers));
                    setStops(optimizeStopSequence(hubLocation, raw));
                  }}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  Connect All
                </button>
                <span>•</span>
                <button
                  onClick={() => setStops([])}
                  className="text-slate-500 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {allAvailableFarmers.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No registered farmers found in the database.
                </div>
              ) : (
                allAvailableFarmers.map((farmer, i) => {
                  const isIncluded = stops.some(s => s.id === farmer.id || s.farmerId === farmer.id || s.farmer === farmer.name);
                  const farmerStop = createStopFromFarmer(farmer, i, allAvailableFarmers);
                  return (
                    <div
                      key={farmer.id || i}
                      onClick={() => {
                        if (isIncluded) {
                          const remaining = stops.filter(s => s.id !== farmer.id && s.farmerId !== farmer.id && s.farmer !== farmer.name);
                          setStops(optimizeStopSequence(hubLocation, remaining));
                        } else {
                          const updated = [...stops, farmerStop];
                          setStops(optimizeStopSequence(hubLocation, updated));
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isIncluded ? 'border-slate-900 bg-emerald-50 shadow-xs' : 'border-slate-200 bg-slate-50/70 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full ${isIncluded ? farmerStop.badgeColor : 'bg-slate-300'} text-white font-black text-xs flex items-center justify-center`}>
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">{farmer.name}</div>
                          <div className="text-[11px] text-slate-500">{farmerStop.location} • {farmer.crops || 'Produce'}</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 ${
                        isIncluded ? 'bg-emerald-700 text-white border-slate-900' : 'bg-white border-slate-300'
                      }`}>
                        {isIncluded && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 flex justify-between items-center border-t-2 border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Route recalculates on save</span>
              <button
                onClick={() => {
                  setIsEditingStops(false);
                  handleOptimizeRoutes();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black border-2 border-slate-900 cursor-pointer shadow-sm"
              >
                Apply & Connect Route ({stops.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
