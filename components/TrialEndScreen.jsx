import React from 'react';
import { Lock, Clock, Calendar, Star, Zap } from 'lucide-react';

const TrialEndScreen = () => {
  const handlePayment = (plan) => {
    // URLs de Pagamento Kiwify
    // TODO: Cole abaixo os links de checkout (pay.kiwify.com.br) de cada plano
    const links = {
      weekly: 'https://pay.kiwify.com.br/SEU_LINK_SEMANAL', // R$ 4,90
      monthly: 'https://pay.kiwify.com.br/us5zDft', // R$ 14,70
      yearly: 'https://pay.kiwify.com.br/SEU_LINK_ANUAL'    // R$ 120,00
    };
    
    if (links[plan]) {
        window.location.href = links[plan];
    } else {
        alert('Erro ao redirecionar para pagamento.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Lock className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-3">Tempo Esgotado!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Seu período de teste gratuito de 72h acabou. <br/>
          Para continuar evoluindo, escolha um plano:
        </p>
        
        <div className="space-y-3">
            <button
              onClick={() => handlePayment('weekly')}
              className="w-full py-4 px-6 bg-white border-2 border-emerald-500 text-emerald-700 rounded-xl font-bold flex items-center justify-between hover:bg-emerald-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                  <Zap size={20} className="text-emerald-500" />
                  <div className="text-left">
                      <span className="block text-xs uppercase tracking-wider font-bold opacity-70">Teste Semanal</span>
                      <span className="block text-lg leading-none">1 Semana</span>
                  </div>
              </div>
              <span className="text-xl font-black">R$ 4,90</span>
            </button>

            <button
              onClick={() => handlePayment('monthly')}
              className="w-full py-4 px-6 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-between hover:bg-emerald-700 transition-transform active:scale-95 shadow-lg shadow-emerald-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-bl-lg">MAIS POPULAR</div>
              <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-emerald-200" />
                  <div className="text-left">
                      <span className="block text-xs uppercase tracking-wider font-bold text-emerald-200">Mensal</span>
                      <span className="block text-lg leading-none">30 Dias</span>
                  </div>
              </div>
              <span className="text-xl font-black">R$ 14,70</span>
            </button>

            <button
              onClick={() => handlePayment('yearly')}
              className="w-full py-4 px-6 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-between hover:bg-gray-800 transition-colors border border-gray-700"
            >
              <div className="flex items-center gap-3">
                  <Star size={20} className="text-yellow-400" />
                  <div className="text-left">
                      <span className="block text-xs uppercase tracking-wider font-bold text-gray-400">Anual</span>
                      <span className="block text-lg leading-none">12 Meses</span>
                  </div>
              </div>
              <div className="text-right">
                  <span className="block text-xl font-black">R$ 120,00</span>
                  <span className="block text-[10px] text-gray-400">R$ 10,00/mês</span>
              </div>
            </button>
        </div>
        
        <p className="text-xs text-gray-400 mt-6">
            Pagamento seguro via PIX ou Cartão. <br/>
            Liberação imediata após confirmação.
        </p>
      </div>
    </div>
  );
};

export default TrialEndScreen;