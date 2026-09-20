/**
 * =============================================================================
 * KARNATAKA CROP SEASON-WISE RECOMMENDATION SERVICE
 * Sourced exclusively from KisanVani Agriculture Intelligence:
 * https://www.kisanvani.co.in/crop-recommendation
 *
 * Contains Karnataka-specific agro-climatic crops, seasonal classification
 * (Kharif, Rabi, Annual/Zaid), soil suitability, water needs, growing periods,
 * and market profitability scores.
 * =============================================================================
 */

export const SOIL_WEIGHTS = {
  'Alluvial Soil': 8,
  'Black Soil': 7,
  'Red Soil': 6,
  'Sandy Loam': 5,
  'Sandy Soil': 4,
  'Laterite Soil': 5,
  'Clay Loam': 6,
  'Mountain Soil': 3,
  'Coastal Alluvial': 7,
  'Forest Soil': 5,
  'Brown Soil': 4
};

export const KARNATAKA_CROPS = [
  {
    "id": "maize",
    "name": "Maize",
    "nameHi": "मक्का",
    "nameMr": "मका",
    "nameGu": "મકાઈ",
    "namePa": "ਮੱਕੀ",
    "nameKn": "ಮೆಕ್ಕೆಜೋಳ",
    "nameTa": "மக்காச்சோளம்",
    "nameTe": "మొక్కజొన్న",
    "nameBn": "ভুট্টা",
    "icon": "🌽",
    "category": "cereal",
    "season": "kharif",
    "soilTypes": [
      "Alluvial Soil",
      "Red Soil",
      "Sandy Loam"
    ],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 20,
    "tempMax": 30,
    "rainMin": 600,
    "rainMax": 1200,
    "growingPeriod": 100,
    "profitabilityScore": 72,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": [
      "karnataka",
      "madhya-pradesh",
      "bihar",
      "telangana",
      "rajasthan",
      "uttar-pradesh",
      "punjab"
    ]
  },
  {
    "id": "soybean",
    "name": "Soybean",
    "nameHi": "सोयाबीन",
    "nameMr": "सोयाबीन",
    "nameGu": "સોયાબીન",
    "namePa": "ਸੋਇਆਬੀਨ",
    "nameKn": "ಸೋಯಾಬೀನ್",
    "nameTa": "சோயாபீன்",
    "nameTe": "సోయాబీన్",
    "nameBn": "সয়াবিন",
    "icon": "🌱",
    "category": "oilseed",
    "season": "kharif",
    "soilTypes": [
      "Black Soil",
      "Red Soil",
      "Alluvial Soil"
    ],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 20,
    "tempMax": 33,
    "rainMin": 600,
    "rainMax": 800,
    "growingPeriod": 100,
    "profitabilityScore": 78,
    "marketDemand": "high",
    "riskLevel": "medium",
    "states": [
      "madhya-pradesh",
      "maharashtra",
      "rajasthan",
      "karnataka",
      "telangana"
    ]
  },
  {
    "id": "cotton",
    "name": "Cotton",
    "nameHi": "कपास",
    "nameMr": "कापूस",
    "nameGu": "કપાસ",
    "namePa": "ਕਪਾਹ",
    "nameKn": "ಹತ್ತಿ",
    "nameTa": "பருத்தி",
    "nameTe": "పత్తి",
    "nameBn": "তুলা",
    "icon": "🌿",
    "category": "fiber",
    "season": "kharif",
    "soilTypes": [
      "Black Soil",
      "Alluvial Soil",
      "Red Soil"
    ],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 21,
    "tempMax": 32,
    "rainMin": 500,
    "rainMax": 800,
    "growingPeriod": 165,
    "profitabilityScore": 82,
    "marketDemand": "high",
    "riskLevel": "high",
    "states": [
      "maharashtra",
      "gujarat",
      "telangana",
      "karnataka",
      "madhya-pradesh",
      "punjab",
      "haryana",
      "rajasthan"
    ]
  },
  {
    "id": "sugarcane",
    "name": "Sugarcane",
    "nameHi": "गन्ना",
    "nameMr": "ऊस",
    "nameGu": "શેરડી",
    "namePa": "ਗੰਨਾ",
    "nameKn": "ಕಬ್ಬು",
    "nameTa": "கரும்பு",
    "nameTe": "చెరకు",
    "nameBn": "আখ",
    "icon": "🎋",
    "category": "cash",
    "season": "annual",
    "soilTypes": [
      "Alluvial Soil",
      "Black Soil",
      "Red Soil"
    ],
    "waterRequirement": "high",
    "waterScore": 3,
    "tempMin": 20,
    "tempMax": 38,
    "rainMin": 1000,
    "rainMax": 1500,
    "growingPeriod": 360,
    "profitabilityScore": 80,
    "marketDemand": "high",
    "riskLevel": "medium",
    "states": [
      "uttar-pradesh",
      "maharashtra",
      "karnataka",
      "tamil-nadu",
      "bihar",
      "gujarat",
      "andhra-pradesh"
    ]
  },
  {
    "id": "groundnut",
    "name": "Groundnut",
    "nameHi": "मूंगफली",
    "nameMr": "शेंगदाणा",
    "nameGu": "મગફળી",
    "namePa": "ਮੂੰਗਫਲੀ",
    "nameKn": "ಕಡಲೆಕಾಯಿ",
    "nameTa": "வேர்க்கடலை",
    "nameTe": "వేరుశెనగ",
    "nameBn": "চীনাবাদাম",
    "icon": "🥜",
    "category": "oilseed",
    "season": "kharif",
    "soilTypes": [
      "Sandy Soil",
      "Alluvial Soil",
      "Red Soil"
    ],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 20,
    "tempMax": 30,
    "rainMin": 500,
    "rainMax": 800,
    "growingPeriod": 120,
    "profitabilityScore": 72,
    "marketDemand": "medium",
    "riskLevel": "medium",
    "states": [
      "gujarat",
      "andhra-pradesh",
      "telangana",
      "karnataka",
      "tamil-nadu",
      "maharashtra",
      "rajasthan"
    ]
  },
  {
    "id": "onion",
    "name": "Onion",
    "nameHi": "प्याज",
    "nameMr": "कांदा",
    "nameGu": "ડુંગળી",
    "namePa": "ਪਿਆਜ਼",
    "nameKn": "ಈರುಳ್ಳಿ",
    "nameTa": "வெங்காயம்",
    "nameTe": "ఉల్లిపాయ",
    "nameBn": "পেঁয়াজ",
    "icon": "🧅",
    "category": "vegetable",
    "season": "rabi",
    "soilTypes": [
      "Alluvial Soil",
      "Red Soil",
      "Sandy Loam"
    ],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 13,
    "tempMax": 25,
    "rainMin": 600,
    "rainMax": 750,
    "growingPeriod": 120,
    "profitabilityScore": 75,
    "marketDemand": "high",
    "riskLevel": "high",
    "states": [
      "maharashtra",
      "karnataka",
      "madhya-pradesh",
      "gujarat",
      "bihar",
      "rajasthan"
    ]
  },
  {
    "id": "tomato",
    "name": "Tomato",
    "nameHi": "टमाटर",
    "nameMr": "टोमॅटो",
    "nameGu": "ટમેટું",
    "namePa": "ਟਮਾਟਰ",
    "nameKn": "ಟೊಮ್ಯಾಟೊ",
    "nameTa": "தக்காளி",
    "nameTe": "టమోటా",
    "nameBn": "টমেটো",
    "icon": "🍅",
    "category": "vegetable",
    "season": "all-season",
    "soilTypes": [
      "Sandy Loam",
      "Alluvial Soil",
      "Red Soil"
    ],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 15,
    "tempMax": 30,
    "rainMin": 400,
    "rainMax": 600,
    "growingPeriod": 85,
    "profitabilityScore": 78,
    "marketDemand": "high",
    "riskLevel": "high",
    "states": [
      "maharashtra",
      "karnataka",
      "andhra-pradesh",
      "tamil-nadu",
      "odisha",
      "gujarat"
    ],
    "image": "https://www.languageguide.org/vocabulary/veg/images/tomato.webp"
  },
  {
    "id": "okra",
    "name": "Lady's Finger (Okra / Bhindi)",
    "nameHi": "भिंडी",
    "nameKn": "ಬೆಂಡೆಕಾಯಿ (Bende)",
    "icon": "🥒",
    "category": "vegetable",
    "season": "kharif",
    "soilTypes": ["Sandy Loam", "Alluvial Soil", "Red Soil", "Black Soil"],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 22,
    "tempMax": 35,
    "rainMin": 500,
    "rainMax": 800,
    "growingPeriod": 75,
    "profitabilityScore": 82,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": ["karnataka", "maharashtra", "andhra-pradesh", "gujarat"],
    "image": "/vegetables/okra-bhindi.webp"
  },
  {
    "id": "bittergourd",
    "name": "Bitter Gourd (Karela)",
    "nameHi": "करेला",
    "nameKn": "ಹಾಗಲಕಾಯಿ (Hagalakayi)",
    "icon": "🥒",
    "category": "vegetable",
    "season": "kharif",
    "soilTypes": ["Sandy Loam", "Alluvial Soil", "Red Soil"],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 20,
    "tempMax": 32,
    "rainMin": 500,
    "rainMax": 750,
    "growingPeriod": 80,
    "profitabilityScore": 79,
    "marketDemand": "high",
    "riskLevel": "medium",
    "states": ["karnataka", "maharashtra", "tamil-nadu"],
    "image": "/vegetables/bitter-gourd-karela.webp"
  },
  {
    "id": "bottlegourd",
    "name": "Bottle Gourd (Lauki)",
    "nameHi": "लौकी",
    "nameKn": "ಸೋರೆಕಾಯಿ (Sorekayi)",
    "icon": "🥒",
    "category": "vegetable",
    "season": "all-season",
    "soilTypes": ["Alluvial Soil", "Sandy Loam", "Clay Loam"],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 18,
    "tempMax": 32,
    "rainMin": 400,
    "rainMax": 700,
    "growingPeriod": 70,
    "profitabilityScore": 76,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": ["karnataka", "uttar-pradesh", "bihar"],
    "image": "/vegetables/bottle-gourd-lauki.webp"
  },
  {
    "id": "spinach",
    "name": "Spinach (Palak)",
    "nameHi": "पालक",
    "nameKn": "ಪಾಲಕ್ ಸೊಪ್ಪು (Palak)",
    "icon": "🥬",
    "category": "vegetable",
    "season": "rabi",
    "soilTypes": ["Alluvial Soil", "Sandy Loam", "Red Soil"],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 15,
    "tempMax": 25,
    "rainMin": 300,
    "rainMax": 600,
    "growingPeriod": 45,
    "profitabilityScore": 85,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": ["karnataka", "tamil-nadu", "maharashtra"],
    "image": "/vegetables/spinach-palak.webp"
  },
  {
    "id": "ivygourd",
    "name": "Ivy Gourd (Tindora / Dondakaya)",
    "nameHi": "कुंदरू (Tindora)",
    "nameKn": "ತೊಂಡೆಕಾಯಿ (Thondekayi)",
    "icon": "🥒",
    "category": "vegetable",
    "season": "all-season",
    "soilTypes": ["Sandy Loam", "Red Soil", "Alluvial Soil"],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 20,
    "tempMax": 32,
    "rainMin": 500,
    "rainMax": 800,
    "growingPeriod": 90,
    "profitabilityScore": 81,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": ["karnataka", "andhra-pradesh", "telangana"],
    "image": "/vegetables/ivy-gourd-tindora.webp"
  },
  {
    "id": "frenchbeans",
    "name": "French String Beans (Barbati)",
    "nameHi": "फ्रेंच बीन्स (Barbati)",
    "nameKn": "ಹುರುಳಿಕಾಯಿ (Hurulikayi)",
    "icon": "🫛",
    "category": "vegetable",
    "season": "rabi",
    "soilTypes": ["Red Soil", "Sandy Loam", "Laterite Soil"],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 15,
    "tempMax": 26,
    "rainMin": 400,
    "rainMax": 700,
    "growingPeriod": 65,
    "profitabilityScore": 86,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": ["karnataka", "tamil-nadu", "himachal-pradesh"],
    "image": "/vegetables/french-beans.webp"
  },
  {
    "id": "ashgourd",
    "name": "Ash Gourd (Kumbalakai)",
    "nameHi": "पेठा (Kumbalakai)",
    "nameKn": "ಬೂದು ಕುಂಬಳಕಾಯಿ (Boodu Kumbalakayi)",
    "icon": "🍈",
    "category": "vegetable",
    "season": "kharif",
    "soilTypes": ["Sandy Loam", "Alluvial Soil", "Red Soil"],
    "waterRequirement": "low",
    "waterScore": 1,
    "tempMin": 22,
    "tempMax": 35,
    "rainMin": 500,
    "rainMax": 900,
    "growingPeriod": 100,
    "profitabilityScore": 77,
    "marketDemand": "medium",
    "riskLevel": "low",
    "states": ["karnataka", "kerala", "tamil-nadu"],
    "image": "/vegetables/ash-gourd.webp"
  },
  {
    "id": "drumstick",
    "name": "Drumstick (Moringa)",
    "nameHi": "सहजन (Moringa)",
    "nameKn": "ನುಗ್ಗೆಕಾಯಿ (Nuggekayi)",
    "icon": "🌱",
    "category": "vegetable",
    "season": "all-season",
    "soilTypes": ["Sandy Loam", "Red Soil", "Black Soil"],
    "waterRequirement": "low",
    "waterScore": 1,
    "tempMin": 25,
    "tempMax": 38,
    "rainMin": 300,
    "rainMax": 700,
    "growingPeriod": 150,
    "profitabilityScore": 91,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": ["karnataka", "tamil-nadu", "andhra-pradesh"],
    "image": "/vegetables/drumstick.webp"
  },
  {
    "id": "pumpkin",
    "name": "Pumpkin (Kaddu / Bhopla)",
    "nameHi": "कद्दू",
    "nameKn": "ಸಿಹಿ ಕುಂಬಳಕಾಯಿ (Sihi Kumbalakayi)",
    "icon": "🎃",
    "category": "vegetable",
    "season": "kharif",
    "soilTypes": ["Sandy Loam", "Alluvial Soil", "Clay Loam"],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 18,
    "tempMax": 30,
    "rainMin": 400,
    "rainMax": 750,
    "growingPeriod": 95,
    "profitabilityScore": 74,
    "marketDemand": "medium",
    "riskLevel": "low",
    "states": ["karnataka", "madhya-pradesh", "odisha"],
    "image": "/vegetables/pumpkin-kaddu.webp"
  },
  {
    "id": "snakebean",
    "name": "Snake Bean (Yardlong Bean / Bodi)",
    "nameHi": "लोबिया (Bodi)",
    "nameKn": "ಹಾವಿನ ಕಾಯಿ / ಅಲಸಂದೆ",
    "icon": "🫛",
    "category": "vegetable",
    "season": "kharif",
    "soilTypes": ["Sandy Loam", "Red Soil", "Alluvial Soil"],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 20,
    "tempMax": 35,
    "rainMin": 500,
    "rainMax": 850,
    "growingPeriod": 60,
    "profitabilityScore": 80,
    "marketDemand": "medium",
    "riskLevel": "low",
    "states": ["karnataka", "tamil-nadu", "kerala"],
    "image": "/vegetables/snake-bean.webp"
  },
  {
    "id": "taroroot",
    "name": "Taro Root (Arbi / Chamadumpa)",
    "nameHi": "अरबी",
    "nameKn": "ಕೆಸುವಿನ ಗಡ್ಡೆ (Chamadumpa)",
    "icon": "🥔",
    "category": "vegetable",
    "season": "kharif",
    "soilTypes": ["Alluvial Soil", "Sandy Loam", "Laterite Soil"],
    "waterRequirement": "high",
    "waterScore": 3,
    "tempMin": 22,
    "tempMax": 32,
    "rainMin": 800,
    "rainMax": 1200,
    "growingPeriod": 140,
    "profitabilityScore": 83,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": ["karnataka", "kerala", "assam"],
    "image": "/vegetables/taro-root-arbi.webp"
  },
  {
    "id": "chickpea",
    "name": "Chickpea (Gram)",
    "nameHi": "चना",
    "nameMr": "हरभरा",
    "nameGu": "ચણા",
    "namePa": "ਛੋਲੇ",
    "nameKn": "ಕಡಲೆ",
    "nameTa": "கொண்டைக்கடலை",
    "nameTe": "శెనగ",
    "nameBn": "ছোলা",
    "icon": "🟤",
    "category": "pulse",
    "season": "rabi",
    "soilTypes": [
      "Alluvial Soil",
      "Black Soil",
      "Sandy Loam"
    ],
    "waterRequirement": "low",
    "waterScore": 1,
    "tempMin": 15,
    "tempMax": 25,
    "rainMin": 350,
    "rainMax": 600,
    "growingPeriod": 110,
    "profitabilityScore": 74,
    "marketDemand": "medium",
    "riskLevel": "low",
    "states": [
      "madhya-pradesh",
      "rajasthan",
      "maharashtra",
      "uttar-pradesh",
      "gujarat",
      "karnataka"
    ]
  },
  {
    "id": "pigeonpea",
    "name": "Pigeon Pea (Arhar)",
    "nameHi": "अरहर (तूर)",
    "nameMr": "तूर",
    "nameGu": "તુવેર",
    "namePa": "ਤੂਰ",
    "nameKn": "ತೊಗರಿ",
    "nameTa": "துவரை",
    "nameTe": "కంది",
    "nameBn": "অড়হর",
    "icon": "🟠",
    "category": "pulse",
    "season": "kharif",
    "soilTypes": [
      "Alluvial Soil",
      "Red Soil",
      "Black Soil"
    ],
    "waterRequirement": "low",
    "waterScore": 1,
    "tempMin": 20,
    "tempMax": 35,
    "rainMin": 600,
    "rainMax": 900,
    "growingPeriod": 160,
    "profitabilityScore": 80,
    "marketDemand": "high",
    "riskLevel": "medium",
    "states": [
      "maharashtra",
      "karnataka",
      "madhya-pradesh",
      "uttar-pradesh",
      "gujarat",
      "telangana"
    ]
  },
  {
    "id": "mung",
    "name": "Mung Bean",
    "nameHi": "मूंग",
    "nameMr": "मूग",
    "nameGu": "મગ",
    "namePa": "ਮੂੰਗ",
    "nameKn": "ಹೆಸರು",
    "nameTa": "பாசிப்பயறு",
    "nameTe": "పెసర",
    "nameBn": "মুগ",
    "icon": "🟢",
    "category": "pulse",
    "season": "kharif",
    "soilTypes": [
      "Alluvial Soil",
      "Sandy Loam"
    ],
    "waterRequirement": "low",
    "waterScore": 1,
    "tempMin": 25,
    "tempMax": 35,
    "rainMin": 500,
    "rainMax": 700,
    "growingPeriod": 70,
    "profitabilityScore": 70,
    "marketDemand": "medium",
    "riskLevel": "low",
    "states": [
      "rajasthan",
      "maharashtra",
      "gujarat",
      "madhya-pradesh",
      "karnataka",
      "telangana"
    ]
  },
  {
    "id": "millet",
    "name": "Millet (Bajra)",
    "nameHi": "बाजरा",
    "nameMr": "बाजरी",
    "nameGu": "બાજરો",
    "namePa": "ਬਾਜਰਾ",
    "nameKn": "ಸಜ್ಜೆ",
    "nameTa": "கம்பு",
    "nameTe": "సజ్జ",
    "nameBn": "বাজরা",
    "icon": "🌾",
    "category": "cereal",
    "season": "kharif",
    "soilTypes": [
      "Sandy Soil",
      "Red Soil",
      "Alluvial Soil"
    ],
    "waterRequirement": "low",
    "waterScore": 1,
    "tempMin": 25,
    "tempMax": 35,
    "rainMin": 300,
    "rainMax": 600,
    "growingPeriod": 80,
    "profitabilityScore": 68,
    "marketDemand": "medium",
    "riskLevel": "low",
    "states": [
      "rajasthan",
      "haryana",
      "gujarat",
      "uttar-pradesh",
      "maharashtra",
      "karnataka"
    ]
  },
  {
    "id": "banana",
    "name": "Banana",
    "nameHi": "केला",
    "nameMr": "केळी",
    "nameGu": "કેળા",
    "namePa": "ਕੇਲਾ",
    "nameKn": "ಬಾಳೆ",
    "nameTa": "வாழைப்பழம்",
    "nameTe": "అరటిపండు",
    "nameBn": "কলা",
    "icon": "🍌",
    "category": "fruit",
    "season": "annual",
    "soilTypes": [
      "Alluvial Soil",
      "Red Soil",
      "Sandy Loam"
    ],
    "waterRequirement": "high",
    "waterScore": 3,
    "tempMin": 20,
    "tempMax": 35,
    "rainMin": 750,
    "rainMax": 1200,
    "growingPeriod": 360,
    "profitabilityScore": 82,
    "marketDemand": "high",
    "riskLevel": "medium",
    "states": [
      "tamil-nadu",
      "maharashtra",
      "gujarat",
      "andhra-pradesh",
      "karnataka",
      "madhya-pradesh"
    ]
  },
  {
    "id": "mango",
    "name": "Mango",
    "nameHi": "आम",
    "nameMr": "आंबा",
    "nameGu": "કેરી",
    "namePa": "ਅੰਬ",
    "nameKn": "ಮಾವು",
    "nameTa": "மாம்பழம்",
    "nameTe": "మామిడి",
    "nameBn": "আম",
    "icon": "🥭",
    "category": "fruit",
    "season": "annual",
    "soilTypes": [
      "Alluvial Soil",
      "Red Soil",
      "Sandy Loam"
    ],
    "waterRequirement": "low",
    "waterScore": 1,
    "tempMin": 15,
    "tempMax": 35,
    "rainMin": 500,
    "rainMax": 1000,
    "growingPeriod": 1095,
    "profitabilityScore": 85,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": [
      "uttar-pradesh",
      "andhra-pradesh",
      "karnataka",
      "maharashtra",
      "tamil-nadu",
      "gujarat",
      "bihar"
    ]
  },
  {
    "id": "grape",
    "name": "Grapes",
    "nameHi": "अंगूर",
    "nameMr": "द्राक्ष",
    "nameGu": "દ્રાક્ષ",
    "namePa": "ਅੰਗੂਰ",
    "nameKn": "ದ್ರಾಕ್ಷಿ",
    "nameTa": "திராட்சை",
    "nameTe": "ద్రాక్ష",
    "nameBn": "আঙুর",
    "icon": "🍇",
    "category": "fruit",
    "season": "annual",
    "soilTypes": [
      "Sandy Loam",
      "Red Soil",
      "Black Soil"
    ],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 15,
    "tempMax": 35,
    "rainMin": 500,
    "rainMax": 600,
    "growingPeriod": 110,
    "profitabilityScore": 88,
    "marketDemand": "high",
    "riskLevel": "high",
    "states": [
      "maharashtra",
      "karnataka",
      "tamil-nadu",
      "andhra-pradesh",
      "punjab"
    ]
  },
  {
    "id": "pomegranate",
    "name": "Pomegranate",
    "nameHi": "अनार",
    "nameMr": "डाळिंब",
    "nameGu": "દાડમ",
    "namePa": "ਅਨਾਰ",
    "nameKn": "ದಾಳಿಂಬೆ",
    "nameTa": "மாதுளை",
    "nameTe": "దానిమ్మ",
    "nameBn": "ডালিম",
    "icon": "🍎",
    "category": "fruit",
    "season": "annual",
    "soilTypes": [
      "Sandy Loam",
      "Red Soil",
      "Black Soil"
    ],
    "waterRequirement": "low",
    "waterScore": 1,
    "tempMin": 10,
    "tempMax": 40,
    "rainMin": 500,
    "rainMax": 800,
    "growingPeriod": 165,
    "profitabilityScore": 80,
    "marketDemand": "high",
    "riskLevel": "high",
    "states": [
      "maharashtra",
      "karnataka",
      "gujarat",
      "andhra-pradesh",
      "rajasthan"
    ]
  },
  {
    "id": "turmeric",
    "name": "Turmeric",
    "nameHi": "हल्दी",
    "nameMr": "हळद",
    "nameGu": "હળદર",
    "namePa": "ਹਲਦੀ",
    "nameKn": "ಅರಿಶಿನ",
    "nameTa": "மஞ்சள்",
    "nameTe": "పసుపు",
    "nameBn": "হলুদ",
    "icon": "🌾",
    "category": "spice",
    "season": "kharif",
    "soilTypes": [
      "Alluvial Soil",
      "Sandy Loam",
      "Red Soil"
    ],
    "waterRequirement": "high",
    "waterScore": 3,
    "tempMin": 20,
    "tempMax": 35,
    "rainMin": 1000,
    "rainMax": 1500,
    "growingPeriod": 240,
    "profitabilityScore": 82,
    "marketDemand": "high",
    "riskLevel": "medium",
    "states": [
      "telangana",
      "maharashtra",
      "tamil-nadu",
      "odisha",
      "karnataka"
    ]
  },
  {
    "id": "coffee",
    "name": "Coffee",
    "nameHi": "कॉफी",
    "nameMr": "कॉफी",
    "nameGu": "કૉફી",
    "namePa": "ਕੌਫੀ",
    "nameKn": "ಕಾಫಿ",
    "nameTa": "காபி",
    "nameTe": "కాఫీ",
    "nameBn": "কফি",
    "icon": "☕",
    "category": "commercial",
    "season": "annual",
    "soilTypes": [
      "Forest Soil",
      "Laterite Soil"
    ],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 15,
    "tempMax": 28,
    "rainMin": 1000,
    "rainMax": 2000,
    "growingPeriod": 270,
    "profitabilityScore": 85,
    "marketDemand": "high",
    "riskLevel": "medium",
    "states": [
      "karnataka",
      "kerala",
      "tamil-nadu"
    ]
  },
  {
    "id": "coconut",
    "name": "Coconut",
    "nameHi": "नारियल",
    "nameMr": "नारळ",
    "nameGu": "નારિયેળ",
    "namePa": "ਨਾਰੀਅਲ",
    "nameKn": "ತೆಂಗಿನಕಾಯಿ",
    "nameTa": "தேங்காய்",
    "nameTe": "కొబ్బరి",
    "nameBn": "নারিকেল",
    "icon": "🥥",
    "category": "commercial",
    "season": "annual",
    "soilTypes": [
      "Coastal Alluvial",
      "Sandy Loam"
    ],
    "waterRequirement": "medium",
    "waterScore": 2,
    "tempMin": 20,
    "tempMax": 35,
    "rainMin": 1000,
    "rainMax": 2000,
    "growingPeriod": 365,
    "profitabilityScore": 78,
    "marketDemand": "high",
    "riskLevel": "low",
    "states": [
      "kerala",
      "tamil-nadu",
      "karnataka",
      "andhra-pradesh",
      "gujarat"
    ]
  }
];

export const KARNATAKA_SEASONS = [
  { id: 'all', label: 'All Seasons', kannada: 'ಎಲ್ಲಾ ಋತುಗಳು' },
  { id: 'kharif', label: 'Kharif (Monsoon)', kannada: 'ಮುಂಗಾರು', months: 'June – October', desc: 'Main rain-fed cropping season across Karnataka' },
  { id: 'rabi', label: 'Rabi (Winter)', kannada: 'ಹಿಂಗಾರು', months: 'October – March', desc: 'Post-monsoon and cool winter cropping season' },
  { id: 'annual', label: 'Annual / Perennial', kannada: 'ವಾರ್ಷಿಕ / ಶಾಶ್ವತ', months: 'Year-round', desc: 'Horticulture, plantation and long-duration cash crops' },
];

export const KARNATAKA_SOILS = [
  'All',
  'Red Soil',
  'Black Soil',
  'Sandy Loam',
  'Alluvial Soil',
  'Laterite Soil',
  'Sandy Soil',
  'Coastal Alluvial',
  'Forest Soil'
];

/**
 * KisanVani Algorithm ported for Karnataka Crops:
 * Calculates suitability and compatibility score (0-100) based on
 * soil match, irrigation level, market demand, profitability, and risk.
 */
export function getRecommendedCrops({ season = 'all', soilType = 'All', waterAvailability = 'All', searchQuery = '' }) {
  return KARNATAKA_CROPS
    .filter((crop) => {
      // Filter by season
      const matchSeason =
        season === 'all' ||
        crop.season === season ||
        crop.season === 'all-season';

      // Filter by soil
      const matchSoil =
        soilType === 'All' ||
        crop.soilTypes.includes(soilType);

      // Filter by water requirement
      const matchWater =
        waterAvailability === 'All' ||
        crop.waterRequirement.toLowerCase() === waterAvailability.toLowerCase();

      // Filter by search query (English & Kannada)
      const matchSearch =
        !searchQuery.trim() ||
        crop.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (crop.nameKn && crop.nameKn.includes(searchQuery.trim())) ||
        crop.category.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchSeason && matchSoil && matchWater && matchSearch;
    })
    .map((crop) => {
      // Calculate KisanVani compatibility score
      let score = 0;
      if (soilType !== 'All') {
        if (crop.soilTypes.includes(soilType)) {
          score += 25;
        } else {
          score += 10;
        }
      } else {
        score += 20;
      }

      // Water score
      if (waterAvailability === 'high') {
        score += crop.waterRequirement === 'high' ? 20 : 15;
      } else if (waterAvailability === 'medium') {
        score += crop.waterRequirement === 'medium' ? 20 : 10;
      } else if (waterAvailability === 'low') {
        score += crop.waterRequirement === 'low' ? 25 : 5;
      } else {
        score += 15;
      }

      // Profitability component (25%)
      score += (crop.profitabilityScore / 100) * 25;

      // Market demand (20%)
      score += crop.marketDemand === 'high' ? 20 : 10;

      // Risk adjustment
      if (crop.riskLevel === 'low') score += 10;
      else if (crop.riskLevel === 'high') score -= 5;

      // Fast duration bonus
      if (crop.growingPeriod <= 120) score += 5;

      const finalCompatibility = Math.round(Math.min(score, 100));

      return {
        ...crop,
        compatibilityScore: finalCompatibility
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
