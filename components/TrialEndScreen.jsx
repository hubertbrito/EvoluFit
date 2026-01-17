import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';

const TrialEndScreen = ({ variant = 'trial', isRealAdmin, onDebugToggle }) => {
  const isExpired = variant === 'expired';

  const handlePayment = (plan) => {
    // URLs de Pagamento Kiwify
    // TODO: Cole abaixo os links de checkout (pay.kiwify.com.br) de cada plano
    const links = {
      monthly: 'https://pay.kiwify.com.br/us5zDft', // R$ 14,70
    };
    
    if (links[plan]) {
        // Rastreamento Google Analytics - Início de Checkout
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'begin_checkout', {
            currency: 'BRL',
            value: 14.70,
            items: [{
              item_id: 'pro_monthly_trial_end',
              item_name: 'Plano PRO Mensal (Fim do Trial)'
            }]
          });
        }
        window.location.href = links[plan];
    } else {
        alert('Erro ao redirecionar para pagamento.');
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
       {isRealAdmin && (
         <button 
           onClick={onDebugToggle}
           className="absolute top-4 right-4 z-[600] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg text-xs transition-transform active:scale-95"
         >
           Admin: Próximo Estado ⏭️
         </button>
       )}
       <div className="relative w-full max-w-sm bg-gray-900 border border-yellow-500/30 p-8 rounded-3xl shadow-2xl overflow-hidden text-center">
          {/* Matrix texture inside modal only */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse border-2 border-yellow-500/20">
                <Crown className="w-10 h-10 text-yellow-400" />
              </div>
              
              <h1 className="text-3xl font-black text-white mb-3 tracking-tight leading-tight">
                {isExpired ? 'Renove sua' : 'Continue sua'} <span className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">Evolução</span>
              </h1>
              
              <p className="text-gray-300 mb-8 leading-relaxed text-sm font-medium">
                {isExpired 
                  ? "Seu plano de 30 dias expirou. Para continuar acessando sua dieta, histórico e evolução sem interrupções, renove sua assinatura agora."
                  : "Seu teste de 72 horas terminou. Você experimentou na prática como o controle inteligente acelera seus resultados. Para desbloquear o acesso total e continuar sua evolução, torne-se PRO."
                }
              </p>

              <button 
                onClick={() => handlePayment('monthly')}
                className="w-full py-4 px-6 bg-yellow-400 text-yellow-900 rounded-xl font-bold flex items-center justify-between hover:bg-yellow-300 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20 group"
              >
                <div className="text-left">
                    <span className="block text-sm uppercase tracking-wider font-bold">Plano Mensal</span>
                    <span className="block text-xs leading-none opacity-80">Acesso PRO Ilimitado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black">R$ 14,70</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <p className="text-xs text-gray-500 mt-6">
                  Pagamento seguro via PIX ou Cartão. Liberação imediata.
              </p>
          </div>
       </div>
      </div>
  );
};

export default TrialEndScreen;