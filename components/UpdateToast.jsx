import React from 'react';
import { RefreshCw } from 'lucide-react';

const UpdateToast = ({ onUpdate }) => (
  <div className="fixed bottom-4 right-4 z-[200] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl border-2 border-emerald-500 flex items-center gap-4 animate-bounce">
    <div className="flex-shrink-0">
      <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" style={{ animationDuration: '2s' }} />
    </div>
    <div>
      <h3 className="text-sm font-black text-gray-800 dark:text-gray-100">Nova versão disponível!</h3>
      <p className="text-xs text-gray-500 dark:text-gray-300">Clique para atualizar o app.</p>
    </div>
    <button onClick={onUpdate} className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-md hover:bg-emerald-700 transition-transform active:scale-95">
      Atualizar
    </button>
  </div>
);

export default UpdateToast;