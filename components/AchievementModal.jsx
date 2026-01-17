import React from 'react';

const AchievementModal = ({ badge, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/50 to-transparent pointer-events-none"></div>
      <div className="p-8 flex flex-col items-center">
        <div className="text-6xl mb-4 animate-bounce">{badge.icon}</div>
        <h2 className="text-2xl font-black text-gray-800 mb-1">Nova Conquista!</h2>
        <p className="text-emerald-600 font-bold text-lg mb-2">{badge.name}</p>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          {badge.description}
        </p>
        <button 
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-transform active:scale-95"
        >
          Incrível!
        </button>
      </div>
    </div>
  </div>
);

export default AchievementModal;