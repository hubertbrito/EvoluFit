import React from 'react';

const ClappingFeedback = ({ message }) => (
  <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-4 animate-bounce">
    <div className="text-4xl">👏</div>
    <div>
      <h3 className="text-lg font-black text-emerald-700 leading-none">Mandou Bem!</h3>
      <p className="text-xs font-bold text-emerald-600/80">{message || "Refeição registrada."}</p>
    </div>
  </div>
);

export default ClappingFeedback;