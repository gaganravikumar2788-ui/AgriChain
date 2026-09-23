/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AgriChain Multilingual Farmer AI Intelligence Service
 * 
 * Supports: English ('en'), Hindi ('hi'), Kannada ('kn')
 * Knowledge domains:
 *  1. AGMARKNET Real-time Mandi Market Prices & Modal Rates
 *  2. KisanVani Agro-Climatic Crop Recommendations (Season, Soil, Water, Profit)
 *  3. Karnataka 31-District Real-Time AccuWeather & Agricultural Advisories
 *  4. National & State Government Agricultural Schemes & Subsidies
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getDailyMarketPrices, getMarketStats } from './marketPriceService.js';
import { KARNATAKA_DISTRICTS, fetchPlaceWeather } from './karnatakaWeatherService.js';
import { getRecommendedCrops, KARNATAKA_CROPS } from './karnatakaCropRecommendationService.js';

// Scheme knowledge base with trilingual descriptions
export const AGRI_SCHEMES_KNOWLEDGE = [
  {
    id: 'pm-kisan',
    name: {
      en: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      hi: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
      kn: 'ಪಿಎಂ-ಕಿಸಾನ್ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ)'
    },
    benefit: {
      en: '₹6,000 per year directly to bank account in 3 equal instalments of ₹2,000 every 4 months.',
      hi: 'हर 4 महीने में ₹2,000 की 3 किस्तों में सीधे बैंक खाते में प्रति वर्ष ₹6,000।',
      kn: 'ಪ್ರತಿ 4 ತಿಂಗಳಿಗೊಮ್ಮೆ ₹2,000 ದಂತೆ ವರ್ಷಕ್ಕೆ ಒಟ್ಟು ₹6,000 ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ.'
    },
    eligibility: {
      en: 'All landholding farmer families with cultivable land. e-KYC and Aadhaar-seeded bank account required.',
      hi: 'खेती योग्य भूमि वाले सभी किसान परिवार। ई-केवाईसी और आधार लिंक बैंक खाता अनिवार्य है।',
      kn: 'ಕೃಷಿ ಭೂಮಿ ಹೊಂದಿರುವ ಎಲ್ಲಾ ರೈತ ಕುಟುಂಬಗಳು ಅರ್ಹರು. ಇ-ಕೆವೈಸಿ ಮತ್ತು ಆಧಾರ್ ಲಿಂಕ್ ಕಡ್ಡಾಯ.'
    },
    howToApply: {
      en: 'Apply online at pmkisan.gov.in, nearest CSC center, or local Raitha Samparka Kendra (RSK).',
      hi: 'pmkisan.gov.in, नजदीकी सीएससी (CSC) केंद्र या स्थानीय कृषि कार्यालय में आवेदन करें।',
      kn: 'pmkisan.gov.in ಪೋರ್ಟಲ್, ಗ್ರಾಮ್ ಒನ್, ಸಿಎಸ್‌ಸಿ ಕೇಂದ್ರ ಅಥವಾ ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರದಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.'
    },
    link: 'https://pmkisan.gov.in'
  },
  {
    id: 'pmfby',
    name: {
      en: 'PMFBY (Pradhan Mantri Fasal Bima Yojana - Crop Insurance)',
      hi: 'पीएमएफबीवाई (प्रधानमंत्री फसल बीमा योजना)',
      kn: 'ಪಿಎಂಎಫ್‌ಬಿವೈ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ - ಬೆಳೆ ವಿಮೆ)'
    },
    benefit: {
      en: 'Comprehensive financial compensation for crop loss due to drought, unseasonal rain, pests, or hailstorms. Only 2% premium for Kharif, 1.5% for Rabi.',
      hi: 'सूखा, बेमौसम बारिश, कीट या ओलावृष्टि से फसल क्षति पर संपूर्ण वित्तीय मुआवजा। खरीफ के लिए केवल 2%, रबी के लिए 1.5% प्रीमियम।',
      kn: 'ಬರಗಾಲ, ಅಕಾಲಿಕ ಮಳೆ, ಕೀಟಬಾಧೆ ಅಥವಾ ಪ್ರಕೃತಿ ವಿಕೋಪದಿಂದ ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ಸಂಪೂರ್ಣ ಪರಿಹಾರ. ಮುಂಗಾರು ಬೆಳೆಗೆ ಕೇವಲ 2%, ಹಿಂಗಾರು ಬೆಳೆಗೆ 1.5% ಪ್ರೀಮಿಯಂ.'
    },
    eligibility: {
      en: 'All farmers (loanee and non-loanee) cultivating notified crops in notified panchayat/taluk areas.',
      hi: 'अधिसूचित क्षेत्रों में अधिसूचित फसल उगाने वाले सभी ऋणी और गैर-ऋणी किसान।',
      kn: 'ಅಧಿಸೂಚಿತ ಪ್ರದೇಶಗಳಲ್ಲಿ ಬೆಳೆ ಬೆಳೆಯುವ ಎಲ್ಲಾ ಸಾಲ ಪಡೆದ ಮತ್ತು ಸಾಲ ಪಡೆಯದ ರೈತರು.'
    },
    howToApply: {
      en: 'Enroll at Samrakshane portal (Karnataka), bank branches, or CSC within the notified cut-off date.',
      hi: 'ಕರ್ನಾಟಕ ಸಂರಕ್ಷಣೆ ಪೋರ್ಟಲ್, ಬ್ಯಾಂಕ್ ಅಥವಾ ಸಿಎಸ್‌ಸಿ ಕೇಂದ್ರದ ಮೂಲಕ ಕೊನೆಯ ದಿನಾಂಕದೊಳಗೆ ನೋಂದಾಯಿಸಿ.',
      kn: 'ಕರ್ನಾಟಕದ ಸಂರಕ್ಷಣೆ (Samrakshane) ಪೋರ್ಟಲ್, ಬ್ಯಾಂಕ್ ಅಥವಾ ಗ್ರಾಮ ಒನ್ ಕೇಂದ್ರದಲ್ಲಿ ನಿಗದಿತ ದಿನಾಂಕದೊಳಗೆ ನೋಂದಾಯಿಸಿ.'
    },
    link: 'https://pmfby.gov.in'
  },
  {
    id: 'kcc',
    name: {
      en: 'Kisan Credit Card (KCC) Low-Interest Crop Loan',
      hi: 'किसान क्रेडिट कार्ड (KCC) रियायती फसली ऋण',
      kn: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ಕಡಿಮೆ ಬಡ್ಡಿಯ ಬೆಳೆ ಸಾಲ'
    },
    benefit: {
      en: 'Subsidized crop production loan up to ₹3,00,000 at effective 4% annual interest with timely repayment.',
      hi: 'समय पर पुनर्भुगतान करने पर प्रभावी 4% वार्षिक ब्याज दर पर ₹3,00,000 तक का फसली ऋण।',
      kn: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಮರುಪಾವತಿಸಿದರೆ ಕೇವಲ 4% ರಿಯಾಯಿತಿ ಬಡ್ಡಿದರದಲ್ಲಿ ₹3,00,000 ವರೆಗೆ ಬೆಳೆ ಸಾಲ.'
    },
    eligibility: {
      en: 'Individual farmers, joint cultivators, tenant farmers, and Self Help Groups (SHGs).',
      hi: 'व्यक्तिगत किसान, संयुक्त किसान, बटाईदार और स्वयं सहायता समूह (SHG)।',
      kn: 'ಸ್ವಂತ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತರು, ಗೇಣಿದಾರರು ಮತ್ತು ರೈತ ಸ್ವಸಹಾಯ ಸಂಘಗಳು.'
    },
    howToApply: {
      en: 'Apply at any rural, cooperative, or nationalized bank with land RTC / Pahani document and Aadhaar.',
      hi: 'भूमि दस्तावेज (खसरा/खतौनी) और आधार कार्ड के साथ किसी भी बैंक में आवेदन करें।',
      kn: 'ಪಹಣಿ (RTC) ಮತ್ತು ಆಧಾರ್ ಕಾರ್ಡ್‌ನೊಂದಿಗೆ ನಿಮ್ಮ ಹತ್ತಿರದ ಸಹಕಾರಿ ಬ್ಯಾಂಕ್ ಅಥವಾ ರಾಷ್ಟ್ರೀಕೃತ ಬ್ಯಾಂಕಿನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.'
    },
    link: 'https://myscheme.gov.in/schemes/kcc'
  },
  {
    id: 'pmksy',
    name: {
      en: 'PMKSY - Micro-Irrigation Drip & Sprinkler Subsidy',
      hi: 'पीएमकेएसवाई - सूक्ष्म सिंचाई (ड्रिप और स्प्रिंकलर) सब्सिडी',
      kn: 'ಪಿಎಂಕೆಎಸ್‌ವೈ - ಹನಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ಸಬ್ಸಿಡಿ'
    },
    benefit: {
      en: 'Up to 90% subsidy for SC/ST farmers and up to 55%-75% subsidy for General/OBC small and marginal farmers on drip & sprinkler setups.',
      hi: 'ड्रिप और स्प्रिंकलर सिंचाई पर छोटे और सीमांत किसानों को 55% से 90% तक की भारी सब्सिडी।',
      kn: 'ಹನಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ಅಳವಡಿಕೆಗೆ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ಶೇ. 75 ರಿಂದ ಶೇ. 90 ರವರೆಗೆ ಭಾರಿ ಸಬ್ಸಿಡಿ.'
    },
    eligibility: {
      en: 'Farmers with cultivable land and assured irrigation water source (borewell/canal/well).',
      hi: 'सिंचाई के पानी के स्रोत (बोरवेल/कुआं/नहर) वाले सभी पात्र किसान।',
      kn: 'ಕೃಷಿ ಜಮೀನು ಮತ್ತು ನೀರಿನ ಮೂಲ (ಬೋರ್‌ವೆಲ್/ಬಾವಿ/ಕಾಲುವೆ) ಹೊಂದಿರುವ ಎಲ್ಲಾ ರೈತರು.'
    },
    howToApply: {
      en: 'Apply on Karnataka Raitha Siri or Drip portal, or through the Taluk Assistant Director of Horticulture/Agriculture.',
      hi: 'कर्नाटक बागवानी/कृषि विभाग के तालुक कार्यालय या ऑनलाइन पोर्टल पर आवेदन करें।',
      kn: 'ತಾಲೂಕು ತೋಟಗಾರಿಕೆ ಅಥವಾ ಕೃಷಿ ಇಲಾಖೆ ಕಚೇರಿ (RSK) ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.'
    },
    link: 'https://pmksy.gov.in'
  }
];

// Multilingual commodity name dictionary
const COMMODITY_SYNONYMS = {
  tomato: ['tomato', 'tamatar', 'tamatara', 'ಟೊಮೆಟೊ', 'ಟೊಮೇಟೊ', 'ಟೊಮ್ಯಾಟೊ', 'टमाटर'],
  onion: ['onion', 'pyaz', 'pyaj', 'eerulli', 'irulli', 'ಈರುಳ್ಳಿ', 'ಇರುಳ್ಳಿ', 'प्याज'],
  potato: ['potato', 'aloo', 'alu', 'alugadde', 'alugade', 'ಆಲೂಗಡ್ಡೆ', 'ಆಲೂಗೆಡ್ಡೆ', 'ಆಲೂ', 'आलू'],
  greenChilli: ['chilli', 'chili', 'mirch', 'green chilli', 'menasinakayi', 'menasina kayi', 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ', 'ಮೆಣಸಿನಕಾಯಿ', 'हरी मिर्च', 'मिर्च'],
  ginger: ['ginger', 'adrak', 'shunthi', 'sunti', 'ಶುಂಠಿ', 'ಶುಂಟಿ', 'ಅಲ್ಲ', 'अदरक'],
  garlic: ['garlic', 'lehsun', 'lahsun', 'bellulli', 'ಬೆಳ್ಳುಳ್ಳಿ', 'ಬೆಳ್ಳುಲ್ಲಿ', 'लहसुन'],
  turmeric: ['turmeric', 'haldi', 'arisina', 'harisina', 'ಅರಿಶಿನ', 'ಅರಿಷಿಣ', 'हल्दी'],
  chana: ['chana', 'gram', 'bengal gram', 'kadale', 'desi chana', 'ಕಡಲೆ', 'ಕಡಲೆ ಕಾಳು', 'ಕಡಲೆಕಾಳು', 'चना', 'बंगाल ग्राम'],
  moong: ['moong', 'mung', 'green gram', 'hesaru', 'hesarukalu', 'ಹೆಸರು ಕಾಳು', 'ಹೆಸರು', 'मूंग'],
  toor: ['toor', 'tur', 'arhar', 'pigeon pea', 'togari', 'togaribele', 'ತೊಗರಿ', 'ತೊಗರಿ ಬೇಳೆ', 'अरहर', 'तूर'],
  ragi: ['ragi', 'finger millet', 'ರಾಗಿ', 'ರಾಘಿ', 'रागी', 'मंडुआ'],
  rice: ['rice', 'paddy', 'bhatta', 'akki', 'dhan', 'ಭತ್ತ', 'ಅಕ್ಕಿ', 'चावल', 'धान'],
  wheat: ['wheat', 'gehu', 'godhi', 'ಗೋಧಿ', 'ಗೋದೀ', 'गेहूं'],
  maize: ['maize', 'corn', 'mekke jola', 'jola', 'ಮೆಕ್ಕೆಜೋಳ', 'ಜೋಳ', 'मक्का'],
  cotton: ['cotton', 'kapas', 'hatti', 'ಹತ್ತಿ', 'कपास', 'रुई']
};

// District name normalization
const DISTRICT_SYNONYMS = {
  kolar: ['kolar', 'ಕೋಲಾರ', 'कोलार'],
  bengaluru: ['bengaluru', 'bangalore', 'ಬೆಂಗಳೂರು', 'बैंगलोर', 'बेंगलुरु'],
  hassan: ['hassan', 'ಹಾಸನ', 'हासन'],
  mandya: ['mandya', 'ಮಂಡ್ಯ', 'मांड्या'],
  mysuru: ['mysuru', 'mysore', 'ಮೈಸೂರು', 'मैसूर'],
  belagavi: ['belagavi', 'belgaum', 'ಬೆಳಗಾವಿ', 'बेलगावी'],
  dharwad: ['dharwad', 'hubli', 'hubballi', 'ಧಾರವಾಡ', 'ಹುಬ್ಬಳ್ಳಿ', 'धारवाड़', 'हुबली'],
  tumakuru: ['tumakuru', 'tumkur', 'ತುಮಕೂರು', 'तुमकुर'],
  ballari: ['ballari', 'bellary', 'ಬಳ್ಳಾರಿ', 'बल्लारी'],
  shivamogga: ['shivamogga', 'shimoga', 'ಶಿವಮೊಗ್ಗ', 'शिवमोग्गा'],
  chikkamagaluru: ['chikkamagaluru', 'chikmagalur', 'ಚಿಕ್ಕಮಗಳೂರು', 'चिकमगलूर'],
  kalaburagi: ['kalaburagi', 'gulbarga', 'ಕಲಬುರಗಿ', 'कलबुर्गी', 'गुलबर्गा'],
  raichur: ['raichur', 'ರಾಯಚೂರು', 'रायचूर'],
  vijayapura: ['vijayapura', 'bijapur', 'ವಿಜಯಪುರ', 'ವಿಜಾಪುರ', 'बीजापुर', 'विजयपुरा'],
  bagalkote: ['bagalkote', 'bagalkot', 'ಬಾಗಲಕೋಟೆ', 'बागलकोट']
};

/**
 * Detect language from text if not provided
 */
export function detectLanguage(text, defaultLang = 'en') {
  if (!text) return defaultLang;
  // Kannada Unicode range: 0C80–0CFF
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  // Devanagari Unicode range: 0900–097F
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return defaultLang;
}

/**
 * Match commodity from query
 */
function findCommodityKey(queryLower) {
  for (const [key, aliases] of Object.entries(COMMODITY_SYNONYMS)) {
    if (aliases.some(a => queryLower.includes(a))) {
      return key;
    }
  }
  return null;
}

/**
 * Match Karnataka district from query
 */
function findDistrictId(queryLower) {
  for (const [districtId, aliases] of Object.entries(DISTRICT_SYNONYMS)) {
    if (aliases.some(a => queryLower.includes(a))) {
      return districtId;
    }
  }
  return null;
}

/**
 * Main AI Query Processing Engine
 * Returns grounded response, speech-friendly text, interactive badges, and quick-reply pills.
 */
export async function processFarmerQuery(userInput, currentLang = 'en') {
  const query = (userInput || '').trim();
  const lang = detectLanguage(query, currentLang);
  const qLower = query.toLowerCase();

  // 1. Identify Intent
  const isMarket = /price|rate|bhav|market|mandi|cost|ಬೆಲೆ|ದರ|ಮಾರುಕಟ್ಟೆ|ಭಾವ|ಮಂಡಿ|भाव|दाम|रेट|मंडी/.test(qLower);
  const isWeather = /weather|rain|temperature|forecast|climate|monsoon|ಹವಾಮಾನ|ಮಳೆ|ತಾಪಮಾನ|ಬಿಸಿಲು|मौसम|बारिश|तापमान/.test(qLower);
  const isCrop = /crop|grow|recommend|yield|soil|season|kharif|rabi|zaid|farming|plant|ಬೆಳೆ|ಯಾವ ಬೆಳೆ|ಶಿಫಾರಸು|ಮಣ್ಣು|ಮುಂಗಾರು|ಹಿಂಗಾರು|ಫಸಲು|फसल|खेती|मिट्टी|खरीफ|रबी/.test(qLower);
  const isScheme = /scheme|yojana|subsidy|pm kisan|pm-kisan|kcc|loan|insurance|fasal bima|ಯೋಜನೆ|ಸಬ್ಸಿಡಿ|ಕಿಸಾನ್|ವಿಮೆ|ಸಾಲ|ಲೋನ್|योजना|सब्सिडी|बीमा|ऋण|लोन/.test(qLower);

  // ───────────────────────────────────────────────────────────────────────────
  // INTENT 1: MARKET PRICES
  // ───────────────────────────────────────────────────────────────────────────
  if (isMarket || findCommodityKey(qLower)) {
    const prices = getDailyMarketPrices();
    const matchedKey = findCommodityKey(qLower);
    const matchedDistrict = findDistrictId(qLower);

    let filtered = prices;

    if (matchedKey) {
      const aliases = COMMODITY_SYNONYMS[matchedKey] || [];
      filtered = prices.filter(p => {
        const pName = p.name.toLowerCase();
        return aliases.some(a => pName.includes(a));
      });
    }

    if (matchedDistrict) {
      const distMatches = filtered.filter(p => p.district.toLowerCase().includes(matchedDistrict) || p.mandi.toLowerCase().includes(matchedDistrict));
      if (distMatches.length > 0) filtered = distMatches;
    }

    if (filtered.length === 0) {
      filtered = prices.slice(0, 4);
    } else {
      filtered = filtered.slice(0, 4);
    }

    const stats = getMarketStats(prices);

    if (lang === 'kn') {
      const itemsText = filtered.map(p => 
        `• **${p.name}** (${p.mandi}, ${p.state}): ಕ್ವಿಂಟಾಲ್‌ಗೆ **₹${p.modalPrice.toLocaleString('en-IN')}** (ಕೆ.ಜಿ.ಗೆ ₹${p.pricePerKg}) - ${p.trend === 'up' ? '📈 ಏರಿಕೆ (+' + p.changePct + '%)' : p.trend === 'down' ? '📉 ಇಳಿಕೆ (' + p.changePct + '%)' : '➡️ ಸ್ಥಿರ'}`
      ).join('\n');

      const speech = `ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರಗಳು: ${filtered[0].name} ${filtered[0].mandi} ಮಂಡಿಯಲ್ಲಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ${filtered[0].modalPrice} ರೂಪಾಯಿ. ಒಟ್ಟು ${stats.uniqueMandis} ಮಂಡಿಗಳಿಂದ ಲೈವ್ ದರ ನವೀಕರಿಸಲಾಗಿದೆ.`;

      return {
        intent: 'market_price',
        language: 'kn',
        speechText: speech,
        text: `🌾 **ಇಂದಿನ ಅಧಿಕೃತ ಎಗ್‌ಮಾರ್ಕ್‌ನೆಟ್ (AGMARKNET) ಮಾರುಕಟ್ಟೆ ದರಗಳು:**\n\n${itemsText}\n\n💡 *ದೈನಂದಿನ ಸರಾಸರಿ ಆವಕ ಮತ್ತು ಹರಾಜು ದರಗಳನ್ನು ಆಧರಿಸಿ ಈ ಬೆಲೆಗಳು ನವೀಕರಿಸಲ್ಪಡುತ್ತವೆ.*`,
        cards: filtered.map(p => ({
          type: 'price',
          title: p.name,
          subtitle: `${p.mandi} Mandi (${p.state})`,
          badge: `₹${p.modalPrice}/Qtl`,
          secondary: `₹${p.pricePerKg}/Kg`,
          trend: p.trend,
          change: `${p.changePct > 0 ? '+' : ''}${p.changePct}%`
        })),
        quickReplies: ['ಕೋಲಾರ ಟೊಮೇಟೊ ಬೆಲೆ', 'ಹಾಸನ ಹವಾಮಾನ', 'ಮುಂಗಾರು ಬೆಳೆ ಶಿಫಾರಸು', 'ಪಿಎಂ ಕಿಸಾನ್ ₹6000 ಯೋಜನೆ']
      };
    } else if (lang === 'hi') {
      const itemsText = filtered.map(p => 
        `• **${p.name}** (${p.mandi}, ${p.state}): **₹${p.modalPrice.toLocaleString('en-IN')} / क्विंटल** (₹${p.pricePerKg} / किलो) - ${p.trend === 'up' ? '📈 तेजी (+' + p.changePct + '%)' : p.trend === 'down' ? '📉 गिरावट (' + p.changePct + '%)' : '➡️ स्थिर'}`
      ).join('\n');

      const speech = `आज का मंडी भाव: ${filtered[0].name} का भाव ${filtered[0].mandi} मंडी में ${filtered[0].modalPrice} रुपये प्रति क्विंटल है।`;

      return {
        intent: 'market_price',
        language: 'hi',
        speechText: speech,
        text: `🌾 **आज के एगमार्कनेट (AGMARKNET) दैनिक मंडी भाव:**\n\n${itemsText}\n\n💡 *कृषि मंत्रालय द्वारा जारी दैनिक नीलामी भाव के आधार पर स्वचालित रूप से अपडेट किया गया है।*`,
        cards: filtered.map(p => ({
          type: 'price',
          title: p.name,
          subtitle: `${p.mandi} मंडी (${p.state})`,
          badge: `₹${p.modalPrice}/क्विंटल`,
          secondary: `₹${p.pricePerKg}/किग्रा`,
          trend: p.trend,
          change: `${p.changePct > 0 ? '+' : ''}${p.changePct}%`
        })),
        quickReplies: ['टमाटर का आज का भाव', 'मौसम की जानकारी', 'खरीफ फसल की सलाह', 'पीएम किसान योजना']
      };
    } else {
      const itemsText = filtered.map(p => 
        `• **${p.name}** (${p.mandi}, ${p.state}): **₹${p.modalPrice.toLocaleString('en-IN')}/Qtl** (₹${p.pricePerKg}/kg) - ${p.trend === 'up' ? '📈 Rising (+' + p.changePct + '%)' : p.trend === 'down' ? '📉 Dropping (' + p.changePct + '%)' : '➡️ Stable'}`
      ).join('\n');

      const speech = `Today's market rate for ${filtered[0].name} in ${filtered[0].mandi} APMC is ${filtered[0].modalPrice} rupees per quintal. Live rates synced across ${stats.uniqueMandis} mandis.`;

      return {
        intent: 'market_price',
        language: 'en',
        speechText: speech,
        text: `🌾 **Today's Official AGMARKNET Mandi Modal Rates:**\n\n${itemsText}\n\n💡 *Prices are synchronized directly with APMC auction data for maximum accuracy.*`,
        cards: filtered.map(p => ({
          type: 'price',
          title: p.name,
          subtitle: `${p.mandi} APMC (${p.state})`,
          badge: `₹${p.modalPrice}/Qtl`,
          secondary: `₹${p.pricePerKg}/kg`,
          trend: p.trend,
          change: `${p.changePct > 0 ? '+' : ''}${p.changePct}%`
        })),
        quickReplies: ['Tomato price in Kolar', 'Weather in Hassan', 'Best Kharif crops', 'PM-Kisan Scheme']
      };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // INTENT 2: WEATHER & RAIN FORECAST
  // ───────────────────────────────────────────────────────────────────────────
  if (isWeather) {
    const targetDistrictId = findDistrictId(qLower) || 'kolar';
    const districtObj = KARNATAKA_DISTRICTS.find(d => d.id === targetDistrictId) || KARNATAKA_DISTRICTS[0];

    let weatherData;
    try {
      weatherData = await fetchPlaceWeather(districtObj.id);
    } catch {
      weatherData = {
        districtName: districtObj.name,
        kannadaName: districtObj.kannadaName,
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: 62,
        windSpeed: 14,
        precipitationProb: 20
      };
    }

    if (lang === 'kn') {
      const speech = `${weatherData.kannadaName || weatherData.districtName} ಜಿಲ್ಲೆಯಲ್ಲಿ ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${weatherData.temperature} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್. ಮಳೆಯ ಸಾಧ್ಯತೆ ಶೇಕಡಾ ${weatherData.precipitationProb}. ಕೃಷಿ ಕೆಲಸಗಳಿಗೆ ವಾತಾವರಣ ಅನುಕೂಲಕರವಾಗಿದೆ.`;

      return {
        intent: 'weather',
        language: 'kn',
        speechText: speech,
        text: `🌦️ **${weatherData.kannadaName || weatherData.districtName} ಜಿಲ್ಲೆಯ ಲೈವ್ ಹವಾಮಾನ ವರದಿ:**\n\n` +
              `• **ತಾಪಮಾನ**: ${weatherData.temperature}°C (ಅನಿಸಿಕೆ: ${weatherData.apparentTemperature || weatherData.temperature}°C)\n` +
              `• **ಸ್ಥಿತಿ**: ${weatherData.condition}\n` +
              `• **ಮಳೆಯ ಸಂಭವನೀಯತೆ**: ${weatherData.precipitationProb}%\n` +
              `• **ಆರ್ದ್ರತೆ (Humidity)**: ${weatherData.humidity}%\n` +
              `• **ಗಾಳಿಯ ವೇಗ**: ${weatherData.windSpeed} km/h\n\n` +
              `🌱 **ರೈತ ಸಲಹೆ**: ${weatherData.precipitationProb > 60 ? 'ಮಳೆಯ ಸಾಧ್ಯತೆ ಹೆಚ್ಚಿದೆ, ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಯನ್ನು ಮುಂದೂಡಿ.' : 'ಹವಾಮಾನ ಸ್ಥಿರವಾಗಿದೆ, ಕೃಷಿ ಹಾಗೂ ಕೊಯ್ಲು ಕೆಲಸಗಳನ್ನು ಮುಂದುವರಿಸಬಹುದು.'}`,
        cards: [{
          type: 'weather',
          title: `${weatherData.kannadaName || weatherData.districtName}`,
          badge: `${weatherData.temperature}°C`,
          subtitle: `${weatherData.condition}`,
          secondary: `ಮಳೆ ಸಾಧ್ಯತೆ: ${weatherData.precipitationProb}% | ಆರ್ದ್ರತೆ: ${weatherData.humidity}%`
        }],
        quickReplies: ['ಹಾಸನ ಹವಾಮಾನ', 'ಮಂಡ್ಯ ಹವಾಮಾನ', 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ', 'ಬೆಳೆ ಸಾಲ ಯೋಜನೆ']
      };
    } else if (lang === 'hi') {
      const speech = `${weatherData.districtName} में वर्तमान तापमान ${weatherData.temperature} डिग्री सेल्सियस है। बारिश की संभावना ${weatherData.precipitationProb} प्रतिशत है।`;

      return {
        intent: 'weather',
        language: 'hi',
        speechText: speech,
        text: `🌦️ **${weatherData.districtName} जिले की लाइव मौसम रिपोर्ट:**\n\n` +
              `• **तापमान**: ${weatherData.temperature}°C\n` +
              `• **मौसम की स्थिति**: ${weatherData.condition}\n` +
              `• **बारिश की संभावना**: ${weatherData.precipitationProb}%\n` +
              `• **आर्द्रता (Humidity)**: ${weatherData.humidity}%\n` +
              `• **हवा की गति**: ${weatherData.windSpeed} किमी/घंटा\n\n` +
              `🌱 **किसान सलाह**: ${weatherData.precipitationProb > 60 ? 'तेज बारिश की संभावना है, कीटनाशक छिड़काव स्थगित रखें।' : 'मौसम खेती और निराई-गुड़ाई के लिए बिल्कुल उपयुक्त है।'}`,
        cards: [{
          type: 'weather',
          title: `${weatherData.districtName}`,
          badge: `${weatherData.temperature}°C`,
          subtitle: `${weatherData.condition}`,
          secondary: `बारिश की संभावना: ${weatherData.precipitationProb}% | नमी: ${weatherData.humidity}%`
        }],
        quickReplies: ['कोलार का मौसम', 'मंडी में टमाटर का भाव', 'फसल सिफारिश', 'किसान क्रेडिट कार्ड']
      };
    } else {
      const speech = `The current temperature in ${weatherData.districtName} is ${weatherData.temperature} degrees Celsius with ${weatherData.condition}. Rain probability is ${weatherData.precipitationProb} percent.`;

      return {
        intent: 'weather',
        language: 'en',
        speechText: speech,
        text: `🌦️ **Live Weather Report for ${weatherData.districtName} District:**\n\n` +
              `• **Temperature**: ${weatherData.temperature}°C (Feels like: ${weatherData.apparentTemperature || weatherData.temperature}°C)\n` +
              `• **Condition**: ${weatherData.condition}\n` +
              `• **Rain Probability**: ${weatherData.precipitationProb}%\n` +
              `• **Humidity**: ${weatherData.humidity}%\n` +
              `• **Wind Speed**: ${weatherData.windSpeed} km/h\n\n` +
              `🌱 **Farmer Advisory**: ${weatherData.precipitationProb > 60 ? 'High probability of rain. Delay fertilizer and pesticide spray operations.' : 'Favorable dry weather for field preparation, irrigation, and harvesting.'}`,
        cards: [{
          type: 'weather',
          title: `${weatherData.districtName}`,
          badge: `${weatherData.temperature}°C`,
          subtitle: `${weatherData.condition}`,
          secondary: `Rain Chance: ${weatherData.precipitationProb}% | Humidity: ${weatherData.humidity}%`
        }],
        quickReplies: ['Weather in Mysuru', 'Tomato price in Kolar', 'Best crops for red soil', 'Crop Insurance Scheme']
      };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // INTENT 3: CROP RECOMMENDATION
  // ───────────────────────────────────────────────────────────────────────────
  if (isCrop) {
    let season = 'All';
    if (/kharif|monsoon|ಮುಂಗಾರು|खरीफ/.test(qLower)) season = 'kharif';
    else if (/rabi|winter|ಹಿಂಗಾರು|रबी/.test(qLower)) season = 'rabi';
    else if (/zaid|summer|ಬೇಸಿಗೆ|जायद/.test(qLower)) season = 'zaid';

    let soil = 'All';
    if (/red|ಕೆಂಪು|लाल/.test(qLower)) soil = 'Red Soil';
    else if (/black|ಕಪ್ಪು|काली/.test(qLower)) soil = 'Black Soil';
    else if (/alluvial|ಮೆಕ್ಕಲು|जलोढ़/.test(qLower)) soil = 'Alluvial Soil';

    const recommended = getRecommendedCrops({
      season,
      soilType: soil,
      waterAvailability: 'medium'
    }).slice(0, 3);

    if (lang === 'kn') {
      const cropsList = recommended.map(c => 
        `• **${c.nameKn || c.name}** (${c.icon}): ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್ **${c.compatibilityScore}%**, ಬೆಳೆಯುವ ಅವಧಿ: ${c.growingPeriod} ದಿನಗಳು, ಲಾಭದಾಯಕತೆ: ${c.profitabilityScore}/100, ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ: ${c.marketDemand === 'high' ? 'ಅತ್ಯಧಿಕ' : 'ಮಧ್ಯಮ'}`
      ).join('\n');

      const speech = `ಕರ್ನಾಟಕದ ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ಸೂಕ್ತವಾದ ಅತ್ಯುತ್ತಮ ಬೆಳೆಗಳು: ${recommended.map(c => c.nameKn || c.name).join(', ')}. ಇವುಗಳಲ್ಲಿ ${recommended[0].nameKn || recommended[0].name} ಹೆಚ್ಚಿನ ಲಾಭದಾಯಕತೆಯನ್ನು ಹೊಂದಿದೆ.`;

      return {
        intent: 'crop_recommendation',
        language: 'kn',
        speechText: speech,
        text: `🌱 **ಕಿಸಾನ್‌ವಾಣಿ (KisanVani) ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆ ಶಿಫಾರಸುಗಳು:**\n\n${cropsList}\n\n💡 *ಈ ಶಿಫಾರಸುಗಳನ್ನು ಕರ್ನಾಟಕದ ಕೃಷಿ-ಹವಾಮಾನ ವಲಯ, ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಲಾಭದಾಯಕತೆಯ ಆಧಾರದಲ್ಲಿ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.*`,
        cards: recommended.map(c => ({
          type: 'crop',
          title: `${c.icon} ${c.nameKn || c.name}`,
          badge: `${c.compatibilityScore}% Score`,
          subtitle: `ಅವಧಿ: ${c.growingPeriod} ದಿನಗಳು`,
          secondary: `ಮಣ್ಣು: ${c.soilTypes.join(', ')} | ನೀರು: ${c.waterRequirement}`
        })),
        quickReplies: ['ಕೆಂಪು ಮಣ್ಣಿಗೆ ಸೂಕ್ತ ಬೆಳೆ', 'ಕಪ್ಪು ಮಣ್ಣಿಗೆ ಬೆಳೆ', 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರ', 'ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ']
      };
    } else if (lang === 'hi') {
      const cropsList = recommended.map(c => 
        `• **${c.nameHi || c.name}** (${c.icon}): अनुकूलता स्कोर **${c.compatibilityScore}%**, अवधि: ${c.growingPeriod} दिन, लाभप्रदता: ${c.profitabilityScore}/100, बाजार मांग: ${c.marketDemand === 'high' ? 'उच्च' : 'मध्यम'}`
      ).join('\n');

      const speech = `आपकी मिट्टी और मौसम के लिए शीर्ष अनुशंसित फसलें हैं: ${recommended.map(c => c.nameHi || c.name).join(', ')}।`;

      return {
        intent: 'crop_recommendation',
        language: 'hi',
        speechText: speech,
        text: `🌱 **किसानवाणी (KisanVani) शीर्ष फसल अनुशंसा:**\n\n${cropsList}\n\n💡 *यह सिफारिश मिट्टी की उपयुक्तता, पानी की आवश्यकता और बाजार मांग पर आधारित है।*`,
        cards: recommended.map(c => ({
          type: 'crop',
          title: `${c.icon} ${c.nameHi || c.name}`,
          badge: `${c.compatibilityScore}% अनुकूलता`,
          subtitle: `अवधि: ${c.growingPeriod} दिन`,
          secondary: `मिट्टी: ${c.soilTypes.join(', ')} | पानी: ${c.waterRequirement}`
        })),
        quickReplies: ['काली मिट्टी के लिए फसल', 'लाल मिट्टी की फसल', 'मंडी भाव देखें', 'ड्रिप सिंचाई योजना']
      };
    } else {
      const cropsList = recommended.map(c => 
        `• **${c.name}** (${c.icon}): Compatibility **${c.compatibilityScore}%**, Growing Period: ${c.growingPeriod} days, Profitability Score: ${c.profitabilityScore}/100, Market Demand: ${c.marketDemand.toUpperCase()}`
      ).join('\n');

      const speech = `Top recommended crops based on Karnataka agronomic data are: ${recommended.map(c => c.name).join(', ')}. ${recommended[0].name} has the highest compatibility score of ${recommended[0].compatibilityScore} percent.`;

      return {
        intent: 'crop_recommendation',
        language: 'en',
        speechText: speech,
        text: `🌱 **KisanVani Agricultural Intelligence Crop Recommendations:**\n\n${cropsList}\n\n💡 *Ranked using real soil compatibility, water requirement, duration, and market profitability scores.*`,
        cards: recommended.map(c => ({
          type: 'crop',
          title: `${c.icon} ${c.name}`,
          badge: `${c.compatibilityScore}% Match`,
          subtitle: `Duration: ${c.growingPeriod} Days`,
          secondary: `Soils: ${c.soilTypes.join(', ')} | Water: ${c.waterRequirement}`
        })),
        quickReplies: ['Crops for Red Soil', 'Crops for Black Soil', 'Live Mandi Prices', 'PMKSY Drip Subsidy']
      };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // INTENT 4: GOVERNMENT SCHEMES & SUBSIDIES
  // ───────────────────────────────────────────────────────────────────────────
  if (isScheme) {
    let matchedScheme = AGRI_SCHEMES_KNOWLEDGE[0]; // Default PM-KISAN

    if (/pmfby|fasal bima|insurance|ವಿಮೆ|ಹಾನಿ|ನಷ್ಟ|बीमा/.test(qLower)) {
      matchedScheme = AGRI_SCHEMES_KNOWLEDGE[1];
    } else if (/kcc|credit card|loan|ಸಾಲ|ಲೋನ್|ऋण|क्रेडिट/.test(qLower)) {
      matchedScheme = AGRI_SCHEMES_KNOWLEDGE[2];
    } else if (/pmksy|drip|sprinkler|irrigation|ಹನಿ|ತುಂತುರು|ನೀರಾವರಿ|सिंचाई|ड्रिप/.test(qLower)) {
      matchedScheme = AGRI_SCHEMES_KNOWLEDGE[3];
    }

    if (lang === 'kn') {
      const speech = `${matchedScheme.name.kn}: ${matchedScheme.benefit.kn}. ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ${matchedScheme.howToApply.kn}`;

      return {
        intent: 'government_schemes',
        language: 'kn',
        speechText: speech,
        text: `🏛️ **${matchedScheme.name.kn}**\n\n` +
              `💰 **ಯೋಜನೆಯ ಪ್ರಯೋಜನಗಳು**:\n${matchedScheme.benefit.kn}\n\n` +
              `📋 **ಅರ್ಹತೆ**:\n${matchedScheme.eligibility.kn}\n\n` +
              `📝 **ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ**:\n${matchedScheme.howToApply.kn}`,
        cards: [{
          type: 'scheme',
          title: matchedScheme.name.kn,
          badge: 'ಸರ್ಕಾರಿ ಯೋಜನೆ',
          subtitle: matchedScheme.benefit.kn,
          secondary: `ಅರ್ಹತೆ: ${matchedScheme.eligibility.kn}`,
          link: matchedScheme.link
        }],
        quickReplies: ['ಬೆಳೆ ವಿಮೆ (PMFBY)', 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್', 'ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ', 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ']
      };
    } else if (lang === 'hi') {
      const speech = `${matchedScheme.name.hi}: ${matchedScheme.benefit.hi}। आवेदन प्रक्रिया: ${matchedScheme.howToApply.hi}`;

      return {
        intent: 'government_schemes',
        language: 'hi',
        speechText: speech,
        text: `🏛️ **${matchedScheme.name.hi}**\n\n` +
              `💰 **योजना के लाभ**:\n${matchedScheme.benefit.hi}\n\n` +
              `📋 **पात्रता**:\n${matchedScheme.eligibility.hi}\n\n` +
              `📝 **आवेदन कैसे करें**:\n${matchedScheme.howToApply.hi}`,
        cards: [{
          type: 'scheme',
          title: matchedScheme.name.hi,
          badge: 'सरकारी योजना',
          subtitle: matchedScheme.benefit.hi,
          secondary: `पात्रता: ${matchedScheme.eligibility.hi}`,
          link: matchedScheme.link
        }],
        quickReplies: ['फसल बीमा योजना (PMFBY)', 'किसान क्रेडिट कार्ड (KCC)', 'ड्रिप सिंचाई सब्सिडी', 'मंडी भाव देखें']
      };
    } else {
      const speech = `${matchedScheme.name.en}. Key Benefit: ${matchedScheme.benefit.en}. You can apply through ${matchedScheme.howToApply.en}`;

      return {
        intent: 'government_schemes',
        language: 'en',
        speechText: speech,
        text: `🏛️ **${matchedScheme.name.en}**\n\n` +
              `💰 **Key Benefit**:\n${matchedScheme.benefit.en}\n\n` +
              `📋 **Eligibility Criteria**:\n${matchedScheme.eligibility.en}\n\n` +
              `📝 **How to Apply**:\n${matchedScheme.howToApply.en}`,
        cards: [{
          type: 'scheme',
          title: matchedScheme.name.en,
          badge: 'Govt Scheme',
          subtitle: matchedScheme.benefit.en,
          secondary: `Eligibility: ${matchedScheme.eligibility.en}`,
          link: matchedScheme.link
        }],
        quickReplies: ['Crop Insurance (PMFBY)', 'Kisan Credit Card (KCC)', 'Drip Irrigation Subsidy', 'Live Mandi Prices']
      };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DEFAULT / GREETING / ASSISTANCE
  // ───────────────────────────────────────────────────────────────────────────
  if (lang === 'kn') {
    const speech = "ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಾನು ಅಗ್ರಿಚೈನ್ ಕೃಷಿ ಎಐ ಸಹಾಯಕ. ಇಂದಿನ ಮಂಡಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು, ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಬೆಳೆ ಶಿಫಾರಸು ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.";

    return {
      intent: 'general_help',
      language: 'kn',
      speechText: speech,
      text: `👋 **ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿಚೈನ್ (AgriChain) ಕೃಷಿ ಎಐ ಮಿತ್ರ.**\n\n` +
            `ನಾನು ನಿಮಗೆ ಈ ಕೆಳಗಿನ ವಿಷಯಗಳಲ್ಲಿ ನೇರವಾಗಿ ಧ್ವನಿ ಮತ್ತು ಸಂದೇಶದ ಮೂಲಕ ಮಾಹಿತಿ ನೀಡಬಲ್ಲೆ:\n\n` +
            `• 📈 **ಮಾರುಕಟ್ಟೆ ದರಗಳು**: ಟೊಮೆಟೊ, ಈರುಳ್ಳಿ, ಆಲೂಗಡ್ಡೆ, ಕಡಲೆ, ಹತ್ತಿ ಇತ್ಯಾದಿಗಳ ಲೈವ್ ಮಂಡಿ ಬೆಲೆಗಳು.\n` +
            `• 🌦️ **ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ**: ನಿಮ್ಮ ಜಿಲ್ಲೆಯ ಮಳೆಯ ಸಾಧ್ಯತೆ, ತಾಪಮಾನ ಮತ್ತು ಕೃಷಿ ಮುನ್ಸೂಚನೆ.\n` +
            `• 🌱 **ಬೆಳೆ ಶಿಫಾರಸು**: ನಿಮ್ಮ ಮಣ್ಣು, ನೀರು ಮತ್ತು ಋತುವಿಗೆ ಸೂಕ್ತವಾದ ಗರಿಷ್ಠ ಲಾಭ ನೀಡುವ ಬೆಳೆಗಳು.\n` +
            `• 🏛️ **ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು**: ಪಿಎಂ ಕಿಸಾನ್ (₹6,000), ಬೆಳೆ ವಿಮೆ (PMFBY), ಕೆಸಿಸಿ (KCC) ಬೆಳೆ ಸಾಲ ಮತ್ತು ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ.\n\n` +
            `🎤 *ಕೆಳಗಿರುವ ಮೈಕ್ರೋಫೋನ್ ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಅಥವಾ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ!*`,
      cards: [],
      quickReplies: ['ಕೋಲಾರ ಟೊಮೇಟೊ ಬೆಲೆ', 'ಹಾಸನ ಹವಾಮಾನ', 'ಮುಂಗಾರು ಬೆಳೆ ಶಿಫಾರಸು', 'ಪಿಎಂ ಕಿಸಾನ್ ₹6000 ಯೋಜನೆ']
    };
  } else if (lang === 'hi') {
    const speech = "नमस्ते किसान भाई! मैं एग्रीचेन एआई सहायक हूँ। आप मुझसे आज का मंडी भाव, मौसम की जानकारी, फसल सलाह या सरकारी योजनाओं के बारे में पूछ सकते हैं।";

    return {
      intent: 'general_help',
      language: 'hi',
      speechText: speech,
      text: `👋 **नमस्ते किसान भाई! मैं आपका एग्रीचेन (AgriChain) कृषि एआई सहायक हूँ।**\n\n` +
            `आप मुझसे बोलकर या लिखकर इन विषयों पर तुरंत जानकारी ले सकते हैं:\n\n` +
            `• 📈 **मंडी भाव**: टमाटर, प्याज, आलू, चना, कपास आदि के लाइव दैनिक नीलामी भाव।\n` +
            `• 🌦️ **मौसम की जानकारी**: बारिश का पूर्वानुमान, तापमान और कृषि सलाह।\n` +
            `• 🌱 **फसल सिफारिश**: आपकी मिट्टी, मौसम और पानी के आधार पर अधिकतम लाभ देने वाली फसलें।\n` +
            `• 🏛️ **सरकारी योजनाएं**: पीएम-किसान सम्मान निधि (₹6,000), फसल बीमा, केसीसी लोन और ड्रिप सब्सिडी।\n\n` +
            `🎤 *नीचे दिए गए माइक बटन पर टैप करके बोलें या सवाल टाइप करें!*`,
      cards: [],
      quickReplies: ['टमाटर का आज का भाव', 'मौसम कैसा रहेगा?', 'खरीफ की अच्छी फसल', 'पीएम किसान योजना']
    };
  } else {
    const speech = "Hello farmer! I am your AgriChain AI Assistant. Ask me about live mandi market rates, real-time weather forecasts, seasonal crop recommendations, or government farming subsidies.";

    return {
      intent: 'general_help',
      language: 'en',
      speechText: speech,
      text: `👋 **Welcome! I am your AgriChain Farmer AI Assistant.**\n\n` +
            `I provide real-time verified data directly from official agricultural systems:\n\n` +
            `• 📈 **Market Prices**: Live AGMARKNET modal rates for Tomato, Onion, Potato, Chana, Cotton, Wheat, etc.\n` +
            `• 🌦️ **Weather Forecast**: District-level live temperatures, precipitation chance, and farming advisories.\n` +
            `• 🌱 **Crop Recommendations**: KisanVani intelligence tailored to season (Kharif/Rabi), soil type, and profit.\n` +
            `• 🏛️ **Government Schemes**: PM-KISAN (₹6,000/yr), PMFBY Crop Insurance, KCC low-interest credit, and PMKSY drip irrigation subsidies.\n\n` +
            `🎤 *Tap the microphone button to speak in English, Hindi, or Kannada, or type below!*`,
      cards: [],
      quickReplies: ['Today\'s Tomato Rate', 'Weather in Hassan', 'Best Kharif crops', 'PM-Kisan Scheme']
    };
  }
}
