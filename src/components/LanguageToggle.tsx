import React from 'react';
import { useLanguage } from '../languageContext';
import { motion } from 'motion/react';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex bg-slate-200/50 p-1 rounded-full backdrop-blur-sm shadow-inner border border-white/20">
      <button
        onClick={() => setLang('id')}
        className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${
          lang === 'id' 
            ? 'bg-white text-primary shadow-sm scale-105' 
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        ID
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${
          lang === 'en' 
            ? 'bg-white text-primary shadow-sm scale-105' 
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        EN
      </button>
    </div>
  );
}
