import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const CalorieAlertModal = ({ onClose, excessCalories }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center">
        <div className="bg-rose-500 p-6 flex justify-center">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <AlertTriangle size={48} className="text-rose-500" />
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black text-gray-800 mb-2">Atenção!</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Você ultrapassou sua meta calórica em{' '}
            <span className="font-bold text-rose-600">{Math.round(excessCalories)} kcal</span>.
            <br/>Tente se manter mais próximo da meta para melhores resultados.
          </p>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold shadow-md hover:bg-rose-700 transition-transform active:scale-95"
          >
            Entendi, vou me policiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalorieAlertModal;