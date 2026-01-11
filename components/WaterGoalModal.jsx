import React from 'react';
import { Droplets } from 'lucide-react';

const WaterGoalModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center">
      <div className="bg-cyan-500 p-6 flex justify-center">
        <div className="bg-white p-4 rounded-full shadow-lg">
          <Droplets size={48} className="text-cyan-500" />
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-800 mb-2">Hidratação em Dia!</h2>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Você atingiu sua meta de água hoje. <br/>
          <span className="font-bold text-cyan-600">Suas células agradecem!</span>
        </p>
        <button 
          onClick={onClose}
          className="w-full py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-md hover:bg-cyan-700 transition-transform active:scale-95"
        >
          Continuar
        </button>
      </div>
    </div>
  </div>
);

export default WaterGoalModal;