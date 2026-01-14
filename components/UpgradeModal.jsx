import React from 'react';
import { Crown, ArrowRight, X } from 'lucide-react';

const UpgradeModal = ({ onClose }) => {
  const handlePayment = () => {
    window.location.href = 'https://pay.kiwify.com.br/us5zDft';
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
       <div className="relative w-full max-w-sm bg-gray-900 border border-yellow-500/30 p-8 rounded-3xl shadow-2xl overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20">
            <X size={24} />
          </button>

          <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse border-2 border-yellow-500/20">
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              
              <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
                Evolua para <span className="text-yellow-400">PRO</span>
              </h1>
              
              <p className="text-gray-300 mb-6 leading-relaxed text-xs font-medium">
                Gostando da experiência? <br/>
                Garanta acesso vitalício e desbloqueie o potencial máximo da sua nutrição agora mesmo.
              </p>

              <button 
                onClick={handlePayment}
                className="w-full py-3 px-4 bg-yellow-400 text-yellow-900 rounded-xl font-bold flex items-center justify-between hover:bg-yellow-300 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20 group"
              >
                <span className="text-sm uppercase tracking-wider font-bold">Quero ser PRO</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
       </div>
      </div>
  );
};

export default UpgradeModal;