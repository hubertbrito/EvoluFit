import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
       {/* Matrix background effect (simplified) */}
       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/matrix.png')]"></div>
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 pointer-events-none"></div>
       
       <div className="relative z-10 max-w-md w-full bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-fade-in">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse border border-emerald-500/20">
            <Zap className="w-10 h-10 text-emerald-400" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">
            A Matrix da Dieta <br/>
            <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Caiu.</span>
          </h1>
          
          <p className="text-gray-300 mb-8 leading-relaxed text-sm font-medium">
            Esqueça a contagem obsessiva de calorias. <br/>
            Você foi convidado para uma experiência de <strong>72 horas</strong> que vai realinhar sua biologia com o natural.
            <br/><br/>
            Sem fome. Sem culpa. Apenas ciência.
          </p>

          <button 
            onClick={onStart}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-black rounded-xl text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            Vamos quebrar a matrix? Aceito
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-[10px] text-gray-500 mt-6 uppercase tracking-widest opacity-60">
            Acesso Liberado • EvoluFit 2026
          </p>
       </div>
    </div>
  );
};

export default WelcomeScreen;