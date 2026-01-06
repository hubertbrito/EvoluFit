import React from 'react';
import { Trophy } from 'lucide-react';

const GoalReachedModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center">
        <div className="bg-emerald-500 p-6 flex justify-center">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <Trophy size={48} className="text-emerald-500" />
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black text-gray-800 mb-2">Parabéns!</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Você atingiu sua meta diária EvoluFit!
            <br/>Continue assim para alcançar seus objetivos.
          </p>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-transform active:scale-95"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalReachedModal;