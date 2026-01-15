import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, DownloadCloud } from 'lucide-react';

const UpdateFeedbackModal = ({ onClose }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success'

  useEffect(() => {
    // Simula o tempo de verificação/aplicação (3 segundos conforme solicitado)
    const timer = setTimeout(() => {
      setStatus('success');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center p-8 border border-emerald-500/20">
        
        {status === 'loading' ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
              <RefreshCw size={64} className="text-emerald-500 animate-spin duration-1000 relative z-10" />
            </div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-2">Atualizando Sistema</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Baixando a versão mais recente...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full"></div>
              <CheckCircle size={64} className="text-emerald-500 relative z-10" />
            </div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-2">Atualização Concluída!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              O EvoluFit está sincronizado e pronto para uso.
            </p>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-transform active:scale-95"
            >
              Acessar App
            </button>
          </div>
        )}

        <div className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest">
          Versão 2026 • Sincronizada
        </div>
      </div>
    </div>
  );
};

export default UpdateFeedbackModal;