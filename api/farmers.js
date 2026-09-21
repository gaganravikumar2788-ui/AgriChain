// Vercel Serverless Function: /api/farmers
// Provides cross-device synchronization for registered farmers on Vercel deployment

const DEFAULT_VERIFIED_FARMERS = [
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

// In-memory registry for serverless instances
let registeredFarmers = [...DEFAULT_VERIFIED_FARMERS];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(registeredFarmers);
  }

  if (req.method === 'POST') {
    try {
      const record = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (record && (record.name || record.phone)) {
        const existingIdx = registeredFarmers.findIndex(
          f => f.id === record.id || (record.phone && f.phone === record.phone)
        );
        if (existingIdx >= 0) {
          registeredFarmers[existingIdx] = { ...registeredFarmers[existingIdx], ...record };
        } else {
          registeredFarmers.unshift(record);
        }
      }
      return res.status(200).json({ success: true, count: registeredFarmers.length, list: registeredFarmers });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
