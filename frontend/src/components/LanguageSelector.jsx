import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSelector({ variant = 'default', className = '' }) {
  const { language, setLanguage, supportedLanguages, currentLangInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 hover:bg-emerald-100/90 active:bg-emerald-200 border-2 border-emerald-300/90 text-emerald-900 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-xs cursor-pointer select-none"
        title="Change Language / भाषा बदलें / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
        aria-expanded={isOpen}
      >
        <Globe size={15} className="text-emerald-700 flex-shrink-0 animate-pulse" />
        <span className="text-sm leading-none">{currentLangInfo.flag}</span>
        <span className="font-extrabold tracking-tight">
          {currentLangInfo.nativeLabel}
        </span>
        <ChevronDown
          size={14}
          className={`text-emerald-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-44 sm:w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-emerald-200/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
        >
          <div className="px-3 py-1.5 border-b border-emerald-100 text-[10px] sm:text-[11px] font-black uppercase text-emerald-800 tracking-wider">
            Choose Language
          </div>
          {supportedLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-bold text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-100/80 text-emerald-950 font-black'
                    : 'text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900'
                }`}
                role="menuitem"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <div>
                    <div className="leading-tight">{lang.nativeLabel}</div>
                    <div className="text-[10px] text-gray-500 font-medium">{lang.label}</div>
                  </div>
                </div>
                {isSelected && <Check size={16} className="text-emerald-700 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
