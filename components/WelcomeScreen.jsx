import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
       <div className="relative w-full max-w-sm bg-gray-900 border border-emerald-500/30 p-6 rounded-3xl shadow-2xl overflow-hidden">
          {/* Matrix texture inside modal only */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/matrix.png')] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse border border-emerald-500/20">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              
              <h1 className="text-2xl font-black text-white mb-3 tracking-tight leading-tight">
                A Matrix da Dieta <br/>
                <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Caiu.</span>
              </h1>
              
              <p className="text-gray-300 mb-6 leading-relaxed text-xs font-medium">
                Esqueça a contagem obsessiva de calorias. <br/>
                Você foi convidado para uma experiência de <strong>72 horas</strong> que vai realinhar sua biologia com o natural.
              </p>

              <button 
                onClick={onStart}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-black rounded-xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                Aceitar Desafio
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-[9px] text-gray-500 mt-4 uppercase tracking-widest opacity-60">
                Acesso Liberado • EvoluFit 2026
              </p>
          </div>
       </div>
    </div>
  );
};

export default WelcomeScreen;