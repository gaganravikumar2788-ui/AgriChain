import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, FileText, BarChart2, Cloud, User, LogOut, Menu, X,
  Search, Sprout, Star, ExternalLink,
  CheckCircle, TrendingUp, Info, ChevronDown, ArrowLeft, Bell
} from 'lucide-react';

const SCHEME_DB = {
  wheat:['pm-kisan','pmfby','kcc','msp','nfsm','agri-infra'],
  rice:['pm-kisan','pmfby','kcc','msp','nfsm','agri-infra','pkvy'],
  paddy:['pm-kisan','pmfby','kcc','msp','nfsm','agri-infra'],
  maize:['pm-kisan','pmfby','kcc','msp','nfsm'],
  jowar:['pm-kisan','pmfby','kcc','msp'],
  bajra:['pm-kisan','pmfby','kcc','msp'],
  barley:['pm-kisan','pmfby','kcc','msp'],
  tur:['pm-kisan','pmfby','kcc','msp','nfsm-pulses'],
  dal:['pm-kisan','pmfby','kcc','msp','nfsm-pulses'],
  lentil:['pm-kisan','pmfby','kcc','msp','nfsm-pulses'],
  moong:['pm-kisan','pmfby','kcc','msp','nfsm-pulses'],
  urad:['pm-kisan','pmfby','kcc','msp','nfsm-pulses'],
  chickpea:['pm-kisan','pmfby','kcc','msp','nfsm-pulses'],
  chana:['pm-kisan','pmfby','kcc','msp','nfsm-pulses'],
  groundnut:['pm-kisan','pmfby','kcc','msp','nmoop','agri-infra'],
  sunflower:['pm-kisan','pmfby','kcc','msp','nmoop'],
  mustard:['pm-kisan','pmfby','kcc','msp','nmoop'],
  soybean:['pm-kisan','pmfby','kcc','msp','nmoop'],
  sesame:['pm-kisan','pmfby','kcc','msp','nmoop'],
  cotton:['pm-kisan','pmfby','kcc','msp','agri-infra'],
  tomato:['pm-kisan','pmksy','midh','agri-infra','kcc'],
  onion:['pm-kisan','pmksy','midh','agri-infra','kcc','price-stabilization'],
  potato:['pm-kisan','pmksy','midh','kcc','price-stabilization'],
  banana:['pm-kisan','pmksy','midh','kcc','agri-infra'],
  mango:['pm-kisan','pmksy','midh','kcc','agri-infra'],
  grapes:['pm-kisan','pmksy','midh','kcc','agri-infra'],
  apple:['pm-kisan','pmksy','midh','kcc','agri-infra'],
  vegetables:['pm-kisan','pmksy','midh','kcc','agri-infra'],
  fruits:['pm-kisan','pmksy','midh','kcc','agri-infra'],
  turmeric:['pm-kisan','pmksy','midh','kcc','spice-board'],
  ginger:['pm-kisan','pmksy','midh','kcc'],
  chilli:['pm-kisan','pmksy','midh','kcc','msp'],
  pepper:['pm-kisan','pmksy','midh','kcc','spice-board'],
  cardamom:['pm-kisan','midh','kcc','spice-board'],
  sugarcane:['pm-kisan','pmfby','kcc','msp','agri-infra'],
  jute:['pm-kisan','pmfby','kcc','msp'],
  tea:['pm-kisan','midh','kcc','agri-infra'],
  coffee:['pm-kisan','midh','kcc'],
  organic:['pm-kisan','pkvy','kcc','agri-infra'],
  floriculture:['pm-kisan','midh','kcc','agri-infra'],
  mushroom:['pm-kisan','midh','kcc','agri-infra'],
};

const ALL_SCHEMES = {
  'pm-kisan':{id:'pm-kisan',name:'PM-KISAN - Pradhan Mantri Kisan Samman Nidhi',ministry:'Ministry of Agriculture & Farmers Welfare',benefit:'Rs 6,000 per year in 3 instalments directly to bank account',eligibility:'All land-holding farmer families with cultivable land.',tags:['Income Support','Cash Transfer','Direct Benefit'],color:'from-emerald-500 to-green-600',icon:'💰',link:'https://www.myscheme.gov.in/schemes/pm-kisan',featured:true},
  'pmfby':{id:'pmfby',name:'PMFBY - Pradhan Mantri Fasal Bima Yojana',ministry:'Ministry of Agriculture & Farmers Welfare',benefit:'Comprehensive crop insurance against natural calamities at very low premium',eligibility:'All farmers growing notified crops in notified areas.',tags:['Crop Insurance','Risk Cover','Natural Calamity'],color:'from-blue-500 to-sky-600',icon:'🛡️',link:'https://www.myscheme.gov.in/schemes/pmfby',featured:true},
  'kcc':{id:'kcc',name:'Kisan Credit Card (KCC) Scheme',ministry:'Ministry of Agriculture & Ministry of Finance',benefit:'Crop loan up to Rs 3 lakh at 4% interest rate with 2% interest subvention',eligibility:'All farmers including tenant farmers, oral lessees, SHGs, JLGs.',tags:['Credit','Low Interest Loan','Banking'],color:'from-violet-500 to-purple-600',icon:'💳',link:'https://www.myscheme.gov.in/schemes/kcc',featured:true},
  'msp':{id:'msp',name:'Minimum Support Price (MSP) Procurement',ministry:'Ministry of Agriculture & Farmers Welfare / FCI',benefit:'Guaranteed price for 23 crops; full protection from market price crash',eligibility:'All farmers growing notified crops registered with procurement agencies.',tags:['Price Support','Procurement','Market Access'],color:'from-amber-500 to-orange-500',icon:'📈',link:'https://www.myscheme.gov.in/schemes/msp',featured:false},
  'pmksy':{id:'pmksy',name:'PMKSY - Pradhan Mantri Krishi Sinchayee Yojana',ministry:'Ministry of Jal Shakti / Agriculture',benefit:'55% subsidy on drip/sprinkler irrigation for small & marginal farmers',eligibility:'All farmers. Priority to small & marginal farmers.',tags:['Irrigation','Water Conservation','Subsidy'],color:'from-cyan-500 to-teal-600',icon:'💧',link:'https://www.myscheme.gov.in/schemes/pmksy',featured:false},
  'nfsm':{id:'nfsm',name:'NFSM - National Food Security Mission',ministry:'Ministry of Agriculture & Farmers Welfare',benefit:'Subsidised seeds, fertilisers, machinery, irrigation tools and training',eligibility:'Farmers in identified districts growing rice, wheat, pulses or coarse cereals.',tags:['Food Security','Subsidy','Training'],color:'from-lime-500 to-green-600',icon:'🌾',link:'https://www.myscheme.gov.in/schemes/nfsm',featured:false},
  'nfsm-pulses':{id:'nfsm-pulses',name:'NFSM - Pulses Component',ministry:'Ministry of Agriculture & Farmers Welfare',benefit:'Free certified seeds, micronutrients, weedicides & field demonstrations',eligibility:'Farmers growing pulses in NFSM-identified districts.',tags:['Pulses','Free Seeds','Demonstrations'],color:'from-yellow-500 to-amber-600',icon:'🫘',link:'https://www.myscheme.gov.in/schemes/nfsm-pulses',featured:false},
  'agri-infra':{id:'agri-infra',name:'Agriculture Infrastructure Fund (AIF)',ministry:'Ministry of Agriculture & Farmers Welfare',benefit:'3% interest subvention on loans up to Rs 2 crore for post-harvest projects',eligibility:'Individual farmers, FPOs, cooperatives, SHGs, Agri-entrepreneurs.',tags:['Infrastructure','Post-Harvest','Cold Chain'],color:'from-rose-500 to-red-600',icon:'🏗️',link:'https://www.myscheme.gov.in/schemes/aif',featured:false},
  'pkvy':{id:'pkvy',name:'PKVY - Paramparagat Krishi Vikas Yojana',ministry:'Ministry of Agriculture & Farmers Welfare',benefit:'Rs 50,000 per hectare over 3 years for organic inputs, certification & marketing',eligibility:'Farmer clusters of minimum 50 acres willing to shift to organic farming.',tags:['Organic Farming','Certification','Cluster'],color:'from-teal-500 to-emerald-600',icon:'🌿',link:'https://www.myscheme.gov.in/schemes/pkvy',featured:false},
  'midh':{id:'midh',name:'MIDH - Mission for Integrated Development of Horticulture',ministry:'Ministry of Agriculture & Farmers Welfare',benefit:'Subsidies for planting material, greenhouses, cold storage & market linkages',eligibility:'All horticulture farmers. FPOs and cooperatives also eligible.',tags:['Horticulture','Infrastructure','Cold Storage'],color:'from-pink-500 to-rose-600',icon:'🍅',link:'https://www.myscheme.gov.in/schemes/midh',featured:false},
  'nmoop':{id:'nmoop',name:'NMOOP - National Mission on Oilseeds and Oil Palm',ministry:'Ministry of Agriculture & Farmers Welfare',benefit:'Subsidy on certified seeds, plant protection chemicals and oil palm planting',eligibility:'All farmers growing notified oilseed crops or Oil Palm.',tags:['Oilseeds','Oil Palm','Subsidy'],color:'from-orange-500 to-amber-600',icon:'🌻',link:'https://www.myscheme.gov.in/schemes/nmoop',featured:false},
  'spice-board':{id:'spice-board',name:'Spices Board Development Schemes',ministry:'Ministry of Commerce & Industry (Spices Board)',benefit:'Subsidy on planting material, post-harvest infra, certification & export support',eligibility:'Spice growers registered with Spices Board of India.',tags:['Spices','Export','Certification'],color:'from-red-500 to-orange-600',icon:'🌶️',link:'https://www.myscheme.gov.in/search/category/Agriculture',featured:false},
  'price-stabilization':{id:'price-stabilization',name:'Price Stabilisation Fund (PSF)',ministry:'Ministry of Consumer Affairs, Food & Public Distribution',benefit:'Buffer stock procurement to prevent distress selling during glut periods',eligibility:'Farmers of onion, potato, tomato registered with NAFED/NCCF.',tags:['Price Support','Horticulture','Anti-Distress'],color:'from-indigo-500 to-blue-600',icon:'⚖️',link:'https://www.myscheme.gov.in/schemes/psf',featured:false},
};

function matchCrops(input) {
  if (!input.trim()) return [];
  const lower = input.toLowerCase().trim();
  const ids = new Set();
  if (SCHEME_DB[lower]) { SCHEME_DB[lower].forEach(id => ids.add(id)); return [...ids].map(id => ALL_SCHEMES[id]).filter(Boolean); }
  for (const [crop, schemeIds] of Object.entries(SCHEME_DB)) {
    if (lower.includes(crop) || crop.includes(lower)) schemeIds.forEach(id => ids.add(id));
  }
  if (ids.size === 0) ['pm-kisan','pmfby','kcc'].forEach(id => ids.add(id));
  return [...ids].map(id => ALL_SCHEMES[id]).filter(Boolean);
}

function SchemeCard({ scheme }) {
  const [open, setOpen] = useState(false);
  const cls = (base) => base;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className={`h-1.5 w-full bg-gradient-to-r ${scheme.color}`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br ${scheme.color} shadow-md`}>{scheme.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-gray-800 text-sm leading-snug">{scheme.name}</h4>
              {scheme.featured && <span className="flex-shrink-0 inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"><Star size={9} fill="currentColor" />Top</span>}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{scheme.ministry}</p>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 bg-green-50 rounded-xl px-3 py-2.5">
          <span className="text-green-600 font-bold text-sm mt-0.5 flex-shrink-0">Rs</span>
          <p className="text-xs text-green-800 font-medium leading-relaxed">{scheme.benefit}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {scheme.tags.map(t => <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">{t}</span>)}
        </div>
        <button onClick={() => setOpen(o => !o)} className="mt-3 w-full flex items-center justify-between text-xs text-gray-500 hover:text-green-700 transition-colors py-1">
          <span className="flex items-center gap-1.5"><Info size={12} /> View Eligibility</span>
          <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <p className="mt-2 text-xs text-gray-600 bg-blue-50 rounded-xl px-3 py-2.5 leading-relaxed border border-blue-100">{scheme.eligibility}</p>}
        <div className="flex-1" />
        <a href={scheme.link} target="_blank" rel="noopener noreferrer"
          className={`mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r ${scheme.color} text-white text-xs font-semibold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm`}>
          Apply / Know More <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

const NAV_LINKS = [
  { icon: Home,      label: 'Home'    },
  { icon: FileText,  label: 'Schemes', active: true },
  { icon: BarChart2, label: 'Market'  },
  { icon: Cloud,     label: 'Weather' },
  { icon: Sprout,    label: 'Crop Recommendation' },
];

const SUGGESTIONS = ['Wheat','Rice','Tomato','Onion','Cotton','Mustard','Maize','Chana','Groundnut','Banana','Turmeric','Soybean','Potato','Sugarcane','Jowar','Coffee'];

const CATEGORIES = [
  { label: 'Cereals',      icon: '🌾', crops: ['wheat','rice','maize','jowar','bajra','barley'] },
  { label: 'Pulses',       icon: '🫘', crops: ['chana','tur','moong','urad','lentil'] },
  { label: 'Oilseeds',     icon: '🌻', crops: ['mustard','groundnut','sunflower','soybean','sesame'] },
  { label: 'Horticulture', icon: '🍅', crops: ['tomato','onion','potato','mango','banana','apple'] },
  { label: 'Spices',       icon: '🌶️', crops: ['turmeric','ginger','chilli','pepper','cardamom'] },
  { label: 'Commercial',   icon: '💼', crops: ['sugarcane','cotton','jute','tea','coffee'] },
];

export default function FarmerSchemes() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const inputRef = useRef(null);

  const doSearch = (term) => {
    const t = (term !== undefined ? term : query).trim();
    if (!t) return;
    setLoading(true); setQuery(t); setActiveCategory(null);
    setTimeout(() => { setResults(matchCrops(t)); setSearched(true); setLoading(false); }, 500);
  };

  const reset = () => {
    setQuery(''); setResults([]); setSearched(false); setActiveCategory(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat.label);
    const ids = new Set();
    cat.crops.forEach(c => { if (SCHEME_DB[c]) SCHEME_DB[c].forEach(id => ids.add(id)); });
    setResults([...ids].map(id => ALL_SCHEMES[id]).filter(Boolean));
    setSearched(true);
    setQuery(cat.label + ' crops');
  };

  return (
    <div className="min-h-screen w-full bg-gray-50" style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      <nav className="bg-white/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.03)] border-b border-gray-100 px-6 sm:px-10 lg:px-12 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3.5 sm:gap-4 cursor-pointer" onClick={() => navigate('/farmer-dashboard')}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center p-1 shadow-md border-2 border-emerald-200 flex-shrink-0">
            <img src="/logo.png" alt="AgriChain Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-black text-green-950 text-2xl sm:text-3xl leading-tight">AgriChain</div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold tracking-wide mt-0.5">Field to Fork Freshness</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-gray-50/90 p-1.5 rounded-full border border-gray-200/70 shadow-inner">
          {NAV_LINKS.map(({ icon: Icon, label, active }) => (
            <button key={label} onClick={() => {
              if (label === 'Home') navigate('/farmer-dashboard');
              if (label === 'Market') navigate('/farmer/market');
              if (label === 'Weather') navigate('/farmer/weather');
              if (label === 'Crop Recommendation') navigate('/farmer/crops');
            }}
              className={`flex items-center gap-2.5 px-5 sm:px-6 py-2.5 rounded-full text-sm sm:text-base font-bold transition-all duration-200 ${active ? 'bg-green-700 text-white shadow-md shadow-green-700/20' : 'text-gray-700 hover:text-green-800 hover:bg-white'}`}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3.5 sm:gap-4">
          <button className="relative p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all">
            <Bell size={22} /><span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-800 rounded-full flex items-center justify-center text-white shadow cursor-pointer hover:bg-green-900 active:scale-95 transition-all">
            <User size={22} />
          </div>
          <button onClick={() => setMenuOpen(o => !o)} className="text-gray-700 md:hidden p-1">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white border-b px-4 py-3 flex flex-col gap-1 shadow-lg z-40">
          {NAV_LINKS.map(({ icon: Icon, label, active }) => (
            <button key={label} onClick={() => {
              setMenuOpen(false);
              if (label === 'Home') navigate('/farmer-dashboard');
              if (label === 'Market') navigate('/farmer/market');
              if (label === 'Weather') navigate('/farmer/weather');
              if (label === 'Crop Recommendation') navigate('/farmer/crops');
            }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${active ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 px-6 sm:px-10 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto text-center">
          <button onClick={() => navigate('/farmer-dashboard')}
            className="inline-flex items-center gap-2 text-green-200 hover:text-white text-sm font-medium mb-5 transition-colors">
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">Government Scheme Finder</h1>
          <p className="text-green-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Enter the crop you have grown and instantly discover all government schemes you are eligible for.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-7">
            {[['13+','Schemes Available'],['40+','Crops Covered'],['Rs 6,000','Annual Support'],['100%','Insurance Cover']].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="text-white font-extrabold text-2xl">{v}</div>
                <div className="text-green-200 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-7 mb-6">
          <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <span className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-xl">🌱</span>
            Search by Your Crop
          </h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Sprout size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" />
              <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
                placeholder="e.g. Wheat, Tomato, Cotton, Onion..."
                className="w-full pl-11 pr-10 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none text-gray-800 text-sm font-medium transition-colors bg-gray-50 focus:bg-white" />
              {query && <button onClick={reset} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={16} /></button>}
            </div>
            <button onClick={() => doSearch()} disabled={loading}
              className="flex-shrink-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-7 sm:px-9 py-4 rounded-xl font-semibold text-sm flex items-center gap-2 hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all shadow-md disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search size={16} />}
              <span className="hidden sm:inline">Find Schemes</span>
            </button>
          </div>
          <div className="mt-5">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Popular Crops</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(c => (
                <button key={c} onClick={() => doSearch(c)}
                  className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 hover:border-green-400 transition-all font-medium active:scale-95">{c}</button>
              ))}
            </div>
          </div>
        </div>

        {!searched && (
          <div className="mb-6">
            <h2 className="font-bold text-gray-700 text-base mb-4 flex items-center gap-2">
              <span className="text-xl">📂</span> Browse by Crop Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => handleCategory(cat)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md active:scale-95 ${activeCategory === cat.label ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200'}`}>
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="font-semibold text-gray-800 text-sm">{cat.label}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{cat.crops.slice(0,3).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}...</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium text-lg">Finding schemes for <span className="text-green-700 font-bold">{query}</span>...</p>
          </div>
        )}

        {!loading && searched && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="flex items-center gap-2 font-bold text-gray-800 text-base">
                <CheckCircle size={22} className="text-green-600" />
                {results.length} Scheme{results.length !== 1 ? 's' : ''} found for
                <span className="text-green-700 capitalize ml-1">"{query}"</span>
              </span>
              <button onClick={reset} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                <X size={13} /> Clear
              </button>
            </div>
            {results.some(s => s.featured) && (
              <div className="mb-7">
                <p className="text-sm font-bold text-amber-600 flex items-center gap-1.5 mb-3">
                  <Star size={13} fill="currentColor" /> Top Recommended Schemes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.filter(s => s.featured).map(s => <SchemeCard key={s.id} scheme={s} />)}
                </div>
              </div>
            )}
            {results.some(s => !s.featured) && (
              <div>
                <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5 mb-3">
                  <TrendingUp size={13} /> Additional Applicable Schemes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.filter(s => !s.featured).map(s => <SchemeCard key={s.id} scheme={s} />)}
                </div>
              </div>
            )}
            <div className="mt-10 text-center bg-green-50 rounded-2xl p-6 border border-green-100">
              <p className="text-sm text-gray-600 mb-3 font-medium">Want to explore more schemes?</p>
              <a href="https://www.myscheme.gov.in/search/category/Agriculture" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-700 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-green-800 transition-colors shadow-md">
                Browse All Agriculture Schemes on myScheme.gov.in <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-7xl mb-5">🔍</div>
            <p className="font-semibold text-gray-500 text-xl">Enter a crop name above to get started</p>
            <p className="text-sm mt-2">Or pick a category above to browse related schemes</p>
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-gray-100 py-4 text-center text-xs text-gray-400 mt-4">
        2026 AgriChain - Scheme data from
        <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline ml-1">myScheme.gov.in</a>
      </footer>
    </div>
  );
}
