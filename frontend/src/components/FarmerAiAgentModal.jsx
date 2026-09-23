import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Volume2, VolumeX, Send, Sparkles, X,
  Bot, Sprout, TrendingUp, Cloud, ExternalLink, RefreshCw,
  MessageSquare, ChevronDown, Maximize2
} from 'lucide-react';
import { processFarmerQuery } from '../services/farmerAiAgentService';
import { playFarmerSpeech, stopFarmerSpeech } from '../utils/farmerSpeechHelper';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerAiAgentModal() {
  const { language: contextLang, setLanguage: setContextLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(contextLang || 'en');
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [isCurrentlySpeaking, setIsCurrentlySpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recognitionAvailable, setRecognitionAvailable] = useState(false);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  // Sync with global language context if changed externally
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
        console.warn('Speech recognition init issue:', err);
      }
    }
  }, []);

  const navigate = useNavigate();

  // Text-To-Speech audio speaker helper with native + neural fallback
  const speakText = useCallback((text, langCode, forcePlay = false) => {
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

  // Initialize initial greeting when modal opens or language changes
  useEffect(() => {
    async function loadWelcome() {
      if (messages.length === 0) {
        setIsLoading(true);
        const welcome = await processFarmerQuery('', activeLang);
        setIsLoading(false);
        setMessages([
          {
            id: 'welcome_' + Date.now(),
            sender: 'bot',
            text: welcome.text,
            speechText: welcome.speechText,
            cards: welcome.cards || [],
            quickReplies: welcome.quickReplies || [],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (isSpeakingEnabled && isOpen) {
          speakText(welcome.speechText, activeLang);
        }
      }
    }
    loadWelcome();
  }, [isOpen, activeLang, speakText, isSpeakingEnabled, messages.length]);

  // Stop speech when closing or muting
  const toggleSpeaking = () => {
    if (isSpeakingEnabled) {
      stopFarmerSpeech();
      setIsCurrentlySpeaking(false);
      setIsSpeakingEnabled(false);
    } else {
      setIsSpeakingEnabled(true);
    }
  };

  // Switch language handler
  const handleLanguageChange = async (newLang) => {
    if (newLang === activeLang) return;
    stopFarmerSpeech();
    setIsCurrentlySpeaking(false);
    setActiveLang(newLang);
    if (setContextLang) setContextLang(newLang);

    setIsLoading(true);
    const welcome = await processFarmerQuery('', newLang);
    setIsLoading(false);

    setMessages(prev => [
      ...prev,
      {
        id: 'lang_switch_' + Date.now(),
        sender: 'bot',
        text: welcome.text,
        speechText: welcome.speechText,
        cards: welcome.cards || [],
        quickReplies: welcome.quickReplies || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    if (isSpeakingEnabled) {
      speakText(welcome.speechText, newLang);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Handle Send Query
  const handleSend = async (queryText) => {
    const textToSend = (queryText || inputText).trim();
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
        speakText(response.speechText, response.language || activeLang);
      }
    } catch (err) {
      setIsLoading(false);
      const fallbackText = activeLang === 'kn'
        ? 'ಕ್ಷಮಿಸಿ, ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಅಡಚಣೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
        : activeLang === 'hi'
        ? 'क्षमा करें, डेटा लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।'
        : 'Sorry, I encountered an issue retrieving the data. Please try again.';

      setMessages(prev => [
        ...prev,
        {
          id: 'error_' + Date.now(),
          sender: 'bot',
          text: fallbackText,
          speechText: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Toggle Microphone recording
  const toggleListening = () => {
    if (!recognitionAvailable || !recognitionRef.current) {
      alert(
        activeLang === 'kn'
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಕ್ರೋಮ್ ಅಥವಾ ಎಡ್ಜ್ ಬಳಸಿ.'
          : activeLang === 'hi'
          ? 'आपका ब्राउज़र वॉइस पहचान का समर्थन नहीं करता है। कृपया क्रोम या एज ब्राउज़र का उपयोग करें।'
          : 'Voice recognition is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        // Set speech language
        if (activeLang === 'kn') recognitionRef.current.lang = 'kn-IN';
        else if (activeLang === 'hi') recognitionRef.current.lang = 'hi-IN';
        else recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            handleSend(transcript);
          }
          setIsListening(false);
        };
        recognitionRef.current.onerror = (e) => {
          console.warn('Speech recognition error:', e);
          setIsListening(false);
        };
        recognitionRef.current.onend = () => setIsListening(false);

        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech start error:', err);
        setIsListening(false);
      }
    }
  };

  const getAgentTitle = () => {
    if (activeLang === 'kn') return 'ಕೃಷಿ ಎಐ ಮಿತ್ರ';
    if (activeLang === 'hi') return 'किसान एआई मित्र';
    return 'AgriChain Farmer AI';
  };

  const getAgentSubtitle = () => {
    if (activeLang === 'kn') return 'ಲೈವ್ ಮಾರುಕಟ್ಟೆ ದರ • ಹವಾಮಾನ • ಬೆಳೆ • ಯೋಜನೆಗಳು';
    if (activeLang === 'hi') return 'लाइव मंडी भाव • मौसम • फसल सलाह • सरकारी योजनाएं';
    return 'Live Mandi Prices • Weather • Crops • Govt Schemes';
  };

  const getInputPlaceholder = () => {
    if (isListening) {
      if (activeLang === 'kn') return 'ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ...';
      if (activeLang === 'hi') return 'सुन रहा हूँ... बोलिए...';
      return 'Listening... please speak now...';
    }
    if (activeLang === 'kn') return 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...';
    if (activeLang === 'hi') return 'अपना सवाल यहाँ लिखें या बोलकर पूछें...';
    return 'Ask market price, weather, crops, schemes...';
  };

  return (
    <>
      {/* ───────────────────────────────────────────────────────────────────────────
          1. FLOATING BOTTOM-RIGHT AGENT BUTTON
          ─────────────────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Tooltip Pill */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-xl border border-emerald-200 text-emerald-900 text-xs font-bold cursor-pointer hover:scale-105 hover:bg-emerald-50 transition-all duration-300 animate-bounce"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{getAgentTitle()}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full uppercase font-black">
              Voice AI
            </span>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          id="agrichain-farmer-ai-trigger"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Open AgriChain Farmer AI Voice Assistant"
          className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-700 via-green-600 to-teal-500 text-white shadow-2xl flex items-center justify-center cursor-pointer transform hover:scale-108 active:scale-95 transition-all duration-300 ring-4 ring-white/80 group"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-75 group-hover:opacity-100" />

          {isOpen ? (
            <X className="w-7 h-7 relative z-10 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <div className="relative z-10 flex items-center justify-center">
              <Bot className="w-8 h-8 drop-shadow-sm" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-white" />
              </span>
            </div>
          )}
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────
          2. EXPANDABLE CHAT MODAL
          ─────────────────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 sm:w-[440px] sm:max-w-[calc(100vw-32px)] h-full sm:h-[620px] bg-white sm:rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 text-white p-4 flex flex-col gap-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                  <Bot className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base tracking-tight leading-none text-white">
                      {getAgentTitle()}
                    </h3>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-100/90 font-medium tracking-wide mt-1">
                    {getAgentSubtitle()}
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1.5">
                {/* Voice / Audio Toggle */}
                <button
                  onClick={toggleSpeaking}
                  title={isSpeakingEnabled ? 'Voice Auto-Speak On (Click to Mute)' : 'Voice Muted (Click to Enable)'}
                  className={`p-2 rounded-xl transition-all ${
                    isSpeakingEnabled
                      ? 'bg-emerald-600/80 text-white hover:bg-emerald-500'
                      : 'bg-black/20 text-emerald-300 hover:bg-black/30'
                  }`}
                >
                  {isSpeakingEnabled ? (
                    <Volume2 className={`w-4 h-4 ${isCurrentlySpeaking ? 'animate-pulse text-amber-300' : ''}`} />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>

                {/* Full Page Button */}
                <button
                  onClick={() => {
                    stopFarmerSpeech();
                    setIsCurrentlySpeaking(false);
                    setIsOpen(false);
                    navigate('/farmer/ai');
                  }}
                  title="Open Full Page / ಪ್ರತ್ಯೇಕ ಪುಟ"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    stopFarmerSpeech();
                    setIsCurrentlySpeaking(false);
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Switcher Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-emerald-600/40">
              <span className="text-[11px] font-semibold text-emerald-200 flex items-center gap-1">
                🗣️ Language:
              </span>
              <div className="flex items-center bg-black/20 rounded-xl p-0.5 border border-white/10">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeLang === 'en'
                      ? 'bg-white text-emerald-900 shadow-sm'
                      : 'text-emerald-100 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeLang === 'hi'
                      ? 'bg-white text-emerald-900 shadow-sm'
                      : 'text-emerald-100 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => handleLanguageChange('kn')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeLang === 'kn'
                      ? 'bg-white text-emerald-900 shadow-sm'
                      : 'text-emerald-100 hover:text-white'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>
            </div>
          </div>

          {/* Active Speaking Indicator Bar */}
          {isCurrentlySpeaking && (
            <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-1.5 flex items-center justify-between text-xs text-amber-900 font-semibold animate-pulse">
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span>
                  {activeLang === 'kn'
                    ? 'ಧ್ವನಿ ಓದಲಾಗುತ್ತಿದೆ...'
                    : activeLang === 'hi'
                    ? 'उत्तर बोला जा रहा है...'
                    : 'Speaking answer aloud...'}
                </span>
              </div>
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsCurrentlySpeaking(false);
                }}
                className="text-[10px] text-amber-700 underline font-bold cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-sm shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0c831f] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs'
                  }`}
                >
                  {/* Message Text with simple line-break rendering */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text.split('\n').map((line, i) => {
                      if (line.startsWith('• **')) {
                        const parts = line.replace('• **', '').split('**');
                        return (
                          <div key={i} className="my-1.5 flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold shrink-0">•</span>
                            <div>
                              <strong className="text-slate-900">{parts[0]}</strong>
                              {parts[1]}
                            </div>
                          </div>
                        );
                      }
                      return <p key={i} className={line === '' ? 'h-2' : 'my-0.5'}>{line}</p>;
                    })}
                  </div>

                  {/* Render Visual Badges/Cards if present */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-2.5">
                      {msg.cards.map((card, cIdx) => (
                        <div
                          key={cIdx}
                          className="bg-slate-50 hover:bg-emerald-50/50 p-2.5 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-800 text-xs truncate">
                                {card.title}
                              </span>
                              {card.change && (
                                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                                  card.trend === 'up'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : card.trend === 'down'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {card.change}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {card.subtitle}
                            </p>
                            {card.secondary && (
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                {card.secondary}
                              </p>
                            )}
                          </div>

                          <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <span className="bg-emerald-700 text-white font-extrabold text-xs px-2 py-0.5 rounded-lg shadow-2xs">
                              {card.badge}
                            </span>
                            {card.link && (
                              <a
                                href={card.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-emerald-700 font-bold hover:underline inline-flex items-center gap-0.5"
                              >
                                Apply <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Footer: Audio Playback & Timestamp */}
                  <div className="mt-2 pt-1 flex items-center justify-between text-[10px] opacity-75 border-t border-slate-100/40">
                    <span>{msg.time}</span>
                    {msg.sender === 'bot' && msg.speechText && (
                      <button
                        onClick={() => speakText(msg.speechText, activeLang, true)}
                        className="flex items-center gap-1 hover:text-emerald-700 font-bold px-1.5 py-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Listen to this reply aloud"
                      >
                        <Volume2 className="w-3 h-3 text-emerald-600" />
                        <span>
                          {activeLang === 'kn' ? 'ಆಲಿಸಿ' : activeLang === 'hi' ? 'सुनें' : 'Listen'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Reply Pills */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.quickReplies.map((qr, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(qr)}
                        className="bg-white hover:bg-emerald-600 hover:text-white text-emerald-900 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-2xs transition-all duration-150 cursor-pointer active:scale-95"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 bg-white p-3 rounded-2xl w-fit shadow-xs border border-slate-200/60">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span className="text-xs font-semibold">
                  {activeLang === 'kn'
                    ? 'ಮಾಹಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...'
                    : activeLang === 'hi'
                    ? 'जानकारी खोजी जा रही है...'
                    : 'Fetching official agricultural data...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Wave Animation when Recording */}
          {isListening && (
            <div className="bg-emerald-50 border-t border-emerald-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <span className="text-xs font-extrabold text-emerald-900">
                  {activeLang === 'kn'
                    ? 'ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಚಾಲ್ತಿಯಲ್ಲಿದೆ... ಮಾತನಾಡಿ...'
                    : activeLang === 'hi'
                    ? 'माइक चालू है... बोलिए...'
                    : 'Microphone Active... Speak now...'}
                </span>
              </div>

              {/* Animated Audio Bars */}
              <div className="flex items-center gap-1">
                <span className="w-1 h-4 bg-emerald-600 rounded-full animate-bounce" />
                <span className="w-1 h-6 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-3 bg-emerald-700 rounded-full animate-bounce [animation-delay:0.3s]" />
                <span className="w-1 h-5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.45s]" />
              </div>
            </div>
          )}

          {/* Input & Microphone Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Microphone Button */}
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Stop Recording' : 'Speak to AI'}
                className={`p-3 rounded-2xl transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-md ring-4 ring-rose-200'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={getInputPlaceholder()}
                disabled={isLoading}
                className="flex-1 bg-slate-100 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-2xl border border-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all placeholder:text-slate-400"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-2xl transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
