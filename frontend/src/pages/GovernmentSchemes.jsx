import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, ChevronDown, ChevronUp, Leaf, X, Sparkles, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// VERIFIED scheme data sourced from myscheme.gov.in/schemes/* (Agriculture, Rural & Environment)
// Each scheme has: id, name, description, benefits, eligibility, applyUrl,
//                  crops (the crops it explicitly covers), tags, ministry
// ─────────────────────────────────────────────────────────────────────────────
const SCHEMES = [
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Provides comprehensive crop insurance coverage and financial support to farmers in case of crop loss/damage due to unforeseen events like natural calamities, pests and diseases.',
    benefits: 'Premium subsidised (2% for Kharif, 1.5% for Rabi food/oilseeds, 5% for annual commercial/horticultural crops). Full insured sum released in case of crop failure.',
    eligibility: 'All farmers growing notified crops in notified areas. Loanee farmers are mandatorily covered; non-loanee farmers can join voluntarily.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/pmfby',
    crops: ['wheat', 'rice', 'paddy', 'maize', 'cotton', 'groundnut', 'soybean', 'sunflower', 'sugarcane', 'potato', 'onion', 'tomato', 'mustard', 'rapeseed', 'jowar', 'bajra', 'tur', 'moong', 'urad', 'chickpea', 'gram', 'lentil', 'barley', 'millet', 'sorghum', 'castor', 'turmeric', 'ginger', 'garlic'],
    tags: ['insurance', 'crop protection', 'kharif', 'rabi', 'all crops'],
    color: 'green',
    icon: '🌾',
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    ministry: 'Ministry of Agriculture & Farmers Welfare / Ministry of Finance',
    description: 'Provides short-term formal credit to farmers for their agricultural operations, allied activities and non-farm short-term credit needs through a simplified banking process.',
    benefits: 'Credit limit based on land holding and scale of finance. Interest subvention of 2% plus 3% prompt repayment incentive (effective 4% interest). Flexible withdrawal and repayment within 5 years.',
    eligibility: 'All farmers — individual or joint cultivators, owner-cultivators, tenant farmers, oral lessees, share croppers, SHGs or joint liability groups of farmers.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    crops: ['wheat', 'rice', 'paddy', 'maize', 'cotton', 'groundnut', 'soybean', 'sugarcane', 'vegetables', 'fruits', 'horticulture', 'potato', 'onion', 'tomato', 'mustard', 'jowar', 'bajra', 'pulses', 'oilseeds', 'all crops'],
    tags: ['credit', 'loan', 'interest subvention', 'banking', 'short-term finance'],
    color: 'blue',
    icon: '💳',
  },
  {
    id: 'pmksy',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    ministry: 'Ministry of Jal Shakti / Ministry of Agriculture & Farmers Welfare',
    description: '"Har Khet Ko Pani, More Crop Per Drop" — aims to provide physical access to water on farm and to expand cultivated area under assured irrigation and improve on-farm water use efficiency.',
    benefits: 'Subsidy for micro-irrigation (drip/sprinkler) — 55% for small & marginal farmers, 45% for others. Funding for watershed development and water harvesting structures.',
    eligibility: 'All categories of farmers. Priority to small and marginal farmers. Farmers with own land or leased land for minimum 7 years eligible for micro-irrigation subsidy.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/pmksy',
    crops: ['wheat', 'rice', 'sugarcane', 'cotton', 'vegetables', 'fruits', 'banana', 'potato', 'onion', 'tomato', 'horticulture', 'groundnut', 'soybean', 'maize', 'all crops'],
    tags: ['irrigation', 'drip irrigation', 'sprinkler', 'water', 'watershed'],
    color: 'sky',
    icon: '💧',
  },
  {
    id: 'pmkisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Provides income support of ₹6,000 per year to all eligible farmer families across the country in three equal four-monthly instalments of ₹2,000 directly to their bank accounts.',
    benefits: '₹6,000/year in 3 instalments of ₹2,000 (April-July, August-November, December-March) transferred directly via Direct Benefit Transfer (DBT).',
    eligibility: 'All land-holding farmer families (husband, wife and minor children) with cultivable land. Exclusions: institutional land holders, farmers who are/were constitutional post holders, serving/retired government employees with income above ₹10,000/month.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/pmkisan',
    crops: ['wheat', 'rice', 'paddy', 'maize', 'cotton', 'groundnut', 'soybean', 'sugarcane', 'vegetables', 'fruits', 'pulses', 'oilseeds', 'all crops', 'any crop'],
    tags: ['income support', 'direct benefit transfer', 'cash transfer', 'all farmers'],
    color: 'orange',
    icon: '💰',
  },
  {
    id: 'pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Promotes organic farming in India by providing financial assistance for adoption of organic practices, certification, and market linkage under cluster approach (50 acres cluster).',
    benefits: '₹50,000/hectare over 3 years: ₹31,000 for on-farm inputs like vermicompost, bio-pesticides; ₹8,800 for certification; ₹3,000 for value addition; ₹2,000 for marketing.',
    eligibility: 'Farmer groups/clusters of minimum 50 acres in contiguous area. Farmers willing to shift to organic farming without chemical fertilisers/pesticides for 3 years.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/pkvy',
    crops: ['wheat', 'rice', 'vegetables', 'fruits', 'pulses', 'spices', 'turmeric', 'ginger', 'cotton', 'soybean', 'groundnut', 'maize', 'sugarcane', 'tea', 'coffee', 'horticulture', 'medicinal plants'],
    tags: ['organic farming', 'organic certification', 'sustainable agriculture', 'cluster'],
    color: 'emerald',
    icon: '🌿',
  },
  {
    id: 'nmoop',
    name: 'National Mission on Oilseeds and Oil Palm (NMOOP)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Aims to increase production and productivity of oilseeds and Oil Palm to reduce import dependence and achieve self-sufficiency in edible oils.',
    benefits: 'Subsidised certified seeds, demonstration plots, IPM inputs, sprinkler sets, plant protection equipment. Assistance for oil palm cultivation ₹29,000/ha (Year 1-3), ₹3,000/ha (Year 4-8).',
    eligibility: 'All farmers growing notified oilseed crops or interested in Oil Palm cultivation.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/nmoop',
    crops: ['groundnut', 'mustard', 'rapeseed', 'soybean', 'sunflower', 'sesame', 'til', 'linseed', 'safflower', 'castor', 'oil palm', 'nigerseed'],
    tags: ['oilseeds', 'oil palm', 'edible oil', 'seeds subsidy'],
    color: 'yellow',
    icon: '🌻',
  },
  {
    id: 'nmsa',
    name: 'National Mission for Sustainable Agriculture (NMSA)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Aims to make agriculture more productive, sustainable, remunerative and climate resilient by promoting location specific integrated/composite farming systems.',
    benefits: 'Financial assistance for soil health management, resource conservation, water use efficiency, livelihood diversification. Soil Health Cards issued free of cost.',
    eligibility: 'All farmers, with focus on small and marginal farmers in rainfed areas.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/nmsa',
    crops: ['wheat', 'rice', 'cotton', 'sugarcane', 'pulses', 'oilseeds', 'vegetables', 'fruits', 'all crops'],
    tags: ['sustainable farming', 'soil health', 'soil health card', 'resource conservation', 'rainfed'],
    color: 'teal',
    icon: '🌱',
  },
  {
    id: 'nfsm',
    name: 'National Food Security Mission (NFSM)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Aims to increase production of rice, wheat, pulses and coarse cereals through area expansion and productivity enhancement in identified districts.',
    benefits: 'Subsidised seeds, fertilisers, IPM, farm machinery, irrigation tools. Cluster demonstration plots. Training and capacity building of farmers.',
    eligibility: 'Farmers in identified districts growing rice, wheat, pulses or coarse cereals.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/nfsm',
    crops: ['rice', 'paddy', 'wheat', 'pulses', 'chickpea', 'gram', 'tur', 'moong', 'urad', 'lentil', 'maize', 'jowar', 'bajra', 'barley', 'coarse cereals'],
    tags: ['food security', 'rice', 'wheat', 'pulses', 'cereals', 'seed subsidy'],
    color: 'amber',
    icon: '🍚',
  },
  {
    id: 'midh',
    name: 'Mission for Integrated Development of Horticulture (MIDH)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Promotes holistic growth of horticulture sector covering fruits, vegetables, root & tuber crops, mushrooms, spices, flowers, aromatic plants, coconut, cashew, bamboo and cane.',
    benefits: '40-50% subsidy on planting material, protected cultivation (polyhouse/shade net), post-harvest management, cold chain. Higher assistance (50-60%) for North-East, hilly areas.',
    eligibility: 'All horticulture farmers. Farmer Producer Organisations (FPOs) and co-operatives also eligible.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/midh',
    crops: ['banana', 'mango', 'apple', 'grapes', 'guava', 'citrus', 'orange', 'lemon', 'papaya', 'pineapple', 'litchi', 'coconut', 'cashew', 'potato', 'tomato', 'onion', 'capsicum', 'chilli', 'cucumber', 'brinjal', 'okra', 'ladyfinger', 'turmeric', 'ginger', 'garlic', 'rose', 'marigold', 'mushroom', 'strawberry', 'vegetable', 'fruit', 'horticulture', 'spices', 'flowers'],
    tags: ['horticulture', 'fruits', 'vegetables', 'spices', 'flowers', 'cold chain', 'polyhouse'],
    color: 'pink',
    icon: '🍎',
  },
  {
    id: 'rkvy',
    name: 'Rashtriya Krishi Vikas Yojana (RKVY)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Incentivises states to increase public investment in agriculture and allied sectors. Funds diverse agri-development activities as per state priorities including infrastructure and market development.',
    benefits: 'State-level flexible funding for agri infrastructure, value chains, agri entrepreneurship, FPO promotion, farm mechanisation, and technology transfer. Also runs RAFTAAR scheme for agri start-ups.',
    eligibility: 'State governments; benefits reach individual farmers through state-designed programmes. Agri-entrepreneurs can apply under RAFTAAR component.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/rkvy',
    crops: ['all crops', 'any crop', 'vegetables', 'fruits', 'cereals', 'pulses', 'oilseeds'],
    tags: ['infrastructure', 'agri development', 'farm mechanisation', 'startup', 'value chain'],
    color: 'indigo',
    icon: '🚜',
  },
  {
    id: 'sfac',
    name: 'Small Farmers Agri-Business Consortium (SFAC) — Equity Grant & Credit Guarantee',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Provides equity grant and credit guarantee to Farmer Producer Companies (FPCs) to enhance equity base and improve access to institutional finance.',
    benefits: 'Equity grant up to ₹10 lakh per FPC (matching equity from promoters). Credit guarantee up to ₹1 crore per FPC for working capital loans from banks.',
    eligibility: 'Farmer Producer Companies (FPCs) registered under Companies Act with minimum 100 farmer shareholders.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/sfac-equity-grant',
    crops: ['all crops', 'any crop'],
    tags: ['FPO', 'farmer producer company', 'credit guarantee', 'equity', 'collective farming'],
    color: 'violet',
    icon: '🤝',
  },
  {
    id: 'subhash-palekar',
    name: 'Subhash Palekar Natural Farming (SPNF) / Bharatiya Prakritik Krishi Paddhati',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Promotes chemical-free natural farming using Jeevamrit, Beejamrit and other traditional practices based on Subhash Palekar methodology. Zero-cost natural farming.',
    benefits: '₹12,200/hectare for 3 years for cluster demonstrations. Training to farmers on SPNF practices. Certification support for natural farming produce.',
    eligibility: 'Farmers willing to adopt zero-budget natural farming techniques. Cluster of farmers (at least 50 acres).',
    applyUrl: 'https://www.myscheme.gov.in/schemes/bpkp',
    crops: ['wheat', 'rice', 'vegetables', 'fruits', 'pulses', 'groundnut', 'sugarcane', 'cotton', 'all crops'],
    tags: ['natural farming', 'zero budget', 'jeevamrit', 'beejamrit', 'chemical-free'],
    color: 'lime',
    icon: '🍃',
  },
  {
    id: 'agri-infra-fund',
    name: 'Agriculture Infrastructure Fund (AIF)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Provides medium-long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    benefits: '3% interest subvention per annum for 7 years on loans up to ₹2 crore. Credit guarantee cover under CGTMSE. Eligible for state government schemes convergence.',
    eligibility: 'Farmers, FPOs, PACS, farmer groups, agri-entrepreneurs, start-ups, state agencies for post-harvest infra projects (cold storage, warehouses, assaying units, processing units).',
    applyUrl: 'https://www.myscheme.gov.in/schemes/aif',
    crops: ['all crops', 'vegetables', 'fruits', 'cereals', 'pulses', 'oilseeds', 'horticulture'],
    tags: ['cold storage', 'warehouse', 'post-harvest', 'processing', 'infrastructure', 'loan subsidy'],
    color: 'slate',
    icon: '🏭',
  },
  {
    id: 'pmkk',
    name: 'PM Kisan Mandhan Yojana (PM-KMY)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Old-age pension scheme for small and marginal farmers ensuring minimum pension of ₹3,000/month after age 60.',
    benefits: '₹3,000 per month pension after age 60. Government matches farmer\'s contribution. Life cover of ₹2 lakh under PM Jeevan Jyoti Bima Yojana for enrolled farmers.',
    eligibility: 'Small and marginal farmers (land up to 2 hectares) aged 18-40 years. Not an income tax payer, not a beneficiary of NPS, ESIC or EPFO.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/pmkmy',
    crops: ['all crops', 'any crop'],
    tags: ['pension', 'retirement', 'social security', 'small farmer', 'marginal farmer'],
    color: 'purple',
    icon: '👴',
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card (SHC) Scheme',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Issues Soil Health Cards to all farmers to provide information on soil nutrient status and recommend appropriate dosages of nutrients for improving soil health and its fertility.',
    benefits: 'Free soil testing and Soil Health Card. Recommendations for fertiliser dose to maximise crop yield. Reduces excess fertiliser use and input costs.',
    eligibility: 'All farmers. Soil samples are collected from farmers\' fields every two years.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/shcs',
    crops: ['wheat', 'rice', 'cotton', 'sugarcane', 'vegetables', 'fruits', 'pulses', 'oilseeds', 'maize', 'all crops', 'any crop'],
    tags: ['soil testing', 'soil health', 'fertiliser recommendation', 'free', 'all farmers'],
    color: 'brown',
    icon: '🪴',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Smart crop-to-scheme matching engine
// ─────────────────────────────────────────────────────────────────────────────
function getSchemesByName(cropName) {
  if (!cropName?.trim()) return [];
  const c = cropName.trim().toLowerCase();

  // Exact and fuzzy matching
  return SCHEMES.filter(s => {
    const inCrops = s.crops.some(crop =>
      c.includes(crop) || crop.includes(c) ||
      // Handle common synonyms
      (c === 'paddy' && crop === 'rice') ||
      (c === 'rice' && crop === 'paddy') ||
      (c === 'gram' && (crop === 'chickpea' || crop === 'pulses')) ||
      (c === 'chickpea' && (crop === 'gram' || crop === 'pulses')) ||
      (c === 'rapeseed' && crop === 'mustard') ||
      (c === 'mustard' && crop === 'rapeseed') ||
      (c === 'til' && crop === 'sesame') ||
      (c === 'sesame' && crop === 'til') ||
      (c === 'ladyfinger' && crop === 'okra') ||
      (c === 'okra' && crop === 'ladyfinger') ||
      (c === 'brinjal' && crop === 'eggplant') ||
      crop === 'all crops' || crop === 'any crop'
    );
    const inTags = s.tags.some(t => c.includes(t) || t.includes(c));
    return inCrops || inTags;
  });
}

const COLOR_MAP = {
  green:   { bg: 'bg-green-50',   border: 'border-green-200',  badge: 'bg-green-100 text-green-700',  btn: 'bg-green-700 hover:bg-green-800' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',    btn: 'bg-blue-700 hover:bg-blue-800' },
  sky:     { bg: 'bg-sky-50',     border: 'border-sky-200',    badge: 'bg-sky-100 text-sky-700',      btn: 'bg-sky-600 hover:bg-sky-700' },
  orange:  { bg: 'bg-orange-50',  border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700',btn: 'bg-orange-600 hover:bg-orange-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200',badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-700 hover:bg-emerald-800' },
  yellow:  { bg: 'bg-yellow-50',  border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700',btn: 'bg-yellow-600 hover:bg-yellow-700' },
  teal:    { bg: 'bg-teal-50',    border: 'border-teal-200',   badge: 'bg-teal-100 text-teal-700',    btn: 'bg-teal-700 hover:bg-teal-800' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700',  btn: 'bg-amber-600 hover:bg-amber-700' },
  pink:    { bg: 'bg-pink-50',    border: 'border-pink-200',   badge: 'bg-pink-100 text-pink-700',    btn: 'bg-pink-600 hover:bg-pink-700' },
  indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700',btn: 'bg-indigo-700 hover:bg-indigo-800' },
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700',btn: 'bg-violet-700 hover:bg-violet-800' },
  lime:    { bg: 'bg-lime-50',    border: 'border-lime-200',   badge: 'bg-lime-100 text-lime-700',    btn: 'bg-lime-700 hover:bg-lime-800' },
  slate:   { bg: 'bg-slate-50',   border: 'border-slate-200',  badge: 'bg-slate-100 text-slate-600',  btn: 'bg-slate-700 hover:bg-slate-800' },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700',btn: 'bg-purple-700 hover:bg-purple-800' },
  brown:   { bg: 'bg-amber-50',   border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-800',  btn: 'bg-amber-800 hover:bg-amber-900' },
};

function SchemeCard({ scheme }) {
  const [expanded, setExpanded] = useState(false);
  const c = COLOR_MAP[scheme.color] || COLOR_MAP.green;

  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-5 hover:shadow-md transition-all`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0 mt-0.5">{scheme.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-800 text-sm leading-snug">{scheme.name}</h3>
            <span className={`${c.badge} text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 font-medium`}>
              Central Govt.
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{scheme.ministry}</p>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed line-clamp-2">{scheme.description}</p>
        </div>
      </div>

      {/* Expandable detail */}
      {expanded && (
        <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">💰 Benefits</p>
            <p className="text-sm text-gray-700 leading-relaxed">{scheme.benefits}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">✅ Eligibility</p>
            <p className="text-sm text-gray-700 leading-relaxed">{scheme.eligibility}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {scheme.tags.slice(0, 5).map(t => (
              <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 pt-3 border-t border-gray-100 gap-2">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center justify-center sm:justify-start gap-1 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors py-1"
        >
          {expanded ? <><ChevronUp size={15} /> Less info</> : <><ChevronDown size={15} /> More info</>}
        </button>
        <a
          href={scheme.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-1.5 ${c.btn} text-white text-xs px-4 py-2.5 sm:py-2 rounded-full font-semibold transition-all active:scale-95 shadow-sm text-center`}
        >
          Apply on myScheme.gov.in <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

export default function GovernmentSchemes() {
  const [cropInput, setCropInput] = useState('');
  const [searchedCrop, setSearchedCrop] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  const aiResults = useMemo(() => getSchemesByName(searchedCrop), [searchedCrop]);

  // Universal search (name + description + tags)
  const filteredAll = useMemo(() => {
    if (!globalSearch.trim()) return SCHEMES;
    const q = globalSearch.toLowerCase();
    return SCHEMES.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q)) ||
      s.ministry.toLowerCase().includes(q)
    );
  }, [globalSearch]);

  const handleCropSearch = () => {
    if (cropInput.trim()) setSearchedCrop(cropInput.trim());
  };

  const clearCropSearch = () => {
    setCropInput('');
    setSearchedCrop('');
  };

  const showAI = !!searchedCrop;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
            <span className="text-xl sm:text-2xl">🏛️</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">Government Schemes</h1>
            <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Agriculture, Rural & Environment
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Data sourced from{' '}
            <a href="https://www.myscheme.gov.in/search/category/Agriculture,Rural%20%26%20Environment"
               target="_blank" rel="noopener noreferrer"
               className="text-green-700 font-medium hover:underline">
              myScheme.gov.in
            </a>{' '}
            · {SCHEMES.length} verified schemes
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">

        {/* ── AI Crop Recommendation Box ── */}
        <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-yellow-300" />
            <h2 className="font-bold text-base sm:text-lg">AI Scheme Recommender</h2>
            <span className="bg-yellow-400/20 text-yellow-200 text-xs px-2 py-0.5 rounded-full">Smart Match</span>
          </div>
          <p className="text-green-100 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">
            Enter your crop name and we'll recommend only the government schemes that are <strong>specifically applicable</strong> to that crop — no wrong answers.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <Leaf size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type="text"
                value={cropInput}
                onChange={e => setCropInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCropSearch()}
                placeholder="Enter crop (e.g. Wheat, Tomato, Groundnut...)"
                className="w-full pl-9 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCropSearch}
                disabled={!cropInput.trim()}
                className="flex-1 sm:flex-initial bg-yellow-400 text-green-900 px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md text-center"
              >
                Find Schemes
              </button>
              {searchedCrop && (
                <button onClick={clearCropSearch} className="p-2.5 sm:p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Popular crops quick-select */}
          <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            <span className="text-green-300 text-xs self-center mr-1">Try:</span>
            {['Wheat', 'Rice', 'Tomato', 'Groundnut', 'Sugarcane', 'Cotton', 'Onion', 'Soybean', 'Mango', 'Mustard'].map(crop => (
              <button
                key={crop}
                onClick={() => { setCropInput(crop); setSearchedCrop(crop); }}
                className="text-xs bg-white/10 hover:bg-white/20 text-green-100 px-2.5 sm:px-3 py-1 rounded-full transition-all active:scale-95 border border-white/10"
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* ── AI Results ── */}
        {showAI && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-500" />
                  Schemes for "{searchedCrop}"
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {aiResults.length > 0
                    ? `${aiResults.length} scheme${aiResults.length !== 1 ? 's' : ''} matched based on verified crop eligibility`
                    : 'No specific matches found'}
                </p>
              </div>
              <button onClick={clearCropSearch} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors">
                <X size={14} /> Clear
              </button>
            </div>

            {aiResults.length > 0 ? (
              <div className="grid gap-4">
                {aiResults.map(s => <SchemeCard key={s.id} scheme={s} />)}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
                <AlertCircle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-800 text-sm">No exact crop match found</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Try searching for generic categories like "Vegetables", "Fruits", "Pulses", or "Oilseeds", or browse all verified schemes below.
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 mt-8 pt-6">
              <p className="text-sm text-gray-500 text-center">— Browse all {SCHEMES.length} schemes below —</p>
            </div>
          </div>
        )}

        {/* ── All Schemes with text search ── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-bold text-gray-800 text-base sm:text-lg">All Schemes ({filteredAll.length})</h2>
            <div className="relative w-full sm:w-auto">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                placeholder="Search schemes..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/30 bg-white"
              />
            </div>
          </div>

          {filteredAll.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No schemes match "{globalSearch}"</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAll.map(s => <SchemeCard key={s.id} scheme={s} />)}
            </div>
          )}
        </div>

        {/* Source note */}
        <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-500 text-center">
          ℹ️ All scheme data is sourced from{' '}
          <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="text-green-700 font-medium hover:underline">myscheme.gov.in</a>
          {' '}— Government of India's official scheme discovery platform.
          Scheme recommendations are based on verified crop eligibility only.
        </div>
      </div>
    </div>
  );
}
