import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mic, MicOff, Volume2, VolumeX, Send, Sparkles,
  Bot, Sprout, TrendingUp, Cloud, FileText, ArrowLeft,
  Home, RefreshCw, CheckCircle, ExternalLink, HelpCircle
} from 'lucide-react';
import { processFarmerQuery } from '../services/farmerAiAgentService';
import { playFarmerSpeech, stopFarmerSpeech } from '../utils/farmerSpeechHelper';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerAiAssistant() {
  const navigate = useNavigate();
  const { language: contextLang, setLanguage: setContextLang } = useLanguage();

  const [activeLang, setActiveLang] = useState(contextLang || 'kn'); // Default to Kannada or user preferred
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [isCurrentlySpeaking, setIsCurrentlySpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recognitionAvailable, setRecognitionAvailable] = useState(false);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync with language context
  useEffect(() => {
    if (contextLang && ['en', 'hi', 'kn'].includes(contextLang)) {
      setActiveLang(contextLang);
    }
  }, [contextLang]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionAvailable(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition init:', err);
      }
    }
  }, []);

  // Audio speech trigger
  const triggerSpeech = useCallback((text, langCode, forcePlay = false) => {
    if ((!isSpeakingEnabled && !forcePlay) || !text) {
      stopFarmerSpeech();
      setIsCurrentlySpeaking(false);
      return;
    }
    if (forcePlay && !isSpeakingEnabled) {
      setIsSpeakingEnabled(true);
    }
    playFarmerSpeech(
      text,
      langCode,
      () => setIsCurrentlySpeaking(true),
      () => setIsCurrentlySpeaking(false),
      () => setIsCurrentlySpeaking(false)
    );
  }, [isSpeakingEnabled]);

  // Initialize Welcome Message
  useEffect(() => {
    async function loadWelcome() {
      if (messages.length === 0) {
        setIsLoading(true);
        const welcome = await processFarmerQuery('', activeLang);
        setIsLoading(false);

        const initialMsg = {
          id: 'welcome_' + Date.now(),
          sender: 'bot',
          text: welcome.text,
          speechText: welcome.speechText,
          cards: welcome.cards || [],
          quickReplies: welcome.quickReplies || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([initialMsg]);

        if (isSpeakingEnabled) {
          triggerSpeech(welcome.speechText, activeLang);
        }
      }
    }
    loadWelcome();
  }, [activeLang, triggerSpeech, isSpeakingEnabled, messages.length]);

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      stopFarmerSpeech();
    };
  }, []);

  // Language switcher
  const handleLanguageChange = async (newLang) => {
    if (newLang === activeLang) return;
    stopFarmerSpeech();
    setIsCurrentlySpeaking(false);
    setActiveLang(newLang);
    if (setContextLang) setContextLang(newLang);

    setIsLoading(true);
    const welcome = await processFarmerQuery('', newLang);
    setIsLoading(false);

    const switchMsg = {
      id: 'switch_' + Date.now(),
      sender: 'bot',
      text: welcome.text,
      speechText: welcome.speechText,
      cards: welcome.cards || [],
      quickReplies: welcome.quickReplies || [],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, switchMsg]);
    if (isSpeakingEnabled) {
      triggerSpeech(welcome.speechText, newLang);
    }
  };

  // Toggle voice mute
  const toggleSpeaking = () => {
    if (isSpeakingEnabled) {
      stopFarmerSpeech();
      setIsCurrentlySpeaking(false);
      setIsSpeakingEnabled(false);
    } else {
      setIsSpeakingEnabled(true);
    }
  };

  // Send message
  const handleSend = async (customQuery) => {
    const textToSend = (customQuery || inputText).trim();
    if (!textToSend || isLoading) return;

    setInputText('');
    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await processFarmerQuery(textToSend, activeLang);
      setIsLoading(false);

      const botMsg = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: response.text,
        speechText: response.speechText,
        cards: response.cards || [],
        quickReplies: response.quickReplies || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      if (isSpeakingEnabled) {
        triggerSpeech(response.speechText, response.language || activeLang);
      }
    } catch (err) {
      setIsLoading(false);
      const fallback = activeLang === 'kn'
        ? 'ಕ್ಷಮಿಸಿ, ಮಾಹಿತಿಯನ್ನು ತರಲು ಅಡಚಣೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
        : activeLang === 'hi'
        ? 'क्षमा करें, डेटा लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
        : 'Sorry, I encountered an error. Please try again.';

      setMessages(prev => [
        ...prev,
        {
          id: 'error_' + Date.now(),
          sender: 'bot',
          text: fallback,
          speechText: fallback,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Voice recording toggle
  const toggleListening = () => {
    if (!recognitionAvailable || !recognitionRef.current) {
      alert(
        activeLang === 'kn'
          ? 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು Google Chrome ಅಥವಾ Microsoft Edge ಬಳಸಿ.'
          : activeLang === 'hi'
          ? 'वॉइस पहचान उपलब्ध नहीं है। कृपया गूगल क्रोम या माइक्रोसॉफ्ट एज का उपयोग करें।'
          : 'Voice input requires Google Chrome or Microsoft Edge.'
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      stopFarmerSpeech();
      setIsCurrentlySpeaking(false);
      try {
        if (activeLang === 'kn') recognitionRef.current.lang = 'kn-IN';
        else if (activeLang === 'hi') recognitionRef.current.lang = 'hi-IN';
        else recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onresult = (e) => {
          const spoken = e.results[0][0].transcript;
          if (spoken) {
            setInputText(spoken);
            handleSend(spoken);
          }
          setIsListening(false);
        };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);

        recognitionRef.current.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getPageTitle = () => {
    if (activeLang === 'kn') return 'ಕೃಷಿ ಎಐ ಧ್ವನಿ ಮಿತ್ರ (AgriChain AI)';
    if (activeLang === 'hi') return 'किसान एआई वॉइस मित्र (AgriChain AI)';
    return 'AgriChain Farmer Voice & Text AI';
  };

  const getPageSubtitle = () => {
    if (activeLang === 'kn') return 'ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ, ಹವಾಮಾನ, ಬೆಳೆ ಹಾಗೂ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಕೇಳಿ ತಿಳಿದುಕೊಳ್ಳಿ';
    if (activeLang === 'hi') return 'कन्नड़, हिंदी और अंग्रेजी में मंडी भाव, मौसम, फसल सलाह और सरकारी योजनाओं की सटीक जानकारी';
    return 'Interactive voice assistant for live market rates, weather forecasts, crop advisory, and government schemes.';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── HEADER ── */}
      <header className="bg-slate-950/90 backdrop-blur-xl border-b border-emerald-900/40 px-4 sm:px-8 py-3.5 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Back & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-white transition-all border border-emerald-500/20 cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link to="/farmer-dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center p-1 shadow-lg shadow-emerald-500/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                  <span>{getPageTitle()}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase font-black tracking-wider">
                    Voice Live
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {getPageSubtitle()}
                </p>
              </div>
            </Link>
          </div>

          {/* Controls: Audio Toggle & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Voice Toggle */}
            <button
              onClick={toggleSpeaking}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                isSpeakingEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
              title={isSpeakingEnabled ? 'Auto Voice Playback Active' : 'Voice Playback Muted'}
            >
              {isSpeakingEnabled ? (
                <>
                  <Volume2 className={`w-4 h-4 ${isCurrentlySpeaking ? 'animate-bounce text-amber-400' : 'text-emerald-400'}`} />
                  <span className="hidden md:inline">Voice On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden md:inline">Muted</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800/90 rounded-2xl p-1 border border-slate-700 shadow-inner">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeLang === 'en'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeLang === 'hi'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLanguageChange('kn')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeLang === 'kn'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT GRID ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* LEFT COLUMN: Voice Control Station & Quick Inquiries (4 cols) */}
        <section className="lg:col-span-4 flex flex-col gap-5">
          {/* Huge Voice Station Card */}
          <div className="bg-gradient-to-b from-slate-800/90 to-slate-950/90 rounded-3xl p-6 border border-emerald-500/20 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mb-5 flex flex-col items-center">
              {/* Pulsing ring for listening or speaking */}
              {(isListening || isCurrentlySpeaking) && (
                <span className={`absolute -inset-4 rounded-full animate-ping opacity-75 ${
                  isListening ? 'bg-rose-500/30' : 'bg-emerald-500/30'
                }`} />
              )}

              {/* Central Mic Button */}
              <button
                onClick={toggleListening}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                  isListening
                    ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white ring-8 ring-rose-500/30 scale-105'
                    : isCurrentlySpeaking
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white ring-8 ring-emerald-500/30'
                    : 'bg-gradient-to-tr from-emerald-700 via-green-600 to-teal-500 text-white hover:scale-105 ring-4 ring-emerald-500/20'
                }`}
                title={isListening ? 'Stop Recording' : 'Speak to AI'}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
                ) : (
                  <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
                )}
              </button>
            </div>

            {/* Speaking / Listening Status Text */}
            <div className="space-y-1">
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {isListening
                  ? activeLang === 'kn' ? 'ರೆಕಾರ್ಡಿಂಗ್ ಚಾಲ್ತಿಯಲ್ಲಿದೆ...' : activeLang === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening to your voice...'
                  : isCurrentlySpeaking
                  ? activeLang === 'kn' ? 'ಧ್ವನಿ ಓದಲಾಗುತ್ತಿದೆ...' : activeLang === 'hi' ? 'उत्तर बोला जा रहा है...' : 'Speaking reply aloud...'
                  : activeLang === 'kn' ? 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿರಿ' : activeLang === 'hi' ? 'बोलने के लिए माइक दबाएं' : 'Tap Mic to Speak'}
              </h3>
              <p className="text-xs text-slate-400">
                {activeLang === 'kn'
                  ? 'ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಮಾತನಾಡಿ'
                  : activeLang === 'hi'
                  ? 'कन्नड़, हिंदी या अंग्रेजी में खुलकर पूछें'
                  : 'Ask in Kannada, Hindi, or English'}
              </p>
            </div>

            {/* Active Soundwave Animation */}
            {(isListening || isCurrentlySpeaking) && (
              <div className="flex items-center gap-1.5 mt-4">
                <span className="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-10 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                <span className="w-1.5 h-8 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.45s]" />
                <span className="w-1.5 h-5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.6s]" />
              </div>
            )}
          </div>

          {/* Quick Categories Navigation */}
          <div className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700/80 flex flex-col gap-3">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{activeLang === 'kn' ? 'ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು' : activeLang === 'hi' ? 'त्वरित प्रश्न' : 'Quick Actions'}</span>
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => handleSend(activeLang === 'kn' ? 'ಕೋಲಾರ ಮಂಡಿ ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?' : activeLang === 'hi' ? 'टमाटर का मंडी भाव क्या है?' : 'What is today\'s Tomato price in Kolar?')}
                className="w-full text-left p-3 rounded-2xl bg-slate-900/70 hover:bg-emerald-950/60 border border-slate-700/60 hover:border-emerald-500/40 text-xs text-slate-200 hover:text-white transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🍅</span>
                  <span className="font-bold">{activeLang === 'kn' ? 'ಟೊಮೇಟೊ ಮಂಡಿ ಬೆಲೆ' : activeLang === 'hi' ? 'टमाटर का भाव' : 'Tomato Mandi Price'}</span>
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              <button
                onClick={() => handleSend(activeLang === 'kn' ? 'ಹಾಸನ ಜಿಲ್ಲೆಯ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ತಿಳಿಸಿ' : activeLang === 'hi' ? 'हासन जिले का मौसम कैसा है?' : 'What is the weather forecast for Hassan?')}
                className="w-full text-left p-3 rounded-2xl bg-slate-900/70 hover:bg-emerald-950/60 border border-slate-700/60 hover:border-emerald-500/40 text-xs text-slate-200 hover:text-white transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🌦️</span>
                  <span className="font-bold">{activeLang === 'kn' ? 'ಲೈವ್ ಹವಾಮಾನ ವರದಿ' : activeLang === 'hi' ? 'लाइव मौसम रिपोर्ट' : 'Live Weather Forecast'}</span>
                </div>
                <Cloud className="w-3.5 h-3.5 text-sky-400" />
              </button>

              <button
                onClick={() => handleSend(activeLang === 'kn' ? 'ಮುಂಗಾರು ಹಂಗಾಮಿಗೆ ಯಾವ ಬೆಳೆ ಉತ್ತಮ?' : activeLang === 'hi' ? 'खरीफ सीजन के लिए कौन सी फसल अच्छी है?' : 'Recommend best crops for Kharif season')}
                className="w-full text-left p-3 rounded-2xl bg-slate-900/70 hover:bg-emerald-950/60 border border-slate-700/60 hover:border-emerald-500/40 text-xs text-slate-200 hover:text-white transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🌱</span>
                  <span className="font-bold">{activeLang === 'kn' ? 'ಖಾರೀಫ್ ಬೆಳೆ ಶಿಫಾರಸು' : activeLang === 'hi' ? 'खरीफ फसल सलाह' : 'Kharif Crop Recommendation'}</span>
                </div>
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              <button
                onClick={() => handleSend(activeLang === 'kn' ? 'ಪಿಎಂ ಕಿಸಾನ್ ₹6000 ಯೋಜನೆ ಬಗ್ಗೆ ಮಾಹಿತಿ ಕೊಡಿ' : activeLang === 'hi' ? 'पीएम किसान सम्मान निधि योजना की जानकारी दें' : 'Tell me about PM-Kisan 6000 Scheme')}
                className="w-full text-left p-3 rounded-2xl bg-slate-900/70 hover:bg-emerald-950/60 border border-slate-700/60 hover:border-emerald-500/40 text-xs text-slate-200 hover:text-white transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">💰</span>
                  <span className="font-bold">{activeLang === 'kn' ? 'ಪಿಎಂ ಕಿಸಾನ್ ₹6,000 ಯೋಜನೆ' : activeLang === 'hi' ? 'पीएम किसान योजना' : 'PM-Kisan Scheme Details'}</span>
                </div>
                <FileText className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Multilingual Chat Stream (8 cols) */}
        <section className="lg:col-span-8 flex flex-col bg-slate-950 rounded-3xl border border-emerald-900/40 shadow-2xl overflow-hidden h-[680px]">
          {/* Chat Stream Header Status */}
          <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>AgriChain Intelligence Live</span>
            </div>
            {isCurrentlySpeaking && (
              <button
                onClick={() => {
                  stopFarmerSpeech();
                  setIsCurrentlySpeaking(false);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" /> Stop Speaking
              </button>
            )}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/80">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-3xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs font-semibold'
                      : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text.split('\n').map((line, i) => {
                      if (line.startsWith('• **')) {
                        const parts = line.replace('• **', '').split('**');
                        return (
                          <div key={i} className="my-2 flex items-start gap-2 text-slate-200">
                            <span className="text-emerald-400 font-bold shrink-0">•</span>
                            <div>
                              <strong className="text-white">{parts[0]}</strong>
                              {parts[1]}
                            </div>
                          </div>
                        );
                      }
                      return <p key={i} className={line === '' ? 'h-2' : 'my-1'}>{line}</p>;
                    })}
                  </div>

                  {/* Cards & Badges */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-slate-800 pt-3">
                      {msg.cards.map((card, cIdx) => (
                        <div
                          key={cIdx}
                          className="bg-slate-800/80 hover:bg-slate-800 p-3 rounded-2xl border border-slate-700/80 transition-all flex flex-col justify-between gap-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-extrabold text-white text-xs sm:text-sm">
                              {card.title}
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-300 font-black text-xs px-2 py-0.5 rounded-lg border border-emerald-500/30">
                              {card.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {card.subtitle}
                          </p>
                          {card.secondary && (
                            <p className="text-[11px] text-slate-500">
                              {card.secondary}
                            </p>
                          )}
                          {card.link && (
                            <a
                              href={card.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 mt-1"
                            >
                              Apply on Portal <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer Audio Playback & Timestamp */}
                  <div className="mt-3 pt-2 flex items-center justify-between text-xs opacity-75 border-t border-slate-800/60">
                    <span className="text-slate-400">{msg.time}</span>
                    {msg.sender === 'bot' && msg.speechText && (
                      <button
                        onClick={() => triggerSpeech(msg.speechText, activeLang, true)}
                        className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-black bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                        title="Replay Audio in Kannada / Hindi / English"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{activeLang === 'kn' ? 'ಆಲಿಸಿ (Play)' : activeLang === 'hi' ? 'सुनिए (Play)' : 'Listen (Play)'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Reply Pills */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                    {msg.quickReplies.map((qr, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(qr)}
                        className="bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-300 border border-slate-700 hover:border-emerald-500 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 bg-slate-900 p-4 rounded-3xl w-fit border border-slate-800">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-sm font-semibold">
                  {activeLang === 'kn' ? 'ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ...' : activeLang === 'hi' ? 'जानकारी एकत्र की जा रही है...' : 'Retrieving official information...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Station */}
          <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2.5"
            >
              {/* Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-4 ring-rose-500/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
                title="Speak Query"
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? activeLang === 'kn' ? 'ಧ್ವನಿ ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ...' : activeLang === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening... please speak...'
                    : activeLang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...' : activeLang === 'hi' ? 'अपना प्रश्न यहाँ लिखें या बोलकर पूछें...' : 'Ask Mandi prices, weather, crop recommendations, schemes...'
                }
                disabled={isLoading}
                className="flex-1 bg-slate-800/90 text-white placeholder:text-slate-500 text-sm sm:text-base px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-3.5 sm:p-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-2xl transition-all cursor-pointer shrink-0 shadow-md"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
