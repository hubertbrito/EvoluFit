import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ResetScheduleModal = ({ onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');
  const isMatch = inputValue === 'RESETAR';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-rose-50 flex justify-between items-center">
          <h3 className="font-bold text-rose-800 flex items-center gap-2">
            <AlertTriangle size={20} /> Zona de Perigo
          </h3>
          <button onClick={onClose}><X size={20} className="text-rose-600" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm font-bold">
            Você está prestes a apagar TODAS as refeições criadas e limpar o conteúdo das refeições padrão.
          </p>
          <p className="text-gray-500 text-xs mb-4">
            Esta ação não pode ser desfeita. Para confirmar, digite <strong>RESETAR</strong> no campo abaixo:
          </p>
          
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            placeholder="Digite RESETAR"
            className="w-full p-3 border-2 border-rose-200 rounded-xl focus:border-rose-500 focus:outline-none font-bold text-rose-600 placeholder:text-rose-200 uppercase"
          />
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
          <button 
            onClick={onConfirm} 
            disabled={!isMatch}
            className={`px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-all ${isMatch ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Confirmar Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetScheduleModal;