import React from 'react';
import { Lock, Clock } from 'lucide-react';

const TrialEndScreen = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">Seu período de teste acabou!</h1>
        <p className="text-gray-600 mb-6">
          Agradecemos por experimentar o EvoluFit. Para continuar usando o aplicativo e alcançar suas metas, por favor, escolha um plano.
        </p>
        <button
          // No futuro, este botão redirecionará para a página de pagamento
          onClick={() => alert('Redirecionando para pagamento...')}
          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-md"
        >
          <Lock size={16} />
          Desbloquear Acesso
        </button>
      </div>
    </div>
  );
};

export default TrialEndScreen;