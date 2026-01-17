import React from 'react';

const WelcomeProModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center relative border-4 border-white/20">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="p-8 flex flex-col items-center relative z-10">
        <div className="text-6xl mb-4 animate-bounce filter drop-shadow-lg">👑</div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-md">VOCÊ É PRO!</h2>
        <p className="text-yellow-100 font-bold text-lg mb-4">A saga continua.</p>
        <p className="text-white text-sm mb-8 leading-relaxed px-2 font-medium">
          Parabéns pela decisão de investir na sua melhor versão. <br/>
          Você desbloqueou o poder total do EvoluFit para dominar a alimentação perfeita.
        </p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-white text-yellow-600 rounded-xl font-black shadow-lg hover:bg-gray-50 transition-transform active:scale-95 uppercase tracking-wider"
        >
          Acessar Meu Plano
        </button>
      </div>
    </div>
  </div>
);

export default WelcomeProModal;