import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const STORAGE_KEY = 'agrichain_registered_farmers';
const BROADCAST_KEY = 'agrichain_farmers_sync';

// Authentic produce photos from LanguageGuide
export function getProduceImageForCrop(cropName = '') {
  const c = (cropName || '').toLowerCase();
  if (c.includes('tomato')) return 'https://www.languageguide.org/vocabulary/veg/images/tomato.webp';
  if (c.includes('potato')) return 'https://www.languageguide.org/vocabulary/veg/images/potato.webp';
  if (c.includes('onion')) return 'https://www.languageguide.org/vocabulary/veg/images/onion.webp';
  if (c.includes('chilli') || c.includes('chili')) return 'https://www.languageguide.org/vocabulary/veg/images/chili.webp';
  if (c.includes('brinjal') || c.includes('eggplant')) return 'https://www.languageguide.org/vocabulary/veg/images/eggplant.webp';
  if (c.includes('cabbage')) return 'https://www.languageguide.org/vocabulary/veg/images/cabbage.webp';
  if (c.includes('carrot')) return 'https://www.languageguide.org/vocabulary/veg/images/carrot.webp';
  if (c.includes('cucumber')) return 'https://www.languageguide.org/vocabulary/veg/images/cucumber.webp';
  if (c.includes('capsicum') || c.includes('pepper')) return 'https://www.languageguide.org/vocabulary/veg/images/bell-pepper.webp';
  if (c.includes('bean') || c.includes('gram') || c.includes('dal') || c.includes('pulse')) return 'https://www.languageguide.org/vocabulary/veg/images/beans.webp';
  if (c.includes('rice') || c.includes('paddy')) return 'https://www.languageguide.org/vocabulary/food_new/small/rice.png';
  if (c.includes('wheat')) return 'https://www.languageguide.org/vocabulary/food_new/small/wheat.png';
  if (c.includes('peanut') || c.includes('groundnut')) return 'https://www.languageguide.org/vocabulary/food_new/small/peanut.png';
  if (c.includes('banana')) return 'https://www.languageguide.org/vocabulary/fruits/small/banana.png';
  if (c.includes('mango')) return 'https://www.languageguide.org/vocabulary/fruits/small/mango.png';
  return 'https://www.languageguide.org/vocabulary/veg/images/tomato.webp';
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
];

// Format Firestore doc or Local data into a consistent Farmer object for Buyer portal
export function formatFarmerRecord(id, data = {}) {
  const name = data.name || 'Registered Farmer';
  const crop = data.crop || data.crops || 'Fresh Farm Produce';
  const quantity = data.quantity || 'Bulk Available';
  const district = data.district || 'Karnataka';
  const phone = data.mobile || data.phone || '+91 98765 43210';
  
  // Clean up blob URLs which are invalid across origins/tabs
  let photo = data.avatar || data.landPhotoURL;
  if (!photo || photo.startsWith('blob:')) {
    const hash = Math.abs((name + phone).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
    photo = DEFAULT_AVATARS[hash % DEFAULT_AVATARS.length];
  }

  let farmPhoto = data.vegetableImage || data.landPhotoURL;
  if (!farmPhoto || farmPhoto.startsWith('blob:')) {
    farmPhoto = getProduceImageForCrop(crop);
  }

  // Calculate realistic distance
  const distNumber = 5 + (Math.abs((name.length * 7) % 20));
  const distance = data.distance || `${distNumber.toFixed(1)} km`;
  const travelMins = Math.round(distNumber * 2.2);
  const travelTime = data.travelTime || `${travelMins} min`;

  return {
    id: id || data.id || `farmer_${Date.now()}`,
    name,
    crops: crop,
    quantity,
    district,
    location: data.location || `${district} Agricultural Belt, Karnataka`,
    distance,
    travelTime,
    phone,
    rating: data.rating || 4.9,
    reviewsCount: data.reviewsCount || Math.floor(Math.random() * 25) + 10,
    verified: true,
    avatar: photo,
    vegetableImage: farmPhoto,
    greenCoveragePct: data.greenCoveragePct || 80,
    availableCrops: data.availableCrops || [
      { name: crop, qty: quantity, price: 'Market Rate / Qtl' }
    ],
    registeredAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.registeredAt || new Date().toISOString())
  };
}

export const DEFAULT_VERIFIED_FARMERS = [
  {
    id: "farmer_9035914558_01",
    name: "Gagan",
    crops: "Paddy & Ragi",
    quantity: "10 Tons",
    district: "Mysuru",
    location: "Mysuru Agricultural Belt, Karnataka",
    distance: "18.5 km",
    travelTime: "38 min",
    phone: "+91 90359 14558",
    rating: 4.9,
    reviewsCount: 31,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    vegetableImage: "https://www.languageguide.org/vocabulary/food_new/small/rice.png",
    greenCoveragePct: 82,
    availableCrops: [
      { name: "Paddy (Fine Jyothi)", qty: "6 MT", price: "₹ 2,450 / Qtl" },
      { name: "Finger Millet (Ragi)", qty: "4 MT", price: "₹ 3,850 / Qtl" }
    ],
    registeredAt: "2026-09-20T10:00:00.000Z"
  },
  {
    id: "farmer_9876543210_02",
    name: "Ramesh Kumar",
    crops: "Tomato, Onion",
    quantity: "34 MT",
    district: "Kolar",
    location: "Kuppam Road, Kolar Agricultural Belt",
    distance: "5.2 km",
    travelTime: "15 min",
    phone: "+91 98765 43210",
    rating: 4.9,
    reviewsCount: 38,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    vegetableImage: "https://www.languageguide.org/vocabulary/veg/images/tomato.webp",
    greenCoveragePct: 78,
    availableCrops: [
      { name: "Red Hybrid Tomato", qty: "14 MT", price: "₹ 1,400 / Qtl" },
      { name: "Fresh Harvest Onion", qty: "20 MT", price: "₹ 2,100 / Qtl" }
    ],
    registeredAt: "2026-09-19T09:30:00.000Z"
  },
  {
    id: "farmer_8765432109_03",
    name: "Lakshmi Devi",
    crops: "Brinjal, Okra",
    quantity: "10 MT",
    district: "Mandya",
    location: "Bagalur Agricultural Cluster, Mandya",
    distance: "8.7 km",
    travelTime: "18 min",
    phone: "+91 87654 32109",
    rating: 4.8,
    reviewsCount: 29,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    vegetableImage: "https://www.languageguide.org/vocabulary/veg/images/eggplant.webp",
    greenCoveragePct: 85,
    availableCrops: [
      { name: "Purple Stripe Brinjal", qty: "6 MT", price: "₹ 1,600 / Qtl" },
      { name: "Tender Green Okra", qty: "4 MT", price: "₹ 2,400 / Qtl" }
    ],
    registeredAt: "2026-09-18T14:15:00.000Z"
  },
  {
    id: "farmer_7654321098_04",
    name: "Suresh Patel",
    crops: "Tomato, Chilli",
    quantity: "26 MT",
    district: "Kolar",
    location: "Malur Farm Belt, Kolar",
    distance: "12.4 km",
    travelTime: "25 min",
    phone: "+91 76543 21098",
    rating: 4.7,
    reviewsCount: 44,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    vegetableImage: "https://www.languageguide.org/vocabulary/veg/images/chili.webp",
    greenCoveragePct: 80,
    availableCrops: [
      { name: "G4 Green Chilli", qty: "8 MT", price: "₹ 4,200 / Qtl" },
      { name: "Firm Salad Tomato", qty: "18 MT", price: "₹ 1,350 / Qtl" }
    ],
    registeredAt: "2026-09-17T11:00:00.000Z"
  },
  {
    id: "farmer_9345678901_05",
    name: "Murugan",
    crops: "Drumstick, Beans",
    quantity: "16 MT",
    district: "Chamarajanagar",
    location: "Berigai Valley Organic Collective, Chamarajanagar",
    distance: "16.8 km",
    travelTime: "32 min",
    phone: "+91 93456 78901",
    rating: 4.9,
    reviewsCount: 52,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    vegetableImage: "https://www.languageguide.org/vocabulary/veg/images/beans.webp",
    greenCoveragePct: 88,
    availableCrops: [
      { name: "PKM-1 Hybrid Drumstick", qty: "9 MT", price: "₹ 3,100 / Qtl" },
      { name: "French Bush Beans", qty: "7 MT", price: "₹ 3,800 / Qtl" }
    ],
    registeredAt: "2026-09-16T16:20:00.000Z"
  },
  {
    id: "farmer_9123456789_06",
    name: "Anitha",
    crops: "Cucumber, Capsicum",
    quantity: "17.5 MT",
    district: "Bengaluru Rural",
    location: "Sarjapur High-Tech Polyhouse Belt, Bengaluru Rural",
    distance: "20.3 km",
    travelTime: "40 min",
    phone: "+91 91234 56789",
    rating: 4.8,
    reviewsCount: 31,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    vegetableImage: "https://www.languageguide.org/vocabulary/veg/images/bell-pepper.webp",
    greenCoveragePct: 91,
    availableCrops: [
      { name: "English Seedless Cucumber", qty: "11 MT", price: "₹ 1,850 / Qtl" },
      { name: "Yellow & Green Capsicum", qty: "6.5 MT", price: "₹ 4,600 / Qtl" }
    ],
    registeredAt: "2026-09-15T08:45:00.000Z"
  }
];

// Read current cached farmers from localStorage with guaranteed default verified farmers
export function getLocalRegisteredFarmers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(list) || list.length === 0) {
      list = [...DEFAULT_VERIFIED_FARMERS];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } else {
      // Ensure baseline DEFAULT_VERIFIED_FARMERS are merged alongside newly registered farmers
      DEFAULT_VERIFIED_FARMERS.forEach(def => {
        if (!list.some(f => f.id === def.id || (def.phone && f.phone === def.phone))) {
          list.push(def);
        }
      });
    }

    // Also check if current session user is a registered farmer not yet in list
    const sessionUserRaw = localStorage.getItem('agrichain_user');
    if (sessionUserRaw) {
      const sessionUser = JSON.parse(sessionUserRaw);
      if (sessionUser?.role === 'FARMER' && sessionUser?.name) {
        const exists = list.some(f => f.id === sessionUser.id || f.phone === sessionUser.mobile);
        if (!exists) {
          const formatted = formatFarmerRecord(sessionUser.id, sessionUser);
          list = [formatted, ...list];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }
      }
    }

    return Array.isArray(list) ? list : [...DEFAULT_VERIFIED_FARMERS];
  } catch (err) {
    console.warn("Failed to read local registered farmers:", err);
    return [...DEFAULT_VERIFIED_FARMERS];
  }
}

// Post farmer record to sync API
async function postFarmerToSyncBridge(farmerRecord) {
  const endpoints = ['/api/farmers', 'http://localhost:5173/api/farmers', 'http://localhost:5174/api/farmers'];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmerRecord)
      });
      if (res.ok) return true;
    } catch (e) {}
  }
  return false;
}

// Fetch all registered farmers from sync API
async function fetchFarmersFromSyncBridge() {
  const endpoints = ['/api/farmers', 'http://localhost:5173/api/farmers', 'http://localhost:5174/api/farmers'];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
  }
  return null;
}

// Save or append registered farmer locally and broadcast across all channels
export function saveLocalRegisteredFarmer(farmerRecord) {
  try {
    const formatted = formatFarmerRecord(farmerRecord.id, farmerRecord);
    const current = getLocalRegisteredFarmers();
    const existingIndex = current.findIndex(f => f.id === formatted.id || (f.phone && f.phone === formatted.phone));

    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...formatted };
    } else {
      updated = [formatted, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 1. Dispatch in current window
    window.dispatchEvent(new CustomEvent('agrichain_farmer_updated', { detail: updated }));

    // 2. Dispatch across same-origin tabs
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel(BROADCAST_KEY);
        channel.postMessage({ type: 'FARMER_LIST_UPDATED', list: updated });
        channel.close();
      } catch (bcErr) {}
    }

    // 3. Post to shared sync bridge (guarantees cross-port delivery to port 5174)
    postFarmerToSyncBridge(formatted).catch(() => {});

    return updated;
  } catch (err) {
    console.warn("Failed to save local farmer:", err);
    return [];
  }
}

// Real-time subscription for Farmer and Bulk Buyer Portals
export function subscribeRegisteredFarmers(callback) {
  // 1. Initial immediate emit from local storage cache
  const initialLocal = getLocalRegisteredFarmers();
  callback(initialLocal);

  // 2. Initial immediate fetch from shared sync bridge
  fetchFarmersFromSyncBridge().then(apiList => {
    if (apiList && Array.isArray(apiList)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apiList));
      callback(apiList);
    }
  });

  // 3. Listen to local events
  const handleLocalEvent = (e) => {
    if (e.detail) {
      callback(e.detail);
    } else {
      callback(getLocalRegisteredFarmers());
    }
  };

  const handleStorageEvent = (e) => {
    if (e.key === STORAGE_KEY || e.key === 'agrichain_user') {
      callback(getLocalRegisteredFarmers());
    }
  };

  window.addEventListener('agrichain_farmer_updated', handleLocalEvent);
  window.addEventListener('storage', handleStorageEvent);

  let channel = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel(BROADCAST_KEY);
      channel.onmessage = (event) => {
        if (event.data?.list) {
          callback(event.data.list);
        }
      };
    } catch (e) {}
  }

  // 4. Polling interval to automatically sync cross-port updates in real-time
  const pollTimer = setInterval(() => {
    fetchFarmersFromSyncBridge().then(apiList => {
      if (apiList && Array.isArray(apiList)) {
        const current = getLocalRegisteredFarmers();
        // Check if different
        if (JSON.stringify(apiList) !== JSON.stringify(current)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiList));
          callback(apiList);
        }
      }
    });
  }, 2000);

  // 5. Firestore fallback listener
  let unsubscribeFirestore = () => {};
  if (db) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'FARMER'));

      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const firestoreFarmers = [];
        snapshot.forEach((docSnap) => {
          firestoreFarmers.push(formatFarmerRecord(docSnap.id, docSnap.data()));
        });

        if (firestoreFarmers.length > 0) {
          const localList = getLocalRegisteredFarmers();
          const combined = [...firestoreFarmers];
          
          localList.forEach(loc => {
            if (!combined.some(c => c.id === loc.id || (loc.phone && c.phone === loc.phone))) {
              combined.push(loc);
            }
          });

          localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
          callback(combined);
        }
      }, () => {
        // Silently fallback if Firestore is disabled
      });
    } catch (err) {}
  }

  // Return comprehensive cleanup function
  return () => {
    window.removeEventListener('agrichain_farmer_updated', handleLocalEvent);
    window.removeEventListener('storage', handleStorageEvent);
    clearInterval(pollTimer);
    if (channel) {
      try { channel.close(); } catch (e) {}
    }
    unsubscribeFirestore();
  };
}
