import React from 'react';

const LevelUpModal = ({ badge, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center relative border-4 border-yellow-400">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="p-8 flex flex-col items-center relative z-10">
        <h2 className="text-3xl font-black text-yellow-400 mb-2 tracking-widest drop-shadow-md animate-pulse">LEVEL UP!</h2>
        <div className="text-8xl mb-4 animate-bounce filter drop-shadow-lg">{badge.icon}</div>
        <p className="text-white font-bold text-xl mb-1">Você agora é um</p>
        <p className="text-yellow-300 font-black text-2xl mb-4 uppercase tracking-wider">{badge.name}</p>
        <p className="text-indigo-100 text-sm mb-8 leading-relaxed px-4">
          {badge.description}
        </p>
        <button 
          onClick={onClose}
          className="w-full py-3 bg-yellow-400 text-indigo-900 rounded-xl font-black shadow-[0_4px_0_rgb(180,83,9)] hover:shadow-[0_2px_0_rgb(180,83,9)] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px]"
        >
          CONTINUAR JORNADA
        </button>
      </div>
    </div>
  </div>
);

export default LevelUpModal;