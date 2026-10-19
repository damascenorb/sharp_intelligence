import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/5519995682110?text=Ol%C3%A1%2C%20gostaria%20de%20conhecer%20melhor%20as%20solu%C3%A7%C3%B5es%20da%20Sharp%20para%20meu%20neg%C3%B3cio."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Sharp no WhatsApp"
      title="Falar com a Sharp Intelligence no WhatsApp"
      className="fixed bottom-6 left-6 z-50 group flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/40 cursor-pointer"
    >
      <WhatsAppIcon className="w-6 h-6 text-white shrink-0 group-hover:rotate-12 transition-transform duration-300" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold tracking-wide">
        Falar no WhatsApp
      </span>
      {/* Pulse Effect */}
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
      </span>
    </a>
  );
};
