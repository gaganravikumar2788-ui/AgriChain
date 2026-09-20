export const BUYER_PROFILE = {
  name: "Ravi Traders",
  role: "Bulk Buyer",
  gstin: "29AABCR1234F1Z8",
  city: "Bengaluru / Hosur Agro Corridor",
  verified: true,
  rating: 4.9,
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

import { getDailyMarketPrices } from '../services/marketPriceService';

const liveMandiPrices = getDailyMarketPrices();
const getMandiPrice = (id, fallback) => {
  const item = liveMandiPrices.find(p => p.id === id);
  return item ? `₹ ${item.modalPrice.toLocaleString('en-IN')} / Qtl` : fallback;
};

export const CATEGORIES = [
  {
    id: "cereals",
    name: "Cereals",
    subtext: "Rice, Wheat, Maize...",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Sona Masoori Rice", price: getMandiPrice("paddy-sona-masoori", "₹ 2,680 / Qtl"), available: "45 MT", grade: "Grade A", farmer: "Ramesh Kumar", image: "https://www.languageguide.org/vocabulary/food_new/small/rice.png" },
      { name: "Sharbati Wheat", price: getMandiPrice("wheat-sharbati", "₹ 3,180 / Qtl"), available: "30 MT", grade: "Export Quality", farmer: "Suresh Patel", image: "https://www.languageguide.org/vocabulary/food_new/small/wheat.png" },
      { name: "Yellow Corn Maize", price: getMandiPrice("maize-yellow", "₹ 2,280 / Qtl"), available: "60 MT", grade: "Feed & Industrial", farmer: "Murugan", image: "https://www.languageguide.org/vocabulary/veg/images/corn.webp" },
    ],
  },
  {
    id: "pulses",
    name: "Pulses",
    subtext: "Toor, Moong, Urad...",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Desi Toor Dal (Pigeon Pea)", price: getMandiPrice("tur-red-gram", "₹ 10,150 / Qtl"), available: "18 MT", grade: "Unpolished A+", farmer: "Lakshmi Devi", image: "https://www.languageguide.org/vocabulary/veg/images/beans.webp" },
      { name: "Green Gram (Moong)", price: getMandiPrice("moong-green-gram", "₹ 8,250 / Qtl"), available: "12 MT", grade: "Grade A Premium", farmer: "Ramesh Kumar", image: "https://www.languageguide.org/vocabulary/veg/images/peas.webp" },
      { name: "Black Matpe (Urad)", price: getMandiPrice("urad-black-matpe", "₹ 7,850 / Qtl"), available: "15 MT", grade: "Machine Cleaned", farmer: "Suresh Patel", image: "https://www.languageguide.org/vocabulary/veg/images/beans.webp" },
    ],
  },
  {
    id: "oilseeds",
    name: "Oilseeds",
    subtext: "Groundnut, Sesame...",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Bold Groundnut / Peanut", price: getMandiPrice("groundnut-pod", "₹ 6,240 / Qtl"), available: "25 MT", grade: "Oil Yield 48%", farmer: "Anitha", image: "https://www.languageguide.org/vocabulary/food_new/small/peanut.png" },
      { name: "Natural White Sesame", price: getMandiPrice("sesame-til", "₹ 13,400 / Qtl"), available: "8 MT", grade: "99/1 Purity", farmer: "Murugan", image: "https://www.languageguide.org/vocabulary/food_new/small/grains.png" },
      { name: "Mustard Seeds (Black)", price: getMandiPrice("mustard-seed", "₹ 5,520 / Qtl"), available: "20 MT", grade: "High Pungency", farmer: "Suresh Patel", image: "https://www.languageguide.org/vocabulary/food_new/small/grains.png" },
    ],
  },
  {
    id: "spices",
    name: "Spices",
    subtext: "Chilli, Turmeric, Pepper...",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Byadagi Red Chilli", price: getMandiPrice("green-chilli", "₹ 3,650 / Qtl"), available: "10 MT", grade: "Deep Red, Low Heat", farmer: "Suresh Patel", image: "https://www.languageguide.org/vocabulary/veg/images/chili.webp" },
      { name: "Salem Turmeric Fingers", price: getMandiPrice("turmeric-raw", "₹ 13,900 / Qtl"), available: "14 MT", grade: "Curcumin 3.8%+", farmer: "Lakshmi Devi", image: "https://www.languageguide.org/vocabulary/veg/images/sweet-potato.webp" },
      { name: "Malabar Black Pepper", price: getMandiPrice("black-pepper", "₹ 61,500 / Qtl"), available: "4 MT", grade: "TGSEB Extra Bold", farmer: "Murugan", image: "https://www.languageguide.org/vocabulary/food_new/small/grains.png" },
    ],
  },
  {
    id: "vegetables",
    name: "Vegetables",
    subtext: "Onion, Tomato, Potato...",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Nashik Red Onion", price: getMandiPrice("onion-red", "₹ 2,420 / Qtl"), available: "35 MT", grade: "Medium 45mm+", farmer: "Ramesh Kumar", image: "https://www.languageguide.org/vocabulary/veg/images/onion.webp" },
      { name: "Hybrid Farm Tomato", price: getMandiPrice("tomato-hybrid", "₹ 1,680 / Qtl"), available: "20 MT", grade: "Firm Ripe Boxed", farmer: "Ramesh Kumar", image: "https://www.languageguide.org/vocabulary/veg/images/tomato.webp" },
      { name: "Jyoti Cold Storage Potato", price: getMandiPrice("potato-jyoti", "₹ 1,450 / Qtl"), available: "50 MT", grade: "Sugar-free 50mm+", farmer: "Suresh Patel", image: "https://www.languageguide.org/vocabulary/veg/images/potato.webp" },
    ],
  },
  {
    id: "fruits",
    name: "Fruits",
    subtext: "Mango, Banana, Citrus...",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=400",
    crops: [
      { name: "Alphonso / Badami Mango", price: getMandiPrice("mango-alphonso", "₹ 8,800 / Qtl"), available: "15 MT", grade: "Naturally Ripened", farmer: "Anitha", image: "https://www.languageguide.org/vocabulary/fruits/small/mango.png" },
      { name: "G9 Cavendish Banana", price: getMandiPrice("banana-robusta", "₹ 1,650 / Qtl"), available: "28 MT", grade: "Class 1 Export Hands", farmer: "Murugan", image: "https://www.languageguide.org/vocabulary/fruits/small/banana.png" },
      { name: "Nagpur Sweet Orange (Mosambi)", price: getMandiPrice("sweet-orange", "₹ 3,850 / Qtl"), available: "18 MT", grade: "Juicy Grade A", farmer: "Lakshmi Devi", image: "https://www.languageguide.org/vocabulary/fruits/small/orange.png" },
    ],
  },
];

export const NEARBY_FARMERS = [];

export const CROP_SEASON_DATA = [
  { crop: "Tomato (Hybrid)", season: "Rabi & Kharif", avgPrice: getMandiPrice("tomato-hybrid", "₹ 1,680/Qtl"), trend: "+8% this week", peakArrival: "September - November", state: "Karnataka / TN" },
  { crop: "Red Onion", season: "Late Kharif", avgPrice: getMandiPrice("onion-red", "₹ 2,420/Qtl"), trend: "-4% (Stable)", peakArrival: "October - December", state: "Maharashtra / Karnataka" },
  { crop: "Sona Masoori Rice", season: "Kharif Harvest", avgPrice: getMandiPrice("paddy-sona-masoori", "₹ 2,680/Qtl"), trend: "+2% (High Demand)", peakArrival: "November - January", state: "Andhra / Karnataka" },
  { crop: "Sharbati Wheat", season: "Rabi Post-Storage", avgPrice: getMandiPrice("wheat-sharbati", "₹ 3,180/Qtl"), trend: "+5% (Export Push)", peakArrival: "April - June", state: "Madhya Pradesh" },
  { crop: "Byadagi Chilli", season: "Annual Stock", avgPrice: getMandiPrice("green-chilli", "₹ 3,650/Qtl"), trend: "+12% (Spice Season)", peakArrival: "January - March", state: "Karnataka" },
];

export const NOTIFICATIONS = [
  { id: 1, title: "Price Drop Alert", desc: "Tomato wholesale in Kolar Mandi dropped by ₹ 180/Qtl today.", time: "10m ago", read: false },
  { id: 2, title: "Farmer Network Live", desc: "Real-time farmer verification and farm-gate procurement active.", time: "1h ago", read: false },
  { id: 3, title: "AI Route Plan Generated", desc: "Multi-farmer pickup route for Hosur corridor is ready with fuel optimization.", time: "2h ago", read: false },
];
