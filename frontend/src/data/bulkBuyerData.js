export const DEFAULT_BUYER_PROFILE = {
  name: "Ravi Traders",
  role: "Bulk Buyer",
  gstin: "29AABCR1234F1Z8",
  city: "Bengaluru / Hosur Agro Corridor",
  verified: true,
  rating: 4.9,
  // Farmer photo as profile
  avatar: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=400",
};

export const METRICS = [
  {
    id: "orders",
    label: "Total Orders",
    value: "0",
    period: "This Month",
    change: "0%",
    changeType: "neutral",
    bgIcon: "bg-emerald-100 text-emerald-700",
    iconType: "landmark",
  },
  {
    id: "purchased",
    label: "Total Purchased",
    value: "0 MT",
    period: "This Month",
    change: "0%",
    changeType: "neutral",
    bgIcon: "bg-amber-100 text-amber-600",
    iconType: "truck",
  },
  {
    id: "spent",
    label: "Total Spent",
    value: "₹ 0",
    period: "This Month",
    change: "0%",
    changeType: "neutral",
    bgIcon: "bg-sky-100 text-sky-600",
    iconType: "indianRupee",
  },
  {
    id: "farmers",
    label: "Active Farmers",
    value: "0",
    period: "Registered Farmers",
    change: "0",
    changeType: "neutral",
    bgIcon: "bg-purple-100 text-purple-600",
    iconType: "users",
  },
];

export const CATEGORIES = [
  {
    id: "cereals",
    name: "Cereals",
    subtext: "Rice, Wheat, Maize...",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Sona Masoori Rice", price: "₹ 3,450 / Qtl", available: "45 MT", grade: "Grade A", farmer: "Ramesh Kumar" },
      { name: "Sharbati Wheat", price: "₹ 2,850 / Qtl", available: "30 MT", grade: "Export Quality", farmer: "Suresh Patel" },
      { name: "Yellow Corn Maize", price: "₹ 2,100 / Qtl", available: "60 MT", grade: "Feed & Industrial", farmer: "Murugan" },
    ],
  },
  {
    id: "pulses",
    name: "Pulses",
    subtext: "Toor, Moong, Urad, Chana, Masoor...",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Desi Toor Dal (Pigeon Pea)", price: "₹ 8,900 / Qtl", available: "18 MT", grade: "Unpolished A+", farmer: "Lakshmi Devi", image: "/pulses/toor-dal.jpg" },
      { name: "Green Gram (Moong Dal)", price: "₹ 7,600 / Qtl", available: "12 MT", grade: "Grade A Premium", farmer: "Ramesh Kumar", image: "/pulses/moong-dal.jpg" },
      { name: "Black Matpe (Urad Dal)", price: "₹ 7,950 / Qtl", available: "15 MT", grade: "Machine Cleaned", farmer: "Suresh Patel", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=400" },
      { name: "Desi Chana (Bengal Gram)", price: "₹ 5,950 / Qtl", available: "24 MT", grade: "FAQ Export Grade", farmer: "Gagan Gowda", image: "/pulses/desi-brown-chana.jpg" },
      { name: "Red Lentil (Masoor Dal)", price: "₹ 6,420 / Qtl", available: "16 MT", grade: "Polished Bold", farmer: "Murugan", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=400" },
    ],
  },
  {
    id: "oilseeds",
    name: "Oilseeds",
    subtext: "Groundnut, Sesame...",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Bold Groundnut / Peanut", price: "₹ 6,300 / Qtl", available: "25 MT", grade: "Oil Yield 48%", farmer: "Anitha", image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&q=80&w=400" },
      { name: "Natural White Sesame", price: "₹ 11,500 / Qtl", available: "8 MT", grade: "99/1 Purity", farmer: "Murugan", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=400" },
      { name: "Mustard Seeds (Black)", price: "₹ 5,450 / Qtl", available: "20 MT", grade: "High Pungency", farmer: "Suresh Patel", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400" },
    ],
  },
  {
    id: "spices",
    name: "Spices",
    subtext: "Chilli, Turmeric, Pepper...",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Byadagi Red Chilli", price: "₹ 18,200 / Qtl", available: "10 MT", grade: "Deep Red, Low Heat", farmer: "Suresh Patel", image: "/vegetables/green-chilli.webp" },
      { name: "Salem Turmeric Fingers", price: "₹ 12,400 / Qtl", available: "14 MT", grade: "Curcumin 3.8%+", farmer: "Lakshmi Devi", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400" },
      { name: "Malabar Black Pepper", price: "₹ 52,000 / Qtl", available: "4 MT", grade: "TGSEB Extra Bold", farmer: "Murugan", image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=400" },
    ],
  },
  {
    id: "vegetables",
    name: "Vegetables",
    subtext: "Okra, Lauki, Karela, Tomato, Palak, Onion...",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Lady's Finger (Okra / Bhindi)", price: "₹ 3,200 / Qtl", available: "20 MT", grade: "Tender Green Grade A", farmer: "Gagan Gowda", image: "/vegetables/okra-bhindi.webp" },
      { name: "Bitter Gourd (Karela)", price: "₹ 2,850 / Qtl", available: "14 MT", grade: "Fresh Desi Green", farmer: "Suresh Patel", image: "/vegetables/bitter-gourd-karela.webp" },
      { name: "Bottle Gourd (Lauki / Sorekayi)", price: "₹ 1,500 / Qtl", available: "30 MT", grade: "Smooth Long Grade A", farmer: "Lakshmi Devi", image: "/vegetables/bottle-gourd-lauki.webp" },
      { name: "Spinach (Palak Leaves)", price: "₹ 1,950 / Qtl", available: "12 MT", grade: "Crisp Organic Farm", farmer: "Anitha", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400" },
      { name: "Ivy Gourd (Tindora / Dondakaya)", price: "₹ 3,700 / Qtl", available: "10 MT", grade: "Crunchy Grade A", farmer: "Murugan", image: "/vegetables/ivy-gourd-tindora.webp" },
      { name: "French String Beans (Barbati)", price: "₹ 4,150 / Qtl", available: "16 MT", grade: "Slender Bush Crisp", farmer: "Ramesh Kumar", image: "/vegetables/french-beans.webp" },
      { name: "Ash Gourd (Kumbalakai)", price: "₹ 1,380 / Qtl", available: "25 MT", grade: "Standard White", farmer: "Suresh Patel", image: "/vegetables/ash-gourd.webp" },
      { name: "Drumstick (Moringa / Nuggekayi)", price: "₹ 4,600 / Qtl", available: "15 MT", grade: "PKM-1 Long Fleshy", farmer: "Gagan Gowda", image: "/vegetables/drumstick.webp" },
      { name: "Nashik Red Onion", price: "₹ 2,150 / Qtl", available: "35 MT", grade: "Medium 45mm+", farmer: "Ramesh Kumar", image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=400" },
      { name: "Hybrid Farm Tomato", price: "₹ 1,400 / Qtl", available: "20 MT", grade: "Firm Ripe Boxed", farmer: "Ramesh Kumar", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400" },
      { name: "Jyoti Cold Storage Potato", price: "₹ 1,750 / Qtl", available: "50 MT", grade: "Sugar-free 50mm+", farmer: "Suresh Patel", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400" },
      { name: "Pumpkin (Kaddu / Bhopla)", price: "₹ 1,280 / Qtl", available: "22 MT", grade: "Golden Sweet", farmer: "Lakshmi Devi", image: "/vegetables/pumpkin-kaddu.webp" },
    ],
  },
  {
    id: "fruits",
    name: "Fruits",
    subtext: "Mango, Banana, Citrus...",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Alphonso / Badami Mango", price: "₹ 9,500 / Qtl", available: "15 MT", grade: "Naturally Ripened", farmer: "Anitha" },
      { name: "G9 Cavendish Banana", price: "₹ 1,650 / Qtl", available: "28 MT", grade: "Class 1 Export Hands", farmer: "Murugan" },
      { name: "Nagpur Sweet Orange (Mosambi)", price: "₹ 3,800 / Qtl", available: "18 MT", grade: "Juicy Grade A", farmer: "Lakshmi Devi" },
    ],
  },
];

export const NEARBY_FARMERS = [
  {
    id: "farmer-1",
    name: "Ramesh Kumar",
    crops: "Tomato, Onion",
    distance: "5.2 km",
    travelTime: "15 min",
    phone: "+91 98765 43210",
    rating: 4.9,
    reviewsCount: 38,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    vegetableImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300",
    location: "Kuppam Road, Hosur Border",
    verified: true,
    availableCrops: [
      { name: "Red Hybrid Tomato", qty: "14 MT", price: "₹ 1,400/Qtl" },
      { name: "Fresh Harvest Onion", qty: "20 MT", price: "₹ 2,100/Qtl" }
    ],
  },
  {
    id: "farmer-2",
    name: "Lakshmi Devi",
    crops: "Brinjal, Okra",
    distance: "8.7 km",
    travelTime: "18 min",
    phone: "+91 87654 32109",
    rating: 4.8,
    reviewsCount: 29,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    vegetableImage: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=300",
    location: "Bagalur Agricultural Cluster",
    verified: true,
    availableCrops: [
      { name: "Purple Stripe Brinjal", qty: "6 MT", price: "₹ 1,600/Qtl" },
      { name: "Tender Green Okra (Lady Finger)", qty: "4 MT", price: "₹ 2,400/Qtl" }
    ],
  },
  {
    id: "farmer-3",
    name: "Suresh Patel",
    crops: "Tomato, Chilli",
    distance: "12.4 km",
    travelTime: "25 min",
    phone: "+91 76543 21098",
    rating: 4.7,
    reviewsCount: 44,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    vegetableImage: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=300",
    location: "Malur Farm Belt, Kolar",
    verified: true,
    availableCrops: [
      { name: "G4 Green Chilli", qty: "8 MT", price: "₹ 4,200/Qtl" },
      { name: "Salad Tomato (Firm)", qty: "18 MT", price: "₹ 1,350/Qtl" }
    ],
  },
  {
    id: "farmer-4",
    name: "Murugan",
    crops: "Drumstick, Beans",
    distance: "16.8 km",
    travelTime: "32 min",
    phone: "+91 93456 78901",
    rating: 4.9,
    reviewsCount: 52,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    vegetableImage: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=300",
    location: "Berigai Valley Organic Collective",
    verified: true,
    availableCrops: [
      { name: "PKM-1 Hybrid Drumstick", qty: "9 MT", price: "₹ 3,100/Qtl" },
      { name: "French Bush Beans", qty: "7 MT", price: "₹ 3,800/Qtl" }
    ],
  },
  {
    id: "farmer-5",
    name: "Anitha",
    crops: "Cucumber, Capsicum",
    distance: "20.3 km",
    travelTime: "40 min",
    phone: "+91 91234 56789",
    rating: 4.8,
    reviewsCount: 31,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    vegetableImage: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=300",
    location: "Sarjapur-Bagalur High-tech Polyhouse",
    verified: true,
    availableCrops: [
      { name: "English Seedless Cucumber", qty: "11 MT", price: "₹ 1,850/Qtl" },
      { name: "Green & Yellow Capsicum", qty: "6.5 MT", price: "₹ 4,600/Qtl" }
    ],
  },
];

export const CROP_SEASON_DATA = [
  { crop: "Tomato (Hybrid)", season: "Rabi & Kharif", avgPrice: "₹ 1,400/Qtl", trend: "+8% this week", peakArrival: "September - November", state: "Karnataka / TN" },
  { crop: "Red Onion", season: "Late Kharif", avgPrice: "₹ 2,150/Qtl", trend: "-4% (Stable)", peakArrival: "October - December", state: "Maharashtra / Karnataka" },
  { crop: "Sona Masoori Rice", season: "Kharif Harvest", avgPrice: "₹ 3,450/Qtl", trend: "+2% (High Demand)", peakArrival: "November - January", state: "Andhra / Karnataka" },
  { crop: "Sharbati Wheat", season: "Rabi Post-Storage", avgPrice: "₹ 2,850/Qtl", trend: "+5% (Export Push)", peakArrival: "April - June", state: "Madhya Pradesh" },
  { crop: "Byadagi Chilli", season: "Annual Stock", avgPrice: "₹ 18,200/Qtl", trend: "+12% (Spice Season)", peakArrival: "January - March", state: "Karnataka" },
];

export const NOTIFICATIONS = [
  { id: 1, title: "Price Drop Alert", desc: "Tomato wholesale in Kolar Mandi dropped by ₹ 180/Qtl today.", time: "10m ago", read: false },
  { id: 2, title: "Farmer Network Live", desc: "Real-time farmer verification and farm-gate procurement active.", time: "1h ago", read: false },
  { id: 3, title: "AI Route Plan Generated", desc: "Multi-farmer pickup route for Hosur corridor is ready with fuel optimization.", time: "2h ago", read: false },
];
