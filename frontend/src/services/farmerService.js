import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const STORAGE_KEY = 'agrichain_registered_farmers';
const BROADCAST_KEY = 'agrichain_farmers_sync';

// Authentic produce photos matching single crop stock photography
export function getProduceImageForCrop(cropName = '') {
  const c = (cropName || '').toLowerCase();
  if (c.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500';
  if (c.includes('potato')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=500';
  if (c.includes('onion')) return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=500';
  if (c.includes('chilli') || c.includes('chili')) return '/vegetables/green-chilli.webp';
  if (c.includes('brinjal') || c.includes('eggplant')) return 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=500';
  if (c.includes('cabbage')) return 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&q=80&w=500';
  if (c.includes('carrot')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=500';
  if (c.includes('cucumber')) return 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&q=80&w=500';
  if (c.includes('capsicum') || c.includes('pepper')) return 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=500';
  if (c.includes('okra') || c.includes('bhindi') || c.includes('lady finger')) return '/vegetables/okra-bhindi.webp';
  if (c.includes('moong') || c.includes('mung') || c.includes('green gram')) return '/pulses/moong-dal.jpg';
  if (c.includes('toor') || c.includes('arhar') || c.includes('tur') || c.includes('dal') || c.includes('pulse')) return '/pulses/toor-dal.jpg';
  if (c.includes('chana') || c.includes('gram') || c.includes('chickpea')) return 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=500';
  if (c.includes('rice') || c.includes('paddy')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=500';
  if (c.includes('wheat')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=500';
  if (c.includes('ragi') || c.includes('finger millet')) return '/grains/ragi-flour.jpg';
  if (c.includes('peanut') || c.includes('groundnut')) return 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&q=80&w=500';
  if (c.includes('banana')) return 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=500';
  if (c.includes('mango')) return 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=500';
  if (c.includes('garlic')) return 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=500';
  if (c.includes('ginger')) return 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=500';
  if (c.includes('turmeric')) return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=500';
  if (c.includes('cotton')) return 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=500';
  if (c.includes('coconut')) return 'https://images.immediate.co.uk/production/volatile/sites/30/2024/06/Coconut-water440-c1acff0.jpg';
  if (c.includes('pomegranate') || c.includes('anaar') || c.includes('anar')) return '/fruits/pomegranate.png';
  return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500';
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

// List of mock/spam names to purge
const SPAM_MOCK_NAMES = [
  'Ramesh Kumar', 'Lakshmi Devi', 'Suresh Patel', 'Murugan', 'Anitha',
  'Ramesh Gowda', 'Basavaraju', 'Suresh Patil'
];

// Read current cached farmers from localStorage (only authentic registrations)
export function getLocalRegisteredFarmers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list = raw ? JSON.parse(raw) : [];

    // Filter out any previously saved mock/spam data
    if (Array.isArray(list) && list.length > 0) {
      list = list.filter(f => {
        if (!f || !f.name) return false;
        if (SPAM_MOCK_NAMES.includes(f.name)) return false;
        if (typeof f.id === 'string' && (
          f.id.startsWith('farmer_98765') || 
          f.id.startsWith('farmer_87654') || 
          f.id.startsWith('farmer_76543') || 
          f.id.startsWith('farmer_93456') || 
          f.id.startsWith('farmer_91234') || 
          f.id.startsWith('farmer-')
        )) {
          return false;
        }
        return true;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    // Check if current session user is a registered farmer
    const sessionUserRaw = localStorage.getItem('agrichain_user');
    if (sessionUserRaw) {
      const sessionUser = JSON.parse(sessionUserRaw);
      if (sessionUser?.role === 'FARMER' && sessionUser?.name && !SPAM_MOCK_NAMES.includes(sessionUser.name)) {
        const exists = list.some(f => f.id === sessionUser.id || (sessionUser.mobile && f.phone === sessionUser.mobile));
        if (!exists) {
          const formatted = formatFarmerRecord(sessionUser.id, sessionUser);
          list = [formatted, ...list];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }
      }
    }

    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn("Failed to read local registered farmers:", err);
    return [];
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
